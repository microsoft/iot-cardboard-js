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
    PrimaryButton
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAdapter from '../../Models/Hooks/useAdapter';
import BaseComponent from '../BaseComponent/BaseComponent';
import { EnvironmentPickerProps } from './EnvironmentPicker.types';
import './EnvironmentPicker.scss';
import {
    ValidAdtHostSuffixes,
    ValidContainerHostSuffixes
} from '../../Models/Constants/Constants';

const EnvironmentPicker: React.FC<EnvironmentPickerProps> = ({
    shouldPullFromSubscription = false,
    isLocalStorageEnabled = false,
    ...props
}) => {
    const { t } = useTranslation();
    const [environments, setEnvironments] = useState<Array<string>>([]);
    const [selectedEnvironmentUrl, setSelectedEnvironmentUrl] = useState('');
    const [containers, setContainers] = useState<Array<string>>([]);
    const [selectedContainerUrl, setSelectedContainerUrl] = useState('');
    const [environmentUrlToEdit, setEnvironmentUrlToEdit] = useState('');
    const [containerUrlToEdit, setContainerUrlToEdit] = useState('');
    const [isDialogHidden, { toggle: toggleIsDialogHidden }] = useBoolean(true);

    const dialogContentProps = {
        type: DialogType.normal,
        title: t('environmentPicker.editEnvironment'),
        closeButtonAriaLabel: t('close'),
        subText: isLocalStorageEnabled
            ? t('environmentPicker.description') +
              ' ' +
              t('environmentPicker.descriptionForLocalStorage')
            : t('environmentPicker.description')
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
        refetchDependencies: [props.adapter],
        isAdapterCalledOnMount: shouldPullFromSubscription
    });

    // set initial values based on props and local storage
    useEffect(() => {
        if (isLocalStorageEnabled) {
            const environmentUrlsInLocalStorage = localStorage.getItem(
                props.localStorageKey
            );
            if (environmentUrlsInLocalStorage) {
                setEnvironments(JSON.parse(environmentUrlsInLocalStorage));
            }

            const selectedEnvironmentUrlInLocalStorage = localStorage.getItem(
                props.selectedItemLocalStorageKey
            );
            if (props.environmentUrl) {
                setSelectedEnvironmentUrl(props.environmentUrl);
            } else if (selectedEnvironmentUrlInLocalStorage) {
                setSelectedEnvironmentUrl(selectedEnvironmentUrlInLocalStorage);
            } else {
                setSelectedEnvironmentUrl('');
            }
        } else {
            setSelectedEnvironmentUrl(props.environmentUrl ?? '');
        }

        if (props.storage?.isLocalStorageEnabled) {
            const containerUrlsInLocalStorage = localStorage.getItem(
                props.storage.localStorageKey
            );
            if (containerUrlsInLocalStorage) {
                setContainers(JSON.parse(containerUrlsInLocalStorage));
            }

            const selectedContainerUrlInLocalStorage = localStorage.getItem(
                props.storage.selectedItemLocalStorageKey
            );
            if (props.storage.containerUrl) {
                setSelectedContainerUrl(props.storage.containerUrl);
            } else if (selectedContainerUrlInLocalStorage) {
                setSelectedContainerUrl(selectedContainerUrlInLocalStorage);
            } else {
                setSelectedContainerUrl('');
            }
        } else {
            setSelectedContainerUrl(props.storage?.containerUrl ?? '');
        }
    }, []);

    useEffect(() => {
        setEnvironmentUrlToEdit(selectedEnvironmentUrl);
    }, [selectedEnvironmentUrl]);

    useEffect(() => {
        setContainerUrlToEdit(selectedContainerUrl);
    }, [selectedContainerUrl]);

    useEffect(() => {
        if (!environmentsState.adapterResult.hasNoData()) {
            const environmentUrls = environmentsState.adapterResult.result?.data.map(
                (i) => 'https://' + i.hostName
            );
            setEnvironments(
                environmentUrls.filter((envUrl) =>
                    isValidUrlStr(envUrl, 'environment')
                )
            );
        }
    }, [environmentsState.adapterResult.result]);

    const environmentOptions: Array<IComboBoxOption> = useMemo(
        () =>
            environments.map(
                (e, idx) =>
                    ({
                        key: `adt-environment-${idx}`,
                        text: e
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
                return (
                    urlStr &&
                    urlStr.startsWith('https://') &&
                    ValidAdtHostSuffixes.some((suffix) =>
                        urlStr.endsWith(suffix)
                    )
                );
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
            environmentUrlToEdit &&
            !environmentsState.isLoading &&
            !isValidUrlStr(environmentUrlToEdit, 'environment')
                ? t('environmentPicker.errors.invalidEnvironmentUrl')
                : undefined,
        [environmentUrlToEdit, environmentsState]
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
                <Icon
                    iconName="Delete"
                    aria-hidden="true"
                    title={'Remove'}
                    style={{ paddingLeft: 20 }}
                    onClick={(event) => {
                        event.stopPropagation();
                        if (type === 'environment') {
                            const restOfOptions = environments.filter(
                                (o: string) => o !== option.text
                            );
                            setEnvironments(restOfOptions);
                            if (option.text === environmentUrlToEdit) {
                                setEnvironmentUrlToEdit('');
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
            </div>
        );
    };

    const handleOnEnvironmentUrlChange = useCallback(
        (option, value) => {
            let newVal = value ?? option?.text;
            if (
                // let user enter hostname and gracefully append https protocol
                !newVal.startsWith('https://') &&
                ValidAdtHostSuffixes.some((suffix) => newVal.endsWith(suffix))
            ) {
                newVal = 'https://' + newVal;
            }
            setEnvironmentUrlToEdit(newVal);
            if (
                isValidUrlStr(newVal, 'environment') &&
                environments.findIndex((e) => e === newVal) === -1
            ) {
                setEnvironments(environments.concat(newVal));
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
                    console.log('Not a valid URL string!');
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
        setSelectedEnvironmentUrl(environmentUrlToEdit);
        setSelectedContainerUrl(containerUrlToEdit);

        if (props.onEnvironmentUrlChange) {
            props.onEnvironmentUrlChange(environmentUrlToEdit);
        }
        if (props.storage?.onContainerUrlChange) {
            props.storage?.onContainerUrlChange(containerUrlToEdit);
        }

        if (isLocalStorageEnabled) {
            localStorage.setItem(
                props.localStorageKey,
                JSON.stringify(environments)
            );
            localStorage.setItem(
                props.selectedItemLocalStorageKey,
                environmentUrlToEdit
            );
        }
        if (props.storage?.isLocalStorageEnabled) {
            localStorage.setItem(
                props.storage.localStorageKey,
                JSON.stringify(containers)
            );
            localStorage.setItem(
                props.storage.selectedItemLocalStorageKey,
                containerUrlToEdit
            );
        }
        toggleIsDialogHidden();
    }, [environmentUrlToEdit, containerUrlToEdit]);

    const handleOnDismiss = useCallback(() => {
        toggleIsDialogHidden();
        setTimeout(() => {
            // wait for dialog dismiss fade-out animation to reset the values
            setEnvironmentUrlToEdit(selectedEnvironmentUrl);
            setContainerUrlToEdit(selectedContainerUrl);
            if (
                environments.findIndex((e) => e === selectedEnvironmentUrl) ===
                -1
            ) {
                setEnvironments(environments.concat(selectedEnvironmentUrl));
            }
            if (
                containers.findIndex((e) => e === selectedContainerUrl) === -1
            ) {
                setContainers(containers.concat(selectedContainerUrl));
            }
        }, 500);
    }, [environmentUrlToEdit, containerUrlToEdit]);

    const displayNameForEnvironment = useCallback((envUrl: string) => {
        if (envUrl) {
            return new URL(envUrl).hostname.split('.')[0]; // i.e. ADTInstanceResourceName
        } else {
            return t('environmentPicker.noEnvironment');
        }
    }, []);

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
                    {displayNameForEnvironment(selectedEnvironmentUrl)}
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
                        placeholder={
                            environmentsState.isLoading
                                ? t('loadingInstances')
                                : t('environmentPicker.enterEnvironmentUrl')
                        }
                        label={t('environmentPicker.environmentUrl')}
                        allowFreeform={true}
                        autoComplete={'on'}
                        options={environmentOptions}
                        styles={comboBoxStyles}
                        disabled={environmentsState.isLoading}
                        required
                        text={
                            environmentsState.isLoading
                                ? ''
                                : environmentUrlToEdit
                        }
                        onChange={(_e, option, _idx, value) =>
                            handleOnEnvironmentUrlChange(option, value)
                        }
                        errorMessage={environmentInputError}
                        onRenderOption={(option) =>
                            onRenderOption(option, 'environment')
                        }
                        selectedKey={
                            environmentsState.isLoading
                                ? undefined
                                : environmentUrlToEdit
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
                                          environmentUrlToEdit,
                                          'environment'
                                      ) &&
                                      isValidUrlStr(
                                          containerUrlToEdit,
                                          'container'
                                      )
                                  )
                                : !isValidUrlStr(
                                      environmentUrlToEdit,
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

export default React.memo(EnvironmentPicker);
