import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import { setPivotToRequired } from '../../../../Theming/FluentComponentStyles/Pivot.styles';
import { useTranslation } from 'react-i18next';
import { DatasourceType } from '../../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderMode,
    VisualRuleFormMode,
    WidgetFormMode
} from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps,
    SET_ADT_SCENE_BUILDER_DRAFT_BEHAVIOR,
    SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY
} from '../../ADT3DSceneBuilder.types';
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
import WidgetForm from './Widgets/WidgetForm/WidgetForm';
import LeftPanelBuilderHeader, {
    getLeftPanelBuilderHeaderParamsForBehaviors
} from '../LeftPanelBuilderHeader';
import SceneElements from '../Elements/Elements';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { getLeftPanelStyles } from '../Shared/LeftPanel.styles';
import PanelFooter from '../Shared/PanelFooter';
import {
    panelFormPivotStyles,
    getPanelFormStyles
} from '../Shared/PanelForms.styles';
import {
    IBehavior,
    IExpressionRangeVisual,
    ITwinToObjectMapping
} from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import AlertsTab from './Internal/AlertsTab';
import StatusTab from './Internal/StatusTab';
import WidgetsTab from './Internal/WidgetsTab';
import {
    BehaviorFormReducer,
    defaultBehaviorFormState
} from './BehaviorForm.state';
import {
    BehaviorFormActionType,
    IValidityState,
    TabNames
} from './BehaviorForm.types';
import TwinsTab from './Internal/TwinsTab';
import SceneLayerMultiSelectBuilder from '../SceneLayerMultiSelectBuilder/SceneLayerMultiSelectBuilder';
import BehaviorTwinAliasForm from './Twins/BehaviorTwinAliasForm';
import {
    useBehaviorFormContext,
    BehaviorFormContextProvider
} from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from '../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';
import { LOCAL_STORAGE_KEYS } from '../../../../Models/Constants';
import { VisualRulesTab } from './Internal/VisualRulesTab';
import VisualRuleForm from '../VisualRuleForm/VisualRuleForm';

const showVisualRulesFeature =
    localStorage.getItem(
        LOCAL_STORAGE_KEYS.FeatureFlags.VisualRules.showVisualRulesFeature
    ) === 'true' || false;
const getElementsFromBehavior = (behavior: IBehavior) =>
    behavior.datasources.filter(
        ViewerConfigUtility.isElementTwinToObjectMappingDataSource
    )[0] || null;

enum BehaviorPivot {
    alerts = 'alerts',
    elements = 'elements',
    states = 'states',
    twins = 'twins',
    visualRules = 'visualRules',
    widgets = 'widgets'
}

const SceneBehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    behaviors,
    elements,
    builderMode,
    selectedElements,
    removedElements,
    onBehaviorBackClick,
    onBehaviorSave,
    setSelectedElements,
    updateSelectedElements,
    onElementClick,
    onRemoveElement
}) => {
    const { t } = useTranslation();
    const [visualRuleId, setVisualRuleId] = useState<string>('');

    const {
        behaviorTwinAliasFormInfo,
        config,
        dispatch,
        setUnsavedBehaviorChangesDialogOpen,
        setUnsavedChangesDialogDiscardAction,
        setVisualRuleFormMode,
        visualRuleFormMode,
        widgetFormInfo
    } = useContext(SceneBuilderContext);
    const {
        behaviorFormDispatch,
        behaviorFormState
    } = useBehaviorFormContext();

    const [behaviorState, behaviorDispatch] = useReducer(
        BehaviorFormReducer,
        defaultBehaviorFormState
    );

    const behaviorDraftWidgetBackup = useRef<IBehavior>(null);
    const behaviorLayersDraftWidgetBackup = useRef<string[]>(null);

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);
    const [
        isExpressionTextFieldEnabled,
        setisExpressionTextFieldEnabled
    ] = useState(false);
    const handleExpressionTextFieldEnabled = useCallback(
        (isEnabled: boolean) => {
            setisExpressionTextFieldEnabled(isEnabled);
        },
        [setisExpressionTextFieldEnabled]
    );

    useEffect(() => {
        const selectedElements = [];

        behaviorFormState.behaviorToEdit.datasources
            .filter(ViewerConfigUtility.isElementTwinToObjectMappingDataSource)
            .forEach((ds) => {
                ds.elementIDs.forEach((elementId) => {
                    const element = elements.find((el) => el.id === elementId);
                    element && selectedElements.push(element);
                });
            });

        if (selectedElements?.length > 0) {
            setSelectedElements(selectedElements);
        }
    }, []);

    // Prior to entering widget form -- freeze copy of draft behavior
    useEffect(() => {
        // Backup draft if opening widget form
        switch (widgetFormInfo.mode) {
            case WidgetFormMode.CreateWidget:
            case WidgetFormMode.EditWidget:
                // capture the state when going into the form
                if (!behaviorDraftWidgetBackup.current) {
                    behaviorDraftWidgetBackup.current =
                        behaviorFormState.behaviorToEdit;
                }
                if (!behaviorLayersDraftWidgetBackup.current) {
                    behaviorLayersDraftWidgetBackup.current =
                        behaviorFormState.behaviorSelectedLayerIds;
                }
                break;
            case WidgetFormMode.Cancelled:
                // If widget form is cancelled, restore backup
                if (
                    behaviorDraftWidgetBackup.current ||
                    behaviorLayersDraftWidgetBackup.current
                ) {
                    behaviorFormDispatch({
                        type: BehaviorFormContextActionType.FORM_BEHAVIOR_RESET,
                        payload: {
                            behavior: behaviorDraftWidgetBackup.current,
                            layerIds: behaviorLayersDraftWidgetBackup.current
                        }
                    });
                    behaviorDraftWidgetBackup.current = null;
                    behaviorLayersDraftWidgetBackup.current = null;
                }
                break;
            case WidgetFormMode.Committed:
                // If changes committed, clear backup
                behaviorDraftWidgetBackup.current = null;
                behaviorLayersDraftWidgetBackup.current = null;
                break;
        }
    }, [
        behaviorFormDispatch,
        behaviorFormState.behaviorSelectedLayerIds,
        behaviorFormState.behaviorToEdit,
        widgetFormInfo
    ]);

    useEffect(() => {
        const elementIds = [];
        selectedElements?.forEach((element) => {
            elementIds.push(element.id);
        });

        behaviorFormDispatch({
            type:
                BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE,
            payload: {
                source: {
                    type: DatasourceType.ElementTwinToObjectMappingDataSource,
                    elementIDs: elementIds
                }
            }
        });

        onTabValidityChange('Twins', {
            isValid: ViewerConfigUtility.areTwinAliasesValidInBehavior(
                behaviorFormState.behaviorToEdit,
                selectedElements
            )
        });
    }, [selectedElements]);

    const onTabValidityChange = useCallback(
        (tabName: TabNames, state: IValidityState) => {
            behaviorDispatch({
                type: BehaviorFormActionType.SET_TAB_STATE,
                payload: {
                    tabName: tabName,
                    state: { isValid: state.isValid }
                }
            });
        },
        []
    );

    // need a local copy to intercept and update form validity
    const localUpdateSelectedElements = useCallback(
        (element: ITwinToObjectMapping, isSelected: boolean) => {
            let count = getElementsFromBehavior(
                behaviorFormState.behaviorToEdit
            )?.elementIDs.length;
            // if selecting, then add 1, else remove 1 from existing counts
            count = isSelected ? count + 1 : count - 1;
            const isValid = count > 0;
            updateSelectedElements(element, isSelected);
            onTabValidityChange('Elements', { isValid: isValid });
        },
        [
            behaviorFormState.behaviorToEdit,
            updateSelectedElements,
            onTabValidityChange
        ]
    );

    const onPivotItemClick = useCallback(
        (item: PivotItem) => {
            const selectedPivot = item.props.itemKey as BehaviorPivot;
            if (selectedPivot == selectedBehaviorPivotKey) {
                // don't rerender if the pivot key is the same
                return;
            }
            setSelectedBehaviorPivotKey(selectedPivot);
        },
        [setSelectedBehaviorPivotKey, selectedBehaviorPivotKey]
    );
    const onLayerSelected = useCallback(
        (layerId: string) => {
            behaviorFormDispatch({
                type: BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD,
                payload: {
                    layerId: layerId
                }
            });
        },
        [behaviorFormDispatch]
    );
    const onLayerUnselected = useCallback(
        (layerId: string) => {
            behaviorFormDispatch({
                type: BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE,
                payload: {
                    layerId: layerId
                }
            });
        },
        [behaviorFormDispatch]
    );

    const onSaveClick = useCallback(async () => {
        await onBehaviorSave(
            config,
            behaviorFormState.behaviorToEdit,
            builderMode as BehaviorSaveMode,
            behaviorFormState.behaviorSelectedLayerIds,
            selectedElements,
            removedElements
        );
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [
        behaviorFormState.behaviorSelectedLayerIds,
        behaviorFormState.behaviorToEdit,
        builderMode,
        config,
        onBehaviorBackClick,
        onBehaviorSave,
        removedElements,
        selectedElements,
        setSelectedElements
    ]);

    const discardChanges = useCallback(() => {
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [onBehaviorBackClick, setSelectedElements]);

    const onCancelClick = useCallback(() => {
        if (behaviorFormState.isDirty) {
            setUnsavedBehaviorChangesDialogOpen(true);
            setUnsavedChangesDialogDiscardAction(discardChanges);
        } else {
            discardChanges();
        }
    }, [
        behaviorFormState.isDirty,
        setUnsavedBehaviorChangesDialogOpen,
        setUnsavedChangesDialogDiscardAction,
        discardChanges
    ]);

    const { headerText, subHeaderText, iconName } = useMemo(
        () =>
            getLeftPanelBuilderHeaderParamsForBehaviors(
                widgetFormInfo,
                behaviorTwinAliasFormInfo,
                builderMode,
                visualRuleFormMode
            ),
        [
            widgetFormInfo,
            behaviorTwinAliasFormInfo,
            builderMode,
            visualRuleFormMode
        ]
    );

    // report out initial state
    useEffect(() => {
        onTabValidityChange('Root', {
            isValid: !!behaviorFormState.behaviorToEdit.displayName
        });
        const existingElementIds = getElementsFromBehavior(
            behaviorFormState.behaviorToEdit
        )?.elementIDs;
        onTabValidityChange('Elements', {
            isValid: existingElementIds?.length > 0
        });
        onTabValidityChange('Twins', {
            isValid: ViewerConfigUtility.areTwinAliasesValidInBehavior(
                behaviorFormState.behaviorToEdit,
                selectedElements
            )
        });
    }, []);

    const notifySceneContextDirtyState = useCallback(
        (isDirty: boolean) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_FORM_DIRTY_MAP_ENTRY,
                payload: {
                    formType: 'behavior',
                    value: isDirty
                }
            });
        },
        [dispatch]
    );
    const notifySceneContextDraftBehavior = useCallback(
        (behavior: IBehavior) => {
            dispatch({
                type: SET_ADT_SCENE_BUILDER_DRAFT_BEHAVIOR,
                payload: behavior
            });
        },
        [dispatch]
    );

    // Visual rule form callbacks
    const onVisualRuleCancelClick = useCallback(
        (isDirty: boolean) => {
            if (isDirty) {
                setUnsavedBehaviorChangesDialogOpen(true);
                setUnsavedChangesDialogDiscardAction(() =>
                    setVisualRuleFormMode(VisualRuleFormMode.Inactive)
                );
            } else {
                setVisualRuleFormMode(VisualRuleFormMode.Inactive);
            }
        },
        [
            setUnsavedBehaviorChangesDialogOpen,
            setUnsavedChangesDialogDiscardAction,
            setVisualRuleFormMode
        ]
    );

    const onVisualRuleSaveClick = useCallback(
        (visualRule: IExpressionRangeVisual) => {
            behaviorFormDispatch({
                type:
                    BehaviorFormContextActionType.FORM_BEHAVIOR_VISUAL_RULE_ADD_OR_UPDATE,
                payload: {
                    visualRule: {
                        ...visualRule,
                        displayName: visualRule.displayName.trim(),
                        valueExpression: visualRule.valueExpression.trim()
                    }
                }
            });
            setVisualRuleFormMode(VisualRuleFormMode.Inactive);
        },
        [behaviorFormDispatch, setVisualRuleFormMode]
    );

    // mirror the form state up to the scene context (for navigation confirmation)
    useEffect(() => {
        notifySceneContextDirtyState(behaviorFormState.isDirty);
    }, [behaviorFormState.isDirty, notifySceneContextDirtyState]);
    // mirror the form state up to the scene context (for the behavior modal)
    useEffect(() => {
        notifySceneContextDraftBehavior(behaviorFormState.behaviorToEdit);
    }, [behaviorFormState.behaviorToEdit, notifySceneContextDraftBehavior]);

    // when we unmount, clear the form data
    useEffect(() => {
        return () => {
            behaviorFormDispatch({
                type: BehaviorFormContextActionType.FORM_BEHAVIOR_RESET
            });
            notifySceneContextDraftBehavior(null);
            notifySceneContextDirtyState(false);
        };
    }, [
        behaviorFormDispatch,
        notifySceneContextDirtyState,
        notifySceneContextDraftBehavior
    ]);
    const onEditRule = useCallback(
        (id: string) => {
            setVisualRuleFormMode(VisualRuleFormMode.EditVisualRule);
            setVisualRuleId(id);
        },
        [setVisualRuleFormMode]
    );

    const onAddRule = useCallback(() => {
        setVisualRuleFormMode(VisualRuleFormMode.CreateVisualRule);
        setVisualRuleId('');
    }, [setVisualRuleFormMode]);

    const isFormValid = checkValidityMap(behaviorState.validityMap);
    const isWidgetFormActive =
        widgetFormInfo.mode === WidgetFormMode.CreateWidget ||
        widgetFormInfo.mode === WidgetFormMode.EditWidget;
    const isVisualRulesFormActive =
        visualRuleFormMode !== VisualRuleFormMode.Inactive;
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const formHeaderHeight = isVisualRulesFormActive
        ? isExpressionTextFieldEnabled
            ? 370
            : 268
        : 168;
    const commonFormStyles = getPanelFormStyles(theme, formHeaderHeight);

    const renderWidgetForm = () => {
        return <WidgetForm />;
    };

    const renderTwinAliasForm = () => {
        return (
            <BehaviorTwinAliasForm
                selectedElements={selectedElements}
                setSelectedElements={setSelectedElements}
            />
        );
    };

    const renderVisualRuleForm = () => {
        return (
            <VisualRuleForm
                visualRuleId={visualRuleId}
                rootHeight={formHeaderHeight}
                isExpressionTextFieldEnabled={isExpressionTextFieldEnabled}
                handleExpressionTextFieldEnabled={
                    handleExpressionTextFieldEnabled
                }
                onCancelClick={onVisualRuleCancelClick}
                onSaveClick={onVisualRuleSaveClick}
            />
        );
    };

    const renderBehaviorFormContent = () => {
        return (
            <>
                <div className={commonFormStyles.content}>
                    <div className={commonFormStyles.header}>
                        <Stack tokens={{ childrenGap: 12 }}>
                            <TextField
                                label={t('displayName')}
                                value={
                                    behaviorFormState.behaviorToEdit.displayName
                                }
                                required
                                onChange={(_e, newValue) => {
                                    onTabValidityChange('Root', {
                                        isValid: !!newValue
                                    });
                                    behaviorFormDispatch({
                                        type:
                                            BehaviorFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET,
                                        payload: {
                                            name: newValue
                                        }
                                    });
                                }}
                            />
                            <SceneLayerMultiSelectBuilder
                                behaviorId={behaviorFormState.behaviorToEdit.id}
                                selectedLayerIds={
                                    behaviorFormState.behaviorSelectedLayerIds
                                }
                                onLayerSelected={onLayerSelected}
                                onLayerUnselected={onLayerUnselected}
                            />
                        </Stack>
                    </div>
                    <Separator />
                    <Pivot
                        selectedKey={selectedBehaviorPivotKey}
                        onLinkClick={onPivotItemClick}
                        className={commonFormStyles.expandingSection}
                        overflowBehavior={'menu'}
                        styles={panelFormPivotStyles}
                    >
                        <PivotItem
                            className={commonPanelStyles.formTabContents}
                            headerText={t('3dSceneBuilder.elements')}
                            itemKey={BehaviorPivot.elements}
                            onRenderItemLink={(props, defaultRenderer) =>
                                setPivotToRequired(
                                    behaviorState.validityMap?.get('Elements')
                                        ?.isValid,
                                    t,
                                    props,
                                    defaultRenderer
                                )
                            }
                        >
                            <SceneElements
                                elements={elements}
                                selectedElements={selectedElements}
                                updateSelectedElements={
                                    localUpdateSelectedElements
                                }
                                isEditBehavior={true}
                                hideSearch={false}
                                onElementClick={onElementClick}
                                onRemoveElement={onRemoveElement}
                            />
                        </PivotItem>
                        <PivotItem
                            className={commonPanelStyles.formTabContents}
                            headerText={t('3dSceneBuilder.twinsTab')}
                            itemKey={BehaviorPivot.twins}
                            onRenderItemLink={(props, defaultRenderer) =>
                                setPivotToRequired(
                                    behaviorState.validityMap?.get('Twins')
                                        ?.isValid,
                                    t,
                                    props,
                                    defaultRenderer
                                )
                            }
                        >
                            <TwinsTab
                                onValidityChange={onTabValidityChange}
                                behaviors={behaviors}
                                selectedElements={selectedElements}
                            />
                        </PivotItem>
                        {!showVisualRulesFeature && (
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.statesTab')}
                                itemKey={BehaviorPivot.states}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    setPivotToRequired(
                                        behaviorState.validityMap?.get('Status')
                                            ?.isValid,
                                        t,
                                        props,
                                        defaultRenderer
                                    )
                                }
                            >
                                <StatusTab
                                    onValidityChange={onTabValidityChange}
                                />
                            </PivotItem>
                        )}
                        {!showVisualRulesFeature && (
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.alertsTab')}
                                itemKey={BehaviorPivot.alerts}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    setPivotToRequired(
                                        behaviorState.validityMap?.get('Alerts')
                                            ?.isValid,
                                        t,
                                        props,
                                        defaultRenderer
                                    )
                                }
                            >
                                <AlertsTab />
                            </PivotItem>
                        )}
                        {showVisualRulesFeature && (
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.visualRulesTab')}
                                itemKey={BehaviorPivot.visualRules}
                            >
                                <VisualRulesTab
                                    onEditRule={onEditRule}
                                    onAddRule={onAddRule}
                                />
                            </PivotItem>
                        )}
                        <PivotItem
                            className={commonPanelStyles.formTabContents}
                            headerText={t('3dSceneBuilder.widgets')}
                            itemKey={BehaviorPivot.widgets}
                            onRenderItemLink={(props, defaultRenderer) =>
                                setPivotToRequired(
                                    behaviorState.validityMap?.get('Widgets')
                                        ?.isValid,
                                    t,
                                    props,
                                    defaultRenderer
                                )
                            }
                        >
                            <WidgetsTab />
                        </PivotItem>
                    </Pivot>
                </div>

                <PanelFooter>
                    <PrimaryButton
                        data-testid={'behavior-form-primary-button'}
                        onClick={onSaveClick}
                        text={
                            builderMode === ADT3DSceneBuilderMode.CreateBehavior
                                ? t('3dSceneBuilder.createBehavior')
                                : t('3dSceneBuilder.updateBehavior')
                        }
                        disabled={!isFormValid}
                    />
                    <DefaultButton
                        data-testid={'behavior-form-secondary-button'}
                        text={t('cancel')}
                        onClick={onCancelClick}
                    />
                </PanelFooter>
            </>
        );
    };

    return (
        <div className={commonFormStyles.root}>
            <LeftPanelBuilderHeader
                headerText={headerText}
                subHeaderText={subHeaderText}
                iconName={iconName}
            />
            {isWidgetFormActive
                ? renderWidgetForm()
                : behaviorTwinAliasFormInfo
                ? renderTwinAliasForm()
                : isVisualRulesFormActive
                ? renderVisualRuleForm()
                : renderBehaviorFormContent()}
        </div>
    );
};
function checkValidityMap(validityMap: Map<string, IValidityState>): boolean {
    let isValid = true;
    validityMap.forEach((x) => {
        isValid = isValid && x.isValid;
    });
    return isValid;
}

const BehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    behaviors,
    builderMode,
    elements,
    onBehaviorBackClick,
    onBehaviorSave,
    onElementClick,
    onRemoveElement,
    removedElements,
    selectedElements,
    setSelectedElements,
    updateSelectedElements
}) => {
    const { config, state } = useContext(SceneBuilderContext);

    const selectedLayerIds = ViewerConfigUtility.getActiveLayersForBehavior(
        config,
        state.selectedBehavior.id
    );
    return (
        <BehaviorFormContextProvider
            behaviorToEdit={state.selectedBehavior}
            behaviorSelectedLayerIds={selectedLayerIds}
        >
            <SceneBehaviorsForm
                behaviors={behaviors}
                builderMode={builderMode}
                elements={elements}
                onBehaviorBackClick={onBehaviorBackClick}
                onBehaviorSave={onBehaviorSave}
                onElementClick={onElementClick}
                onRemoveElement={onRemoveElement}
                removedElements={removedElements}
                selectedElements={selectedElements}
                setSelectedElements={setSelectedElements}
                updateSelectedElements={updateSelectedElements}
            />
        </BehaviorFormContextProvider>
    );
};
export default BehaviorsForm;
