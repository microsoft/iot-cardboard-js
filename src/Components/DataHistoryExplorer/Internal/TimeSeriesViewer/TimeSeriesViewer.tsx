import React, { createContext } from 'react';
import {
    ERROR_IMAGE_HEIGHT,
    ITimeSeriesViewerContext,
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles,
    TimeSeriesViewerMode
} from './TimeSeriesViewer.types';
import { getStyles } from './TimeSeriesViewer.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Pivot,
    PivotItem,
    SpinnerSize,
    Spinner
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import GenericErrorImg from '../../../../Resources/Static/noResults.svg';
import SearchErrorImg from '../../../../Resources/Static/searchError.svg';
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';
import TimeSeriesChart from './Internal/TimeSeriesChart/TimeSeriesChart';
import TimeSeriesTable from './Internal/TimeSeriesTable/TimeSeriesTable';
import { TimeStampFormat } from './Internal/TimeSeriesTable/TimeSeriesTable.types';
import { sendDataHistoryExplorerUserTelemetry } from '../../../../Models/SharedUtils/DataHistoryUtils';
import { TelemetryEvents } from '../../../../Models/Constants/TelemetryConstants';
import DataHistoryErrorHandlingWrapper from '../../../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper';

export const TimeSeriesViewerContext = createContext<ITimeSeriesViewerContext>(
    null
);

const getClassNames = classNamesFunction<
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>();

const TimeSeriesViewer: React.FC<ITimeSeriesViewerProps> = (props) => {
    const {
        timeSeriesTwins = [],
        data = null,
        isLoading = false,
        viewerMode = TimeSeriesViewerMode.Chart,
        onViewerModeChange,
        chartOptions,
        error,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const handleOnChangePivot = (item: PivotItem) => {
        const telemetry =
            TelemetryEvents.Tools.DataHistoryExplorer.UserAction.ChangeView;
        sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
            {
                [telemetry.properties.view]: item.props.itemKey
            }
        ]);
        onViewerModeChange(item.props.itemKey as TimeSeriesViewerMode);
    };

    return (
        <div className={classNames.root}>
            {isLoading ? (
                <Spinner
                    styles={classNames.subComponentStyles.loadingSpinner}
                    size={SpinnerSize.large}
                    label={t('dataHistoryExplorer.viewer.messages.loading')}
                    ariaLive="assertive"
                    labelPosition="top"
                />
            ) : error ? (
                <DataHistoryErrorHandlingWrapper
                    error={error}
                    imgHeight={ERROR_IMAGE_HEIGHT}
                    messageWidth="wide"
                />
            ) : !(viewerMode === TimeSeriesViewerMode.Chart
                  ? data?.chart.length > 0
                  : data?.table.length > 0) ? (
                <IllustrationMessage
                    descriptionText={t(
                        `dataHistoryExplorer.viewer.messages.${
                            !(timeSeriesTwins?.length > 0)
                                ? 'noSeries'
                                : viewerMode === TimeSeriesViewerMode.Chart
                                ? 'noNumericData'
                                : 'noData'
                        }`
                    )}
                    type={'info'}
                    width={'wide'}
                    imageProps={{
                        src:
                            timeSeriesTwins?.length > 0
                                ? SearchErrorImg
                                : GenericErrorImg,
                        height: 172
                    }}
                    styles={{ container: { flexGrow: 1 } }}
                />
            ) : (
                <TimeSeriesViewerContext.Provider
                    value={{
                        timeSeriesTwins
                    }}
                >
                    <Pivot
                        overflowBehavior={'menu'}
                        styles={classNames.subComponentStyles.pivot}
                        onLinkClick={handleOnChangePivot}
                        selectedKey={viewerMode}
                    >
                        <PivotItem
                            headerText={t(
                                'dataHistoryExplorer.viewer.chart.title'
                            )}
                            itemKey={TimeSeriesViewerMode.Chart}
                        >
                            <TimeSeriesChart
                                data={data.chart}
                                chartOptions={chartOptions}
                            />
                        </PivotItem>
                        <PivotItem
                            headerText={t(
                                'dataHistoryExplorer.viewer.table.title'
                            )}
                            itemKey={TimeSeriesViewerMode.Table}
                        >
                            <TimeSeriesTable
                                data={data.table}
                                timeStampFormat={TimeStampFormat.date}
                            />
                        </PivotItem>
                    </Pivot>
                </TimeSeriesViewerContext.Provider>
            )}
        </div>
    );
};

export default styled<
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>(TimeSeriesViewer, getStyles);
