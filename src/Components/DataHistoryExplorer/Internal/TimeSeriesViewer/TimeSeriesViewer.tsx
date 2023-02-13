import React, { createContext, useMemo } from 'react';
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
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';
import TimeSeriesChart from './Internal/TimeSeriesChart/TimeSeriesChart';
import TimeSeriesTable from './Internal/TimeSeriesTable/TimeSeriesTable';
import { TimeStampFormat } from './Internal/TimeSeriesTable/TimeSeriesTable.types';
import DataHistoryErrorHandlingWrapper from '../../../DataHistoryErrorHandlingWrapper/DataHistoryErrorHandlingWrapper';
import TimeSeriesCommandBar from './Internal/TimeSeriesCommandBar/TimeSeriesCommandBar';

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
        viewerModeProps,
        onViewerModeChange,
        explorerChartOptions,
        onChartOptionsChange,
        error,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const CommandBarComponent = useMemo(() => {
        if (explorerChartOptions) {
            const {
                yAxisType,
                aggregationType,
                defaultQuickTimeSpanInMillis
            } = explorerChartOptions;
            return (
                <TimeSeriesCommandBar
                    defaultChartOptions={{
                        yAxisType,
                        aggregationType,
                        defaultQuickTimeSpanInMillis
                    }}
                    viewerModeProps={viewerModeProps}
                    onChartOptionsChange={onChartOptionsChange}
                    styles={classNames.subComponentStyles.commandBar}
                />
            );
        }
    }, [
        explorerChartOptions,
        viewerModeProps,
        onChartOptionsChange,
        classNames
    ]);

    const SpinnerComponent = useMemo(
        () => (
            <Spinner
                styles={classNames.subComponentStyles.loadingSpinner}
                size={SpinnerSize.large}
                label={t('dataHistoryExplorer.viewer.messages.loading')}
                ariaLive="assertive"
                labelPosition="top"
            />
        ),
        [classNames, t]
    );

    const hasNoSeries = useMemo(
        () =>
            !timeSeriesTwins ||
            timeSeriesTwins.length === 0 ||
            timeSeriesTwins.every((tS) => !(tS.twinId && tS.twinPropertyName)),
        [timeSeriesTwins]
    );

    return (
        <div className={classNames.root}>
            {error ? (
                <DataHistoryErrorHandlingWrapper
                    error={error}
                    imgHeight={ERROR_IMAGE_HEIGHT}
                    messageWidth="wide"
                />
            ) : hasNoSeries ? (
                <IllustrationMessage
                    descriptionText={t(
                        'dataHistoryExplorer.viewer.messages.noSeries'
                    )}
                    type={'info'}
                    width={'wide'}
                    imageProps={{
                        src: GenericErrorImg,
                        height: 172
                    }}
                    styles={classNames.subComponentStyles.noSeriesIllustration}
                />
            ) : (
                <TimeSeriesViewerContext.Provider
                    value={{
                        timeSeriesTwins
                    }}
                >
                    <Pivot
                        styles={classNames.subComponentStyles.pivot}
                        onLinkClick={(viewMode) =>
                            onViewerModeChange(
                                viewMode.props.itemKey as TimeSeriesViewerMode
                            )
                        }
                        selectedKey={viewerModeProps.viewerMode}
                    >
                        <PivotItem
                            headerText={t(
                                'dataHistoryExplorer.viewer.chart.title'
                            )}
                            itemKey={TimeSeriesViewerMode.Chart}
                        >
                            {CommandBarComponent}
                            {isLoading ? (
                                SpinnerComponent
                            ) : (
                                <TimeSeriesChart
                                    data={data.chart}
                                    explorerChartOptions={explorerChartOptions}
                                    styles={classNames.subComponentStyles.chart}
                                />
                            )}
                        </PivotItem>
                        <PivotItem
                            headerText={t(
                                'dataHistoryExplorer.viewer.table.title'
                            )}
                            itemKey={TimeSeriesViewerMode.Table}
                        >
                            {CommandBarComponent}
                            {isLoading ? (
                                SpinnerComponent
                            ) : (
                                <TimeSeriesTable
                                    data={data.table}
                                    timeStampFormat={TimeStampFormat.date}
                                    styles={classNames.subComponentStyles.table}
                                />
                            )}
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
