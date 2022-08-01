import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    FontIcon,
    FontSizes,
    IconButton,
    IDialogContentProps,
    Link,
    PrimaryButton
} from '@fluentui/react';
import { useBoolean, usePrevious } from '@fluentui/react-hooks';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    EnvironmentPickerProps,
    StorageAccountsInLocalStorage,
    StorageAccountToContainersMapping
} from './EnvironmentPicker.types';
import './EnvironmentPicker.scss';
import { DOCUMENTATION_LINKS } from '../../Models/Constants/Constants';
import ResourcePicker from '../ResourcePicker/ResourcePicker';
import {
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IAzureResource
} from '../../Models/Constants';
import { useDeeplinkContext } from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import { DeeplinkContextActionType } from '../../Models/Context/DeeplinkContext/DeeplinkContext.types';
import EnvironmentPickerManager from './EnvironmentPickerManager';
import { deepCopy } from '../../Models/Services/Utils';

const EnvironmentPicker = (props: EnvironmentPickerProps) => {
    const { t } = useTranslation();
    const { deeplinkDispatch } = useDeeplinkContext();

    const [environmentItems, setEnvironmentItems] = useState<{
        environments: Array<IAzureResource | string>; // list of name of environment resources or manually entered environment urls
        selectedEnvironment: IAzureResource | string; // either resource itself or manually entered environment url
        environmentToEdit: IAzureResource | string; // either resource itself or manually entered environment url
    }>({
        environments: [],
        selectedEnvironment: null,
        environmentToEdit: null
    });
    const [storageAccountItems, setStorageAccountItems] = useState<{
        storageAccounts: Array<IAzureResource | string>; // list of name of storage account resources or manually entered storage account urls
        selectedStorageAccount: IAzureResource | string; // either resource itself or manually entered account url
        storageAccountToEdit: IAzureResource | string; // either resource itself or manually entered account url
    }>({
        storageAccounts: [],
        selectedStorageAccount: null,
        storageAccountToEdit: null
    });
    const defaultStorageAccountToContainersMappingRef = useRef<
        Array<StorageAccountToContainersMapping>
    >([]); // list of storage account and container pairs
    const [containerItems, setContainerItems] = useState<{
        containers: Array<IAzureResource | string>; // list of name of container resources or manually entered container names
        selectedContainer: IAzureResource | string; // either resource itself or manually entered container name
        containerToEdit: IAzureResource | string; // either resource itself or manually entered container name
    }>({ containers: [], selectedContainer: null, containerToEdit: null });

    const [isDialogHidden, { toggle: toggleIsDialogHidden }] = useBoolean(
        Boolean(props.isDialogHidden)
    );
    const [firstTimeVisible, setFirstTimeVisible] = useState(false); // not to render resouce picker components with data fetch requests if the dialog has not opened yet for the first time
    const dialogResettingValuesTimeoutRef = useRef(null);
    const hasFetchedResources = useRef({
        adtInstances: false,
        storageAccounts: false,
        storageBlobContainers: false
    });

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.normal,
        title: t('environmentPicker.editEnvironment'),
        closeButtonAriaLabel: t('close'),
        subText: props.isLocalStorageEnabled
            ? (props.storage
                  ? t('environmentPicker.descriptionForEnvAndCont')
                  : t('environmentPicker.descriptionForEnvironment')) +
              ' ' +
              t('environmentPicker.descriptionForLocalStorage')
            : props.storage
            ? t('environmentPicker.descriptionForEnvAndCont')
            : t('environmentPicker.descriptionForEnvironment')
    };
    const dialogStyles = {
        main: {
            width: '640px !important',
            maxWidth: 'unset !important',
            minHeight: 'fit-content'
        }
    };
    const modalProps = {
        isBlocking: false,
        styles: dialogStyles
    };

    const previousIsDialogHidden = usePrevious(props.isDialogHidden);
    // Figure out if dialog needs to be open from props
    useEffect(() => {
        // Have undefined checked onMount to avoid an extra render
        // Have is previous check from true to false, to just change dialogHidden on open
        if (
            previousIsDialogHidden !== undefined &&
            previousIsDialogHidden === true &&
            previousIsDialogHidden !== props.isDialogHidden
        ) {
            toggleIsDialogHidden();
        }
    }, [props.isDialogHidden]);

    useEffect(() => {
        if (!isDialogHidden) {
            setFirstTimeVisible(true);
        }
    }, [isDialogHidden]);

    // set initial values based on props and local storage
    useEffect(() => {
        let environmentUrls = [],
            selectedEnvironmentUrl;
        if (props.environmentUrl) {
            // passed environmentUrl has precedence over the selected environment in localstorage, if enabled
            environmentUrls = [props.environmentUrl];
            selectedEnvironmentUrl = props.environmentUrl;
        }
        if (props.isLocalStorageEnabled) {
            const environmentUrlsInLocalStorage: Array<string> = EnvironmentPickerManager.getEnvironmentUrlsFromLocalStorage(
                props.localStorageKey
            );

            const selectedEnvironmentUrlInLocalStorage = EnvironmentPickerManager.getSelectedEnvironmentUrlFromLocalStorage(
                props.selectedItemLocalStorageKey
            );
            selectedEnvironmentUrl =
                selectedEnvironmentUrl || selectedEnvironmentUrlInLocalStorage;

            if (
                selectedEnvironmentUrlInLocalStorage &&
                !environmentUrlsInLocalStorage.includes(
                    selectedEnvironmentUrlInLocalStorage
                )
            ) {
                environmentUrlsInLocalStorage.push(
                    selectedEnvironmentUrlInLocalStorage
                );
            }

            environmentUrls = environmentUrls.concat(
                environmentUrlsInLocalStorage.filter(
                    (item) => environmentUrls.indexOf(item) < 0
                )
            );
        }
        deeplinkDispatch({
            type: DeeplinkContextActionType.SET_ADT_URL,
            payload: {
                url: selectedEnvironmentUrl
            }
        });
        setEnvironmentItems({
            environments: environmentUrls,
            selectedEnvironment: selectedEnvironmentUrl,
            environmentToEdit: selectedEnvironmentUrl
        });

        let containerUrls = [],
            selectedContainerUrl,
            storageAccounts: Array<StorageAccountsInLocalStorage> = []; // list of storage accounts in local storage
        if (props.storage?.containerUrl) {
            containerUrls = [props.storage.containerUrl];
            selectedContainerUrl = props.storage.containerUrl;
        }
        if (props.storage?.isLocalStorageEnabled) {
            const containerUrlsInLocalStorage: Array<string> =
                EnvironmentPickerManager.getContainerUrlsFromLocalStorage(
                    props.storage.localStorageKey
                ) || [];
            const selectedContainerUrlInLocalStorage = EnvironmentPickerManager.getSelectedContainerUrlFromLocalStorage(
                props.selectedItemLocalStorageKey
            );
            storageAccounts = EnvironmentPickerManager.getStorageAccountsFromLocalStorage();

            // passed containerUrl prop overrides the one stored in local storage, change this logic as appropriate
            selectedContainerUrl =
                selectedContainerUrl || selectedContainerUrlInLocalStorage;
            if (
                selectedContainerUrlInLocalStorage &&
                !containerUrlsInLocalStorage.includes(
                    selectedContainerUrlInLocalStorage
                )
            ) {
                containerUrlsInLocalStorage.push(
                    selectedContainerUrlInLocalStorage
                );
            }
            containerUrls = containerUrls.concat(
                containerUrlsInLocalStorage.filter(
                    (item) => containerUrls.indexOf(item) < 0
                )
            );

            const storageAccountAndContainerList = containerUrls.map(
                EnvironmentPickerManager.getStorageAndContainerFromContainerUrl
            );
            const storageAccountToContainersMapping = [];
            storageAccountAndContainerList.forEach((pair, idx) => {
                const isPairAdded = storageAccountToContainersMapping.find(
                    (mapping) =>
                        mapping.storageAccountUrl === pair.storageAccountUrl
                );
                if (!isPairAdded) {
                    const newPair: StorageAccountToContainersMapping = {
                        storageAccountId: storageAccounts?.find((item) =>
                            EnvironmentPickerManager.isResourceUrlsEqual(
                                item.url,
                                pair.storageAccountUrl
                            )
                        )?.id,
                        storageAccountUrl: pair.storageAccountUrl,
                        containerNames: [pair.containerName]
                    };

                    // loop the rest of the list to collect container names for that storage account url
                    for (
                        let i = idx + 1;
                        i < storageAccountAndContainerList.length;
                        i++
                    ) {
                        if (
                            storageAccountAndContainerList[i]
                                .storageAccountUrl === pair.storageAccountUrl
                        ) {
                            newPair.containerNames.push(
                                storageAccountAndContainerList[i].containerName
                            );
                        }
                    }
                    storageAccountToContainersMapping.push(newPair);
                }
            });
            defaultStorageAccountToContainersMappingRef.current = storageAccountToContainersMapping;
        }

        const selectedStorageAccountUrl = EnvironmentPickerManager.getStorageAccountUrlFromContainerUrl(
            selectedContainerUrl
        );
        const storageAccountUrls = defaultStorageAccountToContainersMappingRef.current?.map(
            (pair) => pair.storageAccountUrl
        );

        setStorageAccountItems({
            storageAccounts: storageAccountUrls,
            selectedStorageAccount: selectedStorageAccountUrl,
            storageAccountToEdit: selectedStorageAccountUrl
        });

        // we need to set the context inside this component since there is this localstorage logic implemented here,
        // otherwise it is set in the parent ADT3DScenePage components onchange handler
        deeplinkDispatch({
            type: DeeplinkContextActionType.SET_STORAGE_CONTAINER_URL,
            payload: { url: selectedContainerUrl }
        });
        props.adapter.setBlobContainerPath(selectedContainerUrl);

        setContainerItems({
            containers: defaultStorageAccountToContainersMappingRef.current?.find(
                (mapping) =>
                    mapping.storageAccountUrl === selectedStorageAccountUrl
            )?.containerNames,
            selectedContainer: EnvironmentPickerManager.getContainerNameFromUrl(
                selectedContainerUrl
            ),
            containerToEdit: EnvironmentPickerManager.getContainerNameFromUrl(
                selectedContainerUrl
            )
        });

        return () => clearTimeout(dialogResettingValuesTimeoutRef.current);
    }, []);

    const handleOnEditClick = useCallback(() => {
        toggleIsDialogHidden();
    }, []);

    const handleOnSave = useCallback(() => {
        if (props.onDismiss) {
            props.onDismiss();
        }

        setEnvironmentItems({
            ...environmentItems,
            selectedEnvironment: environmentItems.environmentToEdit
        });
        if (props.onEnvironmentUrlChange) {
            props.onEnvironmentUrlChange(
                EnvironmentPickerManager.getResourceUrl(
                    environmentItems.environmentToEdit,
                    AzureResourceTypes.DigitalTwinInstance
                ),
                EnvironmentPickerManager.getResourceUrls(
                    environmentItems.environments,
                    AzureResourceTypes.DigitalTwinInstance
                )
            );
        }

        setContainerItems({
            ...containerItems,
            selectedContainer: containerItems.containerToEdit
        });
        if (props.storage?.onContainerUrlChange) {
            props.storage.onContainerUrlChange(
                EnvironmentPickerManager.getResourceUrl(
                    containerItems.containerToEdit,
                    AzureResourceTypes.StorageBlobContainer,
                    storageAccountItems.storageAccountToEdit
                ),
                EnvironmentPickerManager.getResourceUrls(
                    containerItems.containers,
                    AzureResourceTypes.StorageBlobContainer,
                    storageAccountItems.storageAccountToEdit
                )
            );
        }

        setStorageAccountItems({
            ...storageAccountItems,
            selectedStorageAccount: storageAccountItems.storageAccountToEdit
        });

        if (props.isLocalStorageEnabled) {
            EnvironmentPickerManager.updateEnvironmentsInLocalStorage(
                environmentItems.environments,
                props.localStorageKey
            );
            EnvironmentPickerManager.updateSelectedEnvironmentInLocalStorage(
                environmentItems.environmentToEdit,
                props.selectedItemLocalStorageKey
            );
        }
        if (props.storage?.isLocalStorageEnabled) {
            EnvironmentPickerManager.updateContainersInLocalStorage(
                containerItems.containers,
                storageAccountItems.storageAccountToEdit,
                props.storage.localStorageKey
            );
            EnvironmentPickerManager.updateSelectedContainerInLocalStorage(
                containerItems.containerToEdit,
                storageAccountItems.storageAccountToEdit,
                props.storage.selectedItemLocalStorageKey
            );
            EnvironmentPickerManager.updateStorageAccountsInLocalStorage(
                storageAccountItems.storageAccounts
            );
        }
        toggleIsDialogHidden();
    }, [
        props,
        toggleIsDialogHidden,
        environmentItems,
        storageAccountItems,
        containerItems
    ]);

    const handleOnDismiss = useCallback(() => {
        if (props.onDismiss) {
            props.onDismiss();
        }
        toggleIsDialogHidden();

        // wait for dialog dismiss fade-out animation to reset the values
        dialogResettingValuesTimeoutRef.current = setTimeout(() => {
            const newEnvironmentItems = deepCopy(environmentItems);
            if (environmentItems.selectedEnvironment) {
                // restore selected item if it is removed from dropdown
                const selectedEnvironmentIndex = environmentItems.environments.findIndex(
                    (e: string | IAzureResource) =>
                        EnvironmentPickerManager.getResourceUrl(
                            e,
                            AzureResourceTypes.DigitalTwinInstance
                        ) ===
                        EnvironmentPickerManager.getResourceUrl(
                            environmentItems.selectedEnvironment,
                            AzureResourceTypes.DigitalTwinInstance
                        )
                );
                if (selectedEnvironmentIndex === -1) {
                    newEnvironmentItems.environments.push(
                        environmentItems.selectedEnvironment
                    );
                }
            }
            newEnvironmentItems.environmentToEdit =
                environmentItems.selectedEnvironment;
            setEnvironmentItems(newEnvironmentItems);

            const newStorageAccountItems = deepCopy(storageAccountItems);
            if (storageAccountItems.selectedStorageAccount) {
                // restore selected item if it is removed from dropdown
                const selectedStorageAccountIndex = storageAccountItems.storageAccounts.findIndex(
                    (s: string | IAzureResource) =>
                        EnvironmentPickerManager.getResourceUrl(
                            s,
                            AzureResourceTypes.StorageAccount
                        ) ===
                        EnvironmentPickerManager.getResourceUrl(
                            storageAccountItems.selectedStorageAccount,
                            AzureResourceTypes.StorageAccount
                        )
                );
                if (selectedStorageAccountIndex === -1) {
                    newStorageAccountItems.storageAccounts.push(
                        storageAccountItems.selectedStorageAccount
                    );
                }
            }
            newStorageAccountItems.storageAccountToEdit =
                storageAccountItems.selectedStorageAccount;
            setStorageAccountItems(newStorageAccountItems);

            const newContainerItems = deepCopy(containerItems);
            if (containerItems.selectedContainer) {
                if (
                    EnvironmentPickerManager.getStorageAccountId(
                        storageAccountItems.storageAccountToEdit,
                        defaultStorageAccountToContainersMappingRef.current
                    ) ===
                    EnvironmentPickerManager.getStorageAccountId(
                        storageAccountItems.selectedStorageAccount,
                        defaultStorageAccountToContainersMappingRef.current
                    )
                ) {
                    // restore selected item if it is removed from dropdown
                    const selectedContainerIndex = containerItems.containers.findIndex(
                        (c: string | IAzureResource) =>
                            EnvironmentPickerManager.getContainerName(c) ===
                            EnvironmentPickerManager.getContainerName(
                                containerItems.selectedContainer
                            )
                    );

                    if (selectedContainerIndex === -1) {
                        newContainerItems.containers.push(
                            containerItems.selectedContainer
                        );

                        defaultStorageAccountToContainersMappingRef.current
                            ?.find((mapping) =>
                                EnvironmentPickerManager.isResourceUrlsEqual(
                                    mapping.storageAccountUrl,
                                    EnvironmentPickerManager.getResourceUrl(
                                        storageAccountItems.selectedStorageAccount,
                                        AzureResourceTypes.StorageAccount
                                    )
                                )
                            )
                            ?.containerNames.push(
                                EnvironmentPickerManager.getContainerName(
                                    containerItems.selectedContainer
                                )
                            );
                    }
                } else {
                    hasFetchedResources.current.storageBlobContainers = false; // to trigger fetch on mount for container picker with storage account id change
                }
            }
            newContainerItems.containerToEdit =
                containerItems.selectedContainer;
            setContainerItems(newContainerItems);
        }, 500);
    }, [
        toggleIsDialogHidden,
        environmentItems,
        storageAccountItems,
        containerItems
    ]);

    const displayTextForEnvironment = useCallback(
        (env: string | IAzureResource) => {
            const displayText = EnvironmentPickerManager.displayTextForEnvironment(
                env
            );
            return displayText || t('environmentPicker.noEnvironment');
        },
        [t]
    );

    const displayTextForContainer = useCallback(
        (container: string | IAzureResource) => {
            const displayText = EnvironmentPickerManager.displayTextForContainer(
                container,
                storageAccountItems.selectedStorageAccount
            );
            return displayText || t('environmentPicker.noContainer');
        },
        [t, storageAccountItems.selectedStorageAccount]
    );

    const handleOnEnvironmentResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        setEnvironmentItems({
            ...environmentItems,
            environmentToEdit: resource,
            environments: resources
        });
    };

    const handleOnStorageAccountResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        setStorageAccountItems({
            ...storageAccountItems,
            storageAccountToEdit: resource,
            storageAccounts: resources
        });

        // when changing the storage account, update the containers from default mappings until containers are fetched
        setContainerItems({
            ...containerItems,
            containers:
                defaultStorageAccountToContainersMappingRef.current?.find(
                    (mapping) =>
                        EnvironmentPickerManager.isResourceUrlsEqual(
                            mapping.storageAccountUrl,
                            EnvironmentPickerManager.getResourceUrl(
                                resource,
                                AzureResourceTypes.StorageAccount
                            )
                        )
                )?.containerNames || [],
            containerToEdit: null
        });
        hasFetchedResources.current.storageBlobContainers = false; // reset this flag as we click on different storage account since it fetches containers again with different storage account id
    };

    const handleOnStorageContainerResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        setContainerItems({
            ...containerItems,
            containerToEdit: resource,
            containers: resources
        });

        // update mappings in case change is based on addition or removal of a resource
        const defaultStorageAccountMapping = defaultStorageAccountToContainersMappingRef.current?.find(
            (mapping) =>
                EnvironmentPickerManager.isResourceUrlsEqual(
                    EnvironmentPickerManager.getResourceUrl(
                        storageAccountItems.storageAccountToEdit,
                        AzureResourceTypes.StorageAccount
                    ),
                    mapping.storageAccountUrl
                )
        );
        if (defaultStorageAccountMapping) {
            defaultStorageAccountMapping.containerNames = resources.map(
                EnvironmentPickerManager.getContainerName
            );
        }
    };

    return (
        <BaseComponent
            locale={props.locale}
            localeStrings={props.localeStrings}
            theme={props.theme}
            containerClassName="cb-environment-picker"
        >
            <div className="cb-environment-picker-environment">
                <span className="cb-environment-picker-environment-title">
                    {displayTextForEnvironment(
                        environmentItems.selectedEnvironment
                    )}
                </span>
                <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title={t('edit')}
                    ariaLabel={t('edit')}
                    onClick={handleOnEditClick}
                    className={'cb-environment-picker-edit-button'}
                />
            </div>
            {props.storage && (
                <div className="cb-environment-picker-container">
                    <FontIcon iconName={'Database'} />
                    <span className="cb-environment-picker-container-title">
                        {displayTextForContainer(
                            containerItems.selectedContainer
                        )}
                    </span>
                </div>
            )}

            <Dialog
                hidden={false}
                styles={{
                    root: { display: !isDialogHidden ? 'flex' : 'none' }
                }}
                onDismiss={handleOnDismiss}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                {firstTimeVisible && (
                    <div className="cb-environment-picker-dialog-form">
                        <ResourcePicker
                            styles={comboBoxSubComponentStyles}
                            adapter={props.adapter}
                            resourceType={
                                AzureResourceTypes.DigitalTwinInstance
                            }
                            requiredAccessRoles={{
                                enforcedRoleIds: [],
                                interchangeableRoleIds: [
                                    AzureAccessPermissionRoles[
                                        'Azure Digital Twins Data Owner'
                                    ],
                                    AzureAccessPermissionRoles[
                                        'Azure Digital Twins Data Reader'
                                    ]
                                ]
                            }}
                            shouldFetchResourcesOnMount={
                                !hasFetchedResources.current.adtInstances
                            }
                            label={t('environmentPicker.environmentUrl')}
                            displayField={AzureResourceDisplayFields.url}
                            additionalOptions={EnvironmentPickerManager.getResourceUrls(
                                environmentItems.environments,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            selectedOption={EnvironmentPickerManager.getResourceUrl(
                                environmentItems.environmentToEdit,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            onResourceChange={handleOnEnvironmentResourceChange}
                            onResourcesLoaded={(_resources) => {
                                hasFetchedResources.current.adtInstances = true;
                            }}
                            allowFreeform
                        />
                        {props.storage && (
                            <>
                                <ResourcePicker
                                    styles={comboBoxSubComponentStyles}
                                    adapter={props.adapter}
                                    resourceType={
                                        AzureResourceTypes.StorageAccount
                                    }
                                    requiredAccessRoles={{
                                        enforcedRoleIds: [],
                                        interchangeableRoleIds: [
                                            AzureAccessPermissionRoles[
                                                'Contributor'
                                            ],
                                            AzureAccessPermissionRoles['Owner']
                                        ]
                                    }}
                                    shouldFetchResourcesOnMount={
                                        !hasFetchedResources.current
                                            .storageAccounts
                                    }
                                    label={t(
                                        'environmentPicker.storageAccountUrl'
                                    )}
                                    displayField={
                                        AzureResourceDisplayFields.url
                                    }
                                    selectedOption={EnvironmentPickerManager.getResourceUrl(
                                        storageAccountItems.storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    additionalOptions={EnvironmentPickerManager.getResourceUrls(
                                        storageAccountItems.storageAccounts,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    onResourceChange={
                                        handleOnStorageAccountResourceChange
                                    }
                                    onResourcesLoaded={(resources) => {
                                        hasFetchedResources.current.storageAccounts = true;
                                        hasFetchedResources.current.storageBlobContainers = false;
                                        const fetchedResource = EnvironmentPickerManager.findStorageAccountFromResources(
                                            storageAccountItems.storageAccountToEdit,
                                            resources
                                        );
                                        setStorageAccountItems({
                                            ...storageAccountItems,
                                            storageAccounts: resources,
                                            storageAccountToEdit:
                                                fetchedResource ||
                                                storageAccountItems.storageAccountToEdit
                                        });
                                    }}
                                    allowFreeform
                                />

                                <ResourcePicker
                                    key={EnvironmentPickerManager.getResourceUrl(
                                        storageAccountItems.storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    styles={comboBoxSubComponentStyles}
                                    adapter={props.adapter}
                                    resourceType={
                                        AzureResourceTypes.StorageBlobContainer
                                    }
                                    requiredAccessRoles={{
                                        enforcedRoleIds: [
                                            AzureAccessPermissionRoles['Reader']
                                        ],
                                        interchangeableRoleIds: [
                                            AzureAccessPermissionRoles[
                                                'Storage Blob Data Owner'
                                            ],
                                            AzureAccessPermissionRoles[
                                                'Storage Blob Data Contributor'
                                            ]
                                        ]
                                    }}
                                    searchParams={{
                                        additionalParams: {
                                            storageAccountId: EnvironmentPickerManager.getStorageAccountId(
                                                storageAccountItems.storageAccountToEdit,
                                                defaultStorageAccountToContainersMappingRef.current
                                            )
                                        }
                                    }}
                                    shouldFetchResourcesOnMount={
                                        !hasFetchedResources.current
                                            .storageBlobContainers
                                    }
                                    label={t(
                                        'environmentPicker.storageContainerName'
                                    )}
                                    displayField={
                                        AzureResourceDisplayFields.name
                                    }
                                    additionalOptions={containerItems.containers?.map(
                                        EnvironmentPickerManager.getContainerName
                                    )}
                                    selectedOption={EnvironmentPickerManager.getContainerName(
                                        containerItems.containerToEdit
                                    )}
                                    onResourceChange={
                                        handleOnStorageContainerResourceChange
                                    }
                                    onResourcesLoaded={(_resources) => {
                                        hasFetchedResources.current.storageBlobContainers = true;
                                    }}
                                    allowFreeform
                                />
                            </>
                        )}
                    </div>
                )}
                <DialogFooter>
                    <Link
                        styles={{
                            root: {
                                float: 'left',
                                fontSize: FontSizes.size14
                            }
                        }}
                        href={DOCUMENTATION_LINKS.overviewDocSetupSection}
                        target={'_blank'}
                    >
                        {t('learnMore')}
                    </Link>
                    <PrimaryButton
                        onClick={handleOnSave}
                        text={t('save')}
                        disabled={
                            props.storage
                                ? !(
                                      environmentItems.environmentToEdit &&
                                      containerItems.containerToEdit
                                  )
                                : !environmentItems.environmentToEdit
                        }
                    />
                    <DefaultButton
                        onClick={handleOnDismiss}
                        text={t('cancel')}
                    />
                </DialogFooter>
            </Dialog>
        </BaseComponent>
    );
};

const comboBoxSubComponentStyles = {
    subComponentStyles: {
        comboBox: { callout: { width: 592 } }
    }
};

export default memo(EnvironmentPicker);
