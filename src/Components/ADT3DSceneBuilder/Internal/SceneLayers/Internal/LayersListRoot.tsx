import { Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ILayer } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    getStyles,
    noLayersDescriptionStyles,
    sectionHeaderStyles
} from '../SceneLayers.styles';
import { Image } from '@fluentui/react';
import NoLayers from '../../../../../Resources/Static/noLayers.svg';
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
    const styles = getStyles();

    const layerListItems: ICardboardListItem<ILayer>[] = layers.map(
        (layer) => ({
            ariaLabel: layer.displayName,
            textPrimary: layer.displayName,
            textSecondary:
                layer.behaviorIDs.length > 0
                    ? t('sceneLayers.layerMetaData', {
                          numBehaviors: String(layer.behaviorIDs.length)
                      })
                    : t('sceneLayers.noBehaviors'),
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
                <div className={styles.noLayersContainer}>
                    <Image
                        src={NoLayers}
                        height={100}
                        styles={{ root: { marginBottom: 8 } }}
                    />
                    <Text
                        variant="medium"
                        as="div"
                        styles={sectionHeaderStyles}
                    >
                        {t('sceneLayers.noLayersFound')}
                    </Text>
                    <Text
                        variant="small"
                        as="div"
                        styles={noLayersDescriptionStyles}
                    >
                        {t('sceneLayers.noLayersDescription')}
                    </Text>
                </div>
            )}
            <CardboardList items={layerListItems} listKey="layer" />
        </PrimaryActionCalloutContents>
    );
};

export default LayersListRoot;
