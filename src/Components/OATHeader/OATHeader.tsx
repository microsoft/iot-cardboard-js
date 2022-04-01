import React from 'react';
import {
    Icon,
    TextField,
    ActionButton,
    useTheme,
    FontSizes
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import BaseComponent from '../BaseComponent/BaseComponent';
import './OATHeader.scss';

const OATHeader = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <BaseComponent theme={theme}>
            <div className="cb-oat-header-container">
                <div className="cb-oat-header-search-component">
                    <div className="cb-oat-header-logo">
                        {t('OATHeader.title')}
                    </div>
                    <div className="cb-oat-header-search">
                        <TextField
                            placeholder={t('OATHeader.searchContent')}
                        ></TextField>
                    </div>
                    <div className="cb-oat-header-options">
                        <Icon
                            iconName="Ringer"
                            styles={{
                                root: {
                                    fontSize: FontSizes.size20,
                                    paddingLeft: '50%',
                                    color: theme.semanticColors.actionLink
                                }
                            }}
                        />
                        <Icon
                            iconName="Settings"
                            styles={{
                                root: {
                                    fontSize: FontSizes.size20,
                                    paddingLeft: '5%',
                                    color: theme.semanticColors.actionLink
                                }
                            }}
                        />
                        <Icon
                            iconName="Help"
                            styles={{
                                root: {
                                    fontSize: FontSizes.size20,
                                    paddingLeft: '5%',
                                    color: theme.semanticColors.actionLink
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="cb-oat-header-menu-component">
                    <div className="cb-oat-header-model"></div>
                    <div className="cb-oat-header-menu">
                        <ActionButton>
                            <Icon
                                iconName="Save"
                                styles={{
                                    root: {
                                        fontSize: FontSizes.size14,
                                        color: theme.semanticColors.actionLink
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
                                        fontSize: FontSizes.size14,
                                        color: theme.semanticColors.actionLink
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
                                        fontSize: FontSizes.size14,
                                        color: theme.semanticColors.actionLink
                                    }
                                }}
                            />
                            {t('OATHeader.sync')}
                        </ActionButton>
                        <ActionButton>
                            <Icon
                                iconName="Import"
                                styles={{
                                    root: {
                                        fontSize: FontSizes.size14,
                                        color: theme.semanticColors.actionLink
                                    }
                                }}
                            />
                            {t('OATHeader.import')}
                        </ActionButton>
                        <ActionButton>
                            <Icon
                                iconName="Export"
                                styles={{
                                    root: {
                                        fontSize: FontSizes.size14,
                                        color: theme.semanticColors.actionLink
                                    }
                                }}
                            />
                            {t('OATHeader.export')}
                        </ActionButton>
                    </div>
                    <div className="cb-oat-header-versioning"></div>
                </div>
            </div>
        </BaseComponent>
    );
};

export default OATHeader;
