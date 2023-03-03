import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { IJobsData } from '../../JobsContainer.types';

export interface IJobsListProps {
    jobs: IJobsData[];
    onCancelJob: () => void;
    onDeleteJob: () => void;

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
