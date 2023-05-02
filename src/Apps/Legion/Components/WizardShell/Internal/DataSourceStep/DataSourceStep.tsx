import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
    DataSourceStepActionType,
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
} from './DataSourceStep.types';
import { getStyles } from './DataSourceStep.styles';
import {
    classNamesFunction,
    DefaultButton,
    Stack,
    styled
} from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { SourceType } from '../../../DataPusher/DataPusher.types';
import { useTranslation } from 'react-i18next';
import {
    dateSourceStepReducer,
    defaultDataSourceStepState
} from './DataSourceStep.state';
import { useWizardNavigationContext } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import {
    WizardNavigationContextActionType,
    WizardStepNumber
} from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useWizardDataManagementContext } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import {
    IADXConnection,
    IAppData,
    IPIDDocument
} from '../../../../Models/Interfaces';
import { WizardDataManagementContextActionType } from '../../../../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';
import { cookSource } from '../../../../Services/DataPusherUtils';
import CookSource from '../../../CookSource/CookSource';
import { ICookSource } from '../../../../Models/Types';

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
        dateSourceStepReducer,
        defaultDataSourceStepState
    );

    const [appData, setAppData] = useState<IAppData>(null);

    // contexts
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();
    const {
        wizardDataManagementContextDispatch
    } = useWizardDataManagementContext();

    // hooks
    const { t } = useTranslation();
    const theme = useExtendedTheme();

    // callbacks
    const handleSourceTypeChange = useCallback(
        (sourceType: SourceType) =>
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE_TYPE,
                sourceType
            }),
        []
    );
    const handleSourceChange = useCallback(
        (source: ICookSource) =>
            dispatch({
                type: DataSourceStepActionType.SET_SELECTED_SOURCE,
                source
            }),
        []
    );
    const handleCookButtonClick = useCallback(() => {
        const cookAssets = cookSource(
            state.selectedSourceType,
            state.selectedSource
        );
        setAppData(cookAssets);
        dispatch({
            type: DataSourceStepActionType.SET_COOK_ASSETS,
            cookAssets
        });
    }, [state.selectedSource, state.selectedSourceType]);

    const handleNextClick = useCallback(() => {
        // Temporary: commit of data into global store in this part until this component's
        // reducer gets merged into global data context
        wizardDataManagementContextDispatch({
            type: WizardDataManagementContextActionType.SET_SOURCE_INFORMATION,
            payload: {
                data: [state.selectedSource]
            }
        });

        wizardDataManagementContextDispatch({
            type: WizardDataManagementContextActionType.SET_INITIAL_ASSETS,
            payload: {
                data: state.cookAssets
            }
        });
        // End of temporary section

        // Navigation only, since all data is updated through other handlers
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.NAVIGATE_TO,
            payload: {
                stepNumber: WizardStepNumber.Modify
            }
        });
    }, [
        state.cookAssets,
        state.selectedSource,
        wizardDataManagementContextDispatch,
        wizardNavigationContextDispatch
    ]);

    // side-effects
    useEffect(() => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.SET_PRIMARY_ACTION,
            payload: {
                buttonProps: {
                    onClick: handleNextClick,
                    disabled: !appData
                }
            }
        });
    }, [appData, handleNextClick, wizardNavigationContextDispatch]);

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
                <DefaultButton
                    text={t('legionApp.dataPusher.actions.cook')}
                    disabled={
                        state.selectedSourceType === SourceType.Timeseries
                            ? !(state.selectedSource as IADXConnection)
                                  .twinIdColumn
                            : !(state.selectedSource as IPIDDocument).pidUrl
                    }
                    onClick={handleCookButtonClick}
                />
            </Stack>
            {appData && (
                <div className={classNames.informationText}>
                    <p>{`${
                        appData.models.length
                    } possible models found with properties ${appData.models
                        .map((model) => {
                            return `[${model.propertyIds
                                .map(
                                    (propId) =>
                                        appData.properties.find(
                                            (p) => p.id === propId
                                        ).name
                                )
                                .join(',')}]`;
                        })
                        .join(',')}`}</p>
                    <p>{`${
                        appData.properties.length
                    } unique properties found: ${appData.properties
                        .map((p) => p.name)
                        .join(',')}`}</p>
                    <p>{`${
                        appData.twins.length
                    } unique twins found: ${appData.twins
                        .map((t) => t.id)
                        .join(',')}`}</p>
                </div>
            )}
        </div>
    );
};

export default styled<
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>(DataSourceStep, getStyles);
