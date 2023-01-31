import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
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
import {
    getDefaultSeriesLabel,
    getHighChartColor,
    sendDataHistoryExplorerUserTelemetry
} from '../../../../Models/SharedUtils/DataHistoryUtils';
import { DTDLPropertyIconographyMap } from '../../../../Models/Constants/Constants';
import { ColorString } from 'highcharts';
import {
    deepCopy,
    getDebugLogger,
    isDefined
} from '../../../../Models/Services/Utils';
import { TelemetryEvents } from '../../../../Models/Constants/TelemetryConstants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TimeSeriesBuilder', debugLogging);

const getClassNames = classNamesFunction<
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
>();

const ROOT_LOC = 'dataHistoryExplorer.builder';
const LOC_KEYS = {
    title: `${ROOT_LOC}.title`,
    description: `${ROOT_LOC}.description`,
    addTwin: `${ROOT_LOC}.timeSeriesTwin.add`,
    editTwin: `${ROOT_LOC}.timeSeriesTwin.edit`,
    removeTwin: `${ROOT_LOC}.timeSeriesTwin.remove`
};

const TimeSeriesBuilder: React.FC<ITimeSeriesBuilderProps> = (props) => {
    const {
        onTimeSeriesTwinListChange,
        timeSeriesTwins: timeSeriesTwinsProp = [],
        styles
    } = props;

    // state
    const [timeSeriesTwins, setTimeSeriesTwins] = useState<
        Array<IDataHistoryTimeSeriesTwin>
    >(deepCopy(timeSeriesTwinsProp));
    const [
        isTimeSeriesTwinCalloutVisible,
        setIsTimeSeriesTwinCalloutVisible
    ] = useState(false);
    const [
        selectedTimeSeriesTwinSeriesId,
        setSelectedTimeSeriesTwinSeriesId
    ] = useState<string>(null);

    // hooks
    const { t } = useTranslation();
    const addTimeSeriesTwinCalloutId = useId('add-time-series-twin-callout');
    const usedSeriesColorsRef = useRef<Array<ColorString>>(
        timeSeriesTwinsProp
            ?.filter((t) => t.chartProps?.color)
            .map((t) => t.chartProps?.color) || []
    );

    // callbacks
    const handleAddNew = useCallback(() => {
        setIsTimeSeriesTwinCalloutVisible(true);
    }, []);
    const handleTimeSeriesTwinCalloutPrimaryAction = useCallback(
        (timeSeriesTwin: IDataHistoryTimeSeriesTwin) => {
            setTimeSeriesTwins(
                produce(timeSeriesTwins, (draft) => {
                    if (isDefined(selectedTimeSeriesTwinSeriesId)) {
                        const selectedIdx = timeSeriesTwins.findIndex(
                            (tsTwin) =>
                                tsTwin.seriesId ===
                                selectedTimeSeriesTwinSeriesId
                        );
                        draft[selectedIdx] = timeSeriesTwin;
                        const telemetry =
                            TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                                .EditSeries;
                        sendDataHistoryExplorerUserTelemetry(
                            telemetry.eventName,
                            [
                                {
                                    property: telemetry.properties.itemIndex,
                                    value: selectedIdx
                                },
                                {
                                    property:
                                        telemetry.properties.hasCustomLabel,
                                    value:
                                        timeSeriesTwin.label !==
                                        getDefaultSeriesLabel(
                                            timeSeriesTwin.twinId,
                                            timeSeriesTwin.twinPropertyName
                                        )
                                }
                            ]
                        );
                    } else {
                        timeSeriesTwin.chartProps.color = getHighChartColor(
                            usedSeriesColorsRef.current
                        );
                        draft.push(timeSeriesTwin);
                        const telemetry =
                            TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                                .AddSeries;
                        sendDataHistoryExplorerUserTelemetry(
                            telemetry.eventName,
                            [
                                {
                                    property:
                                        telemetry.properties.hasCustomLabel,
                                    value:
                                        timeSeriesTwin.label !==
                                        getDefaultSeriesLabel(
                                            timeSeriesTwin.twinId,
                                            timeSeriesTwin.twinPropertyName
                                        )
                                }
                            ]
                        );
                    }
                })
            );
            setIsTimeSeriesTwinCalloutVisible(false);
            setSelectedTimeSeriesTwinSeriesId(null);
        },
        [timeSeriesTwins, selectedTimeSeriesTwinSeriesId]
    );
    const onTimeSeriesTwinEdit = useCallback((seriesId: string) => {
        setSelectedTimeSeriesTwinSeriesId(seriesId);
        setIsTimeSeriesTwinCalloutVisible(true);
    }, []);
    const onTimeSeriesTwinRemove = useCallback(
        (seriesId: string) => {
            setSelectedTimeSeriesTwinSeriesId(null);
            setTimeSeriesTwins(
                produce(timeSeriesTwins, (draft) => {
                    const selectedIdx = draft.findIndex(
                        (tsTwin) => tsTwin.seriesId === seriesId
                    );
                    draft.splice(selectedIdx, 1);
                    const telemetry =
                        TelemetryEvents.Tools.DataHistoryExplorer.UserAction
                            .RemoveSeries;
                    sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
                        {
                            property: telemetry.properties.itemIndex,
                            value: selectedIdx
                        }
                    ]);
                })
            );

            /**
             * when a series is removed, also remove if from usedColors reference
             * so that whenever adding a new series we can use these available colors first
             * before picking the next color in Highcharts palette
             */
            usedSeriesColorsRef.current.splice(
                usedSeriesColorsRef.current.findIndex(
                    (c) =>
                        c ===
                        timeSeriesTwins.find(
                            (tsTwin) => tsTwin.seriesId === seriesId
                        ).chartProps.color
                ),
                1
            );
        },
        [timeSeriesTwins]
    );

    // side effects
    useEffect(() => {
        onTimeSeriesTwinListChange?.(timeSeriesTwins);
        logDebugConsole(
            'debug',
            'Series changed: {timeSeriesTwins}',
            timeSeriesTwins
        );
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
    const classNames = getClassNames(styles, { theme: useTheme() });

    const calloutTarget = selectedTimeSeriesTwinSeriesId
        ? TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX + selectedTimeSeriesTwinSeriesId
        : addTimeSeriesTwinCalloutId;

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 8 }}>
                <h4 className={classNames.header}>{t(LOC_KEYS.title)}</h4>
                <span className={classNames.description}>
                    {t(LOC_KEYS.description)}
                </span>
            </Stack>
            <Separator />
            <CardboardList<IDataHistoryTimeSeriesTwin>
                listKey={'twin-property-list'}
                items={timeSeriesTwinList}
                focusZoneProps={{ style: { overflow: 'auto' } }}
            />
            <ActionButton
                styles={classNames.subComponentStyles.addNewButton()}
                id={addTimeSeriesTwinCalloutId}
                iconProps={{ iconName: 'Add' }}
                onClick={handleAddNew}
            >
                {t(LOC_KEYS.addTwin)}
            </ActionButton>
            {isTimeSeriesTwinCalloutVisible && (
                <TimeSeriesTwinCallout
                    timeSeriesTwin={
                        selectedTimeSeriesTwinSeriesId !== null
                            ? timeSeriesTwins.find(
                                  (t) =>
                                      t.seriesId ===
                                      selectedTimeSeriesTwinSeriesId
                              )
                            : undefined
                    }
                    styles={classNames.subComponentStyles.timeSeriesTwinCallout}
                    target={calloutTarget}
                    onPrimaryActionClick={
                        handleTimeSeriesTwinCalloutPrimaryAction
                    }
                    onDismiss={() => {
                        setIsTimeSeriesTwinCalloutVisible(false);
                        setSelectedTimeSeriesTwinSeriesId(null);
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
    const getMenuItems = (id: string): IContextualMenuItem[] => [
        {
            key: 'edit',
            iconProps: { iconName: 'Edit' },
            text: t(LOC_KEYS.editTwin),
            onClick: () => {
                onEditClick(id);
            }
        },
        {
            key: 'remove',
            iconProps: {
                iconName: 'Delete'
            },
            text: t(LOC_KEYS.removeTwin),
            onClick: () => {
                onRemoveClick(id);
            }
        }
    ];

    return timeSeriesTwins.map((timeSeriesTwin) => {
        const listItem: ICardboardListItem<IDataHistoryTimeSeriesTwin> = {
            ariaLabel: timeSeriesTwin.label,
            iconStart: {
                name:
                    DTDLPropertyIconographyMap[
                        timeSeriesTwin.chartProps
                            ?.isTwinPropertyTypeCastedToNumber
                            ? 'double'
                            : timeSeriesTwin.twinPropertyType
                    ]?.icon,
                color: timeSeriesTwin.chartProps?.color
            },
            id: TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX + timeSeriesTwin.seriesId,
            item: timeSeriesTwin,
            onClick: () => {
                onEditClick(timeSeriesTwin.seriesId);
            },
            textPrimary: timeSeriesTwin.label || timeSeriesTwin.twinId,
            textSecondary: timeSeriesTwin.twinPropertyName,
            overflowMenuItems: getMenuItems(timeSeriesTwin.seriesId)
        };

        return listItem;
    });
};

export default styled<
    ITimeSeriesBuilderProps,
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
>(TimeSeriesBuilder, getStyles);
