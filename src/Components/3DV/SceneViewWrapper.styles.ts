import {
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
} from './SceneViewWrapper.types';

const classPrefix = 'cb-scene-view-wrapper';

const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`,
    callout: `${classPrefix}-callout`,
    calloutCheckbox: `${classPrefix}-callout-checkbox`,
    calloutTitle: `${classPrefix}-callout-title`
};

export const getStyles = (
    _props: ISceneViewWrapperStyleProps
): ISceneViewWrapperStyles => {
    // const { theme } = props;
    return {
        /** provide a hook for custom styling by consumers */
        root: [classNames.root, {}],
        leftHeaderControlsContainer: [''],
        subComponentStyles: {
            leftHeaderControlsStack: {
                root: {
                    alignItems: 'center',
                    left: 20,
                    position: 'absolute',
                    top: 10,
                    zIndex: 1
                }
            },
            centerHeaderControlsStack: {
                root: {
                    position: 'absolute',
                    display: 'flex',
                    width: '100%',
                    top: 10
                }
            }
        }
    };
};
