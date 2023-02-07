import React, { useMemo } from 'react';
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
    IContextualMenuItem,
    Theme
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { TFunction, useTranslation } from 'react-i18next';
import { CardboardList } from '../../../CardboardList';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';
import { IDataHistoryTimeSeriesTwin } from '../../../../Models/Constants/Interfaces';
import { DTDLPropertyIconographyMap } from '../../../../Models/Constants/Constants';

const getClassNames = classNamesFunction<
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
>();

const ROOT_LOC = 'dataHistoryExplorer.builder';
const LOC_KEYS = {
    description: `${ROOT_LOC}.description`,
    addTwin: `${ROOT_LOC}.timeSeriesTwin.add`,
    editTwin: `${ROOT_LOC}.timeSeriesTwin.edit`,
    removeTwin: `${ROOT_LOC}.timeSeriesTwin.remove`,
    noDataMessage: `${ROOT_LOC}.timeSeriesTwin.noData`
};

const TimeSeriesBuilder: React.FC<ITimeSeriesBuilderProps> = (props) => {
    const {
        timeSeriesTwins = [],
        missingTimeSeriesTwinIds = [],
        onAddSeriesClick,
        onEditSeriesClick,
        onRemoveSeriesClick,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();
    const addTimeSeriesTwinCalloutId = useId('add-time-series-twin-callout');

    // styles
    const theme = useTheme();
    const classNames = getClassNames(styles, { theme });

    const timeSeriesTwinList = useMemo(
        () =>
            getTimeSeriesTwinListItems(
                timeSeriesTwins,
                onEditSeriesClick,
                onRemoveSeriesClick,
                t,
                theme,
                missingTimeSeriesTwinIds
            ),
        [
            timeSeriesTwins,
            onEditSeriesClick,
            onRemoveSeriesClick,
            t,
            theme,
            missingTimeSeriesTwinIds
        ]
    );

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 8 }}>
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
                onClick={() => onAddSeriesClick(addTimeSeriesTwinCalloutId)}
            >
                {t(LOC_KEYS.addTwin)}
            </ActionButton>
        </div>
    );
};

const getTimeSeriesTwinListItems = (
    timeSeriesTwins: Array<IDataHistoryTimeSeriesTwin>,
    onEditClick: (id: string, calloutTargetId: string) => void,
    onRemoveClick: (id: string) => void,
    t: TFunction<string>,
    theme: Theme,
    missingDataSeriesIds?: Array<string>
): ICardboardListItem<IDataHistoryTimeSeriesTwin>[] => {
    const getMenuItems = (id: string): IContextualMenuItem[] => [
        {
            key: 'edit',
            iconProps: { iconName: 'Edit' },
            text: t(LOC_KEYS.editTwin),
            onClick: () => {
                onEditClick(id, TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX + id);
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
            iconEnd: missingDataSeriesIds?.includes(timeSeriesTwin.seriesId)
                ? {
                      name: 'Warning',
                      color: theme.semanticColors.warningIcon,
                      title: t(LOC_KEYS.noDataMessage)
                  }
                : undefined,
            id: TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX + timeSeriesTwin.seriesId,
            item: timeSeriesTwin,
            onClick: () => {
                onEditClick(
                    timeSeriesTwin.seriesId,
                    TIME_SERIES_TWIN_LIST_ITEM_ID_PREFIX +
                        timeSeriesTwin.seriesId
                );
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
