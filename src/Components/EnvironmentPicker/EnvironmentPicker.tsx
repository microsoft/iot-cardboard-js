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
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAdapter from '../../Models/Hooks/useAdapter';
import BaseComponent from '../BaseComponent/BaseComponent';
import { EnvironmentPickerProps } from './EnvironmentPicker.types';
import './EnvironmentPicker.scss';

const EnvironmentPicker: React.FC<EnvironmentPickerProps> = ({
    shouldPullFromSubscription = false,
    isLocalStorageEnabled = false,
    storage = {
        isLocalStorageEnabled: false
    },
    ...props
}) => {
    const { t } = useTranslation();
    const [environments, setEnvironments] = useState<Array<IComboBoxOption>>(
        []
    );
    const [selectedEnvironmentUrl, setSelectedEnvironmentUrl] = useState(
        props.environmentUrl ?? 'No environment added'
    );
    const [containerUrls, setContainerUrls] = useState<Array<IComboBoxOption>>(
        []
    );
    const [selectedContainerUrl, setSelectedContainerUrl] = useState(
        storage?.containerUrl ?? 'No container added'
    );

    const [environmentUrlToEdit, setEnvironmentUrlToEdit] = useState(
        props.environmentUrl ?? ''
    );
    const [containerUrlToEdit, setContainerUrlToEdit] = useState(
        storage?.containerUrl ?? ''
    );

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
        root: { width: '100%' },
        optionsContainerWrapper: { minWidth: 592 }
    };

    const environmentsState = useAdapter({
        adapterMethod: () => props.adapter.getADTInstances(),
        refetchDependencies: [props.adapter],
        isAdapterCalledOnMount: shouldPullFromSubscription
    });

    useEffect(() => {
        if (!environmentsState.adapterResult.hasNoData()) {
            setEnvironments(
                environmentsState.adapterResult.result?.data.map(
                    (i) =>
                        ({
                            key: i.hostName,
                            text: i.hostName
                        } as IComboBoxOption)
                )
            );
        }
    }, [environmentsState.adapterResult.result]);

    useEffect(() => {
        // set initial values of environment and container based on props
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
                    {selectedEnvironmentUrl}
                </span>
                <IconButton
                    iconProps={{ iconName: 'Edit' }}
                    title={t('edit')}
                    ariaLabel={t('edit')}
                    onClick={toggleIsDialogHidden}
                    className={'cb-environment-picker-edit-button'}
                />
            </div>
            {storage && (
                <div className="cb-environment-picker-container">
                    <FontIcon iconName={'Database'} />
                    <span className="cb-environment-picker-container-title">
                        {selectedContainerUrl}
                    </span>
                </div>
            )}

            <Dialog
                hidden={isDialogHidden}
                onDismiss={toggleIsDialogHidden}
                dialogContentProps={dialogContentProps}
                modalProps={modalProps}
            >
                <div className="cb-environment-picker-dialog-form">
                    <ComboBox
                        placeholder={
                            environmentsState.isLoading
                                ? t('loadingInstances')
                                : t('enterInstanceUrl')
                        }
                        label={t('environmentPicker.environment')}
                        allowFreeform={true}
                        autoComplete={'on'}
                        options={environments}
                        styles={comboBoxStyles}
                        disabled={environmentsState.isLoading}
                        defaultSelectedKey={selectedEnvironmentUrl}
                        text={environmentUrlToEdit}
                        onChange={(_e, option, _idx, value) => {
                            const newVal = value || option.text;
                            setEnvironmentUrlToEdit(newVal);
                            if (
                                environments.findIndex(
                                    (e) => e.key === newVal
                                ) === -1
                            ) {
                                setEnvironments(
                                    environments.concat({
                                        key: newVal,
                                        text: newVal
                                    })
                                );
                            }
                        }}
                    />
                    <ComboBox
                        placeholder={t('environmentPicker.selectContainerUrl')}
                        label={t('environmentPicker.containerUrl')}
                        allowFreeform={true}
                        autoComplete={'on'}
                        options={containerUrls}
                        styles={comboBoxStyles}
                        defaultSelectedKey={selectedContainerUrl}
                        text={containerUrlToEdit}
                        onChange={(_e, option, _idx, value) => {
                            const newVal = value || option.text;
                            setContainerUrlToEdit(newVal);
                            if (
                                containerUrls.findIndex(
                                    (e) => e.key === newVal
                                ) === -1
                            ) {
                                setContainerUrls(
                                    containerUrls.concat({
                                        key: newVal,
                                        text: newVal
                                    })
                                );
                            }
                        }}
                    />
                </div>
                <DialogFooter>
                    <PrimaryButton
                        onClick={() => {
                            setSelectedEnvironmentUrl(environmentUrlToEdit);
                            setSelectedContainerUrl(containerUrlToEdit);
                            if (props.onEnvironmentUrlChange) {
                                props.onEnvironmentUrlChange(
                                    environmentUrlToEdit
                                );
                            }
                            if (storage.onContainerUrlChange) {
                                storage.onContainerUrlChange(
                                    containerUrlToEdit
                                );
                            }
                            toggleIsDialogHidden();
                        }}
                        text={t('save')}
                    />
                    <DefaultButton
                        onClick={toggleIsDialogHidden}
                        text={t('cancel')}
                    />
                </DialogFooter>
            </Dialog>
        </BaseComponent>
    );
};

export default React.memo(EnvironmentPicker);
