import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FontIcon,
    IconButton,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import { IADT3DSceneBuilderElementFormProps } from '../ADT3DSceneBuilder.types';
import {
    Scene,
    TwinToObjectMapping
} from '../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { createGUID } from '../../../../Models/Services/Utils';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { TaJson } from 'ta-json';

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    selectedElement,
    onElementSave,
    onElementBackClick
}) => {
    const { t } = useTranslation();
    const [isObjectsExpanded, setIsObjectsExpanded] = useState(
        selectedElement ? false : true
    );
    const [elementToEdit, setElementToEdit] = useState<TwinToObjectMapping>(
        selectedElement ??
            TaJson.parse<TwinToObjectMapping>(
                JSON.stringify({
                    id: '',
                    displayName: '',
                    primaryTwinID: '',
                    meshIDs: []
                }),
                TwinToObjectMapping
            )
    );
    const {
        adapter,
        config,
        sceneId,
        getConfig,
        selectedObjectIds,
        setSelectedObjectIds
    } = useContext(SceneBuilderContext);

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<TwinToObjectMapping> }) => {
            const sceneToUpdate: Scene = {
                ...config.viewerConfiguration.scenes[
                    config.viewerConfiguration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            };
            sceneToUpdate.twinToObjectMappings = params.elements;
            return adapter.editScene(config, sceneId, sceneToUpdate);
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const handleSaveElement = () => {
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

        onElementSave(newElements);
    };

    useEffect(() => {
        setElementToEdit({
            ...elementToEdit,
            meshIDs: selectedObjectIds
        });
    }, [selectedObjectIds]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    return (
        <div className="cb-scene-builder-left-panel-create-element-wrapper">
            <div className="cb-scene-builder-left-panel-create-element-form">
                <div
                    className="cb-scene-builder-left-panel-create-element-header"
                    tabIndex={0}
                    onClick={onElementBackClick}
                >
                    <FontIcon
                        iconName={'ChevronRight'}
                        className="cb-chevron cb-breadcrumb"
                    />
                    <span>
                        {builderMode === ADT3DSceneBuilderMode.EditElement
                            ? selectedElement.displayName
                            : t('3dSceneBuilder.newElement')}
                    </span>
                </div>

                <div className="cb-scene-builder-left-panel-create-element-inner-form">
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
                <div className="cb-scene-builder-left-panel-element-objects">
                    <div
                        className="cb-scene-builder-left-panel-element-objects-header"
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
                        <div className="cb-scene-builder-left-panel-element-objects-container">
                            {elementToEdit.meshIDs.length === 0 ? (
                                <div className="cb-scene-builder-left-panel-text">
                                    {t('3dSceneBuilder.noObjectAddedText')}
                                </div>
                            ) : (
                                <ul className="cb-scene-builder-left-panel-element-object-list">
                                    {elementToEdit.meshIDs.map((meshName) => (
                                        <li
                                            key={meshName}
                                            className="cb-scene-builder-left-panel-element-object"
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
                                                    setSelectedObjectIds(
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
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-element-actions">
                <PrimaryButton
                    onClick={handleSaveElement}
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

export default SceneElementForm;
