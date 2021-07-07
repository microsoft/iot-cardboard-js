import React, { useState } from 'react';
import { default as JsonPreviewView } from './JsonPreview';
import { DefaultButton } from '@fluentui/react';
import json from '../../../.storybook/test_data/mockTwin.json';
import { useTranslation } from 'react-i18next';

export default {
    title: 'Components/JsonPreview'
};

export const JsonPreview = () => {
    const { t } = useTranslation();
    const [isPreviewOpen, setIsPreviewOpen] = useState(true);
    return (
        <div>
            <DefaultButton onClick={() => setIsPreviewOpen((prev) => !prev)}>
                {t('modelSearch.modelListItemPreview')}
            </DefaultButton>
            <JsonPreviewView
                isOpen={isPreviewOpen}
                onDismiss={() => setIsPreviewOpen(false)}
                json={json}
                modalTitle={'EV Charging Station'}
            />
        </div>
    );
};
