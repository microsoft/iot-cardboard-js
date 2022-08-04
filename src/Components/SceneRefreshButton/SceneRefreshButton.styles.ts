import {
    ISceneRefreshButtonStyleProps,
    ISceneRefreshButtonStyles
} from './SceneRefreshButton.types';

export const ANIMATION_DURATION_SECONDS = 2.5;

export const classPrefix = 'cb-SceneRefreshButton';
const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`
};
export const getStyles = (
    props: ISceneRefreshButtonStyleProps
): ISceneRefreshButtonStyles => {
    return {
        root: [classNames.root],
        button: [classNames.button],
        callout: [classNames.callout],
        subComponentStyles: {
            headerControlButton: {
                subComponentStyles: {
                    button: {
                        icon: props.isRefreshing
                            ? {
                                  transition: `${ANIMATION_DURATION_SECONDS}s`,
                                  transform: 'rotate(360deg)'
                              }
                            : {}
                    }
                }
            }
        }
    };
};
