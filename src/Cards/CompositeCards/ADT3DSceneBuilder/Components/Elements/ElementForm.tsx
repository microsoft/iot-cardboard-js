import React, {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    FontIcon,
    IconButton,
    Pivot,
    PivotItem,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import {
    BehaviorAction,
    BehaviorActionType,
    BehaviorState,
    IADT3DSceneBuilderElementFormProps
} from '../../ADT3DSceneBuilder.types';
import {
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
import TwinSearchDropdown from '../../../../../Components/TwinSearchDropdown/TwinSearchDropdown';

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    selectedElement,
    behaviors,
    onElementSave,
    onElementBackClick,
    onBehaviorSave,
    onBehaviorClick
}) => {
    const { t } = useTranslation();

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
                default:
                    break;
            }
        }),
        {
            behaviorToEdit: null,
            behaviorsOnElement: [],
            behaviorsToEdit: []
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

    const handleSelectTwinId = (selectedTwinId: string) => {
        if (
            !elementToEdit.displayName ||
            elementToEdit.displayName === elementToEdit.primaryTwinID
        ) {
            setElementToEdit({
                ...elementToEdit,
                primaryTwinID: selectedTwinId,
                displayName: selectedTwinId
            });
        } else {
            setElementToEdit({
                ...elementToEdit,
                primaryTwinID: selectedTwinId
            });
        }
    };

    useEffect(() => {
        setElementToEdit({
            ...elementToEdit,
            meshIDs: selectedMeshIds
        });
    }, [selectedMeshIds]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    const ElementBehaviors = useCallback(
        () => (
            <div className="cb-scene-builder-left-panel-element-behaviors">
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
                                            iconProps: {
                                                iconName: 'Edit'
                                            },
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
            </div>
        ),
        [behaviorState.behaviorsOnElement]
    );

    const ElementAliasedTwins = useCallback(
        () => (
            <div className="cb-scene-builder-left-panel-element-aliased-twins">
                <span>Not implemented yet</span>
            </div>
        ),
        []
    );

    const ElementMeshes = useCallback(
        () => (
            <div className="cb-scene-builder-left-panel-element-objects">
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
                                        <FontIcon iconName={'CubeShape'} />
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
                                            setSelectedMeshIds(currentObjects);
                                        }}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        ),
        [elementToEdit.meshIDs]
    );

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
                    <TwinSearchDropdown
                        adapter={adapter}
                        label={t('3dSceneBuilder.linkedTwin')}
                        selectedTwinId={selectedElement?.primaryTwinID}
                        onTwinIdSelect={handleSelectTwinId}
                    />
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
                </div>

                <div className="cb-scene-builder-spacer" />

                <Pivot
                    aria-label={t('3dScenePage.buildMode')}
                    className="cb-scene-builder-left-panel-pivot"
                >
                    <PivotItem headerText={t('3dSceneBuilder.behaviors')}>
                        <ElementBehaviors />
                    </PivotItem>
                    <PivotItem headerText={t('3dSceneBuilder.aliasedTwins')}>
                        <ElementAliasedTwins />
                    </PivotItem>
                    <PivotItem headerText={t('3dSceneBuilder.meshes')}>
                        <ElementMeshes />
                    </PivotItem>
                </Pivot>
            </div>

            <div className="cb-scene-builder-spacer" />

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
