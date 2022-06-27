import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    Pivot,
    PivotItem,
    PrimaryButton,
    Separator,
    Stack,
    TextField,
    useTheme
} from '@fluentui/react';
import { IADT3DSceneBuilderElementFormProps } from '../../ADT3DSceneBuilder.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { deepCopy } from '../../../../Models/Services/Utils';
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
import ElementTwinAliasForm from './Internal/ElementTwinAliasForm';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import {
    ElementFormContextProvider,
    useElementFormContext
} from '../../../../Models/Context/ElementsFormContext/ElementFormContext';
import { ElementFormContextActionType } from '../../../../Models/Context/ElementsFormContext/ElementFormContext.types';
import { createCustomMeshItems } from '../../../3DV/SceneView.Utils';
import { IBehavior } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    onElementSave,
    onElementBackClick,
    onBehaviorClick,
    onCreateBehaviorWithElements
}) => {
    // hooks
    const { t } = useTranslation();

    // contexts
    const {
        adapter,
        coloredMeshItems,
        config,
        elementTwinAliasFormInfo,
        getConfig,
        sceneId,
        setColoredMeshItems,
        state
    } = useContext(SceneBuilderContext);
    const { elementFormDispatch, elementFormState } = useElementFormContext();

    // state
    const [behaviorsToEdit, setBehaviorsToEdit] = useState<Array<IBehavior>>(
        []
    );

    const existingElementsRef = useRef(
        ViewerConfigUtility.getSceneById(config, sceneId)?.elements?.filter(
            ViewerConfigUtility.isTwinToObjectMappingElement
        ) || []
    );
    const newElementsRef = useRef(null);

    const allBehaviors = config?.configuration?.behaviors || [];
    const isCreateElementDisabled = !(
        elementFormState.elementToEdit?.displayName &&
        elementFormState.elementToEdit?.primaryTwinID &&
        elementFormState.elementToEdit?.objectIDs?.length > 0
    );

    const saveElementAdapterData = useAdapter({
        adapterMethod: () => {
            let updatedConfig = deepCopy(config);

            // BEGINNING of updating elements in scene
            const newElements = existingElementsRef.current
                ? [...existingElementsRef.current]
                : [];

            if (builderMode === ADT3DSceneBuilderMode.CreateElement) {
                newElements.push(elementFormState.elementToEdit);
            } else {
                newElements[
                    newElements.findIndex(
                        (e) => e.id === elementFormState.elementToEdit.id
                    )
                ] = elementFormState.elementToEdit;
            }
            newElementsRef.current = newElements;
            updatedConfig = ViewerConfigUtility.updateElementsInScene(
                updatedConfig,
                sceneId,
                newElements
            );
            // END of updating elements in scene

            // BEGINNING of behaviors update which this element exists in
            if (behaviorsToEdit) {
                for (const behavior of behaviorsToEdit) {
                    updatedConfig = ViewerConfigUtility.editBehavior(
                        updatedConfig,
                        behavior
                    );

                    // add the behavior to the current scene if it is not there
                    updatedConfig = ViewerConfigUtility.addBehaviorToScene(
                        updatedConfig,
                        sceneId,
                        behavior
                    );
                }
            }
            // END of behaviors update which this element exists in

            return adapter.putScenesConfig(updatedConfig);
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const handleSaveElement = useCallback(() => {
        saveElementAdapterData.callAdapter();
    }, [saveElementAdapterData]);

    const handleCreateBehavior = useCallback(
        async (searchText: string) => {
            // Save element
            handleSaveElement();

            onCreateBehaviorWithElements(
                searchText,
                elementFormState.elementToEdit // new element
            );
        },
        [
            elementFormState.elementToEdit,
            handleSaveElement,
            onCreateBehaviorWithElements
        ]
    );

    const handleSelectTwinId = (selectedTwinId: string) => {
        elementFormDispatch({
            type: ElementFormContextActionType.FORM_ELEMENT_TWIN_ID_SET,
            payload: {
                twinId: selectedTwinId
            }
        });
    };

    useEffect(() => {
        if (saveElementAdapterData.adapterResult.result) {
            getConfig();
            // send the updated list of elements to the parent, once the write to config finishes
            if (newElementsRef.current) {
                onElementSave(newElementsRef.current);
            }
        }
    }, [getConfig, onElementSave, saveElementAdapterData.adapterResult]);

    // useEffect(() => {
    //     if (elementFormState.elementToEdit) {
    //         setColoredMeshItems(
    //             createCustomMeshItems(
    //                 elementFormState.elementToEdit.objectIDs,
    //                 null
    //             )
    //         );
    //     }
    // }, [elementFormState.elementToEdit, setColoredMeshItems]);

    // mirror the state from scene context onto the form
    useEffect(() => {
        console.log('****updateing meshes', coloredMeshItems);
        const meshIds = [];
        for (const item of coloredMeshItems) {
            meshIds.push(item.meshId);
        }
        elementFormDispatch({
            type: ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS,
            payload: {
                meshIds: meshIds
            }
        });
    }, [coloredMeshItems, elementFormDispatch]);

    const { headerText, subHeaderText, iconName } = useMemo(
        () =>
            getLeftPanelBuilderHeaderParamsForElements(
                elementFormState.elementToEdit,
                elementTwinAliasFormInfo,
                builderMode
            ),
        [elementFormState.elementToEdit, elementTwinAliasFormInfo, builderMode]
    );

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 170);
    return (
        <ElementFormContextProvider elementToEdit={state.selectedElement}>
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
                                <Stack tokens={{ childrenGap: 8 }}>
                                    <TwinSearchDropdown
                                        adapter={adapter}
                                        descriptionText={t(
                                            '3dSceneBuilder.elementForm.twinNameDescription'
                                        )}
                                        label={t('3dSceneBuilder.primaryTwin')}
                                        labelTooltip={{
                                            buttonAriaLabel: t(
                                                '3dSceneBuilder.elementForm.twinNameTooltip'
                                            ),
                                            calloutContent: t(
                                                '3dSceneBuilder.elementForm.twinNameTooltip'
                                            )
                                        }}
                                        selectedTwinId={
                                            elementFormState.elementToEdit
                                                ?.primaryTwinID
                                        }
                                        onTwinIdSelect={handleSelectTwinId}
                                    />
                                    <TextField
                                        label={t('name')}
                                        value={
                                            elementFormState.elementToEdit
                                                ?.displayName
                                        }
                                        required
                                        onChange={(_e, value) => {
                                            elementFormDispatch({
                                                type:
                                                    ElementFormContextActionType.FORM_ELEMENT_DISPLAY_NAME_SET,
                                                payload: {
                                                    name: value
                                                }
                                            });
                                        }}
                                    />
                                </Stack>
                            </div>
                            <Separator />
                            <Pivot
                                aria-label={t('3dScenePage.buildMode')}
                                className={commonFormStyles.pivot}
                                styles={panelFormPivotStyles}
                            >
                                <PivotItem
                                    headerText={t(
                                        '3dSceneBuilder.elementForm.meshTabName'
                                    )}
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                >
                                    <MeshTab
                                        elementToEdit={
                                            elementFormState.elementToEdit
                                        }
                                    />
                                </PivotItem>
                                <PivotItem
                                    headerText={t(
                                        '3dSceneBuilder.elementForm.behaviorsTabName'
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
                                        <BehaviorsTab
                                            elementToEdit={
                                                elementFormState.elementToEdit
                                            }
                                            allBehaviors={allBehaviors}
                                            updateBehaviorsToEdit={
                                                setBehaviorsToEdit
                                            }
                                            onBehaviorClick={onBehaviorClick}
                                            onCreateBehaviorWithElements={
                                                handleCreateBehavior
                                            }
                                            isCreateBehaviorDisabled={
                                                isCreateElementDisabled
                                            }
                                        />
                                    </div>
                                </PivotItem>
                                <PivotItem
                                    headerText={t(
                                        '3dSceneBuilder.elementForm.twinTabName'
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
                                disabled={isCreateElementDisabled}
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
        </ElementFormContextProvider>
    );
};

const ElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    onElementSave,
    onElementBackClick,
    onBehaviorClick,
    onCreateBehaviorWithElements
}) => {
    const { state } = useContext(SceneBuilderContext);
    return (
        <ElementFormContextProvider elementToEdit={state.selectedElement}>
            <SceneElementForm
                builderMode={builderMode}
                onElementBackClick={onElementBackClick}
                onElementSave={onElementSave}
                onBehaviorClick={onBehaviorClick}
                onCreateBehaviorWithElements={onCreateBehaviorWithElements}
            />
        </ElementFormContextProvider>
    );
};
export default ElementForm;
