import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderModes,
    ADT3DScenePageSteps
} from '../../../Models/Constants/Enums';
import { IADTTwin } from '../../../Models/Constants/Interfaces';
import ADT3DViewerCard from '../../ADT3DViewerCard/ADT3DViewerCard';
import SceneListCard from '../../SceneListCard/Consume/SceneListCard';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    IADT3DSceneBuilderProps,
    IADT3DScenePageProps
} from './ADT3DScenePage.types';
import './ADT3DScenePage.scss';
import { DefaultButton, Pivot, PivotItem } from '@fluentui/react';
import ADT3DBuilderCard from '../../ADT3DBuilderCard/ADT3DBuilderCard';

const ADT3DScenePage: React.FC<IADT3DScenePageProps> = ({
    adapter,
    theme,
    title,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [currentStep, setCurrentPage] = useState(
        ADT3DScenePageSteps.SceneTwinList
    );
    const [selectedTwin, setSelectedTwin] = useState<IADTTwin>(null);

    const { t } = useTranslation();

    const onEditTwinClicked = (twin: IADTTwin) => {
        setSelectedTwin(twin);
        setCurrentPage(ADT3DScenePageSteps.TwinBindingsWithScene);
    };

    const addNewSceneListCardClick = () => {
        setSelectedTwin(null);
        setCurrentPage(ADT3DScenePageSteps.TwinBindingsWithScene);
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
                {currentStep === ADT3DScenePageSteps.SceneTwinList && (
                    <div className="cb-scene-page-scene-list-container">
                        <SceneListCard
                            title={'Twins with visual ontology'}
                            theme={theme}
                            locale={locale}
                            adapter={adapter}
                            editSceneListCardClick={(twin, _twinIndex) => {
                                onEditTwinClicked(twin);
                            }}
                            addNewSceneListCardClick={addNewSceneListCardClick}
                        />
                    </div>
                )}
                {currentStep === ADT3DScenePageSteps.TwinBindingsWithScene && (
                    <>
                        <div className="cb-scene-builder-container">
                            <ADT3DSceneBuilderCompositeComponent
                                twin={selectedTwin}
                                adapter={adapter}
                                title={selectedTwin.$dtId}
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
                                setCurrentPage(
                                    ADT3DScenePageSteps.SceneTwinList
                                );
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
    defaultMode = ADT3DSceneBuilderModes.BuildScene,
    twin,
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
                    defaultMode === ADT3DSceneBuilderModes.BuildScene
                        ? t('buildMode')
                        : t('viewMode')
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
                    itemKey={ADT3DSceneBuilderModes.BuildScene}
                >
                    <BaseCompositeCard
                        theme={theme}
                        locale={locale}
                        localeStrings={localeStrings}
                        adapterAdditionalParameters={
                            adapterAdditionalParameters
                        }
                    >
                        <TwinBuildingsBaseComponentPlaceholder />
                        <div className="cb-scene-builder-builder">
                            <ADT3DBuilderCard
                                title="3D Builder"
                                modelUrl={
                                    twin.MediaSrc /*"https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"*/
                                }
                            />
                        </div>
                    </BaseCompositeCard>
                </PivotItem>
                <PivotItem
                    headerText={t('view')}
                    itemKey={ADT3DSceneBuilderModes.ViewScene}
                >
                    <div className="cb-scene-builder-viewer">
                        <ADT3DViewerCard
                            title="3D Viewer"
                            adapter={adapter}
                            pollingInterval={10000}
                            twinId={twin.$dtId /*TankVisual */}
                        />
                    </div>
                </PivotItem>
            </Pivot>
        </BaseCompositeCard>
    );
};

const TwinBuildingsBaseComponentPlaceholder: React.FC<any> = (_props) => {
    return (
        <div className="cb-scene-builder-twin-bindings">
            Twin bindings component placeholder
        </div>
    );
};

export default React.memo(ADT3DScenePage);
