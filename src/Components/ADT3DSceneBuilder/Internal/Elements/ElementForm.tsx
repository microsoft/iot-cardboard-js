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
    ITwinToObjectMapping
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ElementType } from '../../../../Models/Classes/3DVConfig';
import { createCustomMeshItems } from '../../../3DV/SceneView.Utils';
import ElementTwinAliasForm from './Internal/ElementTwinAliasForm';
import useAdapter from '../../../../Models/Hooks/useAdapter';
import { setPivotToRequired } from '../../../../Theming/FluentComponentStyles/Pivot.styles';

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
    const {
        adapter,
        config,
        getConfig,
        sceneId,
        coloredMeshItems,
        setColoredMeshItems,
        elementTwinAliasFormInfo
    } = useContext(SceneBuilderContext);

    const existingElementsRef = useRef(null);
    const newElementsRef = useRef(null);
    const [elementToEdit, setElementToEdit] = useState<ITwinToObjectMapping>(
        () => {
            const existingElements = config.configuration?.scenes
                ?.find((s) => s.id === sceneId)
                .elements.filter(
                    ViewerConfigUtility.isTwinToObjectMappingElement
                );
            existingElementsRef.current = existingElements;
            if (builderMode === ADT3DSceneBuilderMode.EditElement) {
                return selectedElement;
            } else {
                // builderMode is ADT3DSceneBuilderMode.CreateElement
                let newId = createGUID();
                const existingIds = existingElements?.map((e) => e.id);
                while (existingIds?.includes(newId)) {
                    newId = createGUID();
                }
                return {
                    type: ElementType.TwinToObjectMapping,
                    id: newId,
                    displayName: '',
                    primaryTwinID: '',
                    objectIDs: []
                };
            }
        }
    );

    const [behaviorsToEdit, setBehaviorsToEdit] = useState<Array<IBehavior>>(
        []
    );

    const isCreateElementDisabled = !(
        elementToEdit?.displayName &&
        elementToEdit?.primaryTwinID &&
        elementToEdit?.objectIDs?.length > 0
    );

    useEffect(() => {
        if (selectedElement) {
            setElementToEdit(selectedElement);
        }
    }, [selectedElement]);

    const saveElementAdapterData = useAdapter({
        adapterMethod: () => {
            let updatedConfig = deepCopy(config);

            // BEGINNING of updating elements in scene
            const newElements = existingElementsRef.current
                ? [...existingElementsRef.current]
                : [];

            if (builderMode === ADT3DSceneBuilderMode.CreateElement) {
                newElements.push(elementToEdit);
            } else {
                newElements[
                    newElements.findIndex((e) => e.id === selectedElement.id)
                ] = elementToEdit;
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

    const handleSaveElement = useCallback(async () => {
        await saveElementAdapterData.callAdapter();
    }, [saveElementAdapterData]);

    const handleCreateBehavior = useCallback(
        async (searchText: string) => {
            // Save element
            await handleSaveElement();

            onCreateBehaviorWithElements(
                searchText,
                elementToEdit // new element
            );
        },
        [handleSaveElement, onCreateBehaviorWithElements, elementToEdit]
    );

    useEffect(() => {
        if (saveElementAdapterData.adapterResult.result) {
            getConfig();
            if (newElementsRef.current) {
                onElementSave(newElementsRef.current);
            }
        }
    }, [saveElementAdapterData?.adapterResult]);

    useEffect(() => {
        if (selectedElement) {
            setColoredMeshItems(
                createCustomMeshItems(selectedElement.objectIDs, null)
            );
        }
    }, [selectedElement]);

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
                                            selectedElement?.primaryTwinID
                                        }
                                        onTwinIdSelect={handleSelectTwinId}
                                    />
                                    <TextField
                                        label={t('name')}
                                        value={elementToEdit?.displayName}
                                        required
                                        onChange={(e) => {
                                            setElementToEdit({
                                                ...elementToEdit,
                                                displayName:
                                                    e.currentTarget.value
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
                                    onRenderItemLink={(
                                        props,
                                        defaultRenderer
                                    ) =>
                                        setPivotToRequired(
                                            coloredMeshItems.length > 0,
                                            props,
                                            defaultRenderer
                                        )
                                    }
                                >
                                    <MeshTab elementToEdit={elementToEdit} />
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
                                            elementToEdit={elementToEdit}
                                            behaviors={behaviors}
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
        </ElementFormContext.Provider>
    );
};

export default SceneElementForm;
