import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { MockAdapter } from '../../Adapters';
import JobsAdapter from '../../Adapters/JobsAdapter';
import { ICardBaseProps } from '../../Models/Constants';
import { IExtendedTheme } from '../../Theming/Theme.types';

export interface IJobsPageProps extends ICardBaseProps {
    adapter: JobsAdapter | MockAdapter;
    adtInstanceUrl: string;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsPageStyleProps, IJobsPageStyles>;
}

export interface IJobsPageStyleProps {
    theme: IExtendedTheme;
}
export interface IJobsPageStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsPageSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsPageSubComponentStyles {}
