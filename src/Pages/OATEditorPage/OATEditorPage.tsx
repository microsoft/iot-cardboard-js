import { DefaultButton } from '@fluentui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import JsonPreview from '../../Components/JsonPreview/JsonPreview';
import OATModelList from '../../Components/OATModelList/OATModelList';

const OATEditorPage = ({ theme }) => {
    const { t } = useTranslation();
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(true);
    const [elements, setElements] = useState([]);

    const handleJsonChange = (newELements) => {
        setElements(newELements);
    };

    const handleElementsUpdate = (newElements) => {
        setElements(newElements);
    };

    return (
        <div>
            <DefaultButton
                onClick={() => setIsModelPreviewOpen((prev) => !prev)}
            >
                {t('modelSearch.modelListItemPreview')}
            </DefaultButton>
            <OATModelList
                elements={elements}
                handleElementsUpdate={handleElementsUpdate}
            />
            <JsonPreview
                json={elements}
                isOpen={isModelPreviewOpen}
                onDismiss={() => setIsModelPreviewOpen(false)}
                modalTitle={t('OATModel.modelsUpperCase')}
                theme={theme}
                handleJsonChange={handleJsonChange}
            />
        </div>
    );
};

export default React.memo(OATEditorPage);
