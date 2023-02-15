import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IAdapterData, IJob, IUseAdapter } from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IJobsListProps {
    jobs: IJob[];
    onCancelJob: IUseAdapter<IAdapterData>;
    onDeleteJob: IUseAdapter<IAdapterData>;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsListStyleProps, IJobsListStyles>;
}

export interface IJobsListStyleProps {
    theme: IExtendedTheme;
}
export interface IJobsListStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsListSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsListSubComponentStyles {}
