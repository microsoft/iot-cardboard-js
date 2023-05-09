import React, { useCallback, useEffect, useReducer } from 'react';
import {
    DataSourceStepActionType,
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
} from './DataSourceStep.types';
import { getStyles } from './DataSourceStep.styles';
import { classNamesFunction, Stack, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { SourceType } from '../../../DataPusher/DataPusher.types';
import { useTranslation } from 'react-i18next';
import {
    DataSourceStepReducer,
    defaultDataSourceStepState
} from './DataSourceStep.state';
import { useWizardNavigationContext } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    WizardNavigationContextActionType,
    WizardStepNumber
} from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { IADXConnection, IPIDDocument } from '../../../../Models/Interfaces';
import { cookSource } from '../../../../Services/DataPusherUtils';
import CookSource from '../../../CookSource/CookSource';
import { ICookSource } from '../../../../Models/Types';
import { useWizardDataDispatchContext } from '../../../../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../../../../Contexts/WizardDataContext/WizardDataContext.types';
import { ModifyPivotKeys } from '../ModifyStep/ModifyStep.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataSourceStep', debugLogging);

const getClassNames = classNamesFunction<
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>();

const DataSourceStep: React.FC<IDataSourceStepProps> = (props) => {
    const { styles } = props;
    // state
    const [state, dispatch] = useReducer(
        DataSourceStepReducer,
        defaultDataSourceStepState
    );

    // contexts
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();
    const { wizardDataDispatch } = useWizardDataDispatchContext();

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    // callbacks
    const handleSourceTypeChange = useCallback((sourceType: SourceType) => {
        dispatch({
            type: DataSourceStepActionType.SET_SELECTED_SOURCE_TYPE,
            sourceType
        });
    }, []);
    const handleSourceChange = useCallback((source: ICookSource) => {
        dispatch({
            type: DataSourceStepActionType.SET_SELECTED_SOURCE,
            source
        });
    }, []);

    const handleNextClick = useCallback(() => {
        const cookedSource = cookSource(
            state.selectedSourceType,
            state.selectedSource
        );
        wizardDataDispatch({
            type: WizardDataContextActionType.ADD_COOKED_SOURCE_ASSETS,
            payload: {
                data: cookedSource
            }
        });
        // Navigation only, since all data is updated through other handlers
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.NAVIGATE_TO,
            payload: {
                stepNumber: WizardStepNumber.Modify,
                initialProps: {
                    showDiagram:
                        state.selectedSourceType === SourceType.Diagram,
                    selectedPivotKey: ModifyPivotKeys.Diagram
                }
            }
        });
    }, [
        state.selectedSource,
        state.selectedSourceType,
        wizardDataDispatch,
        wizardNavigationContextDispatch
    ]);

    // side-effects
    useEffect(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_PRIMARY_ACTION,
            payload: {
                buttonProps: {
                    onClick: handleNextClick,
                    disabled: true
                }
            }
        });
    }, [handleNextClick, wizardNavigationContextDispatch]);

    useEffect(() => {
        wizardNavigationContextDispatch({
            type:
                WizardNavigationContextActionType.SET_PRIMARY_ACTION_IS_DISABLED,
            payload: {
                isDisabled:
                    state.selectedSourceType === SourceType.Timeseries
                        ? !(state.selectedSource as IADXConnection).twinIdColumn
                        : !(state.selectedSource as IPIDDocument).pidUrl
            }
        });
    }, [
        state.selectedSource,
        state.selectedSourceType,
        wizardNavigationContextDispatch
    ]);

    // styles
    const classNames = getClassNames(styles, {
        theme
    });

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <p className={classNames.informationText}>
                {t('legionApp.dataSourceStep.infoText')}
            </p>
            <Stack
                tokens={{ childrenGap: 8 }}
                styles={classNames.subComponentStyles.stack}
            >
                <CookSource
                    onSourceTypeChange={handleSourceTypeChange}
                    onSourceChange={handleSourceChange}
                />
            </Stack>
        </div>
    );
};

export default styled<
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>(DataSourceStep, getStyles);
