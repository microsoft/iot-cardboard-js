import {
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    FontIcon,
    FontSizes,
    IconButton,
    IDialogContentProps,
    IModalProps,
    IModalStyles,
    Link,
    PrimaryButton
} from '@fluentui/react';
import { useBoolean, usePrevious } from '@fluentui/react-hooks';
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    EnvironmentPickerActionType,
    EnvironmentPickerProps,
    StorageAccountToContainersMapping
} from './EnvironmentPicker.types';
import './EnvironmentPicker.scss';
import {
    DOCUMENTATION_LINKS,
    RequiredAccessRoleGroupForADTInstance,
    RequiredAccessRoleGroupForStorageAccount,
    RequiredAccessRoleGroupForStorageContainer
} from '../../Models/Constants/Constants';
import ResourcePicker from '../ResourcePicker/ResourcePicker';
import {
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IADTInstance,
    IAzureResource,
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants';
import {
    getContainerDisplayText,
    getStorageAccountId,
    getStorageAccountUrlFromContainerUrl
} from './EnvironmentPickerManager';
import {
    defaultEnvironmentPickerState,
    EnvironmentPickerReducer
} from './EnvironmentPicker.state';
import {
    areResourceValuesEqual,
    getContainerNameFromUrl,
    getNameOfResource,
    getResourceUrl,
    getResourceUrls
} from '../../Models/Services/Utils';
import {
    getAdtInstanceOptionsFromLocalStorage,
    getSelectedAdtInstanceFromLocalStorage,
    getSelectedStorageAccountFromLocalStorage,
    getSelectedStorageContainerFromLocalStorage,
    getStorageAccountOptionsFromLocalStorage,
    getStorageContainerOptionsFromLocalStorage,
    setAdtInstanceOptionsInLocalStorage,
    setStorageAccountOptionsInLocalStorage,
    setStorageContainerOptionsInLocalStorage
} from '../../Models/Services/LocalStorageManager/LocalStorageManager';
import produce from 'immer';

const dialogStyles: Partial<IModalStyles> = {
    main: {
        width: '640px !important',
        maxWidth: 'unset !important',
        minHeight: 'fit-content',
        overflow: 'visible'
    },
    scrollableContent: {
        overflow: 'visible',
        '> div:first-child': { overflow: 'visible' }
    }
};
const modalProps: IModalProps = {
    isBlocking: false,
    styles: dialogStyles
};

const EnvironmentPicker = ({
    adapter,
    onDismiss,
    isLocalStorageEnabled,
    localStorageKey,
    adtInstanceUrl,
    onAdtInstanceChange,
    storage,
    isDialogOpen: isDialogOpenProp = false
}: EnvironmentPickerProps) => {
    const { t } = useTranslation();

    const [environmentPickerState, environmentPickerDispatch] = useReducer(
        EnvironmentPickerReducer,
        defaultEnvironmentPickerState
    );

    const [
        isDialogHidden,
        {
            toggle: toggleIsDialogHidden,
            setFalse: showDialog,
            setTrue: hideDialog
        }
    ] = useBoolean(!isDialogOpenProp);
    const [
        resourcePickerErrorMessages,
        setResourcePickerErrorMessages
    ] = useState({
        adt: undefined,
        storageAccount: undefined,
        storageContainer: undefined
    });

    const defaultStorageAccountToContainersMappingsRef = useRef<
        Array<StorageAccountToContainersMapping>
    >([]); // list of storage account and container pairs
    const prevStorageAccountToEdit = usePrevious(
        environmentPickerState.storageAccountInfo.storageAccountToEdit
    );
    const dialogResettingValuesTimeoutRef = useRef(null);
    const hasFetchedResources = useRef({
        adtInstances: false,
        storageAccounts: false,
        storageBlobContainers: false
    });

    const dialogContentProps: IDialogContentProps = useMemo(
        () => ({
            type: DialogType.normal,
            title: t('environmentPicker.editEnvironment'),
            closeButtonAriaLabel: t('close'),
            subText: isLocalStorageEnabled
                ? (storage
                      ? t('environmentPicker.descriptionForAdtInstanceAndCont')
                      : t('environmentPicker.descriptionForAdtInstance')) +
                  ' ' +
                  t('environmentPicker.descriptionForLocalStorage')
                : storage
                ? t('environmentPicker.descriptionForAdtInstanceAndCont')
                : t('environmentPicker.descriptionForAdtInstance')
        }),
        [t, isLocalStorageEnabled, storage]
    );

    useEffect(() => {
        if (!isDialogHidden) {
            environmentPickerDispatch({
                type: EnvironmentPickerActionType.MARK_DIALOG_AS_SHOWN
            });
        }
    }, [isDialogHidden]);

    useEffect(() => {
        if (isDialogOpenProp !== undefined) {
            if (isDialogOpenProp) {
                showDialog();
            } else {
                hideDialog();
            }
        }
    }, [isDialogOpenProp]);

    // set initial values based on props and local storage
    useEffect(() => {
        // START of initializing ADT Instance url options
        let adtInstances: Array<string> = [];
        let adtInstanceToEdit: string;
        if (adtInstanceUrl) {
            adtInstanceToEdit = adtInstanceUrl; // passed prop has precedence over the localstorage, if enabled
            adtInstances = [adtInstanceUrl];
        }
        if (isLocalStorageEnabled) {
            const selectedAdtInstanceInLocalStorage = getSelectedAdtInstanceFromLocalStorage(
                localStorageKey
            );
            adtInstanceToEdit =
                adtInstanceToEdit ?? selectedAdtInstanceInLocalStorage?.url;

            const adtInstancesInLocalStorage =
                getAdtInstanceOptionsFromLocalStorage(localStorageKey) || [];
            const adtInstanceUrlsInLocalStorage: Array<string> =
                adtInstancesInLocalStorage?.map((a) => a.url) || [];
            adtInstances = adtInstances.concat(
                adtInstanceUrlsInLocalStorage.filter(
                    (item) => adtInstances.indexOf(item) === -1
                )
            );
        }
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_ADT_INSTANCE_INFO,
            payload: {
                adtInstanceInfo: {
                    adtInstances,
                    adtInstanceToEdit
                }
            }
        });
        // END of initializing ADT Instance url options

        // START of initializing Storage account url options
        let storageAccounts: Array<string> = [];
        let storageAccountToEdit: string;
        if (storage?.containerUrl) {
            storageAccountToEdit = getStorageAccountUrlFromContainerUrl(
                storage?.containerUrl
            ); // passed prop has precedence over the localstorage, if enabled
            storageAccounts = [storageAccountToEdit];
        }
        let selectedStorageAccountResourceId;
        if (storage.isLocalStorageEnabled) {
            const selectedStorageAccountInLocalStorage = getSelectedStorageAccountFromLocalStorage();
            storageAccountToEdit =
                storageAccountToEdit ??
                selectedStorageAccountInLocalStorage?.url;
            selectedStorageAccountResourceId =
                selectedStorageAccountInLocalStorage?.id;

            const storageAccountsInLocalStorage =
                getStorageAccountOptionsFromLocalStorage() || [];
            const storageAccountUrlsInLocalStorage: Array<string> =
                storageAccountsInLocalStorage?.map((a) => a.url) || [];
            storageAccounts = storageAccounts.concat(
                storageAccountUrlsInLocalStorage.filter(
                    (item) => storageAccounts.indexOf(item) === -1
                )
            );
        }
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_INFO,
            payload: {
                storageAccountInfo: {
                    storageAccounts,
                    storageAccountToEdit
                }
            }
        });
        // END of initializing Storage account url options

        // START of initializing Storage container name options
        let containers: Array<string> = [];
        let containerToEdit: string;
        if (storage?.containerUrl) {
            containerToEdit = getContainerNameFromUrl(storage?.containerUrl); // passed prop has precedence over the localstorage, if enabled
            containers = [containerToEdit];
        }
        if (storage.isLocalStorageEnabled) {
            containerToEdit =
                containerToEdit ??
                getSelectedStorageContainerFromLocalStorage()?.name;

            const storageContainersInLocalStorage =
                getStorageContainerOptionsFromLocalStorage() || [];
            const storageContainersInLocalStorageForSelectedAccount = storageContainersInLocalStorage.filter(
                (sC) =>
                    areResourceValuesEqual(
                        getStorageAccountUrlFromContainerUrl(sC.url),
                        storageAccountToEdit,
                        AzureResourceDisplayFields.url
                    )
            );

            const storageContainerNamesInLocalStorage: Array<string> =
                storageContainersInLocalStorageForSelectedAccount?.map(
                    (a) => a.name
                ) || [];
            containers = containers.concat(
                storageContainerNamesInLocalStorage.filter(
                    (item) => containers.indexOf(item) === -1
                )
            );
        }
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_CONTAINER_INFO,
            payload: {
                containerInfo: {
                    containers,
                    containerToEdit
                }
            }
        });
        // END of initializing Storage container name options

        const storageAccountToContainersMapping: Array<StorageAccountToContainersMapping> = [];
        storageAccountToContainersMapping.push({
            storageAccountId: selectedStorageAccountResourceId,
            storageAccountUrl: storageAccountToEdit,
            containerNames: containers
        });
        defaultStorageAccountToContainersMappingsRef.current = storageAccountToContainersMapping;

        return () => clearTimeout(dialogResettingValuesTimeoutRef.current);
    }, []);

    const handleOnEditClick = useCallback(() => {
        toggleIsDialogHidden();
    }, [toggleIsDialogHidden]);

    const handleOnSave = useCallback(() => {
        if (onAdtInstanceChange) {
            onAdtInstanceChange(
                environmentPickerState.adtInstanceInfo.adtInstanceToEdit,
                environmentPickerState.adtInstanceInfo.adtInstances
            );
        }
        if (storage?.onContainerChange) {
            storage.onContainerChange(
                environmentPickerState.storageAccountInfo.storageAccountToEdit,
                environmentPickerState.containerInfo.containerToEdit,
                environmentPickerState.containerInfo.containers
            );
        }

        if (isLocalStorageEnabled) {
            setAdtInstanceOptionsInLocalStorage(
                environmentPickerState.adtInstanceInfo.adtInstances
            );
        }
        if (storage?.isLocalStorageEnabled) {
            setStorageContainerOptionsInLocalStorage(
                environmentPickerState.containerInfo.containers,
                environmentPickerState.storageAccountInfo.storageAccountToEdit
            );
            setStorageAccountOptionsInLocalStorage(
                environmentPickerState.storageAccountInfo.storageAccounts
            );
        }

        toggleIsDialogHidden();

        if (onDismiss) {
            onDismiss();
        }
    }, [
        storage,
        onDismiss,
        toggleIsDialogHidden,
        onAdtInstanceChange,
        isLocalStorageEnabled,
        environmentPickerState.adtInstanceInfo,
        environmentPickerState.storageAccountInfo,
        environmentPickerState.containerInfo
    ]);

    const handleOnDismiss = useCallback(() => {
        toggleIsDialogHidden();

        // wait for dialog dismiss fade-out animation to reset the values
        dialogResettingValuesTimeoutRef.current = setTimeout(() => {
            environmentPickerDispatch({
                type: EnvironmentPickerActionType.RESET_ITEMS_ON_DISMISS,
                payload: {
                    selectedEnvironmentUrl: adtInstanceUrl,
                    selectedContainerUrl: storage.containerUrl,
                    storageAccountToContainersMappings:
                        defaultStorageAccountToContainersMappingsRef.current,
                    resetContainersCallback: () => {
                        hasFetchedResources.current.storageBlobContainers = false;
                    }
                }
            });
        }, 500);

        if (onDismiss) {
            onDismiss();
        }
    }, [toggleIsDialogHidden, onDismiss, adtInstanceUrl, storage.containerUrl]);

    const adtInstanceDisplayText = useMemo(() => {
        const displayText = getNameOfResource(
            adtInstanceUrl,
            AzureResourceTypes.DigitalTwinInstance
        );
        return displayText || t('environmentPicker.noAdtInstance');
    }, [t, adtInstanceUrl]);

    const containerDisplayText = useMemo(() => {
        const displayText = getContainerDisplayText(
            getContainerNameFromUrl(storage.containerUrl),
            getStorageAccountUrlFromContainerUrl(storage.containerUrl)
        );
        return displayText || t('environmentPicker.noContainer');
    }, [t, storage.containerUrl]);

    const checkPermissionsForResource = async (
        // check permissions for the selected resource and update error messages accordingly
        resource: IAzureResource | string,
        type: AzureResourceTypes,
        parentResource?: IAzureResource | string
    ) => {
        let fetchedResource: IAzureResource;
        if (typeof resource === 'string') {
            const getResourceResponse = await adapter.getResourceByUrl(
                getResourceUrl(resource, type, parentResource),
                type
            );
            fetchedResource = getResourceResponse.getData();
        } else {
            fetchedResource = resource;
        }

        if (fetchedResource) {
            const haveAccess = await adapter.hasRoleDefinitions(
                fetchedResource.id,
                type.toLowerCase() ===
                    AzureResourceTypes.DigitalTwinInstance.toLowerCase()
                    ? RequiredAccessRoleGroupForADTInstance
                    : type.toLowerCase() ===
                      AzureResourceTypes.StorageAccount.toLowerCase()
                    ? RequiredAccessRoleGroupForStorageAccount
                    : RequiredAccessRoleGroupForStorageContainer
            );

            setResourcePickerErrorMessages(
                produce((draft) => {
                    switch (type.toLowerCase()) {
                        case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                            draft.adt = haveAccess
                                ? null
                                : t(
                                      'environmentPicker.errors.adtInstanceMissingPermissionMessage'
                                  );
                            break;
                        case AzureResourceTypes.StorageAccount.toLowerCase():
                            draft.storageAccount = haveAccess
                                ? null
                                : t(
                                      'environmentPicker.errors.storageAccountMissingPermissionMessage'
                                  );
                            break;
                        case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                            draft.storageContainer = haveAccess
                                ? null
                                : t(
                                      'environmentPicker.errors.storageContainerMissingPermissionMessage'
                                  );
                            break;
                        default:
                            break;
                    }
                })
            );
        } else {
            setResourcePickerErrorMessages(
                produce((draft) => {
                    switch (type.toLowerCase()) {
                        case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                            draft.adt = t(
                                'environmentPicker.errors.resourceNotFound'
                            );
                            break;
                        case AzureResourceTypes.StorageAccount.toLowerCase():
                            draft.storageAccount = t(
                                'environmentPicker.errors.resourceNotFound'
                            );
                            break;
                        case AzureResourceTypes.StorageBlobContainer.toLowerCase():
                            draft.storageContainer = t(
                                'environmentPicker.errors.resourceNotFound'
                            );
                            break;
                        default:
                            break;
                    }
                })
            );
        }
    };

    const handleOnAdtInstanceResourceChange = async (
        resource: IADTInstance | string,
        resources: Array<IADTInstance | string>
    ) => {
        if (
            resource &&
            (!areResourceValuesEqual(
                getResourceUrl(
                    environmentPickerState.adtInstanceInfo.adtInstanceToEdit,
                    AzureResourceTypes.DigitalTwinInstance
                ),
                getResourceUrl(
                    resource,
                    AzureResourceTypes.DigitalTwinInstance
                ),
                AzureResourceDisplayFields.url
            ) ||
                resourcePickerErrorMessages.adt === undefined) // check permissions on mount for the default selected value as well
        ) {
            setResourcePickerErrorMessages(
                produce((draft) => {
                    draft.adt = null;
                })
            ); // set the error state for permissions to null for default state before checking permission for the next changed resource
            checkPermissionsForResource(
                resource,
                AzureResourceTypes.DigitalTwinInstance
            );
        }
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_ADT_INSTANCE_INFO,
            payload: {
                adtInstanceInfo: {
                    adtInstanceToEdit: resource,
                    adtInstances: resources
                }
            }
        });
    };

    const handleOnStorageAccountResourceChange = async (
        resource: IAzureStorageAccount | string,
        resources: Array<IAzureStorageAccount | string>
    ) => {
        if (
            resource &&
            (!areResourceValuesEqual(
                getResourceUrl(
                    environmentPickerState.storageAccountInfo
                        .storageAccountToEdit,
                    AzureResourceTypes.StorageAccount
                ),
                getResourceUrl(resource, AzureResourceTypes.StorageAccount),
                AzureResourceDisplayFields.url
            ) ||
                resourcePickerErrorMessages.storageAccount === undefined) // check permissions on mount for the default selected value as well
        ) {
            setResourcePickerErrorMessages(
                produce((draft) => {
                    draft.storageAccount = null;
                })
            ); // set the error state for permissions to null for default state before checking permission for the next changed resource
            checkPermissionsForResource(
                resource,
                AzureResourceTypes.StorageAccount
            );
        }

        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_INFO,
            payload: {
                storageAccountInfo: {
                    storageAccountToEdit: resource,
                    storageAccounts: resources
                }
            }
        });

        if (
            !areResourceValuesEqual(
                getResourceUrl(
                    prevStorageAccountToEdit,
                    AzureResourceTypes.StorageAccount
                ),
                getResourceUrl(resource, AzureResourceTypes.StorageAccount),
                AzureResourceDisplayFields.url
            )
        ) {
            // when changing the storage account, update the containers from default mappings until containers are fetched
            environmentPickerDispatch({
                type: EnvironmentPickerActionType.SET_CONTAINER_INFO,
                payload: {
                    containerInfo: {
                        containerToEdit: null,
                        containers:
                            defaultStorageAccountToContainersMappingsRef.current?.find(
                                (mapping) =>
                                    areResourceValuesEqual(
                                        mapping.storageAccountUrl,
                                        getResourceUrl(
                                            resource,
                                            AzureResourceTypes.StorageAccount
                                        ),
                                        AzureResourceDisplayFields.url
                                    )
                            )?.containerNames || []
                    }
                }
            });
            hasFetchedResources.current.storageBlobContainers = false; // reset this flag as we click on different storage account since it fetches containers again with different storage account id
        }
    };

    const handleOnStorageAccountResourcesLoaded = (
        resources: Array<IAzureStorageAccount>
    ) => {
        hasFetchedResources.current.storageAccounts = true;
        hasFetchedResources.current.storageBlobContainers = false;
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED,
            payload: { resources }
        });
    };

    const handleOnStorageContainerResourceChange = async (
        resource: IAzureStorageBlobContainer | string,
        resources: Array<IAzureStorageBlobContainer | string>
    ) => {
        if (
            resource &&
            (!areResourceValuesEqual(
                getNameOfResource(
                    environmentPickerState.containerInfo.containerToEdit,
                    AzureResourceTypes.StorageBlobContainer
                ),
                getNameOfResource(
                    resource,
                    AzureResourceTypes.StorageBlobContainer
                ),
                AzureResourceDisplayFields.name
            ) ||
                resourcePickerErrorMessages.storageContainer === undefined) // check permissions on mount for the default selected value as well
        ) {
            setResourcePickerErrorMessages(
                produce((draft) => {
                    draft.storageContainer = null;
                })
            ); // set the error state for permissions to null for default state before checking permission for the next changed resource
            checkPermissionsForResource(
                resource,
                AzureResourceTypes.StorageBlobContainer,
                environmentPickerState.storageAccountInfo.storageAccountToEdit
            );
        }

        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_CONTAINER_INFO,
            payload: {
                containerInfo: {
                    containerToEdit: resource,
                    containers: resources
                }
            }
        });

        // update mappings in case change is based on addition or removal of a resource
        const defaultStorageAccountMapping = defaultStorageAccountToContainersMappingsRef.current?.find(
            (mapping) =>
                areResourceValuesEqual(
                    getResourceUrl(
                        environmentPickerState.storageAccountInfo
                            .storageAccountToEdit,
                        AzureResourceTypes.StorageAccount
                    ),
                    mapping.storageAccountUrl,
                    AzureResourceDisplayFields.url
                )
        );
        if (defaultStorageAccountMapping) {
            defaultStorageAccountMapping.containerNames = resources.map(
                (container) =>
                    getNameOfResource(
                        container,
                        AzureResourceTypes.StorageBlobContainer
                    )
            );
        }
    };

    return (
        <div className="cb-environment-picker">
            <div className="cb-environment-picker-environment">
                <span className="cb-environment-picker-environment-title">
                    {adtInstanceDisplayText}
                </span>
                <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title={t('edit')}
                    ariaLabel={t('edit')}
                    onClick={handleOnEditClick}
                    className={'cb-environment-picker-edit-button'}
                />
            </div>
            {storage && (
                <div className="cb-environment-picker-container">
                    <FontIcon iconName={'Database'} />
                    <span className="cb-environment-picker-container-title">
                        {containerDisplayText}
                    </span>
                </div>
            )}

            <Dialog
                hidden={false}
                styles={{
                    root: {
                        display: !isDialogHidden ? 'flex' : 'none'
                    }
                }}
                onDismiss={handleOnDismiss}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                {environmentPickerState.firstTimeVisible && (
                    <div className="cb-environment-picker-dialog-form">
                        <ResourcePicker
                            adapter={adapter}
                            resourceType={
                                AzureResourceTypes.DigitalTwinInstance
                            }
                            requiredAccessRoles={{
                                enforced: [],
                                interchangeables: []
                            }}
                            shouldFetchResourcesOnMount={
                                !hasFetchedResources.current.adtInstances
                            }
                            label={t('environmentPicker.adtInstanceUrl')}
                            displayField={AzureResourceDisplayFields.url}
                            additionalOptions={getResourceUrls(
                                environmentPickerState.adtInstanceInfo
                                    .adtInstances,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            selectedOption={getResourceUrl(
                                environmentPickerState.adtInstanceInfo
                                    .adtInstanceToEdit,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            onChange={handleOnAdtInstanceResourceChange}
                            onLoaded={(_resources) => {
                                hasFetchedResources.current.adtInstances = true;
                            }}
                            errorMessage={resourcePickerErrorMessages.adt}
                        />
                        {storage && (
                            <>
                                <ResourcePicker
                                    adapter={adapter}
                                    resourceType={
                                        AzureResourceTypes.StorageAccount
                                    }
                                    requiredAccessRoles={{
                                        enforced: [],
                                        interchangeables: []
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
                                    selectedOption={getResourceUrl(
                                        environmentPickerState
                                            .storageAccountInfo
                                            .storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    additionalOptions={getResourceUrls(
                                        environmentPickerState
                                            .storageAccountInfo.storageAccounts,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    onChange={
                                        handleOnStorageAccountResourceChange
                                    }
                                    onLoaded={
                                        handleOnStorageAccountResourcesLoaded
                                    }
                                    errorMessage={
                                        resourcePickerErrorMessages.storageAccount
                                    }
                                />

                                <ResourcePicker
                                    key={getResourceUrl(
                                        environmentPickerState
                                            .storageAccountInfo
                                            .storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    adapter={adapter}
                                    resourceType={
                                        AzureResourceTypes.StorageBlobContainer
                                    }
                                    requiredAccessRoles={{
                                        enforced: [],
                                        interchangeables: []
                                    }}
                                    searchParams={{
                                        additionalParams: environmentPickerState
                                            .storageAccountInfo
                                            .storageAccountToEdit
                                            ? {
                                                  storageAccountId: getStorageAccountId(
                                                      environmentPickerState
                                                          .storageAccountInfo
                                                          .storageAccountToEdit,
                                                      defaultStorageAccountToContainersMappingsRef.current
                                                  ),
                                                  storageAccountBlobUrl: getResourceUrl(
                                                      environmentPickerState
                                                          .storageAccountInfo
                                                          .storageAccountToEdit,
                                                      AzureResourceTypes.StorageAccount
                                                  )
                                              }
                                            : undefined,
                                        isAdditionalParamsRequired: true
                                    }}
                                    shouldFetchResourcesOnMount={
                                        environmentPickerState
                                            .storageAccountInfo
                                            .storageAccountToEdit &&
                                        !hasFetchedResources.current
                                            .storageBlobContainers
                                    }
                                    label={t(
                                        'environmentPicker.storageContainerName'
                                    )}
                                    displayField={
                                        AzureResourceDisplayFields.name
                                    }
                                    additionalOptions={environmentPickerState.containerInfo.containers?.map(
                                        (container) =>
                                            getNameOfResource(
                                                container,
                                                AzureResourceTypes.StorageBlobContainer
                                            )
                                    )}
                                    selectedOption={getNameOfResource(
                                        environmentPickerState.containerInfo
                                            .containerToEdit,
                                        AzureResourceTypes.StorageBlobContainer
                                    )}
                                    onChange={
                                        handleOnStorageContainerResourceChange
                                    }
                                    onLoaded={(_resources) => {
                                        hasFetchedResources.current.storageBlobContainers = true;
                                    }}
                                    errorMessage={
                                        resourcePickerErrorMessages.storageContainer
                                    }
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
                    <DefaultButton
                        onClick={handleOnDismiss}
                        text={t('cancel')}
                    />
                    <PrimaryButton
                        onClick={handleOnSave}
                        text={t('save')}
                        disabled={
                            resourcePickerErrorMessages.adt ||
                            resourcePickerErrorMessages.storageAccount ||
                            resourcePickerErrorMessages.storageContainer ||
                            (storage
                                ? !(
                                      environmentPickerState.adtInstanceInfo
                                          .adtInstanceToEdit &&
                                      environmentPickerState.storageAccountInfo
                                          .storageAccountToEdit &&
                                      environmentPickerState.containerInfo
                                          .containerToEdit
                                  )
                                : !environmentPickerState.adtInstanceInfo
                                      .adtInstanceToEdit)
                        }
                    />
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default memo(EnvironmentPicker);
