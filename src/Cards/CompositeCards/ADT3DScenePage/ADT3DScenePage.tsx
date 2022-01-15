import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DScenePageModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import ADT3DViewerCard from '../../ADT3DViewerCard/ADT3DViewerCard';
import SceneListCard from '../../SceneListCard/Consume/SceneListCard';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    IADT3DSceneBuilderProps,
    IADT3DScenePageProps
} from './ADT3DScenePage.types';
import './ADT3DScenePage.scss';
import { DefaultButton, Pivot, PivotItem } from '@fluentui/react';
import ADT3DGlobeCard from '../../ADT3DGlobeCard/ADT3DGlobeCard';
import { IScene } from '../../../Models/Classes/3DVConfig';
import { IBlobAdapter } from '../../../Models/Constants/Interfaces';
import ADT3DSceneBuilder from '../ADT3DSceneBuilder/ADT3DSceneBuilder';

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const selectedSceneRef = useRef(null);
    const [step, setStep] = useState<ADT3DScenePageSteps>(ADT3DScenePageSteps.SceneTwinList);
    const { t } = useTranslation();

    const handleOnSceneClick = (scene: IScene) => {
        selectedSceneRef.current = scene;
        setStep(ADT3DScenePageSteps.TwinBindingsWithScene);
    };

    return (
        <div className="cb-scene-page-container">
            <BaseCompositeCard
                title={title}
                theme={theme}
                locale={locale}
                localeStrings={localeStrings}
                adapterAdditionalParameters={adapterAdditionalParameters}
            >
                {step === ADT3DScenePageSteps.SceneTwinList && (
                    <div className="cb-scene-page-scene-list-container">
                        <DefaultButton
                            onClick={() => {
                                selectedSceneRef.current = null;
                                setStep(ADT3DScenePageSteps.Globe);
                            }}
                            text={t('globe')}
                            className="cb-scene-page-view-button"
                        />
                        <SceneListCard
                            title={'Twins with visual ontology'}
                            theme={theme}
                            locale={locale}
                            adapter={adapter}
                            onSceneClick={(scene) => {
                                handleOnSceneClick(scene);
                            }}
                        />
                    </div>
                )}
                {step === ADT3DScenePageSteps.Globe && (
                    <div className="cb-scene-page-scene-list-container">
                        <DefaultButton
                            onClick={() => {
                                selectedSceneRef.current = null;
                                setStep(ADT3DScenePageSteps.SceneTwinList);
                            }}
                            text={t('list')}
                            className="cb-scene-page-view-button"
                        />
                        <ADT3DGlobeCard
                            theme={theme}
                            adapter={adapter as IBlobAdapter}
                            onSceneClick={(scene) => {
                                handleOnSceneClick(scene);
                            }}
                        />
                    </div>
                )}
                {step ===
                    ADT3DScenePageSteps.TwinBindingsWithScene && (
                    <>
                        <div className="cb-scene-builder-and-viewer-container">
                            <ADT3DSceneBuilderCompositeComponent
                                scene={selectedSceneRef.current}
                                adapter={adapter}
                                title={selectedSceneRef.current.displayName}
                                theme={theme}
                                locale={locale}
                                localeStrings={localeStrings}
                                adapterAdditionalParameters={
                                    adapterAdditionalParameters
                                }
                            />
                        </div>
                        <DefaultButton
                            onClick={() => {
                                selectedSceneRef.current = null;
                                setStep(ADT3DScenePageSteps.SceneTwinList);
                            }}
                            text={t('back')}
                            className="cb-scene-page-action-button"
                        />
                    </>
                )}
            </BaseCompositeCard>
        </div>
    );
};

const ADT3DSceneBuilderCompositeComponent: React.FC<IADT3DSceneBuilderProps> = ({
    defaultMode = ADT3DScenePageModes.BuildScene,
    scene,
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const { t } = useTranslation();

    return (
        <BaseCompositeCard
            title={title}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
            adapterAdditionalParameters={adapterAdditionalParameters}
        >
            <Pivot
                aria-label={
                    defaultMode === ADT3DScenePageModes.BuildScene
                        ? t('3dScenePage.buildMode')
                        : t('3dScenePage.viewMode')
                }
                defaultSelectedKey={defaultMode}
                styles={{
                    root: {
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
                            title="3D Viewer"
                            adapter={adapter}
                            pollingInterval={10000}
                            sceneId={scene.id}
                            sceneConfig={null}
                        />
                    </div>
                </PivotItem>
            </Pivot>
        </BaseCompositeCard>
    );
};

export default React.memo(ADT3DScenePage);
