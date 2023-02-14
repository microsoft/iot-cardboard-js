import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    IADTInstance,
    IStandaloneConsumeCardProps
} from '../../Models/Constants';

export interface IJobsProps extends IStandaloneConsumeCardProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    adtEnvironmentPicker: {
        isLocalStorageEnabled?: boolean;
        localStorageKey?: string;
        selectedItemLocalStorageKey?: string;
        onAdtInstanceChange?: (
            adtInstance: string | IADTInstance,
            adtInstances: Array<string | IADTInstance>
        ) => void;
    };
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IJobsStyleProps, IJobsStyles>;
}
export interface INewJob {
    outputUri: string;
    inputUri: string;
    jobId: string;
}

export interface IJobsStyleProps {
    theme: ITheme;
}
export interface IJobsStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IJobsSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IJobsSubComponentStyles {}
