import { useTheme } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEditorPageStyles } from '../OATEditorPage.styles';

const OATErrorPage = ({ error }) => {
    const { t } = useTranslation();
    const editorPageStyles = getEditorPageStyles(useTheme());

    return (
        <div className={editorPageStyles.errorContainer}>
            <h2 className={editorPageStyles.errorPageHeader}>
                {t('OATErrorBoundary.modalHeader')}
            </h2>
            <h3 className={editorPageStyles.errorPageMessageHeader}>
                {t('OATErrorBoundary.messageHeader')}
            </h3>
            <div>
                <pre>
                    {error.name} | {error.message}
                </pre>
            </div>
            <h3 className={editorPageStyles.errorPageStackHeader}>
                {t('OATErrorBoundary.stackHeader')}
            </h3>
            <div>
                <pre>{error.stack}</pre>
            </div>
        </div>
    );
};

export default OATErrorPage;
