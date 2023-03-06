import { IDialogStyles, IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../../../Adapters';
import JobsAdapter from '../../../../Adapters/JobsAdapter';
import { IAdtApiJob } from '../../../../Models/Constants';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IResourcePickerStyles } from '../../../ResourcePicker/ResourcePicker.types';

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
    errorText: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsDialogSubComponentStyles;
}

export interface IJobsDialogSubComponentStyles {
    dialog?: IDialogStyles;
    resourcePicker?: IResourcePickerStyles;
}
