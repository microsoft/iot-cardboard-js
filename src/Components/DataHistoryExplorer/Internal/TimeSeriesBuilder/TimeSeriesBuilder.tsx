import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ITimeSeriesBuilderProps,
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles,
    TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX
} from './TimeSeriesBuilder.types';
import { getStyles } from './TimeSeriesBuilder.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    Separator,
    ActionButton,
    IContextualMenuItem
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { TFunction, useTranslation } from 'react-i18next';
import { CardboardList } from '../../../CardboardList';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import TimeSeriesTwinCallout from '../TimeSeriesTwinCallout/TimeSeriesTwinCallout';
import produce from 'immer';
import { getHighChartColor } from '../../../../Models/SharedUtils/DataHistoryUtils';
import { DTDLPropertyIconographyMap } from '../../../../Models/Constants/Constants';

const getClassNames = classNamesFunction<
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
>();

const TimeSeriesBuilder: React.FC<ITimeSeriesBuilderProps> = (props) => {
    const { onTimeSeriesTwinListChange, styles } = props;

    // state
    const [timeSeriesTwins, setTimeSeriesTwins] = useState<
        Array<IDataHistoryTimeSeriesTwin>
    >([]);
    const [
        isTimeSeriesTwinCalloutVisible,
        setIsTimeSeriesTwinCalloutVisible
    ] = useState(false);
    const [
        selectedTimeSeriesTwinId,
        setSelectedTimeSeriesTwinId
    ] = useState<string>(null);

    // hooks
    const { t } = useTranslation();
    const addTimeSeriesTwinCalloutId = useId('add-time-series-twin-callout');

    // callbacks
    const handleAddNew = useCallback(() => {
        setIsTimeSeriesTwinCalloutVisible(true);
    }, []);
    const handleTimeSeriesTwinCalloutPrimaryAction = useCallback(
        (timeSeriesTwin: IDataHistoryTimeSeriesTwin) => {
            setTimeSeriesTwins(
                produce(timeSeriesTwins, (draft) => {
                    if (selectedTimeSeriesTwinId) {
                        const selectedIdx = timeSeriesTwins.findIndex(
                            (tsTwin) =>
                                tsTwin.twinId === selectedTimeSeriesTwinId
                        );
                        draft[selectedIdx] = timeSeriesTwin;
                    } else {
                        timeSeriesTwin.chartProps.color = getHighChartColor(
                            timeSeriesTwins.length
                        );
                        draft.push(timeSeriesTwin);
                    }
                })
            );
            setIsTimeSeriesTwinCalloutVisible(false);
            setSelectedTimeSeriesTwinId(null);
        },
        [timeSeriesTwins, selectedTimeSeriesTwinId]
    );
    const onTimeSeriesTwinEdit = useCallback((twinId: string) => {
        setSelectedTimeSeriesTwinId(twinId);
        setIsTimeSeriesTwinCalloutVisible(true);
    }, []);
    const onTimeSeriesTwinRemove = useCallback(
        (twinId: string) => {
            setSelectedTimeSeriesTwinId(null);
            setTimeSeriesTwins(
                produce(timeSeriesTwins, (draft) => {
                    const selectedIdx = draft.findIndex(
                        (tsTwin) => tsTwin.twinId === twinId
                    );
                    draft.splice(selectedIdx, 1);
                })
            );
        },
        [timeSeriesTwins]
    );

    // side effects
    useEffect(() => {
        onTimeSeriesTwinListChange?.(timeSeriesTwins);
    }, [timeSeriesTwins]);
    const timeSeriesTwinList = useMemo(
        () =>
            getTimeSeriesTwinListItems(
                timeSeriesTwins,
                onTimeSeriesTwinEdit,
                onTimeSeriesTwinRemove,
                t
            ),
        [timeSeriesTwins, onTimeSeriesTwinEdit, onTimeSeriesTwinRemove, t]
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 8 }}>
                <h2 className={classNames.header}>
                    {t('dataHistoryExplorer.builder.title')}
                </h2>
                <span className={classNames.description}>
                    {t('dataHistoryExplorer.builder.description')}
                </span>
            </Stack>
            <Separator />
            <CardboardList
                listKey={'twin-property-list'}
                items={timeSeriesTwinList}
                focusZoneProps={{ style: { overflow: 'auto', flexGrow: 1 } }}
            />
            <ActionButton
                id={addTimeSeriesTwinCalloutId}
                iconProps={{ iconName: 'Add' }}
                onClick={handleAddNew}
            >
                {t('addNew')}
            </ActionButton>
            {isTimeSeriesTwinCalloutVisible && (
                <TimeSeriesTwinCallout
                    timeSeriesTwin={
                        selectedTimeSeriesTwinId
                            ? timeSeriesTwins.find(
                                  (t) => t.twinId === selectedTimeSeriesTwinId
                              )
                            : undefined
                    }
                    styles={classNames.subComponentStyles.timeSeriesTwinCallout}
                    target={
                        selectedTimeSeriesTwinId
                            ? TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX +
                              selectedTimeSeriesTwinId
                            : addTimeSeriesTwinCalloutId
                    }
                    onPrimaryActionClick={
                        handleTimeSeriesTwinCalloutPrimaryAction
                    }
                    onDismiss={() => {
                        setIsTimeSeriesTwinCalloutVisible(false),
                            setSelectedTimeSeriesTwinId(null);
                    }}
                />
            )}
        </div>
    );
};

const getTimeSeriesTwinListItems = (
    timeSeriesTwins: Array<IDataHistoryTimeSeriesTwin>,
    onEditClick: (id: string) => void,
    onRemoveClick: (id: string) => void,
    t: TFunction<string>
): ICardboardListItem<IDataHistoryTimeSeriesTwin>[] => {
    const getMenuItems = (
        item: IDataHistoryTimeSeriesTwin
    ): IContextualMenuItem[] => {
        return [
            {
                key: 'edit',
                iconProps: { iconName: 'Edit' },
                text: t('dataHistoryExplorer.builder.timeSeriesTwin.edit'),
                onClick: () => {
                    onEditClick(item.twinId);
                }
            },
            {
                key: 'remove',
                iconProps: {
                    iconName: 'Delete'
                },
                text: t('dataHistoryExplorer.builder.timeSeriesTwin.remove'),
                onClick: () => {
                    onRemoveClick(item.twinId);
                }
            }
        ];
    };

    return timeSeriesTwins.map((timeSeriesTwin) => {
        const listItem: ICardboardListItem<IDataHistoryTimeSeriesTwin> = {
            ariaLabel: timeSeriesTwin.label,
            iconStart: {
                name:
                    DTDLPropertyIconographyMap[timeSeriesTwin.twinPropertyType]
                        ?.icon,
                color: timeSeriesTwin.chartProps.color
            },
            id: TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX + timeSeriesTwin.twinId,
            item: timeSeriesTwin,
            onClick: () => onEditClick(timeSeriesTwin.twinId),
            textPrimary: timeSeriesTwin.label || timeSeriesTwin.twinId,
            textSecondary: timeSeriesTwin.twinPropertyName,
            overflowMenuItems: getMenuItems(timeSeriesTwin)
        };

        return listItem;
    });
};

export default styled<
    ITimeSeriesBuilderProps,
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
>(TimeSeriesBuilder, getStyles);
