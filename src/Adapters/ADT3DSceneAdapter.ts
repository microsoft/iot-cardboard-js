import { ADTTwinData } from '../Models/Classes';
import AdapterEntityCache from '../Models/Classes/AdapterEntityCache';
import AdapterMethodSandbox from '../Models/Classes/AdapterMethodSandbox';
import AdapterResult from '../Models/Classes/AdapterResult';
import {
    AzureAccessPermissionRoles,
    AzureResourceTypes,
    ComponentErrorType
} from '../Models/Constants/Enums';
import { IAuthService, IAzureResource } from '../Models/Constants/Interfaces';
import {
    applyMixins,
    getUrlFromString,
    validateExplorerOrigin
} from '../Models/Services/Utils';
import BlobAdapter from './BlobAdapter';
import {
    ADTAllModelsData,
    ADTTwinToModelMappingData
} from '../Models/Classes/AdapterDataClasses/ADTModelData';
import {
    IAzureRoleAssignment,
    AzureAccessPermissionRoleGroups,
    modelRefreshMaxAge,
    RequiredAccessRoleGroupForStorageContainer,
    timeSeriesConnectionRefreshMaxAge,
    LOCAL_STORAGE_KEYS
} from '../Models/Constants';
import {
    AzureMissingRoleDefinitionsData,
    AzureResourcesData
} from '../Models/Classes/AdapterDataClasses/AzureManagementData';
import ADTInstanceTimeSeriesConnectionData from '../Models/Classes/AdapterDataClasses/ADTInstanceTimeSeriesConnectionData';
import ADTDataHistoryAdapter from './ADTDataHistoryAdapter';
import PowerBIWidgetBuilderAdapter from '../Components/PowerBIWidget/Internal/PowerBIWidgetBuilder/PowerBIWidgetBuilderAdapter';
import { StorageBlobServiceCorsRulesData } from '../Models/Classes/AdapterDataClasses/StorageData';

const forceCORS =
    localStorage.getItem(LOCAL_STORAGE_KEYS.FeatureFlags.Proxy.forceCORS) ===
    'true';

const initialUseProxySettings = { adt: null, blob: null };
export default class ADT3DSceneAdapter {
    constructor(
        authService: IAuthService,
        adtHostUrl: string,
        blobContainerUrl?: string,
        tenantId?: string,
        uniqueObjectId?: string,
        adtProxyServerPath = '/proxy/adt',
        blobProxyServerPath = '/proxy/blob',
        useAdtProxy = true,
        useBlobProxy = true
    ) {
        this.adtHostUrl = adtHostUrl;
        this.authService = this.blobAuthService = this.adxAuthService = authService;
        this.tenantId = tenantId;
        this.uniqueObjectId = uniqueObjectId;
        this.adtTwinCache = new AdapterEntityCache<ADTTwinData>(9000);
        this.adtModelsCache = new AdapterEntityCache<ADTAllModelsData>(
            modelRefreshMaxAge
        );
        this.adtTwinToModelMappingCache = new AdapterEntityCache<ADTTwinToModelMappingData>(
            modelRefreshMaxAge
        );
        this.timeSeriesConnectionCache = new AdapterEntityCache<ADTInstanceTimeSeriesConnectionData>(
            timeSeriesConnectionRefreshMaxAge
        );
        /**
         * Check if class has been initialized with CORS enabled or if origin matches dev or prod explorer urls,
         * override if CORS is forced by feature flag
         *  */
        this.useAdtProxy = initialUseProxySettings.adt =
            (useAdtProxy || !validateExplorerOrigin(window.origin)) &&
            !forceCORS;

        this.useBlobProxy = initialUseProxySettings.blob =
            (useBlobProxy || !validateExplorerOrigin(window.origin)) &&
            !forceCORS;

        if (blobContainerUrl) {
            try {
                const containerURL = getUrlFromString(blobContainerUrl);
                this.storageAccountHostName = containerURL.hostname;
                this.storageAccountName = containerURL.hostname.split('.')[0];
                this.containerName = containerURL.pathname.split('/')[1];
            } catch (error) {
                console.error(error.message);
            }
        }

        this.adtProxyServerPath = adtProxyServerPath;
        this.blobProxyServerPath = blobProxyServerPath;
        this.authService.login();
        // Fetch & cache models on mount (makes first use of models faster as models should already be cached)
        this.getAllAdtModels();
    }

    /** Checking missing role assignments for the container, for this we need the resouce id of the container and we need to make
     * series of Azure Management calls for be able to find that container - if exist in user's subscription.
     */
    getMissingStorageContainerAccessRoles = async (
        containerUrlString?: string
    ) => {
        let storageAccountName, containerName;
        if (containerUrlString) {
            try {
                const containerURL = getUrlFromString(containerUrlString);
                this.storageAccountName = containerURL.hostname.split('.')[0];
                this.containerName = containerURL.pathname.split('/')[1];
            } catch (error) {
                storageAccountName = null;
                containerName = null;
                console.error(error);
            }
        } else {
            storageAccountName = this.storageAccountName;
            containerName = this.containerName;
        }

        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const storageEndPoint = `${AzureResourceTypes.StorageAccount}/${storageAccountName}/blobServices/default/containers`;
                const storageResourcesInUsersSubscriptionsResult = await this.getResources(
                    {
                        resourceType: AzureResourceTypes.StorageBlobContainer,
                        resourceProviderEndpoint: storageEndPoint
                    }
                );

                const storageResources: Array<IAzureResource> = storageResourcesInUsersSubscriptionsResult?.getData();
                const storageResource = storageResources?.find(
                    (sR) =>
                        storageAccountName ===
                            sR.id.split('/storageAccounts/')[1].split('/')[0] &&
                        sR.name === containerName
                );
                if (storageResource) {
                    this.containerResourceId = storageResource.id;
                    const missingRoles = await this.getMissingRoleDefinitions(
                        storageResource.id,
                        this.uniqueObjectId,
                        RequiredAccessRoleGroupForStorageContainer
                    );

                    return new AzureMissingRoleDefinitionsData(missingRoles);
                } else {
                    // return null as the container is not even in user's subscription
                    return new AzureMissingRoleDefinitionsData({
                        enforced: null,
                        interchangeables: null
                    });
                }
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                return null;
            }
        });
    };

    /** Adding provided role definitions to the user's role assignments for the container resource. This method assumes that
     * containerResourceId is already set in the previous getMissingStorageContainerAccessRoles method and present for assigning roles for.
     */
    addMissingRolesToStorageContainer = async (
        missingRoleDefinitionIds: AzureAccessPermissionRoleGroups
    ) => {
        const adapterMethodSandbox = new AdapterMethodSandbox(this.authService);
        return await adapterMethodSandbox.safelyFetchData(async () => {
            try {
                const enforcedRoleAssignmentResults = await Promise.all(
                    missingRoleDefinitionIds.enforced?.map((roleDefinitionId) =>
                        this.assignRole(
                            roleDefinitionId,
                            this.containerResourceId,
                            this.uniqueObjectId
                        )
                    )
                );

                const interChangeableRoleAssignmentResults = await Promise.all(
                    missingRoleDefinitionIds.interchangeables.map(
                        (interchangeableGroup) => {
                            if (
                                interchangeableGroup.includes(
                                    AzureAccessPermissionRoles[
                                        'Storage Blob Data Contributor'
                                    ]
                                )
                            ) {
                                // add 'Storage Blob Data Contributor' by default if it is in the interchangeable group as minimum
                                return this.assignRole(
                                    AzureAccessPermissionRoles[
                                        'Storage Blob Data Contributor'
                                    ],
                                    this.containerResourceId,
                                    this.uniqueObjectId
                                );
                            } else if (
                                interchangeableGroup.includes(
                                    AzureAccessPermissionRoles['Reader']
                                )
                            ) {
                                // add 'Reader' by default if it is in the interchangeable group as minimum
                                return this.assignRole(
                                    AzureAccessPermissionRoles['Reader'],
                                    this.containerResourceId,
                                    this.uniqueObjectId
                                );
                            } else if (interchangeableGroup.length) {
                                // otherwise add the first item from each interchangeable group
                                return this.assignRole(
                                    interchangeableGroup[0],
                                    this.containerResourceId,
                                    this.uniqueObjectId
                                );
                            }
                        }
                    )
                );

                const newRoleAssignments: Array<IAzureRoleAssignment> = [];

                enforcedRoleAssignmentResults?.forEach((result) => {
                    if (!result?.hasNoData()) {
                        newRoleAssignments.push(result.getData());
                    }
                });

                interChangeableRoleAssignmentResults?.forEach((result) => {
                    if (!result?.hasNoData()) {
                        newRoleAssignments.push(result.getData());
                    }
                });

                return new AzureResourcesData(newRoleAssignments);
            } catch (error) {
                adapterMethodSandbox.pushError({
                    type: ComponentErrorType.DataFetchFailed,
                    isCatastrophic: false,
                    rawError: error
                });
                return null;
            }
        });
    };

    /**
     * wrapper method to check if the selected adt instance is a private link to force CORS,
     * if not use the initial useProxy setting
     */
    checkCORSProperties = async (adtUrl: string) => {
        try {
            if (adtUrl) {
                const adtInstanceResult = await this.getResourceByUrl(
                    adtUrl,
                    AzureResourceTypes.DigitalTwinInstance
                );
                const adtInstance: IAzureResource = adtInstanceResult.getData();
                if (
                    adtInstance?.properties?.publicNetworkAccess === 'Disabled'
                ) {
                    // it means using private with privateEndpointConnections, then force CORS
                    this.useAdtProxy = false;
                    this.useBlobProxy = false;
                } else {
                    this.useAdtProxy = initialUseProxySettings.adt;
                    this.useBlobProxy = initialUseProxySettings.blob;
                }
            }
            return this.getBlobServiceCorsProperties() as Promise<
                AdapterResult<StorageBlobServiceCorsRulesData>
            >;
        } catch (error) {
            console.error(error);
            this.useAdtProxy = initialUseProxySettings.adt;
            this.useBlobProxy = initialUseProxySettings.blob;
            return this.getBlobServiceCorsProperties() as Promise<
                AdapterResult<StorageBlobServiceCorsRulesData>
            >;
        }
    };
}

export default interface ADT3DSceneAdapter
    extends BlobAdapter,
        ADTDataHistoryAdapter,
        PowerBIWidgetBuilderAdapter {
    getMissingStorageContainerAccessRoles: (
        containerURLString?: string
    ) => Promise<AdapterResult<AzureMissingRoleDefinitionsData>>;
    addMissingRolesToStorageContainer: (
        missingRoleDefinitionIds: AzureAccessPermissionRoleGroups
    ) => Promise<AdapterResult<AzureResourcesData>>;
    checkCORSProperties: (
        adtUrl: string
    ) => Promise<AdapterResult<StorageBlobServiceCorsRulesData>>;
}
applyMixins(ADT3DSceneAdapter, [
    BlobAdapter,
    ADTDataHistoryAdapter,
    PowerBIWidgetBuilderAdapter
]);
