import {
    ComboBox,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    FontIcon,
    IComboBoxOption,
    IComboBoxStyles,
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
        subText: t('environmentPicker.description')
    };
    const dialogStyles = {
        main: {
            width: '640px !important',
            maxWidth: 'unset !important',
            minHeight: 350
        }
    };
    const modalProps = {
        isBlocking: false,
        styles: dialogStyles
    };
    const comboBoxStyles: Partial<IComboBoxStyles> = {
        container: { paddingBottom: 16 },
        root: { width: '100%' },
        optionsContainerWrapper: { minWidth: 592 }
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
            setEnvironments(
                environmentsState.adapterResult.result?.data.map(
                    (i) => i.hostName
                )
            );
        }
    }, [environmentsState.adapterResult.result]);

    const environmentOptions: Array<IComboBoxOption> = useMemo(
        () =>
            environments.map(
                (e) =>
                    ({
                        key: e,
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

    const handleOnEnvironmentUrlChange = useCallback(
        (option, value) => {
            const newVal = value || option.text;
            setEnvironmentUrlToEdit(newVal);
            if (environments.findIndex((e) => e === newVal) === -1) {
                setEnvironments(environments.concat(newVal));
            }
        },
        [environments]
    );

    const handleOnContainerUrlChange = useCallback(
        (option, value) => {
            const newVal = value || option.text;
            setContainerUrlToEdit(newVal);
            if (containers.findIndex((e) => e === newVal) === -1) {
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
        }, 500);
    }, [environmentUrlToEdit, containerUrlToEdit]);

    const displayNameForEnvironment = useCallback((envUrl: string) => {
        if (envUrl) {
            ValidAdtHostSuffixes.map((s) => {
                if (envUrl.endsWith(s)) {
                    envUrl.replace(s, '');
                }
            });
            return envUrl;
        } else {
            return t('environmentPicker.noEnvironment');
        }
    }, []);

    const displayNameForContainer = useCallback((containerUrl: string) => {
        if (containerUrl) {
            ValidContainerHostSuffixes.map((s) => {
                if (containerUrl.endsWith(s)) {
                    containerUrl.replace(s, '');
                }
            });
            return containerUrl;
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
                        defaultSelectedKey={selectedEnvironmentUrl}
                        text={environmentUrlToEdit}
                        onChange={(_e, option, _idx, value) =>
                            handleOnEnvironmentUrlChange(option, value)
                        }
                        errorMessage={
                            !ValidAdtHostSuffixes.some((suffix) =>
                                environmentUrlToEdit.endsWith(suffix)
                            )
                                ? t(
                                      'environmentPicker.errors.invalidEnvironmentUrl'
                                  )
                                : undefined
                        }
                    />
                    <ComboBox
                        placeholder={t('environmentPicker.enterContainerUrl')}
                        label={t('environmentPicker.containerUrl')}
                        allowFreeform={true}
                        autoComplete={'on'}
                        options={containerOptions}
                        styles={comboBoxStyles}
                        defaultSelectedKey={selectedContainerUrl}
                        text={containerUrlToEdit}
                        onChange={(_e, option, _idx, value) =>
                            handleOnContainerUrlChange(option, value)
                        }
                        errorMessage={
                            !ValidContainerHostSuffixes.some((suffix) =>
                                containerUrlToEdit.endsWith(suffix)
                            )
                                ? t(
                                      'environmentPicker.errors.invalidContainerUrl'
                                  )
                                : undefined
                        }
                    />
                </div>
                <DialogFooter>
                    <PrimaryButton onClick={handleOnSave} text={t('save')} />
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
