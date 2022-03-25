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
import {
    DatasourceType,
    defaultBehavior
} from '../../../../Models/Classes/3DVConfig';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps,
    IBehaviorFormContext
} from '../../ADT3DSceneBuilder.types';
import produce from 'immer';
import {
    DefaultButton,
    IPivotItemProps,
    Pivot,
    PivotItem,
    PrimaryButton,
    Separator,
    TextField,
    useTheme
} from '@fluentui/react';
// import AlertsTab from './Internal/AlertsTab';
import WidgetForm from './Widgets/WidgetForm';
import LeftPanelBuilderHeader, {
    getLeftPanelBuilderHeaderParams
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
import { createGUID } from '../../../../Models/Services/Utils';
import AlertsTab from './Internal/AlertsTab';
import StatesTab from './Internal/StatesTab';
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
import { IValueRangeBuilderHandle } from '../../../ValueRangeBuilder/ValueRangeBuilder.types';

export const BehaviorFormContext = React.createContext<IBehaviorFormContext>(
    null
);
const getElementsFromBehavior = (behavior: IBehavior) =>
    behavior.datasources.filter(
        ViewerConfigUtility.isElementTwinToObjectMappingDataSource
    )[0] || null;

const getStatusFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isStatusColorVisual)[0] || null;

enum BehaviorPivot {
    alerts = 'alerts',
    elements = 'elements',
    states = 'states',
    twins = 'twins',
    widgets = 'widgets'
}

const SceneBehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    elements,
    builderMode,
    selectedBehavior,
    selectedElements,
    onBehaviorBackClick,
    onBehaviorSave,
    setSelectedElements,
    updateSelectedElements
}) => {
    const { t } = useTranslation();

    const { widgetFormInfo } = useContext(SceneBuilderContext);

    const [state, dispatch] = useReducer(
        BehaviorFormReducer,
        defaultBehaviorFormState
    );
    const valueRangeRef = useRef<IValueRangeBuilderHandle>(null);

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        !selectedBehavior
            ? { ...defaultBehavior, id: createGUID(false) }
            : selectedBehavior
    );

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

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
    }, []);

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
            setSelectedBehaviorPivotKey((prevValue) => {
                // if the current pivot is states, then store the data before we move
                if (prevValue === BehaviorPivot.states) {
                    storeStatusRanges();
                }
                return selectedPivot;
            });
        },
        [setSelectedBehaviorPivotKey, selectedBehaviorPivotKey]
    );

    const getStatusRangeValues = useCallback(() => {
        return valueRangeRef.current?.getValueRanges() || [];
    }, [valueRangeRef]);
    const storeStatusRanges = useCallback(() => {
        const ranges = getStatusRangeValues();
        setBehaviorToEdit(
            produce((draft) => {
                // Assuming only 1 status visual per behavior
                const stateVisual = getStatusFromBehavior(draft);
                // Edit flow
                if (stateVisual) {
                    stateVisual.valueRanges = ranges;
                }
            })
        );
    }, [getStatusRangeValues, setBehaviorToEdit]);

    const onSaveClick = useCallback(() => {
        // store the latest ranges from the status
        const rangeValues = getStatusRangeValues();
        const statusVisual = getStatusFromBehavior(behaviorToEdit);
        if (statusVisual) {
            statusVisual.valueRanges = rangeValues;
        }

        // behaviorToEdit.
        onBehaviorSave(behaviorToEdit, builderMode as BehaviorSaveMode);
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [
        behaviorToEdit,
        builderMode,
        getStatusRangeValues,
        onBehaviorBackClick,
        onBehaviorSave,
        setSelectedElements
    ]);
    const onCancelClick = useCallback(() => {
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [onBehaviorBackClick, setSelectedElements]);

    const { headerText, subHeaderText, iconName } = useMemo(
        () => getLeftPanelBuilderHeaderParams(widgetFormInfo, builderMode),
        [widgetFormInfo, builderMode]
    );
    // report out initial state
    useEffect(() => {
        onTabValidityChange('Root', { isValid: !!behaviorToEdit.displayName });
        const existing = getElementsFromBehavior(behaviorToEdit)?.elementIDs;
        onTabValidityChange('Elements', {
            isValid: existing?.length > 0
        });
    }, []);
    const isFormValid = checkValidityMap(state.validityMap);

    // console.log(
    //     `***Rendering, isValid: ${isFormValid}, Elements: ${
    //         state.validityMap?.get('Elements')?.isValid
    //     }, Status: ${state.validityMap?.get('Status')?.isValid}, Alerts: ${
    //         state.validityMap?.get('Alerts')?.isValid
    //     }, Widgets: ${state.validityMap?.get('Widgets')?.isValid}`
    // );
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const commonFormStyles = getPanelFormStyles(theme, 92);
    return (
        <BehaviorFormContext.Provider
            value={{
                behaviorToEdit,
                setBehaviorToEdit
            }}
        >
            <div className={commonFormStyles.root}>
                <LeftPanelBuilderHeader
                    headerText={headerText}
                    subHeaderText={subHeaderText}
                    iconName={iconName}
                />
                {widgetFormInfo ? (
                    <WidgetForm />
                ) : (
                    <>
                        <div className={commonFormStyles.content}>
                            <div className={commonFormStyles.header}>
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
                            </div>
                            <Separator />
                            <Pivot
                                selectedKey={selectedBehaviorPivotKey}
                                onLinkClick={onPivotItemClick}
                                className={commonFormStyles.pivot}
                                styles={panelFormPivotStyles}
                            >
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.elements')}
                                    itemKey={BehaviorPivot.elements}
                                    onRenderItemLink={(
                                        props,
                                        defaultRenderer
                                    ) =>
                                        _customTabRenderer(
                                            state.validityMap?.get('Elements')
                                                ?.isValid,
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
                                    />
                                </PivotItem>
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.statesTab')}
                                    itemKey={BehaviorPivot.states}
                                    onRenderItemLink={(
                                        props,
                                        defaultRenderer
                                    ) =>
                                        _customTabRenderer(
                                            state.validityMap?.get('Status')
                                                ?.isValid,
                                            props,
                                            defaultRenderer
                                        )
                                    }
                                >
                                    <StatesTab
                                        onValidityChange={onTabValidityChange}
                                        valueRangeRef={valueRangeRef}
                                    />
                                </PivotItem>
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.alertsTab')}
                                    itemKey={BehaviorPivot.alerts}
                                    onRenderItemLink={(
                                        props,
                                        defaultRenderer
                                    ) =>
                                        _customTabRenderer(
                                            state.validityMap?.get('Alerts')
                                                ?.isValid,
                                            props,
                                            defaultRenderer
                                        )
                                    }
                                >
                                    <AlertsTab />
                                </PivotItem>
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.widgets')}
                                    itemKey={BehaviorPivot.widgets}
                                    onRenderItemLink={(
                                        props,
                                        defaultRenderer
                                    ) =>
                                        _customTabRenderer(
                                            state.validityMap?.get('Widgets')
                                                ?.isValid,
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
            </div>
        </BehaviorFormContext.Provider>
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
