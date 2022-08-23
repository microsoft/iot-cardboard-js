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
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    EnvironmentPickerActionType,
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
import {
    areResourceUrlsEqual,
    getContainerDisplayText,
    getContainerName,
    getContainerNameFromUrl,
    getContainerUrlsFromLocalStorage,
    getEnvironmentDisplayText,
    getEnvironmentUrlsFromLocalStorage,
    getResourceUrl,
    getResourceUrls,
    getStorageAccountId,
    getStorageAccountOptionsFromLocalStorage,
    getStorageAccountUrlFromContainerUrl,
    getStorageAndContainerFromContainerUrl,
    updateContainerOptionsInLocalStorage,
    updateEnvironmentsInLocalStorage,
    updateStorageAccountsInLocalStorage
} from './EnvironmentPickerManager';
import {
    defaultEnvironmentPickerState,
    EnvironmentPickerReducer
} from './EnvironmentPicker.state';

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
    isDialogHidden: isDialogHiddenProp,
    onDismiss,
    isLocalStorageEnabled,
    localStorageKey,
    selectedItemLocalStorageKey,
    environmentUrl,
    onEnvironmentUrlChange,
    storage
}: EnvironmentPickerProps) => {
    const { t } = useTranslation();

    const [state, dispatch] = useReducer(
        EnvironmentPickerReducer,
        defaultEnvironmentPickerState
    );

    const [isDialogHidden, { toggle: toggleIsDialogHidden }] = useBoolean(
        Boolean(isDialogHiddenProp)
    );

    const defaultStorageAccountToContainersMappingsRef = useRef<
        Array<StorageAccountToContainersMapping>
    >([]); // list of storage account and container pairs
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
                      ? t('environmentPicker.descriptionForEnvAndCont')
                      : t('environmentPicker.descriptionForEnvironment')) +
                  ' ' +
                  t('environmentPicker.descriptionForLocalStorage')
                : storage
                ? t('environmentPicker.descriptionForEnvAndCont')
                : t('environmentPicker.descriptionForEnvironment')
        }),
        [t, isLocalStorageEnabled, storage]
    );

    const previousIsDialogHidden = usePrevious(isDialogHidden);
    // Figure out if dialog needs to be open from props
    useEffect(() => {
        // Have undefined checked onMount to avoid an extra render
        // Have is previous check from true to false, to just change dialogHidden on open
        if (
            previousIsDialogHidden !== undefined &&
            previousIsDialogHidden === true &&
            previousIsDialogHidden !== isDialogHiddenProp
        ) {
            toggleIsDialogHidden();
        }
    }, [isDialogHiddenProp, previousIsDialogHidden, toggleIsDialogHidden]);

    useEffect(() => {
        if (!isDialogHidden) {
            dispatch({
                type: EnvironmentPickerActionType.SET_FIRST_TIME_VISIBLE,
                payload: true
            });
        }
    }, [isDialogHidden]);

    // set initial values based on props and local storage
    useEffect(() => {
        let environmentUrls = [];
        if (environmentUrl) {
            // passed environmentUrl has precedence over the selected environment in localstorage, if enabled
            environmentUrls = [environmentUrl];
        }
        if (isLocalStorageEnabled) {
            const environmentUrlsInLocalStorage: Array<string> = getEnvironmentUrlsFromLocalStorage(
                localStorageKey
            );

            if (
                environmentUrl &&
                !environmentUrlsInLocalStorage.includes(environmentUrl)
            ) {
                environmentUrlsInLocalStorage.push(environmentUrl);
            }

            environmentUrls = environmentUrls.concat(
                environmentUrlsInLocalStorage.filter(
                    (item) => environmentUrls.indexOf(item) < 0
                )
            );
        }
        dispatch({
            type: EnvironmentPickerActionType.SET_ENVIRONMENT_ITEMS,
            payload: {
                environmentItems: {
                    environments: environmentUrls,
                    environmentToEdit: environmentUrl
                }
            }
        });

        let containerUrls = [],
            storageAccounts: Array<StorageAccountsInLocalStorage> = []; // list of storage accounts in local storage
        if (storage?.containerUrl) {
            containerUrls = [storage.containerUrl];
        }
        if (storage?.isLocalStorageEnabled) {
            const containerUrlsInLocalStorage: Array<string> =
                getContainerUrlsFromLocalStorage(storage.localStorageKey) || [];

            storageAccounts = getStorageAccountOptionsFromLocalStorage();
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
                        storageAccountId: storageAccounts?.find((item) =>
                            areResourceUrlsEqual(
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
        const storageAccountUrls = defaultStorageAccountToContainersMappingsRef.current?.map(
            (pair) => pair.storageAccountUrl
        );
        dispatch({
            type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS,
            payload: {
                storageAccountItems: {
                    storageAccounts: storageAccountUrls,
                    storageAccountToEdit: selectedStorageAccountUrl
                }
            }
        });
        dispatch({
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
        if (onEnvironmentUrlChange) {
            onEnvironmentUrlChange(
                getResourceUrl(
                    state.environmentItems.environmentToEdit,
                    AzureResourceTypes.DigitalTwinInstance
                ),
                getResourceUrls(
                    state.environmentItems.environments,
                    AzureResourceTypes.DigitalTwinInstance
                )
            );
        }
        if (storage?.onContainerUrlChange) {
            storage.onContainerUrlChange(
                getResourceUrl(
                    state.containerItems.containerToEdit,
                    AzureResourceTypes.StorageBlobContainer,
                    state.storageAccountItems.storageAccountToEdit
                ),
                getResourceUrls(
                    state.containerItems.containers,
                    AzureResourceTypes.StorageBlobContainer,
                    state.storageAccountItems.storageAccountToEdit
                )
            );
        }

        if (isLocalStorageEnabled) {
            updateEnvironmentsInLocalStorage(
                state.environmentItems.environments,
                localStorageKey
            );
        }
        if (storage?.isLocalStorageEnabled) {
            updateContainerOptionsInLocalStorage(
                state.containerItems.containers,
                state.storageAccountItems.storageAccountToEdit,
                storage.localStorageKey
            );
            updateStorageAccountsInLocalStorage(
                state.storageAccountItems.storageAccounts
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
        onEnvironmentUrlChange,
        isLocalStorageEnabled,
        localStorageKey,
        selectedItemLocalStorageKey,
        state.environmentItems,
        state.storageAccountItems,
        state.containerItems
    ]);

    const handleOnDismiss = useCallback(() => {
        toggleIsDialogHidden();

        // wait for dialog dismiss fade-out animation to reset the values
        dialogResettingValuesTimeoutRef.current = setTimeout(() => {
            dispatch({
                type: EnvironmentPickerActionType.RESET_ITEMS_ON_DISMISS,
                payload: {
                    selectedEnvironmentUrl: environmentUrl,
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
    }, [toggleIsDialogHidden, onDismiss, environmentUrl, storage.containerUrl]);

    const environmentDisplayText = useMemo(() => {
        const displayText = getEnvironmentDisplayText(environmentUrl);
        return displayText || t('environmentPicker.noEnvironment');
    }, [t, environmentUrl]);

    const containerDisplayText = useMemo(() => {
        const displayText = getContainerDisplayText(
            getContainerNameFromUrl(storage.containerUrl),
            getStorageAccountUrlFromContainerUrl(storage.containerUrl)
        );
        return displayText || t('environmentPicker.noContainer');
    }, [t, storage.containerUrl]);

    const handleOnEnvironmentResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        dispatch({
            type: EnvironmentPickerActionType.SET_ENVIRONMENT_ITEMS,
            payload: {
                environmentItems: {
                    environmentToEdit: resource,
                    environments: resources
                }
            }
        });
    };

    const handleOnStorageAccountResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        dispatch({
            type: EnvironmentPickerActionType.SET_STORAGE_ACCOUNT_ITEMS,
            payload: {
                storageAccountItems: {
                    storageAccountToEdit: resource,
                    storageAccounts: resources
                }
            }
        });

        // when changing the storage account, update the containers from default mappings until containers are fetched
        dispatch({
            type: EnvironmentPickerActionType.SET_CONTAINER_ITEMS,
            payload: {
                containerItems: {
                    containerToEdit: null,
                    containers:
                        defaultStorageAccountToContainersMappingsRef.current?.find(
                            (mapping) =>
                                areResourceUrlsEqual(
                                    mapping.storageAccountUrl,
                                    getResourceUrl(
                                        resource,
                                        AzureResourceTypes.StorageAccount
                                    )
                                )
                        )?.containerNames || []
                }
            }
        });
        hasFetchedResources.current.storageBlobContainers = false; // reset this flag as we click on different storage account since it fetches containers again with different storage account id
    };

    const handleOnStorageAccountResourcesLoaded = (
        resources: Array<IAzureResource>
    ) => {
        hasFetchedResources.current.storageAccounts = true;
        hasFetchedResources.current.storageBlobContainers = false;
        dispatch({
            type: EnvironmentPickerActionType.HANDLE_STORAGE_ACCOUNT_LOADED,
            payload: { resources }
        });
    };

    const handleOnStorageContainerResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        dispatch({
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
                areResourceUrlsEqual(
                    getResourceUrl(
                        state.storageAccountItems.storageAccountToEdit,
                        AzureResourceTypes.StorageAccount
                    ),
                    mapping.storageAccountUrl
                )
        );
        if (defaultStorageAccountMapping) {
            defaultStorageAccountMapping.containerNames = resources.map(
                getContainerName
            );
        }
    };

    return (
        <BaseComponent
            locale={locale}
            localeStrings={localeStrings}
            theme={theme}
            containerClassName="cb-environment-picker"
        >
            <div className="cb-environment-picker-environment">
                <span className="cb-environment-picker-environment-title">
                    {environmentDisplayText}
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
                {state.firstTimeVisible && (
                    <div className="cb-environment-picker-dialog-form">
                        <ResourcePicker
                            styles={comboBoxSubComponentStyles}
                            adapter={adapter}
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
                            additionalOptions={getResourceUrls(
                                state.environmentItems.environments,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            selectedOption={getResourceUrl(
                                state.environmentItems.environmentToEdit,
                                AzureResourceTypes.DigitalTwinInstance
                            )}
                            onChange={handleOnEnvironmentResourceChange}
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
                                    selectedOption={getResourceUrl(
                                        state.storageAccountItems
                                            .storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    additionalOptions={getResourceUrls(
                                        state.storageAccountItems
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
                                        state.storageAccountItems
                                            .storageAccountToEdit,
                                        AzureResourceTypes.StorageAccount
                                    )}
                                    styles={comboBoxSubComponentStyles}
                                    adapter={adapter}
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
                                            storageAccountId: getStorageAccountId(
                                                state.storageAccountItems
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
                                    additionalOptions={state.containerItems.containers?.map(
                                        getContainerName
                                    )}
                                    selectedOption={getContainerName(
                                        state.containerItems.containerToEdit
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
                                      state.environmentItems
                                          .environmentToEdit &&
                                      state.containerItems.containerToEdit
                                  )
                                : !state.environmentItems.environmentToEdit
                        }
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
