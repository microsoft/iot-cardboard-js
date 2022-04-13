import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { createGUID, deepCopy } from '../../../../Models/Services/Utils';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import LeftPanelBuilderHeader from '../LeftPanelBuilderHeader';
import TwinSearchDropdown from '../../../../Components/TwinSearchDropdown/TwinSearchDropdown';
import MeshTab from './Internal/MeshTab';
import BehaviorsTab from './Internal/BehaviorsTab';
import AliasedTwinsTab from './Internal/AliasedTwinsTab';
import { getLeftPanelStyles } from '../Shared/LeftPanel.styles';
import PanelFooter from '../Shared/PanelFooter';
import {
    panelFormPivotStyles,
    getPanelFormStyles
} from '../Shared/PanelForms.styles';
import {
    IBehavior,
    IScene,
    ITwinToObjectMapping
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ElementType } from '../../../../Models/Classes/3DVConfig';
import { createCustomMeshItems } from '../../../3DV/SceneView.Utils';

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
    const configRef = useRef(config);

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<ITwinToObjectMapping> }) => {
            const sceneToUpdate: IScene = deepCopy(
                config.configuration.scenes[
                    config.configuration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            );
            sceneToUpdate.elements = params.elements;
            configRef.current = ViewerConfigUtility.editScene(
                config,
                sceneId,
                sceneToUpdate
            );
            return adapter.putScenesConfig(configRef.current);
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
            let newId = createGUID();
            const existingIds = existingElements?.map((e) => e.id);
            while (existingIds?.includes(newId)) {
                newId = createGUID();
            }
            const newElement = { ...elementToEdit, id: newId };
            newElements.push(newElement);
        } else {
            newElements[
                existingElements.findIndex((e) => e.id === selectedElement.id)
            ] = elementToEdit;
        }

        await updateTwinToObjectMappings.callAdapter({
            elements: newElements
        });

        for (const behavior of behaviorsToEdit) {
            await onBehaviorSave(
                configRef.current,
                behavior,
                ADT3DSceneBuilderMode.EditBehavior
            );
        }

        onElementSave(newElements);
    };

    useEffect(() => {
        if (selectedElement) {
            setColoredMeshItems(
                createCustomMeshItems(selectedElement.objectIDs, null)
            );
        }
    }, []);

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
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 170);
    return (
        <div className={commonFormStyles.root}>
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
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.header}>
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
                    className={commonFormStyles.pivot}
                    styles={panelFormPivotStyles}
                >
                    <PivotItem
                        headerText={t('3dSceneBuilder.meshes')}
                        className={commonPanelStyles.formTabContents}
                    >
                        <MeshTab elementToEdit={elementToEdit} />
                    </PivotItem>
                    <PivotItem
                        headerText={t('3dSceneBuilder.behaviors')}
                        className={commonPanelStyles.formTabContents}
                    >
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
                    <PivotItem
                        headerText={t('3dSceneBuilder.twinAlias.aliasedTwins')}
                        className={commonPanelStyles.formTabContents}
                    >
                        <div className={commonPanelStyles.formTabContents}>
                            <AliasedTwinsTab elementToEdit={elementToEdit} />
                        </div>
                    </PivotItem>
                </Pivot>
            </div>
            <PanelFooter>
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
                    onClick={() => {
                        onElementBackClick();
                    }}
                />
            </PanelFooter>
        </div>
    );
};

export default SceneElementForm;
