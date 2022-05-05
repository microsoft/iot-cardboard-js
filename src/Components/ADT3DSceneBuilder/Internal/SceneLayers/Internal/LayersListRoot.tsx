import { Spinner, Text } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ILayer } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { sectionHeaderStyles } from '../SceneLayers.styles';
import NoLayers from '../../../../../Resources/Static/noLayers.svg';
import PrimaryActionCalloutContents from './PrimaryActionCalloutContents';
import IllustrationMessage from '../../../../IllustrationMessage/IllustrationMessage';

interface ILayersListRoot {
    onPrimaryAction: () => void;
    layers: ILayer[];
    onLayerClick: (layer: ILayer) => void;
    onDeleteLayerClick: (layer: ILayer) => void;
    isLoading?: boolean;
}

const LayersListRoot: React.FC<ILayersListRoot> = ({
    onPrimaryAction,
    layers,
    onLayerClick,
    onDeleteLayerClick,
    isLoading = false
}) => {
    const { t } = useTranslation();

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
            {isLoading ? (
                <Spinner />
            ) : layers.length > 0 ? (
                <>
                    <Text
                        variant="medium"
                        styles={sectionHeaderStyles}
                        as="div"
                    >
                        {t('sceneLayers.layers')}
                    </Text>
                    <CardboardList items={layerListItems} listKey="layer" />
                </>
            ) : (
                <IllustrationMessage
                    headerText={t('sceneLayers.noLayersFound')}
                    descriptionText={t('sceneLayers.noLayersDescription')}
                    imageProps={{
                        src: NoLayers,
                        height: 100
                    }}
                    type={'info'}
                    width={'compact'}
                />
            )}
        </PrimaryActionCalloutContents>
    );
};

export default LayersListRoot;
