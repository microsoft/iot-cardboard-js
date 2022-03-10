import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    Pivot,
    PivotItem,
    PrimaryButton,
    Separator,
    TextField,
    useTheme
} from '@fluentui/react';
import { IADT3DSceneBuilderElementFormProps } from '../../ADT3DSceneBuilder.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { createGUID } from '../../../../Models/Services/Utils';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import LeftPanelBuilderHeader from '../LeftPanelBuilderHeader';
import TwinSearchDropdown from '../../../../Components/TwinSearchDropdown/TwinSearchDropdown';
import MeshTab from './Internal/MeshTab';
import BehaviorsTab from './Internal/BehaviorsTab';
import AliasedTwinsTab from './Internal/AliasedTwinsTab';
import {
    getLeftPanelStyles,
    leftPanelPivotStyles
} from '../Shared/LeftPanel.styles';
import {
    IBehavior,
    IScene,
    ITwinToObjectMapping
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ElementType } from '../../../../Models/Classes/3DVConfig';

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    selectedElement,
    behaviors,
    onElementSave,
    onElementBackClick,
    onBehaviorSave,
    onBehaviorClick,
    onCreateBehaviorWithElements
}) => {
    const { t } = useTranslation();
    const [elementToEdit, setElementToEdit] = useState<ITwinToObjectMapping>(
        selectedElement ?? {
            type: ElementType.TwinToObjectMapping,
            id: '',
            displayName: '',
            linkedTwinID: '',
            objectIDs: []
        }
    );

    const [behaviorsToEdit, setBehaviorsToEdit] = useState<Array<IBehavior>>(
        []
    );

    const {
        adapter,
        config,
        sceneId,
        getConfig,
        coloredMeshItems,
        setColoredMeshItems
    } = useContext(SceneBuilderContext);

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<ITwinToObjectMapping> }) => {
            const sceneToUpdate: IScene = {
                ...config.configuration.scenes[
                    config.configuration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            };
            sceneToUpdate.elements = params.elements;
            return adapter.putScenesConfig(
                ViewerConfigUtility.editScene(config, sceneId, sceneToUpdate)
            );
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const handleSaveElement = async () => {
        const existingElements = config.configuration?.scenes
            ?.find((s) => s.id === sceneId)
            .elements.filter(ViewerConfigUtility.isTwinToObjectMappingElement);

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
            await onBehaviorSave(behavior, ADT3DSceneBuilderMode.EditBehavior);
        }

        onElementSave(newElements);
    };

    useEffect(() => {
        const meshIds = [];
        for (const item of coloredMeshItems) {
            meshIds.push(item.meshId);
        }
        setElementToEdit({
            ...elementToEdit,
            objectIDs: meshIds
        });
    }, [coloredMeshItems]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    const handleSelectTwinId = (selectedTwinId: string) => {
        if (
            !elementToEdit.displayName ||
            elementToEdit.displayName === elementToEdit.linkedTwinID
        ) {
            setElementToEdit({
                ...elementToEdit,
                linkedTwinID: selectedTwinId,
                displayName: selectedTwinId
            });
        } else {
            setElementToEdit({
                ...elementToEdit,
                linkedTwinID: selectedTwinId
            });
        }
    };

    useEffect(() => {
        const meshIds: string[] = [];
        for (const item of coloredMeshItems) {
            meshIds.push(item.meshId);
        }
        setElementToEdit({
            ...elementToEdit,
            objectIDs: meshIds
        });
    }, [coloredMeshItems]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <LeftPanelBuilderHeader
                headerText={
                    builderMode === ADT3DSceneBuilderMode.CreateElement
                        ? t('3dSceneBuilder.newElement')
                        : t('3dSceneBuilder.modifyElement')
                }
                subHeaderText={
                    !elementToEdit.displayName
                        ? t('3dSceneBuilder.addElementDetails')
                        : elementToEdit.displayName
                }
                iconName={'Shapes'}
            />
            <div className="cb-scene-builder-left-panel-create-form">
                <div className="cb-scene-builder-left-panel-create-form-contents">
                    <TwinSearchDropdown
                        adapter={adapter}
                        label={t('3dSceneBuilder.linkedTwin')}
                        selectedTwinId={selectedElement?.linkedTwinID}
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
                <Separator />
                <Pivot
                    aria-label={t('3dScenePage.buildMode')}
                    styles={leftPanelPivotStyles}
                >
                    <PivotItem headerText={t('3dSceneBuilder.meshes')}>
                        <div className={commonPanelStyles.formTabContents}>
                            <MeshTab elementToEdit={elementToEdit} />
                        </div>
                    </PivotItem>
                    <PivotItem headerText={t('3dSceneBuilder.behaviors')}>
                        <div className={commonPanelStyles.formTabContents}>
                            <BehaviorsTab
                                elementToEdit={elementToEdit}
                                behaviors={behaviors}
                                updateBehaviorsToEdit={(behaviors) => {
                                    setBehaviorsToEdit(behaviors);
                                }}
                                onBehaviorClick={onBehaviorClick}
                                onCreateBehaviorWithElements={
                                    onCreateBehaviorWithElements
                                }
                            />
                        </div>
                    </PivotItem>
                    <PivotItem headerText={t('3dSceneBuilder.aliasedTwins')}>
                        <div className={commonPanelStyles.formTabContents}>
                            <AliasedTwinsTab elementToEdit={elementToEdit} />
                        </div>
                    </PivotItem>
                </Pivot>
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
                            elementToEdit?.linkedTwinID &&
                            elementToEdit?.objectIDs?.length > 0
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
