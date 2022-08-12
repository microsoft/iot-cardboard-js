import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ADT3DSceneAdapter, MockAdapter } from '../../Adapters';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IHeaderControlButtonWithCalloutStyles } from '../HeaderControlButtonWithCallout/HeaderControlButtonWithCallout.types';

export interface ISceneRefreshConfiguratorProps {
    adapter: ADT3DSceneAdapter | MockAdapter;
    config: I3DScenesConfig; // the scene configuration
    sceneId: string; // current scene id
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        ISceneRefreshConfiguratorStyleProps,
        ISceneRefreshConfiguratorStyles
    >;
}

export interface ISceneRefreshConfiguratorStyleProps {
    theme: ITheme;
}
export interface ISceneRefreshConfiguratorStyles {
    root: IStyle;
    subHeader: IStyle;
    calloutDescription: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: ISceneRefreshConfiguratorSubComponentStyles;
}

export interface ISceneRefreshConfiguratorSubComponentStyles {
    headerControlWithCallout?: IHeaderControlButtonWithCalloutStyles;
}
