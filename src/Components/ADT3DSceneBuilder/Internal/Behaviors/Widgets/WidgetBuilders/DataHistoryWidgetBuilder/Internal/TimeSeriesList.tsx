import {
    IContextualMenuItem,
    Label,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import React, { useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import {
    IDataHistoryBasicTimeSeries,
    IDataHistoryTimeSeries
} from '../../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../../../../CardboardList';
import { ICardboardListItem } from '../../../../../../../CardboardList/CardboardList.types';
import { getWidgetFormStyles } from '../../../WidgetForm/WidgetForm.styles';
import {
    MAX_NUMBER_OF_TIME_SERIES,
    SERIES_LIST_ITEM_ID_PREFIX
} from '../DataHistoryWidgetBuilder.types';

interface IProp {
    series: IDataHistoryTimeSeries;
    onSeriesEditClick: (id: string) => void;
    onSeriesRemoveClick: (id: string) => void;
}

const TimeSeriesList: React.FC<IProp> = ({
    series,
    onSeriesEditClick,
    onSeriesRemoveClick
}) => {
    // hooks
    const { t } = useTranslation();

    const listItems = useMemo(
        () =>
            getTimeSeriesListItems(
                series,
                onSeriesEditClick,
                onSeriesRemoveClick,
                t
            ),
        [series, onSeriesEditClick, onSeriesRemoveClick, t]
    );

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);
    return (
        <Stack tokens={{ childrenGap: 2 }}>
            <Label required className={customStyles.label}>
                {t('widgets.dataHistory.form.timeSeries.title')}
            </Label>
            <Text className={customStyles.innerDescription}>
                {t(
                    'widgets.dataHistory.form.timeSeries.timeSeriesDescription',
                    {
                        maxTimeSeriesCount: MAX_NUMBER_OF_TIME_SERIES
                    }
                )}
            </Text>
            <CardboardList<IDataHistoryBasicTimeSeries>
                items={listItems}
                listKey={'time-series-in-data-history-widget'}
            />
        </Stack>
    );
};

const getTimeSeriesListItems = (
    series: Array<IDataHistoryBasicTimeSeries>,
    onSeriesEditClick: (id: string) => void,
    onSeriesRemoveClick: (id: string) => void,
    t: TFunction<string>
): ICardboardListItem<IDataHistoryBasicTimeSeries>[] => {
    const getMenuItems = (
        item: IDataHistoryBasicTimeSeries
    ): IContextualMenuItem[] => {
        return [
            {
                key: 'edit',
                iconProps: { iconName: 'Edit' },
                text: t('widgets.dataHistory.form.timeSeries.edit'),
                onClick: () => {
                    onSeriesEditClick(item.id);
                }
            },
            {
                key: 'remove',
                iconProps: {
                    iconName: 'Delete'
                },
                text: t('widgets.dataHistory.form.timeSeries.remove'),
                onClick: () => {
                    onSeriesRemoveClick(item.id);
                }
            }
        ];
    };

    return series.map((series) => {
        const listItem: ICardboardListItem<IDataHistoryBasicTimeSeries> = {
            ariaLabel: series.label,
            iconStart: { name: 'NumberField' },
            id: SERIES_LIST_ITEM_ID_PREFIX + series.id,
            item: series,
            onClick: () => onSeriesEditClick(series.id),
            textPrimary: series.label || series.expression,
            textSecondary: series.unit,
            overflowMenuItems: getMenuItems(series)
        };

        return listItem;
    });
};

export default TimeSeriesList;
