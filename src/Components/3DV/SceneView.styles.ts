import {
    memoizeFunction,
    mergeStyleSets,
    IStyle,
    IProgressIndicatorStyles,
    FontSizes,
    Theme
} from '@fluentui/react';

const classPrefix = 'scene-view';
const classNames = {
    canvas: `${classPrefix}-canvas`,
    canvasVisible: `${classPrefix}-canvas-visible`,
    errorMessage: `${classPrefix}-error-message`,
    globeTooltip: `${classPrefix}-globe-tooltip`,
    root: `${classPrefix}-root`,
    modelErrorMessage: `${classPrefix}-model-error-message`
};
export const getSceneViewStyles = memoizeFunction((theme: Theme) =>
    mergeStyleSets({
        root: [
            classNames.root,
            {
                height: '100%',
                position: 'relative',
                width: '100%'
            } as IStyle
        ],
        canvas: [
            classNames.canvas,
            {
                display: 'block',
                height: '100%',
                opacity: 0,
                outline: 'none',
                webkitTapHighlightColor: theme.palette.black,
                width: '100%'
            } as IStyle
        ],
        canvasVisible: [
            classNames.canvasVisible,
            {
                opacity: '1 !important',
                transition: '2s'
            } as IStyle
        ],
        errorMessage: [
            classNames.errorMessage,
            {
                left: '50%',
                position: 'absolute',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            } as IStyle
        ],
        globeTooltip: [
            classNames.globeTooltip,
            {
                background: 'rgba(22, 27, 54, 0.8)',
                border: '#364944 1px solid',
                borderRadius: 10,
                color: '#fff',
                padding: 5,
                pointerEvents: 'none !important',
                position: 'absolute'
            } as IStyle
        ],
        placeholderMarkers: [
            {
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: -1
            } as IStyle
        ],
        markers: [
            {
                position: 'absolute'
            } as IStyle
        ],
        modelErrorMessage: [
            classNames.modelErrorMessage,
            {
                position: 'absolute',
                top: '64px',
                left: '16px',
                width: 'calc(100% - 16px)'
            }
        ]
    })
);
export const getProgressStyles = memoizeFunction(
    (theme: Theme): Partial<IProgressIndicatorStyles> => ({
        root: {
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.size24,
            left: '50%',
            position: 'absolute',
            textShadow: getTextShadow(theme),
            top: '50%',
            transform: `translate(-50%, 0%)`,
            width: '300px'
        },
        itemDescription: {
            color: theme.semanticColors.bodyText,
            fontSize: FontSizes.size24,
            marginTop: 10,
            textAlign: 'center'
        }
    })
);

const getTextShadow = memoizeFunction(
    (theme: Theme): string =>
        `1px 0 0 ${theme.palette.white}, 0 -1px 0 ${theme.palette.white}, 0 1px 0 ${theme.palette.white}, -1px 0 0 ${theme.palette.white}`
);
