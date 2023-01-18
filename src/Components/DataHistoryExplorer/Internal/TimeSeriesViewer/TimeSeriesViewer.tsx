import React from 'react';
import {
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
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
import TimeSeriesTable from './Internal/Table/TimeSeriesTable';
import { TimeStampFormat } from './Internal/Table/TimeSeriesTable.types';

enum ViewerPivot {
    Chart = 'Chart',
    Table = 'Table'
}

const getClassNames = classNamesFunction<
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>();

const TimeSeriesViewer: React.FC<ITimeSeriesViewerProps> = (props) => {
    const { timeSeriesTwinList, styles } = props;

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
                <Pivot
                    overflowBehavior={'menu'}
                    styles={classNames.subComponentStyles.pivot}
                >
                    <PivotItem
                        headerText={t('dataHistoryExplorer.viewer.chart')}
                        itemKey={ViewerPivot.Chart}
                    >
                        <TimeSeriesChart
                            timeSeriesTwinList={timeSeriesTwinList}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('dataHistoryExplorer.viewer.table')}
                        itemKey={ViewerPivot.Table}
                    >
                        <TimeSeriesTable
                            adxTimeSeries={[]}
                            timeStampFormat={TimeStampFormat.date}
                        />
                    </PivotItem>
                </Pivot>
            )}
        </div>
    );
};

export default styled<
    ITimeSeriesViewerProps,
    ITimeSeriesViewerStyleProps,
    ITimeSeriesViewerStyles
>(TimeSeriesViewer, getStyles);
