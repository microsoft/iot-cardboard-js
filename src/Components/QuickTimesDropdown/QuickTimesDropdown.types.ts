import {
    ICalloutProps,
    IDropdownOption,
    IDropdownProps,
    IRenderFunction,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';

export interface IQuickTimesDropdownProps {
    defaultSelectedKey?: QuickTimeSpanKey;
    hasLabel?: boolean;
    label?: string;
    /**
     * Optional custom renderer for label
     */
    onRenderLabel?: IRenderFunction<IDropdownProps>;
    onChange?: (
        event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption,
        index?: number
    ) => void;
    /**
     * Optional custom renderer for selected option displayed in input
     */
    onRenderTitle?: IRenderFunction<IDropdownOption[]>;
    /**
     * Optional custom renderer for the down caret
     */
    onRenderCaretDown?: IRenderFunction<IDropdownProps>;
    /**
     * Custom properties for the Callout used to render the option list.
     */
    calloutProps?: ICalloutProps;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IQuickTimesDropdownStyleProps,
        IQuickTimesDropdownStyles
    >;
}

export interface IQuickTimesDropdownStyleProps {
    theme: ITheme;
}
export interface IQuickTimesDropdownStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IQuickTimesDropdownSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQuickTimesDropdownSubComponentStyles {}

export enum QuickTimeSpanKey {
    Last15Mins = 'Last 15 mins',
    Last30Mins = 'Last 30 mins',
    LastHour = 'Last hour',
    Last3Hours = 'Last 3 hours',
    Last6Hours = 'Last 6 hours',
    Last12Hours = 'Last 12 hours',
    Last24Hours = 'Last 24 hours',
    Last7Days = 'Last 7 days',
    Last30Days = 'Last 30 days',
    Last60Days = 'Last 60 days',
    Last90Days = 'Last 90 days',
    Last180Days = 'Last 180 days',
    LastYear = 'Last year'
}

/** Quick time span key to value in millisecond mapping */
export const QuickTimeSpans = {
    [QuickTimeSpanKey.Last15Mins]: 15 * 60 * 1000,
    [QuickTimeSpanKey.Last30Mins]: 30 * 60 * 1000,
    [QuickTimeSpanKey.LastHour]: 1 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last3Hours]: 3 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last6Hours]: 6 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last12Hours]: 12 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last24Hours]: 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last7Days]: 7 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last30Days]: 30 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last60Days]: 60 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last90Days]: 90 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.Last180Days]: 180 * 24 * 60 * 60 * 1000,
    [QuickTimeSpanKey.LastYear]: 365 * 24 * 60 * 60 * 1000
};
