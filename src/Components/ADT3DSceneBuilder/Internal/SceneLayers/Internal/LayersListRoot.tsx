import { Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ILayer } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';

interface ILayersListRoot {
    onPrimaryAction: () => void;
    layers: ILayer[];
    onLayerClick: (layer: ILayer) => void;
    onDeleteLayerClick: (layer: ILayer) => void;
}

const LayersListRoot: React.FC<ILayersListRoot> = ({
    onPrimaryAction,
    layers,
    onLayerClick,
    onDeleteLayerClick
}) => {
    const { t } = useTranslation();

    const layerListItems: ICardboardListItem<ILayer>[] = layers.map(
        (layer) => ({
            ariaLabel: layer.displayName,
            textPrimary: layer.displayName,
            item: layer,
            onClick: (layer: ILayer) => onLayerClick(layer),
            iconEnd: {
                name: 'Delete',
                onClick: () => onDeleteLayerClick(layer)
            }
        })
    );

    return (
        <PrimaryActionCalloutContents
            onPrimaryButtonClick={onPrimaryAction}
            primaryButtonText={t('sceneLayers.newLayer')}
        >
            {layers.length > 0 ? (
                <Text variant="medium" styles={sectionHeaderStyles} as="div">
                    {t('sceneLayers.layers')}
                </Text>
            ) : (
                <Text variant="medium" as="div">
                    {t('sceneLayers.noLayersFound')}
                </Text>
            )}
            <CardboardList items={layerListItems} listKey="layer" />
        </PrimaryActionCalloutContents>
    );
};

export default LayersListRoot;
