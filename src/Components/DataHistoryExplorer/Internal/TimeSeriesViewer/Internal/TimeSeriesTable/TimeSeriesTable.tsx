import React, { useCallback, useContext, useMemo } from 'react';
import {
    ITimeSeriesTableProps,
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles,
    TimeSeriesTableRow,
    TimeStampFormat
} from './TimeSeriesTable.types';
import { getStyles } from './TimeSeriesTable.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    ConstrainMode,
    Icon,
    ScrollablePane,
    IDetailsHeaderProps,
    IRenderFunction,
    Sticky,
    StickyPositionType
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { TimeSeriesViewerContext } from '../../TimeSeriesViewer';
import { DTDLPropertyIconographyMap } from '../../../../../../Models/Constants/Constants';
import IllustrationMessage from '../../../../../IllustrationMessage/IllustrationMessage';
import SearchErrorImg from '../../../../../../Resources/Static/searchError.svg';

const getClassNames = classNamesFunction<
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>();

const TimeSeriesTable: React.FC<ITimeSeriesTableProps> = (props) => {
    const { data, timeStampFormat = TimeStampFormat.iso, styles } = props;

    // contexts
    const { timeSeriesTwins } = useContext(TimeSeriesViewerContext);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // callbacks
    const getFormattedTimeStamp = useCallback(
        (timeStamp: number | string) => {
            switch (timeStampFormat) {
                case TimeStampFormat.date:
                    return new Date(timeStamp).toLocaleString();
                case TimeStampFormat.iso:
                    return new Date(timeStamp).toISOString();
                default:
                    return timeStamp;
            }
        },
        [timeStampFormat]
    );
    const onRenderDetailsHeader = (
        detailsHeaderProps: IDetailsHeaderProps,
        defaultRender: IRenderFunction<IDetailsHeaderProps>
    ) => (
        <Sticky stickyPosition={StickyPositionType.Header}>
            {defaultRender({
                ...detailsHeaderProps,
                styles: { root: { paddingTop: 0 } }
            })}
        </Sticky>
    );

    // hooks
    const { t } = useTranslation();
    const getColumns: Array<IColumn> = useMemo(
        () => [
            {
                key: 'timestamp',
                name: t('dataHistoryExplorer.viewer.table.columns.timestamp'),
                minWidth: 100,
                maxWidth: 160,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) =>
                    getFormattedTimeStamp(item.timestamp)
            },
            {
                key: 'seriesLabel',
                name: t('dataHistoryExplorer.viewer.table.columns.series'),
                minWidth: 100,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => {
                    const timeSeriesTwin = timeSeriesTwins.find(
                        (seriesTwin) => seriesTwin.seriesId === item?.seriesId
                    );
                    return (
                        <div
                            className={
                                classNames.subComponentStyles.seriesColumn({
                                    color: timeSeriesTwin?.chartProps?.color
                                }).root
                            }
                        >
                            {timeSeriesTwin.label ? (
                                <span>{timeSeriesTwin.label}</span>
                            ) : (
                                <>
                                    <span>{timeSeriesTwin.twinId}</span>
                                    <span>
                                        ({timeSeriesTwin.twinPropertyName})
                                    </span>
                                </>
                            )}
                        </div>
                    );
                }
            },
            {
                key: 'value',
                name: t('dataHistoryExplorer.viewer.table.columns.value'),
                minWidth: 60,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => item.value
            },
            {
                key: 'type',
                name: t('dataHistoryExplorer.viewer.table.columns.type'),
                minWidth: 40,
                maxWidth: 60,
                isResizable: true,
                onRender: (item: TimeSeriesTableRow) => {
                    const timeSeriesTwin = timeSeriesTwins.find(
                        (seriesTwin) => seriesTwin.seriesId === item?.seriesId
                    );
                    if (timeSeriesTwin) {
                        const propertyIcon =
                            DTDLPropertyIconographyMap[
                                timeSeriesTwin.twinPropertyType
                            ];
                        return (
                            <Icon
                                iconName={propertyIcon.icon}
                                aria-hidden="true"
                                title={propertyIcon.text}
                            />
                        );
                    }
                }
            }
        ],
        [timeSeriesTwins, t, getFormattedTimeStamp, classNames]
    );

    return (
        <div className={classNames.root}>
            {!(data?.length > 0) ? (
                <IllustrationMessage
                    descriptionText={t(
                        'dataHistoryExplorer.viewer.table.messages.noData'
                    )}
                    type={'info'}
                    width={'wide'}
                    imageProps={{
                        src: SearchErrorImg,
                        height: 172
                    }}
                    styles={classNames.subComponentStyles.illustrationMessage}
                />
            ) : (
                <div className={classNames.listWrapper}>
                    <ScrollablePane scrollContainerFocus={true}>
                        <DetailsList
                            styles={classNames.subComponentStyles.detailsList}
                            key={'adx-series-data'}
                            selectionMode={SelectionMode.none}
                            items={data}
                            columns={getColumns}
                            layoutMode={DetailsListLayoutMode.justified}
                            constrainMode={ConstrainMode.horizontalConstrained}
                            onRenderDetailsHeader={onRenderDetailsHeader}
                        />
                    </ScrollablePane>
                </div>
            )}
        </div>
    );
};

export default styled<
    ITimeSeriesTableProps,
    ITimeSeriesTableStyleProps,
    ITimeSeriesTableStyles
>(TimeSeriesTable, getStyles);
