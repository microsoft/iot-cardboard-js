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
    ADTEnvironmentInLocalStorage,
    ADTSelectedEnvironmentInLocalStorage,
    EnvironmentPickerProps
} from './EnvironmentPicker.types';
import './EnvironmentPicker.scss';
import {
    ContainersLocalStorageKey,
    EnvironmentsLocalStorageKey,
    DOCUMENTATION_LINKS,
    SelectedContainerLocalStorageKey,
    SelectedEnvironmentLocalStorageKey
} from '../../Models/Constants/Constants';
import ResourcePicker from '../ResourcePicker/ResourcePicker';
import {
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes,
    IAzureResource
} from '../../Models/Constants';

const EnvironmentPicker = (props: EnvironmentPickerProps) => {
    const { t } = useTranslation();
    const [environmentUrls, setEnvironmentUrls] = useState<Array<string>>([]);
    const [selectedEnvironmentUrl, setSelectedEnvironmentUrl] = useState('');
    const [environmentUrlToEdit, setEnvironmentUrlToEdit] = useState('');
    const [containerUrls, setContainerUrls] = useState<Array<string>>([]);
    const [selectedContainerUrl, setSelectedContainerUrl] = useState('');
    const [containerUrlToEdit, setContainerUrlToEdit] = useState('');
    const [storageAccountToEdit, setStorageAccountToEdit] = useState(null);

    const [isDialogHidden, { toggle: toggleIsDialogHidden }] = useBoolean(
        Boolean(props.isDialogHidden)
    );
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

    // set initial values based on props and local storage
    useEffect(() => {
        if (props.isLocalStorageEnabled) {
            let environmentsInLocalStorage: Array<ADTEnvironmentInLocalStorage> = null;
            try {
                environmentsInLocalStorage = JSON.parse(
                    localStorage.getItem(
                        props.localStorageKey ?? EnvironmentsLocalStorageKey
                    )
                );
            } catch (error) {
                environmentsInLocalStorage = null;
            }

            const environmentUrls: Array<string> = environmentsInLocalStorage
                ? environmentsInLocalStorage
                      .filter((e) => e.config?.appAdtUrl)
                      .map(
                          (e: ADTEnvironmentInLocalStorage) =>
                              e.config.appAdtUrl
                      )
                : [];

            let selectedEnvironmentUrl = '';
            try {
                selectedEnvironmentUrl =
                    props.environmentUrl ??
                    (JSON.parse(
                        localStorage.getItem(
                            props.selectedItemLocalStorageKey ??
                                SelectedEnvironmentLocalStorageKey
                        )
                    ) as ADTSelectedEnvironmentInLocalStorage)?.appAdtUrl;
            } catch (error) {
                selectedEnvironmentUrl = '';
            }

            if (
                selectedEnvironmentUrl &&
                !environmentUrls.includes(selectedEnvironmentUrl)
            ) {
                environmentUrls.push(selectedEnvironmentUrl);
            }
            setSelectedEnvironmentUrl(selectedEnvironmentUrl);
            setEnvironmentUrlToEdit(selectedEnvironmentUrl);
            setEnvironmentUrls(environmentUrls);
        } else {
            setSelectedEnvironmentUrl(props.environmentUrl ?? '');
            setEnvironmentUrlToEdit(props.environmentUrl ?? '');
            setEnvironmentUrls(
                props.environmentUrl ? [props.environmentUrl] : []
            );
        }

        if (props.storage?.containerUrl) {
            setSelectedContainerUrl(props.storage.containerUrl);
            setContainerUrlToEdit(props.storage.containerUrl);
            setContainerUrls(
                props.storage?.containerUrl ? [props.storage.containerUrl] : []
            );
            try {
                const containerUrl = new URL(props.storage.containerUrl);
                setStorageAccountToEdit(containerUrl.origin + '/');
            } catch {
                setStorageAccountToEdit(null);
            }
        } else if (props.storage?.isLocalStorageEnabled) {
            let containerUrlsInLocalStorage: Array<string> = [];
            try {
                containerUrlsInLocalStorage =
                    JSON.parse(
                        localStorage.getItem(
                            props.storage.localStorageKey ??
                                ContainersLocalStorageKey
                        )
                    ) ?? [];
            } catch (error) {
                containerUrlsInLocalStorage = [];
            }

            // passed containerUrl prop overrides the one stored in local storage, change this logic as appropriate
            const selectedContainerUrl =
                props.storage.containerUrl ??
                (localStorage.getItem(
                    props.storage.selectedItemLocalStorageKey ??
                        SelectedContainerLocalStorageKey
                ) ||
                    '');
            if (
                selectedContainerUrl !== '' &&
                !containerUrlsInLocalStorage.includes(selectedContainerUrl)
            ) {
                containerUrlsInLocalStorage.push(selectedContainerUrl);
            }
            setSelectedContainerUrl(selectedContainerUrl);
            setContainerUrlToEdit(selectedContainerUrl);
            setContainerUrls(containerUrlsInLocalStorage);
            try {
                const containerUrl = new URL(props.storage.containerUrl);
                setStorageAccountToEdit(containerUrl.origin + '/');
            } catch {
                setStorageAccountToEdit(null);
            }
        }
        return () => clearTimeout(dialogResettingValuesTimeoutRef.current);
    }, []);

    useEffect(() => {
        setEnvironmentUrlToEdit(selectedEnvironmentUrl);
    }, [selectedEnvironmentUrl]);

    const handleOnEditClick = useCallback(() => {
        toggleIsDialogHidden();
    }, []);

    const handleOnSave = useCallback(() => {
        // eslint-disable-next-line no-debugger
        debugger;
        if (props.onDismiss) {
            props.onDismiss();
        }
        setSelectedEnvironmentUrl(environmentUrlToEdit);

        if (props.onEnvironmentUrlChange) {
            props.onEnvironmentUrlChange(environmentUrlToEdit, environmentUrls);
        }
        // if (props.storage?.onContainerUrlChange) {
        //     props.storage?.onContainerUrlChange(
        //         selectedContainerUrl,
        //         containerUrls
        //     );
        // }

        if (props.isLocalStorageEnabled) {
            localStorage.setItem(
                props.localStorageKey ?? EnvironmentsLocalStorageKey,
                JSON.stringify(
                    environmentUrls.map((e: string) => {
                        if (!e) return;
                        return {
                            config: {
                                appAdtUrl: e
                            },
                            name: e
                        };
                    })
                )
            );
            localStorage.setItem(
                props.selectedItemLocalStorageKey ??
                    SelectedEnvironmentLocalStorageKey,
                JSON.stringify({
                    appAdtUrl: environmentUrlToEdit
                })
            );
        }
        if (props.storage?.isLocalStorageEnabled) {
            localStorage.setItem(
                props.storage.localStorageKey ?? ContainersLocalStorageKey,
                JSON.stringify(containerUrls)
            );
            // localStorage.setItem(
            //     props.storage.selectedItemLocalStorageKey ??
            //         SelectedContainerLocalStorageKey,
            //     selectedContainerUrl
            // );
        }
        toggleIsDialogHidden();
    }, [
        environmentUrlToEdit,
        props,
        toggleIsDialogHidden,
        environmentUrls,
        containerUrls
    ]);

    const handleOnDismiss = useCallback(() => {
        if (props.onDismiss) {
            props.onDismiss();
        }
        toggleIsDialogHidden();
        dialogResettingValuesTimeoutRef.current = setTimeout(() => {
            // wait for dialog dismiss fade-out animation to reset the values
            if (selectedEnvironmentUrl) {
                const selectedEnvironmentIndex = environmentUrls.findIndex(
                    (e: string) => e === selectedEnvironmentUrl
                );
                if (selectedEnvironmentIndex === -1) {
                    setEnvironmentUrls(
                        environmentUrls.concat(selectedEnvironmentUrl)
                    );
                }
            }
            setEnvironmentUrlToEdit(selectedEnvironmentUrl);

            // if (
            //     selectedContainerUrl &&
            //     containers.findIndex((e) => e === selectedContainerUrl) === -1
            // ) {
            //     setContainers(containers.concat(selectedContainerUrl));
            // }
            // setContainerUrlToEdit(selectedContainerUrl);
        }, 500);
    }, [
        toggleIsDialogHidden,
        environmentUrls,
        selectedEnvironmentUrl,
        selectedContainerUrl,
        containerUrls
    ]);

    const displayNameForEnvironment = useCallback(
        (envUrl: string) => {
            if (envUrl) {
                return new URL(envUrl).hostname.split('.')[0];
            } else {
                return t('environmentPicker.noEnvironment');
            }
        },
        [t]
    );

    const displayNameForContainer = useCallback(
        (containerUrl: string) => {
            if (containerUrl) {
                const urlObj = new URL(containerUrl);
                return urlObj.hostname.split('.')[0] + urlObj.pathname; // i.e. AzureStorageAccountName/ContainerName
            } else {
                return t('environmentPicker.noContainer');
            }
        },
        [t]
    );

    const handleOnEnvironmentResourceChange = (
        resource: IAzureResource | string,
        resources: Array<IAzureResource | string>
    ) => {
        const getResourceUrl = (resource) =>
            typeof resource === 'string'
                ? resource
                : 'https://' + resource.properties?.hostName;

        setEnvironmentUrlToEdit(getResourceUrl(resource));
        setEnvironmentUrls(
            resources.map((resource) => getResourceUrl(resource))
        );
    };

    const handleOnStorageAccountResourceChange = (
        resource: IAzureResource | string
    ) => {
        setStorageAccountToEdit(resource);
        setContainerUrlToEdit(null);
        hasFetchedResources.current.storageBlobContainers = false;
    };

    const handleOnStorageContainerResourceChange = (
        resource: IAzureResource | string
    ) => {
        if (
            storageAccountToEdit.properties?.primaryEndpoints?.blob &&
            typeof resource !== 'string'
        ) {
            setContainerUrlToEdit(
                `${storageAccountToEdit.properties?.primaryEndpoints?.blob}${resource.name}`
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
                    {displayNameForEnvironment(selectedEnvironmentUrl)}
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
                        {displayNameForContainer(selectedContainerUrl)}
                    </span>
                </div>
            )}

            <Dialog
                hidden={isDialogHidden}
                onDismiss={handleOnDismiss}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                <div className="cb-environment-picker-dialog-form">
                    <ResourcePicker
                        adapter={props.adapter}
                        resourceType={AzureResourceTypes.DigitalTwinInstance}
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
                        additionalOptions={environmentUrls}
                        selectedOption={environmentUrlToEdit}
                        onResourceChange={handleOnEnvironmentResourceChange}
                        onResourcesLoaded={(_resources) => {
                            hasFetchedResources.current.adtInstances = true;
                        }}
                    />
                    {props.storage && (
                        <>
                            <ResourcePicker
                                adapter={props.adapter}
                                resourceType={AzureResourceTypes.StorageAccount}
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
                                    !hasFetchedResources.current.storageAccounts
                                }
                                label={t('environmentPicker.storageAccountUrl')}
                                displayField={AzureResourceDisplayFields.url}
                                selectedOption={storageAccountToEdit}
                                onResourceChange={
                                    handleOnStorageAccountResourceChange
                                }
                                onResourcesLoaded={(resources) => {
                                    hasFetchedResources.current.storageAccounts = true;
                                    setStorageAccountToEdit(
                                        resources.find(
                                            (r) =>
                                                r.properties?.primaryEndpoints
                                                    ?.blob ===
                                                storageAccountToEdit
                                        )
                                    );
                                }}
                            />
                            {storageAccountToEdit?.id && (
                                <ResourcePicker
                                    key={storageAccountToEdit.id}
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
                                    additionalResourceSearchParams={{
                                        storageAccountId:
                                            storageAccountToEdit.id
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
                                    selectedOption={
                                        containerUrlToEdit
                                            ? new URL(
                                                  containerUrlToEdit
                                              ).pathname.split('/')[1]
                                            : undefined
                                    }
                                    onResourceChange={
                                        handleOnStorageContainerResourceChange
                                    }
                                    onResourcesLoaded={(_resources) => {
                                        hasFetchedResources.current.storageBlobContainers = true;
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
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
                                ? !!(environmentUrlToEdit && containerUrlToEdit)
                                : !!environmentUrlToEdit
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

export default memo(EnvironmentPicker);
