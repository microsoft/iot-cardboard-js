import {
    ComboBox,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    FontIcon,
    IComboBoxOption,
    IComboBoxStyles,
    Icon,
    IconButton,
    PrimaryButton,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import useAdapter from '../../Models/Hooks/useAdapter';
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
    SelectedContainerLocalStorageKey,
    SelectedEnvironmentLocalStorageKey,
    ValidAdtHostSuffixes,
    ValidContainerHostSuffixes
} from '../../Models/Constants/Constants';
import { IADTInstance } from '../../Models/Constants/Interfaces';

const EnvironmentPicker = (props: EnvironmentPickerProps) => {
    const { t } = useTranslation();
    const [environments, setEnvironments] = useState<
        Array<string | IADTInstance>
    >([]);
    const [selectedEnvironment, setSelectedEnvironment] = useState<
        string | IADTInstance
    >('');
    const [containers, setContainers] = useState<Array<string>>([]);
    const [selectedContainerUrl, setSelectedContainerUrl] = useState('');
    const [environmentToEdit, setEnvironmentToEdit] = useState<
        string | IADTInstance
    >('');
    const [containerUrlToEdit, setContainerUrlToEdit] = useState('');
    const [isDialogHidden, { toggle: toggleIsDialogHidden }] = useBoolean(true);
    const dialogResettingValuesTimeoutRef = useRef(null);

    const dialogContentProps = {
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
    const comboBoxStyles: Partial<IComboBoxStyles> = {
        container: { paddingBottom: 16 },
        root: { width: '100%' },
        optionsContainerWrapper: { minWidth: 592 },
        optionsContainer: {
            selectors: {
                span: { width: '100%' }
            }
        }
    };

    const environmentsState = useAdapter({
        adapterMethod: () => props.adapter.getADTInstances(),
        refetchDependencies: [],
        isAdapterCalledOnMount: props.shouldPullFromSubscription
    });

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

            const environments: Array<string> = environmentsInLocalStorage
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
                    (JSON.parse(
                        localStorage.getItem(
                            props.selectedItemLocalStorageKey ??
                                SelectedEnvironmentLocalStorageKey
                        )
                    ) as ADTSelectedEnvironmentInLocalStorage)?.appAdtUrl ??
                    (props.environmentUrl || '');
            } catch (error) {
                selectedEnvironmentUrl = '';
            }

            if (
                selectedEnvironmentUrl !== '' &&
                !environments.includes(selectedEnvironmentUrl)
            ) {
                environments.push(selectedEnvironmentUrl);
            }
            setSelectedEnvironment(selectedEnvironmentUrl);
            setEnvironments(environments);
        } else {
            setSelectedEnvironment(props.environmentUrl ?? '');
            setEnvironments(props.environmentUrl ? [props.environmentUrl] : []);
        }

        if (props.storage?.isLocalStorageEnabled) {
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
            setContainers(containerUrlsInLocalStorage);
        } else {
            setSelectedContainerUrl(props.storage?.containerUrl ?? '');
            setContainers(
                props.storage?.containerUrl ? [props.storage.containerUrl] : []
            );
        }
        return () => clearTimeout(dialogResettingValuesTimeoutRef.current);
    }, []);

    useEffect(() => {
        setEnvironmentToEdit(selectedEnvironment);
    }, [selectedEnvironment]);

    useEffect(() => {
        setContainerUrlToEdit(selectedContainerUrl);
    }, [selectedContainerUrl]);

    useEffect(() => {
        if (!environmentsState.adapterResult.hasNoData()) {
            const subscriptionEnvironments: Array<IADTInstance> =
                environmentsState.adapterResult.result?.data;
            setEnvironments(
                //merge localstorage environments and environments from subscription in case both are enabled
                environments.concat(
                    subscriptionEnvironments.filter(
                        (env) =>
                            isValidUrlStr(
                                'https://' + env.hostName,
                                'environment'
                            ) &&
                            environments.findIndex((e: string | IADTInstance) =>
                                typeof e === 'string'
                                    ? e === 'https://' + env.hostName
                                    : e.hostName === env.hostName
                            ) === -1
                    )
                )
            );
        }
    }, [environmentsState.adapterResult.result]);

    const environmentOptions: Array<IComboBoxOption> = useMemo(
        () =>
            environments.map((e: string | IADTInstance, idx) =>
                typeof e === 'string'
                    ? ({
                          key: `adt-environment-${idx}`,
                          text: e
                      } as IComboBoxOption)
                    : ({
                          key: `adt-environment-${idx}`,
                          text: 'https://' + e.hostName,
                          data: e
                      } as IComboBoxOption)
            ),
        [environments]
    );

    const containerOptions: Array<IComboBoxOption> = useMemo(
        () =>
            containers.map(
                (c) =>
                    ({
                        key: c,
                        text: c
                    } as IComboBoxOption)
            ),
        [containers]
    );

    const isValidUrlStr = useCallback(
        (urlStr: string, type: 'environment' | 'container') => {
            if (type === 'environment') {
                try {
                    return (
                        urlStr &&
                        urlStr.startsWith('https://') &&
                        ValidAdtHostSuffixes.some((suffix) =>
                            new URL(urlStr).hostname.endsWith(suffix)
                        )
                    );
                } catch (error) {
                    return false;
                }
            } else {
                try {
                    return (
                        urlStr &&
                        urlStr.startsWith('https://') &&
                        ValidContainerHostSuffixes.some((suffix) =>
                            new URL(urlStr).hostname.endsWith(suffix)
                        ) &&
                        new URL(urlStr).pathname !== '/'
                    );
                } catch (error) {
                    return false;
                }
            }
        },
        []
    );

    const environmentInputError = useMemo(
        () =>
            environmentToEdit &&
            !isValidUrlStr(
                typeof environmentToEdit === 'string'
                    ? environmentToEdit
                    : 'https://' + environmentToEdit.hostName,
                'environment'
            )
                ? t('environmentPicker.errors.invalidEnvironmentUrl')
                : undefined,
        [environmentToEdit, environmentsState]
    );

    const containerInputError = useMemo(
        () =>
            containerUrlToEdit &&
            !isValidUrlStr(containerUrlToEdit, 'container')
                ? t('environmentPicker.errors.invalidContainerUrl')
                : undefined,
        [containerUrlToEdit]
    );

    const onRenderOption = (
        option: IComboBoxOption,
        type: 'environment' | 'container'
    ) => {
        return (
            <div className={'cb-environment-picker-dropdown-option'}>
                <span>{option.text}</span>
                {!environmentsState.isLoading &&
                    environmentsState.adapterResult?.result?.data?.findIndex(
                        (e) => e.hostName === new URL(option.text).hostname
                    ) === -1 && (
                        <Icon
                            iconName="Delete"
                            aria-hidden="true"
                            title={t('environmentPicker.removeFromList')}
                            style={{ paddingLeft: 20 }}
                            onClick={(event) => {
                                event.stopPropagation();
                                if (type === 'environment') {
                                    const restOfOptions = environments.filter(
                                        (e: string | IADTInstance) =>
                                            typeof e === 'string'
                                                ? e !== option.text
                                                : 'https://' + e.hostName !==
                                                  option.text
                                    );
                                    setEnvironments(restOfOptions);
                                    if (
                                        option.text ===
                                        (typeof environmentToEdit === 'string'
                                            ? environmentToEdit
                                            : 'https://' +
                                              environmentToEdit.hostName)
                                    ) {
                                        setEnvironmentToEdit('');
                                    }
                                } else {
                                    const restOfOptions = containers.filter(
                                        (o: string) => o !== option.text
                                    );
                                    setContainers(restOfOptions);
                                    if (option.text === containerUrlToEdit) {
                                        setContainerUrlToEdit('');
                                    }
                                }
                            }}
                        />
                    )}
            </div>
        );
    };

    const handleOnEnvironmentUrlChange = useCallback(
        (option, value) => {
            if (value) {
                let newVal = value;
                if (
                    // let user enter hostname and gracefully append https protocol
                    !newVal.startsWith('https://') &&
                    ValidAdtHostSuffixes.some(
                        (suffix) =>
                            newVal.endsWith(suffix) ||
                            newVal.endsWith(suffix + '/')
                    )
                ) {
                    newVal = 'https://' + newVal;
                }
                setEnvironmentToEdit(newVal);
                if (
                    isValidUrlStr(newVal, 'environment') &&
                    environments.findIndex((e: string | IADTInstance) =>
                        typeof e === 'string'
                            ? new URL(e).hostname === new URL(newVal).hostname
                            : 'https://' + e.hostName ===
                              new URL(newVal).hostname
                    ) === -1
                ) {
                    setEnvironments(environments.concat(newVal));
                }
            } else {
                setEnvironmentToEdit(option.data ?? option.text);
            }
        },
        [environments]
    );

    const handleOnContainerUrlChange = useCallback(
        (option, value) => {
            let newVal = value ?? option?.text;
            if (!newVal.startsWith('https://')) {
                // let user enter hostname and gracefully append https protocol
                try {
                    const urlObj = new URL('https://' + newVal);
                    if (
                        ValidContainerHostSuffixes.some((suffix) =>
                            urlObj.hostname.endsWith(suffix)
                        ) &&
                        urlObj.pathname !== '/'
                    ) {
                        newVal = 'https://' + newVal;
                    }
                } catch (error) {
                    console.error('Not a valid URL string!');
                }
            }
            setContainerUrlToEdit(newVal);
            if (
                isValidUrlStr(newVal, 'container') &&
                containers.findIndex((e) => e === newVal) === -1
            ) {
                setContainers(containers.concat(newVal));
            }
        },
        [containers]
    );

    const handleOnSave = useCallback(() => {
        setSelectedEnvironment(environmentToEdit);
        setSelectedContainerUrl(containerUrlToEdit);

        if (props.onEnvironmentUrlChange) {
            props.onEnvironmentUrlChange(environmentToEdit, environments);
        }
        if (props.storage?.onContainerUrlChange) {
            props.storage?.onContainerUrlChange(containerUrlToEdit, containers);
        }

        if (props.isLocalStorageEnabled) {
            localStorage.setItem(
                props.localStorageKey ?? EnvironmentsLocalStorageKey,
                JSON.stringify(
                    environments.map((e: string | IADTInstance) => ({
                        config: {
                            appAdtUrl:
                                typeof e === 'string'
                                    ? e
                                    : 'https://' + e.hostName
                        },
                        name: typeof e === 'string' ? e : e.name
                    }))
                )
            );
            localStorage.setItem(
                props.selectedItemLocalStorageKey ??
                    SelectedEnvironmentLocalStorageKey,
                JSON.stringify({
                    appAdtUrl:
                        typeof environmentToEdit === 'string'
                            ? environmentToEdit
                            : 'https://' + environmentToEdit.hostName
                })
            );
        }
        if (props.storage?.isLocalStorageEnabled) {
            localStorage.setItem(
                props.storage.localStorageKey ?? ContainersLocalStorageKey,
                JSON.stringify(containers)
            );
            localStorage.setItem(
                props.storage.selectedItemLocalStorageKey ??
                    SelectedContainerLocalStorageKey,
                containerUrlToEdit
            );
        }
        toggleIsDialogHidden();
    }, [environmentToEdit, containerUrlToEdit, environments, containers]);

    const handleOnDismiss = useCallback(() => {
        toggleIsDialogHidden();
        dialogResettingValuesTimeoutRef.current = setTimeout(() => {
            // wait for dialog dismiss fade-out animation to reset the values
            const selectedEnvironmentIndex = environments.findIndex(
                (e: string | IADTInstance) =>
                    (typeof e === 'string' ? e : 'https://' + e.hostName) ===
                    (typeof selectedEnvironment === 'string'
                        ? selectedEnvironment
                        : 'https://' + selectedEnvironment.hostName)
            );
            setEnvironmentToEdit(selectedEnvironment);
            setContainerUrlToEdit(selectedContainerUrl);
            if (selectedEnvironmentIndex === -1) {
                setEnvironments(environments.concat(selectedEnvironment));
            }
            if (
                containers.findIndex((e) => e === selectedContainerUrl) === -1
            ) {
                setContainers(containers.concat(selectedContainerUrl));
            }
        }, 500);
    }, [environmentToEdit, containerUrlToEdit]);

    const displayNameForEnvironment = useCallback(
        (env: string | IADTInstance) => {
            if (env) {
                return typeof env === 'string'
                    ? new URL(env).hostname.split('.')[0]
                    : env.name;
            } else {
                return t('environmentPicker.noEnvironment');
            }
        },
        []
    );

    const displayNameForContainer = useCallback((containerUrl: string) => {
        if (containerUrl) {
            const urlObj = new URL(containerUrl);
            return urlObj.hostname.split('.')[0] + urlObj.pathname; // i.e. AzureStorageAccountName/ContainerName
        } else {
            return t('environmentPicker.noContainer');
        }
    }, []);

    return (
        <BaseComponent
            locale={props.locale}
            localeStrings={props.localeStrings}
            theme={props.theme}
            containerClassName="cb-environment-picker"
        >
            <div className="cb-environment-picker-environment">
                <span className="cb-environment-picker-environment-title">
                    {displayNameForEnvironment(selectedEnvironment)}
                </span>
                <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title={t('edit')}
                    ariaLabel={t('edit')}
                    onClick={toggleIsDialogHidden}
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
                    <ComboBox
                        placeholder={t('environmentPicker.enterEnvironmentUrl')}
                        label={t('environmentPicker.environmentUrl')}
                        allowFreeform={true}
                        autoComplete={'on'}
                        options={environmentOptions}
                        styles={comboBoxStyles}
                        required
                        text={
                            typeof environmentToEdit === 'string'
                                ? environmentToEdit
                                : 'https://' + environmentToEdit.hostName
                        }
                        onChange={(_e, option, _idx, value) =>
                            handleOnEnvironmentUrlChange(option, value)
                        }
                        errorMessage={environmentInputError}
                        onRenderOption={(option) =>
                            onRenderOption(option, 'environment')
                        }
                        onRenderLabel={(p) => (
                            <div className="cb-environment-picker-environment-url-label">
                                <span className="cb-environment-picker-environment-url-label-text">
                                    {p.props.label}
                                </span>
                                {environmentsState.isLoading && (
                                    <Spinner
                                        size={SpinnerSize.xSmall}
                                        label={t('loadingInstances')}
                                        ariaLive="assertive"
                                        labelPosition="right"
                                    />
                                )}
                            </div>
                        )}
                        selectedKey={
                            typeof environmentToEdit === 'string'
                                ? environmentToEdit
                                : 'https://' + environmentToEdit.hostName
                        }
                    />
                    {props.storage && (
                        <ComboBox
                            placeholder={t(
                                'environmentPicker.enterContainerUrl'
                            )}
                            label={t('environmentPicker.containerUrl')}
                            allowFreeform={true}
                            autoComplete={'on'}
                            options={containerOptions}
                            styles={comboBoxStyles}
                            required
                            text={containerUrlToEdit}
                            onChange={(_e, option, _idx, value) =>
                                handleOnContainerUrlChange(option, value)
                            }
                            errorMessage={containerInputError}
                            onRenderOption={(option) =>
                                onRenderOption(option, 'container')
                            }
                            selectedKey={containerUrlToEdit}
                        />
                    )}
                </div>
                <DialogFooter>
                    <PrimaryButton
                        onClick={handleOnSave}
                        text={t('save')}
                        disabled={
                            props.storage
                                ? !(
                                      isValidUrlStr(
                                          typeof environmentToEdit === 'string'
                                              ? environmentToEdit
                                              : 'https://' +
                                                    environmentToEdit.hostName,
                                          'environment'
                                      ) &&
                                      isValidUrlStr(
                                          containerUrlToEdit,
                                          'container'
                                      )
                                  )
                                : !isValidUrlStr(
                                      typeof environmentToEdit === 'string'
                                          ? environmentToEdit
                                          : 'https://' +
                                                environmentToEdit.hostName,
                                      'environment'
                                  )
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
