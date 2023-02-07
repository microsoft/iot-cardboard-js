import React, { useCallback, useEffect, useState } from 'react';
import {
    ITimeSeriesCommandBarOptionKeys,
    ITimeSeriesCommandBarOptions,
    ITimeSeriesCommandBarProps,
    ITimeSeriesCommandBarStyleProps,
    ITimeSeriesCommandBarStyles
} from './TimeSeriesCommandBar.types';
import { getStyles } from './TimeSeriesCommandBar.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    CommandBar,
    ICommandBarItemProps
} from '@fluentui/react';
import {
    IDataHistoryAggregationType,
    IDataHistoryChartYAxisType
} from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { QuickTimeSpanKey } from '../../../../../../Models/Constants/Enums';
import {
    AggregationTypeDropdownOptions,
    QuickTimeSpans
} from '../../../../../../Models/Constants/Constants';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import {
    getQuickTimeSpanKeyByValue,
    getQuickTimeSpanOptions,
    getYAxisTypeOptions,
    sendDataHistoryExplorerUserTelemetry
} from '../../../../../../Models/SharedUtils/DataHistoryUtils';
import {
    capitalizeFirstLetter,
    deepCopy
} from '../../../../../../Models/Services/Utils';
import { TelemetryEvents } from '../../../../../../Models/Constants/TelemetryConstants';
import { TimeSeriesViewerMode } from '../../TimeSeriesViewer.types';

const getClassNames = classNamesFunction<
    ITimeSeriesCommandBarStyleProps,
    ITimeSeriesCommandBarStyles
>();

const TimeSeriesCommandBar: React.FC<ITimeSeriesCommandBarProps> = (props) => {
    const {
        defaultChartOptions,
        onChartOptionsChange,
        viewerModeProps,
        styles
    } = props;

    // state
    const [
        chartOptions,
        setChartOptions
    ] = useState<ITimeSeriesCommandBarOptions>(
        deepCopy(defaultChartOptions) || {
            yAxisType: 'independent',
            defaultQuickTimeSpanInMillis:
                QuickTimeSpans[QuickTimeSpanKey.Last15Mins],
            aggregationType: 'avg'
        }
    );

    // hooks
    const { t } = useTranslation();

    // callbacks
    const handleChartOptionChange = useCallback(
        (
            chartOption: ITimeSeriesCommandBarOptionKeys,
            value:
                | IDataHistoryChartYAxisType
                | number
                | IDataHistoryAggregationType
        ) => {
            setChartOptions(
                produce((draft) => {
                    return { ...draft, [chartOption]: value };
                })
            );
        },
        []
    );

    // side effects
    useEffect(() => {
        if (onChartOptionsChange) {
            onChartOptionsChange(chartOptions);
        }
    }, [onChartOptionsChange, chartOptions]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const quickTimeItem: ICommandBarItemProps = {
        key: 'QuickTime',
        text: getQuickTimeSpanKeyByValue(
            chartOptions.defaultQuickTimeSpanInMillis
        ),
        iconProps: { iconName: 'DateTime' },
        subMenuProps: {
            items: getQuickTimeSpanOptions(t).map((o) => ({
                ...o,
                onClick: () =>
                    handleChartOptionChange(
                        'defaultQuickTimeSpanInMillis',
                        o.data as number
                    )
            }))
        }
    };

    const items: ICommandBarItemProps[] =
        viewerModeProps.viewerMode === TimeSeriesViewerMode.Chart
            ? [
                  quickTimeItem,
                  {
                      key: 'YAxisType',
                      text: capitalizeFirstLetter(chartOptions.yAxisType),
                      iconProps: { iconName: 'StackedLineChart' },
                      subMenuProps: {
                          items: getYAxisTypeOptions(t).map((o) => ({
                              ...o,
                              onClick: () =>
                                  handleChartOptionChange(
                                      'yAxisType',
                                      o.key as IDataHistoryChartYAxisType
                                  )
                          }))
                      }
                  },
                  {
                      key: 'AggregationType',
                      text: capitalizeFirstLetter(chartOptions.aggregationType),
                      iconProps: { iconName: 'AssessmentGroupTemplate' },
                      subMenuProps: {
                          items: AggregationTypeDropdownOptions.map((o) => ({
                              key: o.key,
                              text: capitalizeFirstLetter(o.text),
                              onClick: () =>
                                  handleChartOptionChange(
                                      'aggregationType',
                                      o.key as IDataHistoryAggregationType
                                  )
                          }))
                      }
                  }
              ]
            : [quickTimeItem];

    const farItems: ICommandBarItemProps[] =
        viewerModeProps.viewerMode === TimeSeriesViewerMode.Chart
            ? [
                  {
                      key: 'refresh',
                      text: t('dataHistoryExplorer.viewer.commandBar.refresh'),
                      iconOnly: true,
                      iconProps: { iconName: 'Refresh' },
                      onClick: viewerModeProps.onRefreshClick
                  },
                  {
                      key: 'share',
                      text: t('widgets.dataHistory.openQuery'),
                      iconOnly: true,
                      iconProps: { iconName: 'OpenInNewWindow' },
                      onClick: () => {
                          window.open(viewerModeProps.deeplink, '_blank');
                          const telemetry =
                              TelemetryEvents.Tools.DataHistoryExplorer
                                  .UserAction.OpenSeriesInAdx;
                          sendDataHistoryExplorerUserTelemetry(
                              telemetry.eventName
                          );
                      }
                  }
              ]
            : [
                  {
                      key: 'refresh',
                      text: t('dataHistoryExplorer.viewer.commandBar.refresh'),
                      iconOnly: true,
                      iconProps: { iconName: 'Refresh' },
                      onClick: viewerModeProps.onRefreshClick
                  },
                  {
                      key: 'download',
                      text: t('dataHistoryExplorer.viewer.commandBar.download'),
                      iconOnly: true,
                      iconProps: { iconName: 'Download' },
                      onClick: viewerModeProps.onDownloadClick
                  }
              ];

    return (
        <div className={classNames.root}>
            <CommandBar
                items={items}
                farItems={farItems}
                styles={classNames.subComponentStyles.commandBar}
            />
        </div>
    );
};

export default styled<
    ITimeSeriesCommandBarProps,
    ITimeSeriesCommandBarStyleProps,
    ITimeSeriesCommandBarStyles
>(TimeSeriesCommandBar, getStyles);
