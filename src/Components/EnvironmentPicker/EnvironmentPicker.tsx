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
    useRef
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
    IAzureStorageAccount,
    IAzureStorageBlobContainer
} from '../../Models/Constants';
import {
    getContainerDisplayText,
    getStorageAccountId,
    getStorageAccountUrlFromContainerUrl,
    getStorageAndContainerFromContainerUrl,
    getUrlOfLocalStorageItem
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
    getStorageAccountOptionsFromLocalStorage,
    getStorageContainerOptionsFromLocalStorage,
    setAdtInstancesInLocalStorage,
    setStorageAccountsInLocalStorage,
    setStorageContainersInLocalStorage
} from '../../Models/Services/LocalStorageManager/LocalStorageManager';

const dialogStyles: Partial<IModalStyles> = {
    main: {
        width: '640px !important',
        maxWidth: 'unset !important',
        minHeight: 'fit-content'
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
    storage
}: EnvironmentPickerProps) => {
    const { t } = useTranslation();

    const [environmentPickerState, environmentPickerDispatch] = useReducer(
        EnvironmentPickerReducer,
        defaultEnvironmentPickerState
    );

    const [isDialogHidden, { toggle: toggleIsDialogHidden }] = useBoolean(true);

    const defaultStorageAccountToContainersMappingsRef = useRef<
        Array<StorageAccountToContainersMapping>
    >([]); // list of storage account and container pairs
    const prevStorageAccountToEdit = usePrevious(
        environmentPickerState.storageAccountItems.storageAccountToEdit
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

    // set initial values based on props and local storage
    useEffect(() => {
        let adtInstanceUrls = [];
        if (adtInstanceUrl) {
            // passed adtInstanceUrl has precedence over the selected adt url in localstorage, if enabled
            adtInstanceUrls = [adtInstanceUrl];
        }
        if (isLocalStorageEnabled) {
            const adtInstancesInLocalStorage = getAdtInstanceOptionsFromLocalStorage(
                localStorageKey
            );
            const adtInstanceUrlsInLocalStorage: Array<string> =
                adtInstancesInLocalStorage?.map((a) =>
                    getUrlOfLocalStorageItem(a)
                ) || [];

            if (
                adtInstanceUrl &&
                !adtInstanceUrlsInLocalStorage.includes(adtInstanceUrl)
            ) {
                adtInstanceUrlsInLocalStorage.push(adtInstanceUrl);
            }

            adtInstanceUrls = adtInstanceUrls.concat(
                adtInstanceUrlsInLocalStorage.filter(
                    (item) => adtInstanceUrls.indexOf(item) === -1
                )
            );
        }
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_ADT_INSTANCE_ITEMS,
            payload: {
                adtInstanceItems: {
                    adtInstances: adtInstanceUrls,
                    adtInstanceToEdit: adtInstanceUrl
                }
            }
        });

        let containerUrls: Array<string> = [];
        if (storage?.containerUrl) {
            containerUrls = [storage.containerUrl];
        }
        if (storage?.isLocalStorageEnabled) {
            const containersInLocalStorage = getStorageContainerOptionsFromLocalStorage(
                storage.localStorageKey
            );
            const containerUrlsInLocalStorage: Array<string> =
                containersInLocalStorage?.map((c) =>
                    getUrlOfLocalStorageItem(c)
                ) || [];

            const storageAccountsInLocalStorage =
                getStorageAccountOptionsFromLocalStorage() || [];

            if (
                storage.containerUrl &&
                !containerUrlsInLocalStorage.includes(storage.containerUrl)
            ) {
                containerUrlsInLocalStorage.push(storage.containerUrl);
            }
            containerUrls = containerUrls.concat(
                containerUrlsInLocalStorage.filter(
                    (item) => containerUrls.indexOf(item) < 0
                )
            );

            const storageAccountAndContainerList = containerUrls.map(
                getStorageAndContainerFromContainerUrl
            );
            const storageAccountToContainersMapping = [];
            storageAccountAndContainerList.forEach((pair, idx) => {
                const isPairAdded = storageAccountToContainersMapping.find(
                    (mapping) =>
                        mapping.storageAccountUrl === pair.storageAccountUrl
                );
                if (!isPairAdded) {
                    const newPair: StorageAccountToContainersMapping = {
                        storageAccountId: storageAccountsInLocalStorage.find(
                            (item) =>
                                areResourceValuesEqual(
                                    item.url,
                                    pair.storageAccountUrl,
                                    AzureResourceDisplayFields.url
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
            defaultStorageAccountToContainersMappingsRef.current = storageAccountToContainersMapping;
        } else if (storage?.containerUrl) {
            const storageAccountAndContainer = getStorageAndContainerFromContainerUrl(
                storage?.containerUrl
            );
            defaultStorageAccountToContainersMappingsRef.current = [
                {
                    storageAccountId: undefined,
                    storageAccountUrl:
                        storageAccountAndContainer.storageAccountUrl,
                    containerNames: [storageAccountAndContainer.containerName]
                } as StorageAccountToContainersMapping
            ];
        }
        adapter.setBlobContainerPath(storage.containerUrl);

        const selectedStorageAccountUrl = getStorageAccountUrlFromContainerUrl(
            storage.containerUrl
        );
        const storageAccountUrls =
            defaultStorageAccountToContainersMappingsRef.current?.map(
                (pair) => pair.storageAccountUrl
            ) || [];
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS,
            payload: {
                storageAccountItems: {
                    storageAccounts: storageAccountUrls,
                    storageAccountToEdit: selectedStorageAccountUrl
                }
            }
        });
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_CONTAINER_ITEMS,
            payload: {
                containerItems: {
                    containers:
                        defaultStorageAccountToContainersMappingsRef.current?.find(
                            (mapping) =>
                                mapping.storageAccountUrl ===
                                selectedStorageAccountUrl
                        )?.containerNames || [],
                    containerToEdit: getContainerNameFromUrl(
                        storage.containerUrl
                    )
                }
            }
        });

        return () => clearTimeout(dialogResettingValuesTimeoutRef.current);
    }, []);

    const handleOnEditClick = useCallback(() => {
        toggleIsDialogHidden();
    }, [toggleIsDialogHidden]);

    const handleOnSave = useCallback(() => {
        if (onAdtInstanceChange) {
            onAdtInstanceChange(
                environmentPickerState.adtInstanceItems.adtInstanceToEdit,
                environmentPickerState.adtInstanceItems.adtInstances
            );
        }
        if (storage?.onContainerChange) {
            storage.onContainerChange(
                environmentPickerState.storageAccountItems.storageAccountToEdit,
                environmentPickerState.containerItems.containerToEdit,
                environmentPickerState.containerItems.containers
            );
        }

        if (isLocalStorageEnabled) {
            setAdtInstancesInLocalStorage(
                environmentPickerState.adtInstanceItems.adtInstances
            );
        }
        if (storage?.isLocalStorageEnabled) {
            setStorageContainersInLocalStorage(
                environmentPickerState.containerItems.containers,
                environmentPickerState.storageAccountItems.storageAccountToEdit
            );
            setStorageAccountsInLocalStorage(
                environmentPickerState.storageAccountItems.storageAccounts
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
        environmentPickerState.adtInstanceItems,
        environmentPickerState.storageAccountItems,
        environmentPickerState.containerItems
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

    const handleOnAdtInstanceResourceChange = (
        resource: IADTInstance | string,
        resources: Array<IADTInstance | string>
    ) => {
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_ADT_INSTANCE_ITEMS,
            payload: {
                adtInstanceItems: {
                    adtInstanceToEdit: resource,
                    adtInstances: resources
                }
            }
        });
    };

    const handleOnStorageAccountResourceChange = (
        resource: IAzureStorageAccount | string,
        resources: Array<IAzureStorageAccount | string>
    ) => {
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS,
            payload: {
                storageAccountItems: {
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
                type: EnvironmentPickerActionType.SET_CONTAINER_ITEMS,
                payload: {
                    containerItems: {
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

    const handleOnStorageContainerResourceChange = (
        resource: IAzureStorageBlobContainer | string,
        resources: Array<IAzureStorageBlobContainer | string>
    ) => {
        environmentPickerDispatch({
            type: EnvironmentPickerActionType.SET_CONTAINER_ITEMS,
            payload: {
                containerItems: {
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
                        environmentPickerState.storageAccountItems
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
                    root: { display: !isDialogHidden ? 'flex' : 'none' }
                }}
                onDismiss={handleOnDismiss}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                {environmentPickerState.firstTimeVisible && (
                    <div className="cb-environment-picker-dialog-form">
                        <ResourcePicker
                            styles={comboBoxSubComponentStyles}
                            adapter={adapter}
                            resourceType={
                                AzureResourceTypes.DigitalTwinInstance
                            }
                            requiredAccessRoles={
                                RequiredAccessRoleGroupForADTInstance
                            }
                            shouldFetchResourcesOnMount={
                                !hasFetchedResources.current.adtInstances
                            }
                            label={t('environmentPicker.adtInstanceUrl')}
                            displayField={AzureResourceDisplayFields.url}
                            additionalOptions={getResourceUrls(
                                environmentPickerState.adtInstanceItems
                                    .adtInstances,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            selectedOption={getResourceUrl(
                                environmentPickerState.adtInstanceItems
                                    .adtInstanceToEdit,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            onChange={handleOnAdtInstanceResourceChange}
                            onLoaded={(_resources) => {
                                hasFetchedResources.current.adtInstances = true;
                            }}
                            allowFreeform
                        />
                        {storage && (
                            <>
                                <ResourcePicker
                                    styles={comboBoxSubComponentStyles}
                                    adapter={adapter}
                                    resourceType={
                                        AzureResourceTypes.StorageAccount
                                    }
                                    requiredAccessRoles={
                                        RequiredAccessRoleGroupForStorageAccount
                                    }
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
                                            .storageAccountItems
                                            .storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    additionalOptions={getResourceUrls(
                                        environmentPickerState
                                            .storageAccountItems
                                            .storageAccounts,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    onChange={
                                        handleOnStorageAccountResourceChange
                                    }
                                    onLoaded={
                                        handleOnStorageAccountResourcesLoaded
                                    }
                                    allowFreeform
                                />

                                <ResourcePicker
                                    key={getResourceUrl(
                                        environmentPickerState
                                            .storageAccountItems
                                            .storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    styles={comboBoxSubComponentStyles}
                                    adapter={adapter}
                                    resourceType={
                                        AzureResourceTypes.StorageBlobContainer
                                    }
                                    requiredAccessRoles={
                                        RequiredAccessRoleGroupForStorageContainer
                                    }
                                    searchParams={{
                                        additionalParams: {
                                            storageAccountId: getStorageAccountId(
                                                environmentPickerState
                                                    .storageAccountItems
                                                    .storageAccountToEdit,
                                                defaultStorageAccountToContainersMappingsRef.current
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
                                    additionalOptions={environmentPickerState.containerItems.containers?.map(
                                        (container) =>
                                            getNameOfResource(
                                                container,
                                                AzureResourceTypes.StorageBlobContainer
                                            )
                                    )}
                                    selectedOption={getNameOfResource(
                                        environmentPickerState.containerItems
                                            .containerToEdit,
                                        AzureResourceTypes.StorageBlobContainer
                                    )}
                                    onChange={
                                        handleOnStorageContainerResourceChange
                                    }
                                    onLoaded={(_resources) => {
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
                    <DefaultButton
                        onClick={handleOnDismiss}
                        text={t('cancel')}
                    />
                    <PrimaryButton
                        onClick={handleOnSave}
                        text={t('save')}
                        disabled={
                            storage
                                ? !(
                                      environmentPickerState.adtInstanceItems
                                          .adtInstanceToEdit &&
                                      environmentPickerState.containerItems
                                          .containerToEdit
                                  )
                                : !environmentPickerState.adtInstanceItems
                                      .adtInstanceToEdit
                        }
                    />
                </DialogFooter>
            </Dialog>
        </div>
    );
};

const comboBoxSubComponentStyles = {
    subComponentStyles: {
        comboBox: { callout: { width: 592 } }
    }
};

export default memo(EnvironmentPicker);
