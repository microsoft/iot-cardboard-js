import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActionButton,
    Callout,
    DefaultButton,
    DirectionalHint,
    FontIcon,
    IconButton,
    mergeStyleSets,
    PrimaryButton,
    SearchBox,
    TextField
} from '@fluentui/react';
import {
    BehaviorAction,
    BehaviorActionType,
    BehaviorState,
    IADT3DSceneBuilderElementFormProps
} from '../../ADT3DSceneBuilder.types';
import {
    DatasourceType,
    IScene,
    ITwinToObjectMapping
} from '../../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../../Models/Constants/Enums';
import { createGUID } from '../../../../../Models/Services/Utils';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import { ColoredMeshItem } from '../../../../../Models/Classes/SceneView.types';
import SceneBuilderFormBreadcrumb from '../SceneBuilderFormBreadcrumb';
import produce from 'immer';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    selectedElement,
    behaviors,
    onElementSave,
    onElementBackClick,
    onBehaviorSave,
    onBehaviorClick
}) => {

    const styles = mergeStyleSets({
        callout: {
          padding: '15px',
          width: '300px',
          background: '#ffffff'
        },
        title: {
            marginBottom: '15px',
            fontWeight: '500'
        },
        resultText: {
            fontSize: '12px',
            marginTop: '5px',
            opacity: '0.6',
        },
        item: {
            alignItems: 'center',
            display: 'flex',
            marginTop: '15px'
        },
        icon: {
            display: 'inline-block',
            fontSize: '16px'
        },
        name: {
            flex: '1',
            fontSize: '14px',
            paddingLeft: '8px',
        }
    })

    const { t } = useTranslation();
    const [isObjectsExpanded, setIsObjectsExpanded] = useState(
        selectedElement ? false : true
    );

    const [showAddBehavior, setShowAddBehavior] = useState(false);

    const [elementToEdit, setElementToEdit] = useState<ITwinToObjectMapping>(
        selectedElement ?? {
            id: '',
            displayName: '',
            primaryTwinID: '',
            meshIDs: []
        }
    );

    const [behaviorState, dispatch] = useReducer(
        produce((draft: BehaviorState, action: BehaviorAction) => {
            switch (action.type) {
                case BehaviorActionType.SET_BEHAVIORS_ON_ELEMENT:
                    draft.behaviorsOnElement = action.behaviors;
                    break;
                case BehaviorActionType.SET_AVAILABLE_BEHAVIORS:
                    draft.availableBehaviors = action.behaviors;
                    break;
                case BehaviorActionType.SET_FILTERED_AVAILABLE_BEHAVIORS:
                    draft.filteredAvailableBehaviors = action.behaviors;
                    break;
                case BehaviorActionType.SEARCH_AVAILABLE_BEHAVIORS:
                    draft.filteredAvailableBehaviors = draft.availableBehaviors.filter((behavior) =>
                    behavior.id.toLowerCase().includes(action.value.toLowerCase()));
                    break;
                case BehaviorActionType.SET_BEHAVIOR_TO_EDIT:
                    draft.behaviorToEdit = action.behavior;
                    break;
                case BehaviorActionType.REMOVE_BEHAVIOR:
                    draft.behaviorsOnElement = draft.behaviorsOnElement.filter(
                        (behavior) => behavior.id !== draft.behaviorToEdit.id
                    );
                    draft.behaviorToEdit.datasources[0].mappingIDs = draft.behaviorToEdit.datasources[0].mappingIDs.filter(
                        (mappingId) => mappingId !== elementToEdit.id
                    );
                    draft.behaviorsToEdit.push(draft.behaviorToEdit);
                    break;
                case BehaviorActionType.ADD_BEHAVIOR:
                    draft.behaviorToEdit = action.behavior;
                    if (
                        draft.behaviorToEdit.datasources &&
                        draft.behaviorToEdit.datasources[0] &&
                        draft.behaviorToEdit.datasources[0].mappingIDs
                    ) {
                        draft.behaviorToEdit.datasources[0].mappingIDs.push(elementToEdit.id);
                    } else {
                        draft.behaviorToEdit.datasources[0] = {
                            type: DatasourceType.TwinToObjectMapping,
                            mappingIDs: [elementToEdit.id]
                        };
                    }
                    draft.behaviorsOnElement.push(draft.behaviorToEdit);
                    draft.behaviorsToEdit.push(draft.behaviorToEdit);
                    draft.filteredAvailableBehaviors = draft.availableBehaviors.filter(
                        (behavior) => behavior.id !== draft.behaviorToEdit.id
                    );
                    break;
                default:
                    break;
            }
        }),
        {
            behaviorToEdit: null,
            behaviorsOnElement: [],
            behaviorsToEdit: [],
            availableBehaviors: [],
            filteredAvailableBehaviors: []
        }
    );

    const {
        adapter,
        config,
        sceneId,
        getConfig,
        selectedMeshIds,
        setSelectedMeshIds,
        setColoredMeshItems
    } = useContext(SceneBuilderContext);

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<ITwinToObjectMapping> }) => {
            const sceneToUpdate: IScene = {
                ...config.viewerConfiguration.scenes[
                    config.viewerConfiguration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            };
            sceneToUpdate.twinToObjectMappings = params.elements;
            return adapter.putScenesConfig(
                ViewerConfigUtility.editScene(config, sceneId, sceneToUpdate)
            );
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const handleSaveElement = async () => {
        const existingElements = config.viewerConfiguration?.scenes?.find(
            (s) => s.id === sceneId
        ).twinToObjectMappings;
        const newElements = existingElements ? [...existingElements] : [];
        if (builderMode === ADT3DSceneBuilderMode.CreateElement) {
            let newId = createGUID(false);
            const existingIds = existingElements?.map((e) => e.id);
            while (existingIds?.includes(newId)) {
                newId = createGUID(false);
            }
            const newElement = { ...elementToEdit, id: newId };
            newElements.push(newElement);
        } else {
            newElements[
                existingElements.findIndex((e) => e.id === selectedElement.id)
            ] = elementToEdit;
        }

        updateTwinToObjectMappings.callAdapter({
            elements: newElements
        });

        for (const behavior of behaviorState.behaviorsToEdit) {
            await onBehaviorSave(
                behavior,
                ADT3DSceneBuilderMode.EditBehavior,
                behavior.id
            );
        }

        onElementSave(newElements);
    };

    useEffect(() => {
        setElementToEdit({
            ...elementToEdit,
            meshIDs: selectedMeshIds
        });
    }, [selectedMeshIds]);

    useEffect(() => {
        dispatch({
            type: BehaviorActionType.SET_AVAILABLE_BEHAVIORS,
            behaviors: ViewerConfigUtility.getAvailableBehaviorsForElement(
                elementToEdit,
                behaviors
            )
        });

        dispatch({
            type: BehaviorActionType.SET_FILTERED_AVAILABLE_BEHAVIORS,
            behaviors: ViewerConfigUtility.getAvailableBehaviorsForElement(
                elementToEdit,
                behaviors
            )
        });
    }, []);

    useEffect(() => {
        dispatch({
            type: BehaviorActionType.SET_BEHAVIORS_ON_ELEMENT,
            behaviors: ViewerConfigUtility.getBehaviorsOnElement(
                elementToEdit,
                behaviors
            )
        });
    }, [behaviors]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    const updateColoredMeshItems = (meshName?: string) => {
        const coloredMeshes: ColoredMeshItem[] = [];
        for (const meshId of elementToEdit.meshIDs) {
            if (meshName && meshId === meshName) {
                coloredMeshes.push({ meshId: meshId, color: '#00EDD9' });
            } else {
                coloredMeshes.push({ meshId: meshId, color: '#00A8F0' });
            }
        }

        setColoredMeshItems(coloredMeshes);
    };

    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <SceneBuilderFormBreadcrumb
                items={[
                    {
                        text: t('3dSceneBuilder.elements'),
                        key: 'elements',
                        onClick: () => onElementBackClick()
                    },
                    {
                        text:
                            builderMode === ADT3DSceneBuilderMode.EditElement
                                ? selectedElement.displayName
                                : t('3dSceneBuilder.newElement'),
                        key: 'elementForm'
                    }
                ]}
            />
            <div className="cb-scene-builder-left-panel-create-form">
                <div className="cb-scene-builder-left-panel-create-form-contents">
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
                        label={t('3dSceneBuilder.linkedTwin')}
                        value={elementToEdit?.primaryTwinID}
                        required
                        description={t('3dSceneBuilder.linkedTwinInputInfo')}
                        onChange={(e) => {
                            setElementToEdit({
                                ...elementToEdit,
                                primaryTwinID: e.currentTarget.value
                            });
                        }}
                    />
                </div>
                <div className="cb-scene-builder-left-panel-element-objects">
                    <div
                        className="cb-scene-builder-left-panel-collapse-chevron-header"
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
                        <span>
                            {t('3dSceneBuilder.meshes')} (
                            {elementToEdit.meshIDs.length})
                        </span>
                    </div>
                    {isObjectsExpanded && (
                        <div className="cb-scene-builder-left-panel-element-objects-container">
                            {elementToEdit.meshIDs.length === 0 ? (
                                <div className="cb-scene-builder-left-panel-text">
                                    {t('3dSceneBuilder.noMeshAddedText')}
                                </div>
                            ) : (
                                <ul className="cb-scene-builder-left-panel-element-object-list">
                                    {elementToEdit.meshIDs.map((meshName) => (
                                        <li
                                            key={meshName}
                                            className="cb-scene-builder-left-panel-element-object"
                                            onMouseEnter={() =>
                                                updateColoredMeshItems(meshName)
                                            }
                                            onMouseLeave={() =>
                                                updateColoredMeshItems()
                                            }
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
                                                className="cb-remove-object-button"
                                                iconProps={{
                                                    iconName: 'Delete'
                                                }}
                                                title={t('remove')}
                                                ariaLabel={t('remove')}
                                                onClick={() => {
                                                    const currentObjects = [
                                                        ...elementToEdit.meshIDs
                                                    ];
                                                    currentObjects.splice(
                                                        currentObjects.indexOf(
                                                            meshName
                                                        ),
                                                        1
                                                    );
                                                    setSelectedMeshIds(
                                                        currentObjects
                                                    );
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    <div className="cb-scene-builder-element-behaviors-spacer" />
                    <div className="cb-scene-builder-element-behaviors-title">
                        {t('3dSceneBuilder.behaviors')}
                    </div>
                    {behaviorState.behaviorsOnElement?.length === 0 && (
                        <div className="cb-scene-builder-element-behaviors-text">
                            {t('3dSceneBuilder.noBehaviorsOnElement')}
                        </div>
                    )}
                    {behaviorState.behaviorsOnElement.map((behavior) => {
                        return (
                            <div
                                id={behavior.id}
                                key={behavior.id}
                                className="cb-scene-builder-element-behavior-item"
                            >
                                <FontIcon
                                    iconName={'Warning'}
                                    className="cb-scene-builder-element-behavior-item-icon"
                                />
                                <div className="cb-scene-builder-element-behavior-item-name">
                                    {behavior.id}
                                </div>
                                <IconButton
                                    title={t('more')}
                                    ariaLabel={t('more')}
                                    menuIconProps={{
                                        iconName: 'MoreVertical',
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            color: 'black'
                                        }
                                    }}
                                    onMenuClick={() => {
                                        dispatch({
                                            type:
                                                BehaviorActionType.SET_BEHAVIOR_TO_EDIT,
                                            behavior: behavior
                                        });
                                    }}
                                    menuProps={{
                                        items: [
                                            {
                                                key: 'modify',
                                                text: t(
                                                    '3dSceneBuilder.modifyBehavior'
                                                ),
                                                iconProps: { iconName: 'Edit' },
                                                onClick: () =>
                                                    onBehaviorClick(behavior)
                                            },
                                            {
                                                key: 'remove',
                                                text: t(
                                                    '3dSceneBuilder.removeBehavior'
                                                ),
                                                iconProps: {
                                                    iconName: 'blocked2'
                                                },
                                                onClick: () =>
                                                    dispatch({
                                                        type:
                                                            BehaviorActionType.REMOVE_BEHAVIOR
                                                    })
                                            }
                                        ]
                                    }}
                                ></IconButton>
                            </div>
                        );
                    })}
                    <div>
                        <ActionButton id='addBehavior' className='cb-scene-builder-left-panel-add-behavior' 
                            style={{color: '#0b75c8'}} onClick={() => setShowAddBehavior(true)}>
                                {t('3dSceneBuilder.addBehaviorButton')}
                        </ActionButton>
                    </div>
                    {showAddBehavior && 
                        <Callout className={styles.callout} target='#addBehavior' 
                            isBeakVisible={false} directionalHint={DirectionalHint.bottomLeftEdge} 
                            onDismiss={() => setShowAddBehavior(false)}>
                            <div>
                                <div className={styles.title}>
                                    {t('3dSceneBuilder.addBehavior')}
                                </div>
                                <div>
                                    <SearchBox
                                        placeholder={t('3dSceneBuilder.searchBehaviors')}
                                        onChange={(event, value) => dispatch({
                                            type: BehaviorActionType.SEARCH_AVAILABLE_BEHAVIORS,
                                            value: value
                                        })}
                                    />
                                </div>
                                <div>
                                    {behaviorState.filteredAvailableBehaviors?.length === 0 && (
                                        <div className={styles.resultText}>
                                            {t('3dSceneBuilder.noAvailableBehaviors')}
                                        </div>
                                    )}
                                    {behaviorState.filteredAvailableBehaviors.map((behavior) => {
                                        return (
                                            <div key={behavior.id} className={styles.item}>
                                                <FontIcon
                                                iconName={'Warning'}
                                                className={styles.icon}
                                                />
                                                <div className={styles.name}>
                                                    {behavior.id}
                                                </div>
                                                <IconButton iconProps={{ 
                                                    iconName: 'Add',
                                                    style: {
                                                        fontSize: 18,
                                                        color: 'black'
                                                    } 
                                                    }} 
                                                    onClick={() => 
                                                        dispatch({
                                                        type:
                                                            BehaviorActionType.ADD_BEHAVIOR,
                                                            behavior: behavior
                                                    })}/>
                                            </div>
                                        )}
                                    )}
                                </div>
                            </div>
                        </Callout>
                    }
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={handleSaveElement}
                    text={
                        builderMode === ADT3DSceneBuilderMode.CreateElement
                            ? t('3dSceneBuilder.createElement')
                            : t('3dSceneBuilder.updateElement')
                    }
                    disabled={
                        !(
                            elementToEdit?.displayName &&
                            elementToEdit?.primaryTwinID &&
                            elementToEdit?.meshIDs?.length > 0
                        )
                    }
                />
                <DefaultButton
                    text={t('cancel')}
                    styles={{ root: { marginLeft: 8 } }}
                    onClick={() => {
                        onElementBackClick();
                    }}
                />
            </div>
        </div>
    );
};

export default SceneElementForm;
