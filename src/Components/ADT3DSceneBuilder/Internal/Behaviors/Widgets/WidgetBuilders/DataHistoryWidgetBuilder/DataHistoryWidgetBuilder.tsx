import {
    ActionButton,
    ChoiceGroup,
    classNamesFunction,
    Dropdown,
    IDropdownProps,
    ITextFieldProps,
    Label,
    Link,
    Stack,
    styled,
    TextField,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    AggregationTypeDropdownOptions,
    DOCUMENTATION_LINKS
} from '../../../../../../../Models/Constants/Constants';
import { isValidADXClusterUrl } from '../../../../../../../Models/Services/Utils';
import {
    getQuickTimeSpanKeyByValue,
    getYAxisTypeOptions
} from '../../../../../../../Models/SharedUtils/DataHistoryUtils';
import {
    IADXTimeSeriesConnection,
    IDataHistoryAggregationType,
    IDataHistoryBasicTimeSeries,
    IDataHistoryChartYAxisType
} from '../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ADT3DScenePageContext } from '../../../../../../../Pages/ADT3DScenePage/ADT3DScenePage';
import { ADXConnectionInformationLoadingState } from '../../../../../../../Pages/ADT3DScenePage/ADT3DScenePage.types';
import QuickTimesDropdown from '../../../../../../QuickTimesDropdown/QuickTimesDropdown';
import TooltipCallout from '../../../../../../TooltipCallout/TooltipCallout';
import { getActionButtonStyles } from '../../../../Shared/LeftPanel.styles';
import { getWidgetFormStyles } from '../../WidgetForm/WidgetForm.styles';
import { getStyles } from './DataHistoryWidgetBuilder.styles';
import {
    ChartOptionKeys,
    IDataHistoryWidgetBuilderProps,
    MAX_NUMBER_OF_TIME_SERIES,
    SERIES_LIST_ITEM_ID_PREFIX,
    IDataHistoryWidgetBuilderStyleProps,
    IDataHistoryWidgetBuilderStyles
} from './DataHistoryWidgetBuilder.types';
import TimeSeriesFormCallout from './Internal/TimeSeriesFormCallout';
import TimeSeriesList from './Internal/TimeSeriesList';

const ROOT_LOC = 'widgets.dataHistory.form';
const LOC_KEYS = {
    connectionLoadingText: `${ROOT_LOC}.connectionLoadingText`,
    noConnectionInformationText: `${ROOT_LOC}.noConnectionInformationText`,
    connectionStringInformation: `${ROOT_LOC}.connectionStringInformation`,
    quickTimeRangeLabel: `${ROOT_LOC}.chartOptions.quickTimeRange.label`,
    quickTimeRangeInformation: `${ROOT_LOC}.chartOptions.quickTimeRange.information`,
    aggregationMethodLabel: `${ROOT_LOC}.chartOptions.aggregationMethod.label`,
    aggregationMethodInformation: `${ROOT_LOC}.chartOptions.aggregationMethod.information`,
    connectionStringPlaceholder: `${ROOT_LOC}.connectionStringPlaceholder`,
    connectionStringTitle: `${ROOT_LOC}.connectionStringTitle`,
    connectionStringInvalid: `${ROOT_LOC}.connectionStringInvalid`,
    displayNamePlaceholder: `${ROOT_LOC}.displayNamePlaceholder`,
    addTimeSeriesLabel: `${ROOT_LOC}.timeSeries.add`,
    yAxisTypeLabel: `${ROOT_LOC}.chartOptions.yAxisType.label`,
    yAxisTypeDescription: `${ROOT_LOC}.chartOptions.yAxisType.description`
};

const getClassNames = classNamesFunction<
    IDataHistoryWidgetBuilderStyleProps,
    IDataHistoryWidgetBuilderStyles
>();

const DataHistoryWidgetBuilder: React.FC<IDataHistoryWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid,
    styles
}) => {
    const [selectedTimeSeriesId, setSelectedTimeSeriesId] = useState(null);
    const addTimeSeriesCalloutId = useId('add-time-series-callout');
    const yAxisLabelId = useId('y-axis-label');
    const [
        isTimeSeriesFormCalloutVisible,
        {
            setTrue: setIsAddTimeSeriesCalloutVisibleTrue,
            setFalse: setIsAddTimeSeriesCalloutVisibleFalse
        }
    ] = useBoolean(false);

    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme
    });
    const sharedClassNames = getWidgetFormStyles(theme);
    const sharedActionButtonStyles = getActionButtonStyles(theme);
    const { t } = useTranslation();

    const {
        state: { adxConnectionInformation }
    } = useContext(ADT3DScenePageContext);

    useEffect(() => {
        const {
            displayName,
            connection,
            timeSeries
        } = formData.widgetConfiguration;
        if (displayName && connection && timeSeries.length) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData]);

    useEffect(() => {
        if (
            adxConnectionInformation.loadingState ===
            ADXConnectionInformationLoadingState.EXIST
        ) {
            const connection = adxConnectionInformation.connection;
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.connection = formData
                        .widgetConfiguration.connection ?? {
                        adxClusterUrl: connection.kustoClusterUrl,
                        adxDatabaseName: connection.kustoDatabaseName,
                        adxTableName: connection.kustoTableName
                    };
                })
            );
        }
    }, [adxConnectionInformation]);

    const connectionString = formData.widgetConfiguration.connection
        ? generateConnectionString(formData.widgetConfiguration.connection) ||
          t(LOC_KEYS.connectionStringInvalid)
        : adxConnectionInformation.loadingState ===
          ADXConnectionInformationLoadingState.LOADING
        ? t(LOC_KEYS.connectionLoadingText)
        : t(LOC_KEYS.noConnectionInformationText);

    const selectedSeries = selectedTimeSeriesId
        ? formData.widgetConfiguration.timeSeries.find(
              (ts) => ts.id === selectedTimeSeriesId
          )
        : null;

    const onDisplayNameChange = useCallback(
        (_event, value: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.displayName = value;
                })
            );
        },
        [updateWidgetData, formData]
    );

    const handleTimeSeriesFormDismiss = useCallback(() => {
        setIsAddTimeSeriesCalloutVisibleFalse();
        setSelectedTimeSeriesId(null);
    }, []);

    const handleTimeSeriesFormPrimaryAction = useCallback(
        (series: IDataHistoryBasicTimeSeries) => {
            selectedTimeSeriesId
                ? updateWidgetData(
                      produce(formData, (draft) => {
                          const selectedIdx = draft.widgetConfiguration.timeSeries.findIndex(
                              (ts) => ts.id === selectedTimeSeriesId
                          );
                          draft.widgetConfiguration.timeSeries[
                              selectedIdx
                          ] = series;
                      })
                  )
                : updateWidgetData(
                      produce(formData, (draft) => {
                          draft.widgetConfiguration.timeSeries.push(series);
                      })
                  );
            handleTimeSeriesFormDismiss();
        },
        [
            updateWidgetData,
            handleTimeSeriesFormDismiss,
            formData,
            selectedTimeSeriesId
        ]
    );

    const handleTimeSeriesEditClick = useCallback((id: string) => {
        setSelectedTimeSeriesId(id);
        setIsAddTimeSeriesCalloutVisibleTrue();
    }, []);

    const handleTimeSeriesRemoveClick = useCallback(
        (id: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.timeSeries = draft.widgetConfiguration.timeSeries.filter(
                        (ts) => ts.id !== id
                    );
                })
            );
        },
        [formData]
    );

    const handleOnRenderConnectionStringLabel = useCallback(
        (
            props?: ITextFieldProps,
            defaultRender?: (props?: ITextFieldProps) => JSX.Element | null
        ): JSX.Element => {
            return (
                <Stack
                    horizontal
                    verticalAlign={'center'}
                    className={classNames.stackWithTooltipAndRequired}
                >
                    {defaultRender(props)}
                    <TooltipCallout
                        content={{
                            buttonAriaLabel: t(
                                LOC_KEYS.connectionStringInformation
                            ),
                            calloutContent: (
                                <>
                                    {t(LOC_KEYS.connectionStringInformation)}{' '}
                                    <Link
                                        target="_blank"
                                        href={DOCUMENTATION_LINKS.dataHistory}
                                    >
                                        {t('learnMore')}
                                    </Link>
                                </>
                            )
                        }}
                    />
                </Stack>
            );
        },
        [t, classNames]
    );

    const handleOnRenderTimeSpanLabel = useCallback(
        (
            props?: IDropdownProps,
            defaultRender?: (props?: IDropdownProps) => JSX.Element | null
        ): JSX.Element => {
            return (
                <Stack horizontal verticalAlign={'center'}>
                    {defaultRender(props)}
                    <TooltipCallout
                        content={{
                            buttonAriaLabel: t(
                                LOC_KEYS.quickTimeRangeInformation
                            ),
                            calloutContent: t(
                                LOC_KEYS.quickTimeRangeInformation
                            )
                        }}
                    />
                </Stack>
            );
        },
        [t, classNames]
    );

    const handleOnRenderAggregationMethodLabel = useCallback(
        (
            props?: IDropdownProps,
            defaultRender?: (props?: IDropdownProps) => JSX.Element | null
        ): JSX.Element => {
            return (
                <Stack horizontal verticalAlign={'center'}>
                    {defaultRender(props)}
                    <TooltipCallout
                        content={{
                            buttonAriaLabel: t(
                                LOC_KEYS.aggregationMethodInformation
                            ),
                            calloutContent: t(
                                LOC_KEYS.aggregationMethodInformation
                            )
                        }}
                    />
                </Stack>
            );
        },
        [t, classNames]
    );

    const onChartOptionChange = useCallback(
        (
            optionKey: ChartOptionKeys,
            value:
                | IDataHistoryChartYAxisType
                | IDataHistoryAggregationType
                | number
        ) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.chartOptions[
                        optionKey as string
                    ] = value;
                })
            );
        },
        [updateWidgetData, formData]
    );

    return (
        <div className={sharedClassNames.widgetFormContents}>
            <Stack tokens={{ childrenGap: 8 }}>
                <TextField
                    required
                    placeholder={t(LOC_KEYS.connectionStringPlaceholder)}
                    label={t(LOC_KEYS.connectionStringTitle)}
                    value={connectionString}
                    readOnly
                    disabled
                    title={connectionString}
                    onRenderLabel={handleOnRenderConnectionStringLabel}
                />
                <TextField
                    required
                    placeholder={t(LOC_KEYS.displayNamePlaceholder)}
                    label={t('displayName')}
                    value={formData.widgetConfiguration.displayName}
                    onChange={onDisplayNameChange}
                />
                <TimeSeriesList
                    series={formData.widgetConfiguration.timeSeries}
                    onSeriesEditClick={handleTimeSeriesEditClick}
                    onSeriesRemoveClick={handleTimeSeriesRemoveClick}
                />
                {formData.widgetConfiguration.timeSeries.length <
                    MAX_NUMBER_OF_TIME_SERIES && (
                    <ActionButton
                        id={addTimeSeriesCalloutId}
                        styles={sharedActionButtonStyles}
                        text={t(LOC_KEYS.addTimeSeriesLabel)}
                        onClick={setIsAddTimeSeriesCalloutVisibleTrue}
                    />
                )}
                <Label className={sharedClassNames.label} id={yAxisLabelId}>
                    <Stack horizontal verticalAlign="center">
                        <span>{t(LOC_KEYS.yAxisTypeLabel)}</span>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    LOC_KEYS.yAxisTypeDescription
                                ),
                                calloutContent: t(LOC_KEYS.yAxisTypeDescription)
                            }}
                        />
                    </Stack>
                </Label>
                <ChoiceGroup
                    className={sharedClassNames.choiceGroup}
                    selectedKey={
                        formData.widgetConfiguration.chartOptions.yAxisType
                    }
                    options={getYAxisTypeOptions(t)}
                    onChange={(_env, option) =>
                        onChartOptionChange(
                            'yAxisType',
                            option.key as IDataHistoryChartYAxisType
                        )
                    }
                    ariaLabelledBy={yAxisLabelId}
                />
                <QuickTimesDropdown
                    label={t(LOC_KEYS.quickTimeRangeLabel)}
                    defaultSelectedKey={getQuickTimeSpanKeyByValue(
                        formData.widgetConfiguration.chartOptions
                            .defaultQuickTimeSpanInMillis
                    )}
                    onChange={(_env, option) =>
                        onChartOptionChange(
                            'defaultQuickTimeSpanInMillis',
                            option.data
                        )
                    }
                    onRenderLabel={handleOnRenderTimeSpanLabel}
                />
                <Dropdown
                    label={t(LOC_KEYS.aggregationMethodLabel)}
                    selectedKey={
                        formData.widgetConfiguration.chartOptions
                            .aggregationType
                    }
                    onChange={(_env, option) =>
                        onChartOptionChange(
                            'aggregationType',
                            option.key as IDataHistoryAggregationType
                        )
                    }
                    options={AggregationTypeDropdownOptions}
                    onRenderLabel={handleOnRenderAggregationMethodLabel}
                />
            </Stack>
            {isTimeSeriesFormCalloutVisible && (
                <TimeSeriesFormCallout
                    calloutTarget={
                        selectedSeries
                            ? SERIES_LIST_ITEM_ID_PREFIX + selectedTimeSeriesId
                            : addTimeSeriesCalloutId
                    }
                    series={selectedSeries}
                    onDismiss={handleTimeSeriesFormDismiss}
                    onPrimaryActionClick={handleTimeSeriesFormPrimaryAction}
                />
            )}
        </div>
    );
};

const generateConnectionString = (
    connection: IADXTimeSeriesConnection
): string | null => {
    if (
        connection?.adxClusterUrl &&
        connection?.adxDatabaseName &&
        connection?.adxTableName
    ) {
        try {
            if (isValidADXClusterUrl(connection?.adxClusterUrl)) {
                return `kustoClusterUrl=${connection.adxClusterUrl};kustoDatabaseName=${connection.adxDatabaseName};kustoTableName=${connection.adxTableName}`;
            }
        } catch (error) {
            return null;
        }
    } else {
        return null;
    }
};

export default styled<
    IDataHistoryWidgetBuilderProps,
    IDataHistoryWidgetBuilderStyleProps,
    IDataHistoryWidgetBuilderStyles
>(DataHistoryWidgetBuilder, getStyles);
