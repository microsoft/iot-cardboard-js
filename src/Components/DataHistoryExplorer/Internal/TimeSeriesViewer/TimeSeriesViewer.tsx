import React, { createContext, useState } from 'react';
import {
    ITimeSeriesViewerContext,
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles,
    ViewerPivot
} from './TimeSeriesViewer.types';
import { getStyles } from './TimeSeriesViewer.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Pivot,
    PivotItem
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import GenericErrorImg from '../../../../Resources/Static/noResults.svg';
import IllustrationMessage from '../../../IllustrationMessage/IllustrationMessage';
import TimeSeriesChart from './Internal/TimeSeriesChart/TimeSeriesChart';
import TimeSeriesTable from './Internal/TimeSeriesTable/TimeSeriesTable';
import { TimeStampFormat } from './Internal/TimeSeriesTable/TimeSeriesTable.types';
import { IDataHistoryChartOptions } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export const TimeSeriesViewerContext = createContext<ITimeSeriesViewerContext>(
    null
);

const getClassNames = classNamesFunction<
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>();

const TimeSeriesViewer: React.FC<ITimeSeriesViewerProps> = (props) => {
    const { timeSeriesTwinList, styles } = props;

    //state
    const [chartOptions, setChartOptions] = useState<IDataHistoryChartOptions>(
        null
    );

    // hooks
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            {!timeSeriesTwinList || timeSeriesTwinList.length === 0 ? (
                <IllustrationMessage
                    descriptionText={t(
                        'dataHistoryExplorer.viewer.noSeriesDescription'
                    )}
                    type={'info'}
                    width={'compact'}
                    imageProps={{
                        src: GenericErrorImg,
                        height: 172
                    }}
                    styles={{ container: { flexGrow: 1 } }}
                />
            ) : (
                <TimeSeriesViewerContext.Provider
                    value={{
                        timeSeriesTwinList
                    }}
                >
                    <Pivot
                        overflowBehavior={'menu'}
                        styles={classNames.subComponentStyles.pivot}
                    >
                        <PivotItem
                            headerText={t('dataHistoryExplorer.viewer.chart')}
                            itemKey={ViewerPivot.Chart}
                        >
                            <TimeSeriesChart
                                defaultOptions={chartOptions}
                                onChartOptionsChange={setChartOptions}
                            />
                        </PivotItem>
                        <PivotItem
                            headerText={t(
                                'dataHistoryExplorer.viewer.table.title'
                            )}
                            itemKey={ViewerPivot.Table}
                        >
                            <TimeSeriesTable
                                adxTimeSeries={[]}
                                quickTimeSpanInMillis={
                                    chartOptions?.defaultQuickTimeSpanInMillis
                                }
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
