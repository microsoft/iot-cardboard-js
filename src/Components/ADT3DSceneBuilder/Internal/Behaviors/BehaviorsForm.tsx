import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
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
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { Pivot } from '@fluentui/react/lib/components/Pivot/Pivot';
import { PivotItem } from '@fluentui/react/lib/components/Pivot/PivotItem';
import { TextField, DefaultButton, Separator, useTheme } from '@fluentui/react';
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
import { BehaviorFormActionType, IValidityState } from './BehaviorForm.types';

export const BehaviorFormContext = React.createContext<IBehaviorFormContext>(
    null
);

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

    // need a local copy to intercept and update form validity
    const localUpdateSelectedElements = useCallback(
        (element: ITwinToObjectMapping, isSelected: boolean) => {
            updateSelectedElements(element, isSelected);

            const isValid =
                behaviorToEdit.datasources.filter(
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                )?.[0]?.elementIDs?.length > 0;
            dispatch({
                type: BehaviorFormActionType.SET_TAB_STATE,
                payload: {
                    tabName: 'Elements',
                    isValid: isValid
                }
            });
        },
        [updateSelectedElements]
    );

    const onSaveClick = useCallback(() => {
        onBehaviorSave(behaviorToEdit, builderMode as BehaviorSaveMode);
        onBehaviorBackClick();
        setSelectedElements([]);
    }, [
        behaviorToEdit,
        builderMode,
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

    const isFormValid = checkValidityMap(state.validityMap);

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
                                onLinkClick={(item) =>
                                    setSelectedBehaviorPivotKey(
                                        item.props.itemKey as BehaviorPivot
                                    )
                                }
                                className={commonFormStyles.pivot}
                                styles={panelFormPivotStyles}
                            >
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.elements')}
                                    itemKey={BehaviorPivot.elements}
                                >
                                    <SceneElements
                                        elements={elements}
                                        selectedElements={selectedElements}
                                        updateSelectedElements={
                                            localUpdateSelectedElements
                                        }
                                        isEditBehavior={true}
                                        hideSearch={true}
                                    />
                                </PivotItem>
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.statesTab')}
                                    itemKey={BehaviorPivot.states}
                                >
                                    <StatesTab />
                                </PivotItem>
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.alertsTab')}
                                    itemKey={BehaviorPivot.alerts}
                                >
                                    <AlertsTab />
                                </PivotItem>
                                <PivotItem
                                    className={
                                        commonPanelStyles.formTabContents
                                    }
                                    headerText={t('3dSceneBuilder.widgets')}
                                    itemKey={BehaviorPivot.widgets}
                                >
                                    <WidgetsTab />
                                </PivotItem>
                            </Pivot>
                        </div>

                        <PanelFooter>
                            <PrimaryButton
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

function checkValidityMap(validityMap: Map<string, IValidityState>): boolean {
    let isValid = true;
    validityMap.forEach((x) => {
        isValid = isValid && x.isValid;
    });
    return isValid;
}

export default SceneBehaviorsForm;
