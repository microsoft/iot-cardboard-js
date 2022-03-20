import React, { useState } from 'react';
import { default as JsonPreviewView } from './JsonPreview';
import { DefaultButton } from '@fluentui/react';
import json from '../../../.storybook/test_data/mockModel.json';
import { useTranslation } from 'react-i18next';

export default {
    title: 'Components/JsonPreview',
    component: JsonPreviewView
};

export const JsonPreview = (_args, { globals: { theme } }) => {
    const { t } = useTranslation();
    const [isPreviewOpen, setIsPreviewOpen] = useState(true);
    const [jsonHandler, setJsonHandler] = useState(json);

    const cleanJson = {
        id: 'someId',
        extends: 'someExtends'
    };

    const handleJsonChange = (newJson) => {
        setJsonHandler(newJson);
    };

    return (
        <div>
            <DefaultButton onClick={() => setIsPreviewOpen((prev) => !prev)}>
                {t('modelSearch.modelListItemPreview')}
            </DefaultButton>
            <label>This is the Button</label>
            <JsonPreviewView
                isOpen={isPreviewOpen}
                onDismiss={() => setIsPreviewOpen(false)}
                json={jsonHandler}
                modalTitle={'EV Charging Station'}
                theme={theme}
                handleJsonChange={handleJsonChange}
            />
            <DefaultButton onClick={() => setJsonHandler(cleanJson)}>
                CleanButton
            </DefaultButton>
            <label>{JSON.stringify(jsonHandler, null, 2)}</label>
        </div>
    );
};
