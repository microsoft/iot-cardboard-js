import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { DatasourceType } from '../../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderMode,
    WidgetFormMode
} from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps
} from '../../ADT3DSceneBuilder.types';
import produce from 'immer';
import {
    DefaultButton,
    IPivotItemProps,
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
import { customPivotItemStyles } from './BehaviorsForm.styles';
import TwinsTab from './Internal/TwinsTab';
import SceneLayerMultiSelectBuilder from '../SceneLayerMultiSelectBuilder/SceneLayerMultiSelectBuilder';
import BehaviorTwinAliasForm from './Twins/BehaviorTwinAliasForm';
import UnsavedChangesDialog from '../UnsavedChangesDialog/UnsavedChangesDialog';
import { deepCopy } from '../../../../Models/Services/Utils';

const getElementsFromBehavior = (behavior: IBehavior) =>
    behavior.datasources.filter(
        ViewerConfigUtility.isElementTwinToObjectMappingDataSource
    )[0] || null;

enum BehaviorPivot {
    alerts = 'alerts',
    elements = 'elements',
    states = 'states',
    twins = 'twins',
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

    const {
        config,
        widgetFormInfo,
        behaviorTwinAliasFormInfo,
        checkIfBehaviorHasBeenEdited,
        setBehaviorToEdit,
        setOriginalBehaviorToEdit,
        setUnsavedBehaviorChangesDialog,
        setUnsavedChangesDialogDiscardAction,
        state,
        behaviorToEdit
    } = useContext(SceneBuilderContext);

    const [behaviorState, dispatch] = useReducer(
        BehaviorFormReducer,
        defaultBehaviorFormState
    );

    const behaviorDraftWidgetBackup = useRef<IBehavior>(null);

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

    const [selectedLayerIds, setSelectedLayerIds] = useState(
        ViewerConfigUtility.getActiveLayersForBehavior(
            config,
            behaviorToEdit.id
        )
    );

    useEffect(() => {
        const selectedElements = [];

        behaviorToEdit.datasources
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

        // store original behavior so we can determine if it has changed
        setOriginalBehaviorToEdit(deepCopy(behaviorToEdit));
    }, []);

    // Prior to entering widget form -- freeze copy of draft behavior
    useEffect(() => {
        // Backup draft if opening widget form
        if (
            (widgetFormInfo.mode === WidgetFormMode.CreateWidget ||
                widgetFormInfo.mode === WidgetFormMode.EditWidget) &&
            !behaviorDraftWidgetBackup.current
        ) {
            behaviorDraftWidgetBackup.current = behaviorToEdit;
        }
        // If widget form is cancelled, restore backup
        else if (
            widgetFormInfo.mode === WidgetFormMode.Cancelled &&
            behaviorDraftWidgetBackup.current
        ) {
            setBehaviorToEdit(behaviorDraftWidgetBackup.current);
            behaviorDraftWidgetBackup.current = null;
        }
        // If changes committed, clear backup
        else if (widgetFormInfo.mode === WidgetFormMode.Committed) {
            behaviorDraftWidgetBackup.current = null;
        }
    }, [widgetFormInfo]);

    useEffect(() => {
        const elementIds = [];
        selectedElements?.forEach((element) => {
            elementIds.push(element.id);
        });

        setBehaviorToEdit(
            produce((draft) => {
                if (
                    draft.datasources &&
                    draft.datasources[0] &&
                    draft.datasources[0].elementIDs
                ) {
                    draft.datasources[0].elementIDs = elementIds;
                } else {
                    draft.datasources[0] = {
                        type:
                            DatasourceType.ElementTwinToObjectMappingDataSource,
                        elementIDs: elementIds
                    };
                }
            })
        );

        onTabValidityChange('Twins', {
            isValid: ViewerConfigUtility.areTwinAliasesValidInBehavior(
                behaviorToEdit,
                selectedElements
            )
        });
    }, [selectedElements]);

    const onTabValidityChange = useCallback(
        (tabName: TabNames, state: IValidityState) => {
            dispatch({
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
            let count = getElementsFromBehavior(behaviorToEdit)?.elementIDs
                .length;
            // if selecting, then add 1, else remove 1 from existing counts
            count = isSelected ? count + 1 : count - 1;
            const isValid = count > 0;
            updateSelectedElements(element, isSelected);
            onTabValidityChange('Elements', { isValid: isValid });
        },
        [behaviorToEdit, updateSelectedElements, onTabValidityChange]
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

    const onSaveClick = useCallback(async () => {
        await onBehaviorSave(
            config,
            behaviorToEdit,
            builderMode as BehaviorSaveMode,
            selectedLayerIds,
            selectedElements,
            removedElements
        );
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [
        onBehaviorSave,
        config,
        behaviorToEdit,
        builderMode,
        selectedLayerIds,
        selectedElements,
        removedElements,
        onBehaviorBackClick,
        setSelectedElements
    ]);

    const discardChanges = useCallback(() => {
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [onBehaviorBackClick, setSelectedElements]);

    const onCancelClick = useCallback(() => {
        if (checkIfBehaviorHasBeenEdited()) {
            setUnsavedBehaviorChangesDialog(true);
            setUnsavedChangesDialogDiscardAction(discardChanges);
        } else {
            discardChanges();
        }
    }, [
        discardChanges,
        checkIfBehaviorHasBeenEdited,
        setUnsavedChangesDialogDiscardAction,
        setUnsavedBehaviorChangesDialog
    ]);

    const onDiscardChangesClick = useCallback(() => {
        setUnsavedBehaviorChangesDialog(false);
        if (state.unsavedChangesDialogDiscardAction) {
            state.unsavedChangesDialogDiscardAction();
        }
    }, [setUnsavedBehaviorChangesDialog, state]);

    const { headerText, subHeaderText, iconName } = useMemo(
        () =>
            getLeftPanelBuilderHeaderParamsForBehaviors(
                widgetFormInfo,
                behaviorTwinAliasFormInfo,
                builderMode
            ),
        [widgetFormInfo, behaviorTwinAliasFormInfo, builderMode]
    );

    // report out initial state
    useEffect(() => {
        onTabValidityChange('Root', { isValid: !!behaviorToEdit.displayName });
        const existingElementIds = getElementsFromBehavior(behaviorToEdit)
            ?.elementIDs;
        onTabValidityChange('Elements', {
            isValid: existingElementIds?.length > 0
        });
        onTabValidityChange('Twins', {
            isValid: ViewerConfigUtility.areTwinAliasesValidInBehavior(
                behaviorToEdit,
                selectedElements
            )
        });
    }, []);
    const isFormValid = checkValidityMap(behaviorState.validityMap);

    // console.log(
    //     `***Rendering, isValid: ${isFormValid}, Elements: ${
    //         state.validityMap?.get('Elements')?.isValid
    //     }, Twins: ${state.validityMap?.get('Twins')?.isValid}, Status: ${
    //         state.validityMap?.get('Status')?.isValid
    //     }, Alerts: ${state.validityMap?.get('Alerts')?.isValid}, Widgets: ${
    //         state.validityMap?.get('Widgets')?.isValid
    //     }`
    // );
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 168);

    return (
        <div className={commonFormStyles.root}>
            <LeftPanelBuilderHeader
                headerText={headerText}
                subHeaderText={subHeaderText}
                iconName={iconName}
            />
            {widgetFormInfo.mode === WidgetFormMode.CreateWidget ||
            widgetFormInfo.mode === WidgetFormMode.EditWidget ? (
                <WidgetForm />
            ) : behaviorTwinAliasFormInfo ? (
                <BehaviorTwinAliasForm
                    selectedElements={selectedElements}
                    setSelectedElements={setSelectedElements}
                />
            ) : (
                <>
                    <div className={commonFormStyles.content}>
                        <div className={commonFormStyles.header}>
                            <Stack tokens={{ childrenGap: 12 }}>
                                <TextField
                                    label={t('displayName')}
                                    value={behaviorToEdit.displayName}
                                    required
                                    onChange={(_e, newValue) => {
                                        onTabValidityChange('Root', {
                                            isValid: !!newValue
                                        });
                                        setBehaviorToEdit(
                                            produce((draft: IBehavior) => {
                                                draft.displayName = newValue;
                                            })
                                        );
                                    }}
                                />
                                <SceneLayerMultiSelectBuilder
                                    behaviorId={behaviorToEdit.id}
                                    selectedLayerIds={selectedLayerIds}
                                    setSelectedLayerIds={setSelectedLayerIds}
                                />
                            </Stack>
                        </div>
                        <Separator />
                        <Pivot
                            selectedKey={selectedBehaviorPivotKey}
                            onLinkClick={onPivotItemClick}
                            className={commonFormStyles.pivot}
                            overflowBehavior={'menu'}
                            styles={panelFormPivotStyles}
                        >
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.elements')}
                                itemKey={BehaviorPivot.elements}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    _customTabRenderer(
                                        behaviorState.validityMap?.get(
                                            'Elements'
                                        )?.isValid,
                                        props,
                                        defaultRenderer
                                    )
                                }
                            >
                                <div
                                    className={
                                        commonPanelStyles.paddedPivotTabContents
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
                                </div>
                            </PivotItem>
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.twinsTab')}
                                itemKey={BehaviorPivot.twins}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    _customTabRenderer(
                                        behaviorState.validityMap?.get('Twins')
                                            ?.isValid,
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
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.statesTab')}
                                itemKey={BehaviorPivot.states}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    _customTabRenderer(
                                        behaviorState.validityMap?.get('Status')
                                            ?.isValid,
                                        props,
                                        defaultRenderer
                                    )
                                }
                            >
                                <StatusTab
                                    onValidityChange={onTabValidityChange}
                                />
                            </PivotItem>
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.alertsTab')}
                                itemKey={BehaviorPivot.alerts}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    _customTabRenderer(
                                        behaviorState.validityMap?.get('Alerts')
                                            ?.isValid,
                                        props,
                                        defaultRenderer
                                    )
                                }
                            >
                                <AlertsTab />
                            </PivotItem>
                            <PivotItem
                                className={commonPanelStyles.formTabContents}
                                headerText={t('3dSceneBuilder.widgets')}
                                itemKey={BehaviorPivot.widgets}
                                onRenderItemLink={(props, defaultRenderer) =>
                                    _customTabRenderer(
                                        behaviorState.validityMap?.get(
                                            'Widgets'
                                        )?.isValid,
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
                                builderMode ===
                                ADT3DSceneBuilderMode.CreateBehavior
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
            )}
            <UnsavedChangesDialog
                isOpen={state.unsavedBehaviorDialogOpen}
                onConfirmDiscard={onDiscardChangesClick}
                onClose={() => setUnsavedBehaviorChangesDialog(false)}
            />
        </div>
    );
};

function _customTabRenderer(
    isValid: boolean | undefined,
    link?: IPivotItemProps,
    defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null
): JSX.Element | null {
    if (!link || !defaultRenderer) {
        return null;
    }
    return (
        <span className={customPivotItemStyles.root}>
            {defaultRenderer({ ...link, itemIcon: undefined })}
            {/* TODO: Add an aria label of some kind here for screen readers to see this error state */}
            {isValid === false && (
                <span className={customPivotItemStyles.alert} />
            )}
        </span>
    );
}

function checkValidityMap(validityMap: Map<string, IValidityState>): boolean {
    let isValid = true;
    validityMap.forEach((x) => {
        isValid = isValid && x.isValid;
    });
    return isValid;
}

export default SceneBehaviorsForm;
