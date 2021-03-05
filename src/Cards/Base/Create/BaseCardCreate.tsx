import React from 'react';
import { BaseCardCreateProps } from './BaseCardCreate.types';
import './BaseCardCreate.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import { useTranslation } from 'react-i18next';

const BaseCard: React.FC<BaseCardCreateProps> = ({
    form,
    preview,
    title,
    theme
}) => {
    const { t } = useTranslation();
    return (
        <ThemeProvider theme={theme}>
            <div className="cb-base-card-create">
                <h3 className="cb-base-card-create-title">{title}</h3>
                <div className="cb-base-card-create-content">
                    <div className="cb-form">{form}</div>
                    <div className="cb-preview">
                        <div className="cb-preview-title">{t('preview')}</div>
                        <div className="cb-preview-card">{preview}</div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default BaseCard;
