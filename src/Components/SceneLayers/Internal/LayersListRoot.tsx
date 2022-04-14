import { Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

const LayersListRoot: React.FC = () => {
    const { t } = useTranslation();

    return (
        <PrimaryActionCalloutContents
            onPrimaryButtonClick={() => null}
            primaryButtonText={t('sceneLayers.createNewLayer')}
        >
            <Text variant="medium" styles={sectionHeaderStyles}>
                {t('sceneLayers.layers')}
            </Text>
        </PrimaryActionCalloutContents>
    );
};

export default LayersListRoot;
