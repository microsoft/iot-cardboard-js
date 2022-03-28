import React, { useState } from 'react';
import { Icon, TextField, ActionButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';
import './OATHeader.scss';

type OATHeaderProps = {
    theme?: Theme;
    modelNameInput?: string;
    onHandleImportModel?: () => any;
    onHandleExportModel?: () => any;
};

const OATHeader = ({
    theme,
    modelNameInput,
    onHandleImportModel,
    onHandleExportModel
}: OATHeaderProps) => {
    const { t } = useTranslation();
    const [modelName, setModelName] = useState(modelNameInput);
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;

    return (
        <BaseComponent theme={themeToUse}>
            <div className="cb-ontology-header-container">
                <div className="cb-ontology-header-search-component">
                    <div className="cb-ontology-header-logo">
                        {t('OATHeader.title')}
                    </div>
                    <div className="cb-ontology-header-search">
                        <TextField
                            placeholder={t('OATHeader.searchContent')}
                        ></TextField>
                    </div>
                    <div className="cb-ontology-header-options">
                        <Icon
                            iconName="Ringer"
                            styles={{
                                root: {
                                    fontSize: 20,
                                    paddingLeft: '50%',
                                    color: 'var(--cb-color-bg-card)'
                                }
                            }}
                        />
                        <Icon
                            iconName="Settings"
                            styles={{
                                root: {
                                    fontSize: 20,
                                    paddingLeft: '5%',
                                    color: 'var(--cb-color-bg-card)'
                                }
                            }}
                        />
                        <Icon
                            iconName="Help"
                            styles={{
                                root: {
                                    fontSize: 20,
                                    paddingLeft: '5%',
                                    color: 'var(--cb-color-bg-card)'
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="cb-ontology-header-menu-component">
                    <div className="cb-ontology-header-model">
                        <label>{modelName}</label>
                    </div>
                    <div className="cb-ontology-header-menu">
                        <ActionButton>
                            <Icon
                                iconName="Save"
                                styles={{
                                    root: {
                                        fontSize: 15,
                                        color: 'var(--cb-color-theme-primary)'
                                    }
                                }}
                            />
                            {t('OATHeader.save')}
                        </ActionButton>
                        <ActionButton>
                            <Icon
                                iconName="Upload"
                                styles={{
                                    root: {
                                        fontSize: 15,
                                        color: 'var(--cb-color-theme-primary)'
                                    }
                                }}
                            />
                            {t('OATHeader.publish')}
                        </ActionButton>
                        <ActionButton>
                            <Icon
                                iconName="Sync"
                                styles={{
                                    root: {
                                        fontSize: 15,
                                        color: 'var(--cb-color-theme-primary)'
                                    }
                                }}
                            />
                            {t('OATHeader.sync')}
                        </ActionButton>
                        <ActionButton onClick={onHandleImportModel}>
                            <Icon
                                iconName="Import"
                                styles={{
                                    root: {
                                        fontSize: 15,
                                        color: 'var(--cb-color-theme-primary)'
                                    }
                                }}
                            />
                            {t('OATHeader.import')}
                        </ActionButton>
                        <ActionButton
                            onClick={() => {
                                if (onHandleExportModel) {
                                    onHandleExportModel();
                                }
                            }}
                        >
                            <Icon
                                iconName="Export"
                                styles={{
                                    root: {
                                        fontSize: 15,
                                        color: 'var(--cb-color-theme-primary)'
                                    }
                                }}
                            />
                            {t('OATHeader.export')}
                        </ActionButton>
                    </div>
                    <div className="cb-ontology-header-versioning"></div>
                </div>
            </div>
        </BaseComponent>
    );
};

export default OATHeader;
