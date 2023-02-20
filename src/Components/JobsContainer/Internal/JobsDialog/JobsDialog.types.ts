import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../../../Adapters';
import JobsAdapter from '../../../../Adapters/JobsAdapter';
import { IAdtApiJob } from '../../../../Models/Constants/Interfaces';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

export interface IJobsDialogProps {
    adapter: JobsAdapter | MockAdapter;
    isOpen: boolean;
    onClose: () => void;
    onAddJob: (newJob: IAdtApiJob) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsDialogStyleProps, IJobsDialogStyles>;
}

export interface IJobsDialogStyleProps {
    theme: IExtendedTheme;
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
