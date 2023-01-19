import React, { useCallback, useEffect, useState } from 'react';
import {
    IChartCommandBarProps,
    IChartCommandBarStyleProps,
    IChartCommandBarStyles
} from './ChartCommandBar.types';
import { getStyles } from './ChartCommandBar.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    CommandBar,
    ICommandBarItemProps
} from '@fluentui/react';
import { IDataHistoryChartOptions } from '../../../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { QuickTimeSpanKey } from '../../../../../../../../Models/Constants/Enums';
import {
    AggregationTypeDropdownOptions,
    QuickTimeSpans
} from '../../../../../../../../Models/Constants/Constants';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import {
    getQuickTimeSpanKeyByValue,
    getQuickTimeSpanOptions,
    getYAxisTypeOptions
} from '../../../../../../../../Models/SharedUtils/DataHistoryUtils';
import {
    capitalizeFirstLetter,
    deepCopy
} from '../../../../../../../../Models/Services/Utils';

const getClassNames = classNamesFunction<
    IChartCommandBarStyleProps,
    IChartCommandBarStyles
>();

const ChartCommandBar: React.FC<IChartCommandBarProps> = (props) => {
    const { defaultOptions, onChange, deeplink, styles } = props;

    // state
    const [chartOptions, setChartOptions] = useState<IDataHistoryChartOptions>(
        deepCopy(defaultOptions) || {
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
            chartOption:
                | 'aggregationType'
                | 'yAxisType'
                | 'defaultQuickTimeSpanInMillis',
            value: any
        ) => {
            setChartOptions(
                produce((draft) => {
                    draft[chartOption as string] = value;
                })
            );
        },
        []
    );

    // side effects
    useEffect(() => {
        if (onChange) {
            onChange(chartOptions);
        }
    }, [chartOptions]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const items: ICommandBarItemProps[] = [
        {
            key: 'YAxisType',
            text: capitalizeFirstLetter(chartOptions.yAxisType),
            iconProps: { iconName: 'StackedLineChart' },
            subMenuProps: {
                items: getYAxisTypeOptions(t).map((o) => ({
                    ...o,
                    onClick: () => handleChartOptionChange('yAxisType', o.key)
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
                        handleChartOptionChange('aggregationType', o.key)
                }))
            }
        },
        {
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
                            o.data
                        )
                }))
            }
        }
    ];

    const farItems: ICommandBarItemProps[] = deeplink
        ? [
              {
                  key: 'download',
                  text: t('widgets.dataHistory.openQuery'),
                  iconOnly: true,
                  iconProps: { iconName: 'OpenInNewWindow' },
                  onClick: () => {
                      window.open(deeplink, '_blank');
                  }
              }
          ]
        : [];

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
    IChartCommandBarProps,
    IChartCommandBarStyleProps,
    IChartCommandBarStyles
>(ChartCommandBar, getStyles);
