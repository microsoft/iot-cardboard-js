import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Callout,
    DefaultButton,
    DirectionalHint,
    FontIcon,
    IconButton,
    mergeStyleSets,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import { IADT3DSceneBuilderElementFormProps } from '../../ADT3DSceneBuilder.types';
import {
    IBehavior,
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
    onBehaviorSave
}) => {
    const { t } = useTranslation();
    const [isObjectsExpanded, setIsObjectsExpanded] = useState(
        selectedElement ? false : true
    );

    const styles = mergeStyleSets({
        callout: {
          paddingLeft: '10px',
          paddingRight: '10px',
          paddingTop: '5px',
          paddingBottom: '5px',
        },
        menuitem: {
            alignItems: 'center',
            display: 'flex',
            marginTop: '10px',
            marginBottom: '10px',
            cursor: 'pointer'
        },
        menutext: {
            marginLeft: '8px'
        },
        menuicon: {
            display: 'inline-block'
        }
    })

    const [isCalloutVisible, setIsCalloutVisible] = useState(false);

    const [elementToEdit, setElementToEdit] = useState<ITwinToObjectMapping>(
        selectedElement ?? {
            id: '',
            displayName: '',
            primaryTwinID: '',
            meshIDs: []
        }
    );

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(null);
    const [behaviorsToEdit, setBehaviorsToEdit] = useState<Array<IBehavior>>([]);
    const [behaviorsOnElement, setBehaviorsOnElement] = useState<Array<IBehavior>>([]);
    
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

        for (const behavior of behaviorsToEdit) {
            await onBehaviorSave(behavior, ADT3DSceneBuilderMode.EditBehavior, behavior.id); 
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
        const eb = behaviors.filter((behavior) => behavior.datasources?.[0]?.mappingIDs?.find((id) => id === elementToEdit?.id))
        setBehaviorsOnElement(eb);
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

    const onBehaviorClick = (behavior: IBehavior) => {
        setBehaviorToEdit(behavior)
        setIsCalloutVisible(true);
    }

    const removeBehavior = () => {
        const behaviorIndex = behaviorsOnElement.indexOf(behaviorToEdit);
        setBehaviorsOnElement(
            produce((draft) => {
                draft.splice(behaviorIndex, 1)      
            })
        );

        const mappingIdIndex = behaviorToEdit?.datasources?.[0]?.mappingIDs.indexOf(elementToEdit.id);

        setBehaviorToEdit(
            produce((draft) => {
                draft.datasources[0].mappingIDs?.splice(mappingIdIndex, 1);
            })
        )

        // behaviorToEdit is not yet updated until the next render so using a deep copy to add to the list
        const behavior = JSON.parse(JSON.stringify(behaviorToEdit));
        behavior.datasources[0].mappingIDs?.splice(mappingIdIndex, 1);

        setBehaviorsToEdit(
            produce((draft) => {
                draft.push(behavior);
            })
        )

        setIsCalloutVisible(false);
    }

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
                    <div className='cb-scene-builder-element-behaviors-spacer'/>
                    <div className='cb-scene-builder-element-behaviors-title'>
                        {t('3dSceneBuilder.behaviors')}
                    </div>
                    {behaviorsOnElement.map((behavior) => {
                        return (
                            <div id={behavior.id} key={behavior.id} className='cb-scene-builder-element-behavior-item'>
                                <FontIcon iconName={'Warning'} className='cb-scene-builder-element-behavior-item-icon' />
                                <div className='cb-scene-builder-element-behavior-item-name'>{behavior.id}</div>
                                <IconButton id={behavior.id} iconProps={{iconName: 'MoreVertical'}} title={t('more')} ariaLabel={t('more')} onClick={() => onBehaviorClick(behavior)}/>
                            </div>
                        )
                    })}
                    {isCalloutVisible &&
                        <Callout target={`#${behaviorToEdit?.id}`} isBeakVisible={false} directionalHint={DirectionalHint.rightCenter} className={styles.callout} onDismiss={() => setIsCalloutVisible(false)} >
                            <div className={styles.menuitem}>
                                <FontIcon iconName={'Edit'} className={styles.menuicon} />
                                <span className={styles.menutext}>{t('3dSceneBuilder.modifyBehavior')}</span>
                            </div>
                            <div className={styles.menuitem} onClick={() => removeBehavior()}>
                                <FontIcon iconName={'Blocked2'} className={styles.menuicon} />
                                <span className={styles.menutext}>{t('3dSceneBuilder.removeBehavior')}</span>
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
