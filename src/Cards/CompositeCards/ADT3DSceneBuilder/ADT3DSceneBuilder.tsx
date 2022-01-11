import {
    ActionButton,
    FontIcon,
    IconButton,
    IContextualMenuProps,
    Pivot,
    PivotItem,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode
} from '../../../Models/Constants/Enums';
import ADT3DBuilderCard from '../../ADT3DBuilderCard/ADT3DBuilderCard';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    I3DSceneBuilderContext,
    IADT3DSceneBuilderCardProps,
    IADT3DSceneBuilderCreateElementFormProps,
    IADT3DSceneBuilderVisualStateRulesWizardProps
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import useAdapter from '../../../Models/Hooks/useAdapter';
import {
    Scene,
    ScenesConfig,
    TwinToObjectMapping
} from '../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderReducer,
    ADT3DSceneBuilderVisualStateRulesWizardReducer,
    defaultADT3DSceneBuilderState,
    defaultADT3DSceneBuilderVisualStateRulesWizardState
} from './ADT3DSceneBuilder.state';
import {
    SET_ADT_SCENE_BUILDER_ELEMENTS,
    SET_ADT_SCENE_BUILDER_MODE,
    SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
    SET_ADT_SCENE_CONFIG,
    SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS
} from '../../../Models/Constants/ActionTypes';
import { createGUID } from '../../../Models/Services/Utils';
import { IADTAdapter } from '../../../Models/Constants/Interfaces';

export const SceneBuilderContext = React.createContext<I3DSceneBuilderContext>(
    null
);

const ADT3DSceneBuilder: React.FC<IADT3DSceneBuilderCardProps> = ({
    sceneId,
    adapter,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderReducer,
        defaultADT3DSceneBuilderState
    );

    const getScenesConfig = useAdapter({
        adapterMethod: () => adapter.getScenesConfig(),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        if (!getScenesConfig.adapterResult.hasNoData()) {
            const config: ScenesConfig = getScenesConfig.adapterResult.getData();
            dispatch({
                type: SET_ADT_SCENE_CONFIG,
                payload: config
            });
        } else {
            dispatch({
                type: SET_ADT_SCENE_CONFIG,
                payload: null
            });
        }
    }, [getScenesConfig?.adapterResult]);

    const setSelectedObjectIds = (selectedMeshIds) => {
        dispatch({
            type: SET_ADT_SCENE_ELEMENT_SELECTED_OBJECT_IDS,
            payload: selectedMeshIds
        });
    };

    return (
        <SceneBuilderContext.Provider
            value={{
                adapter,
                theme,
                locale,
                localeStrings,
                selectedObjectIds: state.selectedObjectIds,
                setSelectedObjectIds,
                config: state.config,
                sceneId
            }}
        >
            <div className="cb-scene-builder-card-wrapper">
                <BaseCompositeCard
                    isLoading={!state.config && getScenesConfig.isLoading}
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    adapterAdditionalParameters={adapterAdditionalParameters}
                >
                    <div className="cb-scene-builder-twin-bindings">
                        <VisualStateRulesWizard
                            loadConfig={getScenesConfig.callAdapter}
                        />
                    </div>
                    <div className="cb-scene-builder-canvas">
                        {state.config && (
                            <ADT3DBuilderCard
                                adapter={adapter as IADTAdapter}
                                modelUrl={
                                    state.config.viewerConfiguration?.scenes[
                                        state.config.viewerConfiguration?.scenes.findIndex(
                                            (s) => s.id === sceneId
                                        )
                                    ].assets[0].url
                                }
                                onMeshSelected={(selectedMeshes) =>
                                    setSelectedObjectIds(selectedMeshes)
                                }
                                preselectedMeshIds={state.selectedObjectIds}
                            />
                        )}
                    </div>
                </BaseCompositeCard>
            </div>
        </SceneBuilderContext.Provider>
    );
};

const VisualStateRulesWizard: React.FC<IADT3DSceneBuilderVisualStateRulesWizardProps> = ({
    loadConfig
}) => {
    const { t } = useTranslation();
    const [state, dispatch] = useReducer(
        ADT3DSceneBuilderVisualStateRulesWizardReducer,
        defaultADT3DSceneBuilderVisualStateRulesWizardState
    );

    const {
        adapter,
        theme,
        locale,
        localeStrings,
        config,
        sceneId,
        setSelectedObjectIds
    } = useContext(SceneBuilderContext);

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: {
            config: ScenesConfig;
            sceneId: string;
            elements: Array<TwinToObjectMapping>;
        }) => {
            const sceneToUpdate: Scene = {
                ...params.config.viewerConfiguration.scenes[
                    params.config.viewerConfiguration.scenes.findIndex(
                        (s) => s.id === params.sceneId
                    )
                ]
            };
            sceneToUpdate.twinToObjectMappings = params.elements;
            return adapter.editScene(
                params.config,
                params.sceneId,
                sceneToUpdate
            );
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    useEffect(() => {
        if (config) {
            const mappings =
                config.viewerConfiguration?.scenes?.find(
                    (s) => s.id === sceneId
                ).twinToObjectMappings || [];
            dispatch({
                type: SET_ADT_SCENE_BUILDER_ELEMENTS,
                payload: mappings
            });
        } else {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_ELEMENTS,
                payload: []
            });
        }
    }, [config]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            loadConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    const handleCreateElementClick = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
            payload: null
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.CreateElement
        });
        setSelectedObjectIds([]);
    };

    const handleElementBackClick = () => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.Idle
        });
        setSelectedObjectIds([]);
    };

    const handleSaveClick = (editedElement: TwinToObjectMapping) => {
        const newElements = [...state.elements];
        if (state.builderMode === ADT3DSceneBuilderMode.CreateElement) {
            let newId = createGUID(false);
            const existingIds = state.elements.map((e) => e.id);
            while (existingIds.includes(newId)) {
                newId = createGUID(false);
            }
            newElements.push({ id: newId, ...editedElement });
        } else {
            newElements[
                state.elements.findIndex(
                    (e) => e.id === state.selectedElement.id
                )
            ] = editedElement;
        }

        updateTwinToObjectMappings.callAdapter({
            config: config,
            sceneId: sceneId,
            elements: newElements
        });

        dispatch({
            type: SET_ADT_SCENE_BUILDER_ELEMENTS,
            payload: newElements
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.Idle
        });
        setSelectedObjectIds([]);
    };

    const handleElementClick = (element: TwinToObjectMapping) => {
        dispatch({
            type: SET_ADT_SCENE_BUILDER_SELECTED_ELEMENT,
            payload: { ...element }
        });
        dispatch({
            type: SET_ADT_SCENE_BUILDER_MODE,
            payload: ADT3DSceneBuilderMode.EditElement
        });
        setSelectedObjectIds(element.meshIDs);
    };

    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            {state.builderMode === ADT3DSceneBuilderMode.Idle ? (
                <Pivot
                    aria-label={t('buildMode')}
                    defaultSelectedKey={ADT3DSceneTwinBindingsMode.Elements}
                    className="cb-scene-builder-twin-bindings-pivot"
                >
                    <PivotItem
                        headerText={t('3dSceneBuilder.elements')}
                        itemKey={ADT3DSceneTwinBindingsMode.Elements}
                    >
                        <ElementList
                            elements={state.elements}
                            handleCreateElementClick={handleCreateElementClick}
                            handleElementClick={handleElementClick}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('3dSceneBuilder.behaviors')}
                        itemKey={ADT3DSceneTwinBindingsMode.Behaviors}
                    >
                        <div>
                            <p className="cb-scene-builder-twin-bindings-text">
                                {t('3dSceneBuilder.noBehaviorsText')}
                            </p>
                        </div>
                    </PivotItem>
                </Pivot>
            ) : (
                <CreateElementForm
                    builderMode={state.builderMode}
                    element={state.selectedElement}
                    handleElementBackClick={handleElementBackClick}
                    handleSaveClick={handleSaveClick}
                />
            )}
        </BaseComponent>
    );
};

const ElementList: React.FC<any> = ({
    elements,
    handleCreateElementClick,
    handleElementClick
}) => {
    const { t } = useTranslation();

    return (
        <div>
            <ActionButton
                iconProps={{ iconName: 'Add' }}
                onClick={handleCreateElementClick}
            >
                {t('3dSceneBuilder.createElement')}
            </ActionButton>
            {elements.length === 0 ? (
                <p className="cb-scene-builder-twin-bindings-text">
                    {t('3dSceneBuilder.noElementsText')}
                </p>
            ) : (
                elements.map((e: TwinToObjectMapping) => (
                    <div
                        className="cb-scene-builder-twin-bindings-element"
                        key={e.displayName}
                        onClick={() => handleElementClick(e)}
                    >
                        <FontIcon iconName={'Shapes'} className="cb-element" />
                        <span className="cb-scene-builder-element-name">
                            {e.displayName}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
};

const CreateElementForm: React.FC<IADT3DSceneBuilderCreateElementFormProps> = ({
    builderMode,
    element,
    handleElementBackClick,
    handleSaveClick
}) => {
    const { t } = useTranslation();
    const [isObjectsExpanded, setIsObjectsExpanded] = useState(
        element ? false : true
    );
    const [elementToEdit, setElementToEdit] = useState<TwinToObjectMapping>(
        element ?? new TwinToObjectMapping('', '', '', [])
    );
    const { selectedObjectIds, setSelectedObjectIds } = useContext(
        SceneBuilderContext
    );

    const objectMenuProps = (objectName: string): IContextualMenuProps => {
        return {
            items: [
                {
                    key: 'remove',
                    text: t('remove'),
                    iconProps: { iconName: 'Delete' },
                    onClick: () => {
                        const currentObjects = [...elementToEdit.meshIDs];
                        currentObjects.splice(
                            currentObjects.indexOf(objectName),
                            1
                        );
                        setSelectedObjectIds(currentObjects);
                    }
                }
            ],
            styles: { root: { minWidth: 'unset' } }
        };
    };

    useEffect(() => {
        setElementToEdit({
            ...elementToEdit,
            meshIDs: selectedObjectIds
        });
    }, [selectedObjectIds]);

    return (
        <div className="cb-scene-builder-twin-bindings-create-element-wrapper">
            <div className="cb-scene-builder-twin-bindings-create-element-form">
                <div
                    className="cb-scene-builder-twin-bindings-create-element-header"
                    tabIndex={0}
                    onClick={handleElementBackClick}
                >
                    <FontIcon
                        iconName={'ChevronRight'}
                        className="cb-chevron cb-breadcrumb"
                    />
                    <span>
                        {builderMode === ADT3DSceneBuilderMode.EditElement
                            ? element.displayName
                            : t('3dSceneBuilder.newElement')}
                    </span>
                </div>

                <div className="cb-scene-builder-twin-bindings-create-element-inner-form">
                    <TextField
                        label={t('name')}
                        value={elementToEdit?.displayName}
                        required
                        onChange={(e) => {
                            setElementToEdit({
                                ...elementToEdit,
                                displayName: e.currentTarget.value
                            });
                        }}
                    />
                    <TextField
                        label={t('3dSceneBuilder.twinLink')}
                        value={elementToEdit?.primaryTwinID}
                        required
                        description={t('3dSceneBuilder.twinLinkInputInfo')}
                        onChange={(e) => {
                            setElementToEdit({
                                ...elementToEdit,
                                primaryTwinID: e.currentTarget.value
                            });
                        }}
                    />
                </div>
                <div className="cb-scene-builder-twin-bindings-element-objects">
                    <div
                        className="cb-scene-builder-twin-bindings-element-objects-header"
                        tabIndex={0}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsObjectsExpanded(!isObjectsExpanded);
                        }}
                    >
                        <FontIcon
                            iconName={'ChevronRight'}
                            className={`cb-chevron ${
                                isObjectsExpanded
                                    ? 'cb-expanded'
                                    : 'cb-collapsed'
                            }`}
                        />
                        <span>{t('3dSceneBuilder.objects')}</span>
                    </div>
                    {isObjectsExpanded && (
                        <div className="cb-scene-builder-twin-bindings-element-objects-container">
                            {elementToEdit.meshIDs.length === 0 ? (
                                <div className="cb-scene-builder-twin-bindings-text">
                                    {t('3dSceneBuilder.noObjectAddedText')}
                                </div>
                            ) : (
                                <ul className="cb-scene-builder-twin-bindings-element-object-list">
                                    {elementToEdit.meshIDs.map((meshName) => (
                                        <li
                                            key={meshName}
                                            className="cb-scene-builder-twin-bindings-element-object"
                                        >
                                            <div className="cb-mesh-name-wrapper">
                                                <FontIcon
                                                    iconName={'CubeShape'}
                                                />
                                                <span className="cb-mesh-name">
                                                    {meshName}
                                                </span>
                                            </div>
                                            <IconButton
                                                menuProps={objectMenuProps(
                                                    meshName
                                                )}
                                                iconProps={{
                                                    iconName: 'MoreVertical'
                                                }}
                                                title={t('remove')}
                                                ariaLabel={t('remove')}
                                                onRenderMenuIcon={() => null}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="cb-scene-builder-twin-bindings-create-element-actions">
                <PrimaryButton
                    onClick={() => handleSaveClick(elementToEdit)}
                    text={
                        builderMode === ADT3DSceneBuilderMode.CreateElement
                            ? t('create')
                            : t('update')
                    }
                    disabled={
                        !(
                            elementToEdit?.displayName &&
                            elementToEdit?.primaryTwinID &&
                            elementToEdit?.meshIDs?.length > 0
                        )
                    }
                />
            </div>
        </div>
    );
};

export default React.memo(ADT3DSceneBuilder);
