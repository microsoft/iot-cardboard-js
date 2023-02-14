import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';

export interface IJobsDialogProps {
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsDialogStyleProps, IJobsDialogStyles>;
}

export interface IJobsDialogStyleProps {
    theme: ITheme;
}
export interface IJobsDialogStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsDialogSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsDialogSubComponentStyles {}
