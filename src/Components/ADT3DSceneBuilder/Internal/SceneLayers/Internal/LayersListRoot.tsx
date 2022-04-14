import { Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ILayer } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

interface ILayersListRoot {
    onPrimaryAction: () => void;
    layers: ILayer[];
    // onLayerClick: (layer: ILayer) => void;
    // onDeleteLayerClick: (layer: ILayer) => void;
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
