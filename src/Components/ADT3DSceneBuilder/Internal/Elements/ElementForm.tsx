import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    IconButton,
    Pivot,
    PivotItem,
    PrimaryButton,
    Separator,
    Stack,
    TextField,
    useTheme
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import {
    IADT3DSceneBuilderElementFormProps,
    SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY
} from '../../ADT3DSceneBuilder.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { deepCopy, getDebugLogger } from '../../../../Models/Services/Utils';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import LeftPanelBuilderHeader, {
    getLeftPanelBuilderHeaderParamsForElements
} from '../LeftPanelBuilderHeader';
import TwinPropertySearchDropdown from '../../../TwinPropertySearchDropdown/TwinPropertySearchDropdown';
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
import { setPivotToRequired } from '../../../../Theming/FluentComponentStyles/Pivot.styles';
import { DTID_PROPERTY_NAME } from '../../../../Models/Constants/Constants';
import PropertyInspectorCallout from '../../../PropertyInspector/PropertyInspectorCallout/PropertyInspectorCallout';
import AdvancedSearch from '../../../AdvancedSearch/AdvancedSearch';
import { queryAllowedPropertyValueTypes } from '../../../AdvancedSearch/Internal/QueryBuilder/QueryBuilder.types';
import { PropertyValueHandle } from '../../../TwinPropertySearchDropdown/TwinPropertySearchDropdown.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ElementsForm', debugLogging);

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
        dispatch,
        elementTwinAliasFormInfo,
        getConfig,
        sceneId,
        setUnsavedBehaviorChangesDialogOpen,
        setUnsavedChangesDialogDiscardAction
    } = useContext(SceneBuilderContext);
    const { elementFormDispatch, elementFormState } = useElementFormContext();

    // state
    const [
        isAdvancedSearchOpen,
        { toggle: ToggleAdvancedSearchOpen }
    ] = useBoolean(false);
    const existingElementsRef = useRef(
        ViewerConfigUtility.getSceneById(config, sceneId)?.elements?.filter(
            ViewerConfigUtility.isTwinToObjectMappingElement
        ) || []
    );
    const newElementsRef = useRef(null);
    const propertyDropdownRef = useRef<PropertyValueHandle>(null);

    const isCreateElementDisabled = !(
        elementFormState.elementToEdit?.displayName &&
        elementFormState.elementToEdit?.primaryTwinID &&
        elementFormState.elementToEdit?.objectIDs?.length > 0
    );

    const saveElementAdapterData = useAdapter({
        adapterMethod: () => {
            logDebugConsole(
                'info',
                '[START] Saving element form. {initialConfig, element, linkedBehaviors}',
                config,
                elementFormState.elementToEdit,
                elementFormState.linkedBehaviorIds
            );
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
            updatedConfig.configuration.behaviors.forEach((behavior) => {
                const formElementId = elementFormState.elementToEdit.id;

                // if the behavior is in the linked list, add the element
                if (elementFormState.linkedBehaviorIds.includes(behavior.id)) {
                    ViewerConfigUtility.addElementToBehavior(
                        formElementId,
                        behavior
                    );
                    logDebugConsole(
                        'debug',
                        `Adding element ${formElementId} to behavior ${behavior.displayName} (${behavior.id}).`
                    );

                    // add the behavior to the current scene if it is not there
                    ViewerConfigUtility.addBehaviorToScene(
                        updatedConfig,
                        sceneId,
                        behavior,
                        true // in-place update
                    );
                } else {
                    ViewerConfigUtility.removeElementFromBehavior(
                        formElementId,
                        behavior
                    );
                    logDebugConsole(
                        'debug',
                        `Removing element ${formElementId} from behavior ${behavior.displayName} (${behavior.id}).`
                    );
                }
            });
            // END of behaviors update which this element exists in
            logDebugConsole(
                'info',
                '[END] Saving element form. {finalConfig, element, linkedBehaviors}',
                updatedConfig,
                elementFormState.elementToEdit,
                elementFormState.linkedBehaviorIds
            );
            return adapter.putScenesConfig(updatedConfig);
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    // callbacks
    const handleSaveElement = useCallback(async () => {
        await saveElementAdapterData.callAdapter();
    }, [saveElementAdapterData]);

    const notifySceneContextDirtyState = useCallback(
        (isDirty: boolean) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY,
                payload: {
                    formType: 'element',
                    value: isDirty
                }
            });
        },
        [dispatch]
    );

    const onCancelClick = useCallback(() => {
        if (elementFormState.isDirty) {
            setUnsavedBehaviorChangesDialogOpen(true);
            setUnsavedChangesDialogDiscardAction(onElementBackClick);
        } else {
            onElementBackClick();
        }
    }, [
        elementFormState.isDirty,
        onElementBackClick,
        setUnsavedBehaviorChangesDialogOpen,
        setUnsavedChangesDialogDiscardAction
    ]);

    const handleCreateBehavior = useCallback(
        async (searchText: string) => {
            // Save element
            await handleSaveElement();

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

    const handleSearchSelectTwinId = (selectedTwinId: string) => {
        if (propertyDropdownRef.current && selectedTwinId.length) {
            propertyDropdownRef.current.setValue(selectedTwinId);
            handleSelectTwinId(selectedTwinId);
        }
    };

    // effects

    // mirror the form state up to the scene context (for navigation confirmation)
    useEffect(() => {
        notifySceneContextDirtyState(elementFormState.isDirty);
    }, [elementFormState.isDirty, notifySceneContextDirtyState]);

    // when we unmount, clear the form data
    useEffect(() => {
        return () => {
            notifySceneContextDirtyState(false);
        };
    }, [notifySceneContextDirtyState]);

    // mirror the state from scene context onto the form
    useEffect(() => {
        const meshIds = [];
        for (const item of coloredMeshItems) {
            meshIds.push(item.meshId);
        }
        logDebugConsole(
            'debug',
            'Updating selected meshes. {coloredMeshes}',
            meshIds
        );
        elementFormDispatch({
            type: ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS,
            payload: {
                meshIds: meshIds
            }
        });
    }, [coloredMeshItems, elementFormDispatch]);

    // when the network call finishes, notify the parent
    useEffect(() => {
        if (saveElementAdapterData.adapterResult.result) {
            getConfig();
            // send the updated list of elements to the parent, once the write to config finishes
            if (newElementsRef.current) {
                onElementSave(newElementsRef.current);
            }
        }
    }, [getConfig, onElementSave, saveElementAdapterData.adapterResult]);

    // data
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
    const iconButtonStyles = {
        root: {
            marginTop: '34px', // Needed to align button to dropdown
            color: theme.semanticColors.buttonText,
            border: `1px solid ${theme.semanticColors.inputBorder}`
        }
    };
    return (
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
                                <Stack
                                    horizontal={true}
                                    tokens={{ childrenGap: 4 }}
                                >
                                    <TwinPropertySearchDropdown
                                        ref={propertyDropdownRef}
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
                                        initialSelectedValue={
                                            elementFormState.elementToEdit
                                                ?.primaryTwinID
                                        }
                                        searchPropertyName={DTID_PROPERTY_NAME}
                                        onChange={handleSelectTwinId}
                                    />
                                    <PropertyInspectorCallout
                                        adapter={adapter}
                                        twinId={
                                            elementFormState.elementToEdit
                                                ?.primaryTwinID
                                        }
                                        disabled={
                                            !(
                                                elementFormState.elementToEdit
                                                    ?.primaryTwinID?.length > 0
                                            )
                                        }
                                        styles={{
                                            subComponentStyles: {
                                                button: iconButtonStyles
                                            }
                                        }}
                                    />
                                    <IconButton
                                        iconProps={{
                                            iconName: 'QueryList'
                                        }}
                                        onClick={ToggleAdvancedSearchOpen}
                                        styles={iconButtonStyles}
                                        title={t('advancedSearch.modalTitle')}
                                    />
                                </Stack>
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
                                className={commonPanelStyles.formTabContents}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    setPivotToRequired(
                                        coloredMeshItems.length > 0,
                                        props,
                                        defaultRenderer
                                    )
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
                                className={commonPanelStyles.formTabContents}
                            >
                                <div
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                >
                                    <BehaviorsTab
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
                                className={commonPanelStyles.formTabContents}
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
                            onClick={onCancelClick}
                        />
                    </PanelFooter>
                    {/* Modal */}
                    {isAdvancedSearchOpen && (
                        <AdvancedSearch
                            adapter={adapter}
                            allowedPropertyValueTypes={
                                queryAllowedPropertyValueTypes
                            }
                            isOpen={isAdvancedSearchOpen}
                            onDismiss={ToggleAdvancedSearchOpen}
                            onTwinIdSelect={handleSearchSelectTwinId}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const ElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    onElementSave,
    onElementBackClick,
    onBehaviorClick,
    onCreateBehaviorWithElements
}) => {
    const { config, state } = useContext(SceneBuilderContext);
    const linkedBehaviorIds = ViewerConfigUtility.getBehaviorsOnElement(
        state.selectedElement?.id,
        config?.configuration?.behaviors
    ).map((x) => x.id);

    return (
        <ElementFormContextProvider
            elementToEdit={state.selectedElement}
            linkedBehaviorIds={linkedBehaviorIds}
        >
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
