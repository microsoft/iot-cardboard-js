import React from 'react';
import { FontIcon, TextField, ActionButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getHeaderStyles } from './OATHeader.styles';

const OATHeader = () => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();

    return (
        <div className={headerStyles.container}>
            <div className={headerStyles.searchComponent}>
                <div className={headerStyles.logo}>{t('OATHeader.title')}</div>
                <div className={headerStyles.search}>
                    <TextField
                        placeholder={t('OATHeader.searchContent')}
                    ></TextField>
                </div>
                <div className={headerStyles.options}>
                    <FontIcon
                        iconName={'Ringer'}
                        className={headerStyles.optionIcon}
                    />
                    <FontIcon
                        iconName={'Settings'}
                        className={headerStyles.optionIcon}
                    />
                    <FontIcon
                        iconName={'Help'}
                        className={headerStyles.optionIcon}
                    />
                </div>
            </div>
            <div className={headerStyles.menuComponent}>
                <div className="cb-oat-header-model"></div>
                <div className="cb-oat-header-menu">
                    <ActionButton>
                        <FontIcon
                            iconName={'Save'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.save')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Upload'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.publish')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Sync'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.sync')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Import'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.import')}
                    </ActionButton>
                    <ActionButton>
                        <FontIcon
                            iconName={'Export'}
                            className={headerStyles.menuIcon}
                        />
                        {t('OATHeader.export')}
                    </ActionButton>
                </div>
                <div className="cb-oat-header-versioning"></div>
            </div>
        </div>
    );
};

export default OATHeader;
