import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import {
    IADT3DSceneBuilderElementFormProps,
    IElementFormContext
} from '../../ADT3DSceneBuilder.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { createGUID, deepCopy } from '../../../../Models/Services/Utils';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import LeftPanelBuilderHeader, {
    getLeftPanelBuilderHeaderParamsForElements
} from '../LeftPanelBuilderHeader';
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
import ElementTwinAliasForm from './Internal/ElementTwinAliasForm';

export const ElementFormContext = React.createContext<IElementFormContext>(
    null
);

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    selectedElement,
    behaviors,
    onElementSave,
    onElementBackClick,
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
        coloredMeshItems,
        setColoredMeshItems,
        elementTwinAliasFormInfo
    } = useContext(SceneBuilderContext);
    const configRef = useRef(config);

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

        // beginning of element update in scene
        const sceneToUpdate: IScene = deepCopy(
            config.configuration.scenes[
                config.configuration.scenes.findIndex((s) => s.id === sceneId)
            ]
        );
        sceneToUpdate.elements = newElements;
        configRef.current = ViewerConfigUtility.editScene(
            config,
            sceneId,
            sceneToUpdate
        );
        // end of update of element update in scene

        // beginning of behaviors update which this element exists in
        if (behaviorsToEdit) {
            for (const behavior of behaviorsToEdit) {
                configRef.current = ViewerConfigUtility.editBehavior(
                    configRef.current,
                    behavior,
                    undefined
                );
            }
        }
        // end of behaviors update which this element exists in

        onElementSave(elementToEdit, newElements, configRef.current);
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
        configRef.current = config;
    }, [config]);

    const { headerText, subHeaderText, iconName } = useMemo(
        () =>
            getLeftPanelBuilderHeaderParamsForElements(
                selectedElement,
                elementTwinAliasFormInfo,
                builderMode
            ),
        [
            selectedElement,
            elementTwinAliasFormInfo,
            builderMode,
            getLeftPanelBuilderHeaderParamsForElements
        ]
    );

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 170);
    return (
        <ElementFormContext.Provider
            value={{
                elementToEdit,
                setElementToEdit
            }}
        >
            <div className={commonFormStyles.root}>
                <LeftPanelBuilderHeader
                    headerText={headerText}
                    subHeaderText={subHeaderText}
                    iconName={iconName}
                />
                {elementTwinAliasFormInfo ? (
                    <ElementTwinAliasForm />
                ) : (
                    <>
                        <div className={commonFormStyles.content}>
                            <div className={commonFormStyles.header}>
                                <TwinSearchDropdown
                                    adapter={adapter}
                                    label={t('3dSceneBuilder.linkedTwin')}
                                    selectedTwinId={
                                        selectedElement?.linkedTwinID
                                    }
                                    onTwinIdSelect={handleSelectTwinId}
                                    descriptionText={t(
                                        '3dSceneBuilder.linkedTwinInputInfo'
                                    )}
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
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                >
                                    <MeshTab elementToEdit={elementToEdit} />
                                </PivotItem>
                                <PivotItem
                                    headerText={t('3dSceneBuilder.behaviors')}
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                >
                                    <div
                                        className={
                                            commonPanelStyles.formTabContents
                                        }
                                    >
                                        <BehaviorsTab
                                            elementToEdit={elementToEdit}
                                            behaviors={behaviors}
                                            updateBehaviorsToEdit={(
                                                behaviors
                                            ) => {
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
                                    headerText={t(
                                        '3dSceneBuilder.twinAlias.aliasedTwins'
                                    )}
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                >
                                    <div
                                        className={
                                            commonPanelStyles.formTabContents
                                        }
                                    >
                                        <AliasedTwinsTab />
                                    </div>
                                </PivotItem>
                            </Pivot>
                        </div>
                        <PanelFooter>
                            <PrimaryButton
                                onClick={handleSaveElement}
                                text={
                                    builderMode ===
                                    ADT3DSceneBuilderMode.CreateElement
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
                    </>
                )}
            </div>
        </ElementFormContext.Provider>
    );
};

export default SceneElementForm;
