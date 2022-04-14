import { Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

interface ILayersListRoot {
    onPrimaryAction: () => void;
}

const LayersListRoot: React.FC<ILayersListRoot> = ({ onPrimaryAction }) => {
    const { t } = useTranslation();

    return (
        <PrimaryActionCalloutContents
            onPrimaryButtonClick={onPrimaryAction}
            primaryButtonText={t('sceneLayers.newLayer')}
        >
            <Text variant="medium" styles={sectionHeaderStyles}>
                {t('sceneLayers.layers')}
            </Text>
        </PrimaryActionCalloutContents>
    );
};

export default LayersListRoot;
