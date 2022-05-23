import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEditorPageStyles } from '../OATEditorPage.Styles';

const OATErrorPage = ({ error }) => {
    const { t } = useTranslation();
    const EditorPageStyles = getEditorPageStyles();

    return (
        <div className={EditorPageStyles.errorContainer}>
            <h2 className={EditorPageStyles.errorPageHeader}>
                {t('OATErrorBoundary.modalHeader')}
            </h2>
            <h3 className={EditorPageStyles.errorPageMessageHeader}>
                {t('OATErrorBoundary.messageHeader')}
            </h3>
            <div>
                <pre>
                    {error.name} | {error.message}
                </pre>
            </div>
            <h3 className={EditorPageStyles.errorPageStackHeader}>
                {t('OATErrorBoundary.stackHeader')}
            </h3>
            <div>
                <pre>{error.stack}</pre>
            </div>
        </div>
    );
};

export default OATErrorPage;
