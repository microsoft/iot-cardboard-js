import { Pivot, PivotItem } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DScenePageModes } from '../../../../Models/Constants/Enums';
import ADT3DViewerCard from '../../../ADT3DViewerCard/ADT3DViewerCard';
import ADT3DSceneBuilder from '../../ADT3DSceneBuilder/ADT3DSceneBuilder';
import BaseCompositeCard from '../../BaseCompositeCard/Consume/BaseCompositeCard';
import { IADT3DSceneBuilderProps } from '../ADT3DScenePage.types';

export const ADT3DSceneBuilderContainer: React.FC<IADT3DSceneBuilderProps> = ({
    defaultMode = ADT3DScenePageModes.BuildScene,
    scenesConfig,
    scene,
    adapter,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const { t } = useTranslation();

    return (
        <BaseCompositeCard
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            <Pivot
                className="cb-scene-page-builder-container"
                aria-label={
                    defaultMode === ADT3DScenePageModes.BuildScene
                        ? t('buildMode')
                        : t('viewMode')
                }
                defaultSelectedKey={defaultMode}
                styles={{
                    root: {
                        position: 'absolute',
                        zIndex: '3',
                        right: '0',
                        display: 'flex',
                        justifyContent: 'end',
                        marginBottom: '4px'
                    }
                }}
            >
                <PivotItem
                    headerText={t('build')}
                    itemKey={ADT3DScenePageModes.BuildScene}
                >
                    <div className="cb-scene-page-scene-builder-wrapper">
                        <ADT3DSceneBuilder
                            theme={theme}
                            locale={locale}
                            adapter={adapter}
                            sceneId={scene.id}
                        />
                    </div>
                </PivotItem>
                <PivotItem
                    headerText={t('view')}
                    itemKey={ADT3DScenePageModes.ViewScene}
                >
                    <div className="cb-scene-view-viewer">
                        <ADT3DViewerCard
                            adapter={adapter}
                            pollingInterval={10000}
                            sceneId={scene.id}
                            sceneConfig={scenesConfig}
                        />
                    </div>
                </PivotItem>
            </Pivot>
        </BaseCompositeCard>
    );
};
