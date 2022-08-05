import { FontSizes, FontWeights } from '@fluentui/react';
import {
    ISceneRefreshConfiguratorStyleProps,
    ISceneRefreshConfiguratorStyles
} from './SceneRefreshConfigurator.types';

export const classPrefix = 'cb-scene-refresh-configurator';
const classNames = {
    root: `${classPrefix}-root`,
    calloutDescription: `${classPrefix}-calloutDescription`,
    subHeader: `${classPrefix}-subHeader`
};
export const getStyles = (
    _props: ISceneRefreshConfiguratorStyleProps
): ISceneRefreshConfiguratorStyles => {
    return {
        root: [classNames.root],
        calloutDescription: [
            classNames.calloutDescription,
            {
                fontSize: FontSizes.small
                // color: props.theme.palette.neutralSecondary
            }
        ],
        subHeader: [
            classNames.subHeader,
            {
                fontSize: FontSizes.size14,
                fontWeight: FontWeights.semibold,
                margin: 0
            }
        ],
        subComponentStyles: {}
    };
};
