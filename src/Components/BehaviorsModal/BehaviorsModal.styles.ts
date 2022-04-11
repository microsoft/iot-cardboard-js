import {
    FontSizes,
    FontWeights,
    IButtonStyles,
    ISeparatorStyles,
    IStyle,
    ITheme,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { BehaviorModalMode } from '../../Models/Constants';
import { getTransparentColor } from '../../Models/Services/Utils';

export const behaviorsModalClassPrefix = 'cb-behaviors-modal';
const classNames = {
    boundaryLayer: `${behaviorsModalClassPrefix}-boundary-layer`,
    draggable: `${behaviorsModalClassPrefix}-draggable`,
    separator: `${behaviorsModalClassPrefix}-separator`,
    modalContainer: `${behaviorsModalClassPrefix}-modal-container`,
    modalHeaderContainer: `${behaviorsModalClassPrefix}-modal-header-container`,
    modalHeader: `${behaviorsModalClassPrefix}-modal-header`,
    modalTitle: `${behaviorsModalClassPrefix}-modal-title`,
    modalContents: `${behaviorsModalClassPrefix}-modal-contents`
};

export const getBorderStyle = (
    theme: ITheme,
    mode: BehaviorModalMode,
    styleTarget: 'border' | 'color' = 'border',
    isActive?: boolean
) => {
    const color =
        mode === BehaviorModalMode.preview
            ? getTransparentColor(theme.palette.black, '0.3')
            : 'var(--cb-color-modal-border)';

    if (styleTarget === 'color') {
        return color;
    } else if (isActive && mode === BehaviorModalMode.preview) {
        return `2px dashed ${theme.palette.themePrimary}`;
    } else {
        return mode === BehaviorModalMode.preview
            ? `1px dashed ${color}`
            : `1px solid ${color}`;
    }
};

export const getStyles = memoizeFunction(
    (theme: ITheme, mode: BehaviorModalMode) => {
        const modalBorderStyle = getBorderStyle(theme, mode, 'border');
        const isPreview = mode === BehaviorModalMode.preview;

        // Offset preview modal based on height of left panel header
        const boundaryLayerTopOffset = 114;

        // Pad modal with viewer padding
        const initialPopoverRightOffset = 8;

        /** In preview mode, position draggable modal just offset from left builder panel
         *  In viewer mode, position draggable modal slightly padded of right screen boundary
         */
        const draggablePositionStyle: IStyle = isPreview
            ? {
                  top: 0,
                  left: 0
              }
            : {
                  top: 0,
                  right: initialPopoverRightOffset
              };
        return mergeStyleSets({
            boundaryLayer: [
                classNames.boundaryLayer,
                {
                    height: `calc(100% - ${boundaryLayerTopOffset}px)`,
                    left: 0,
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: boundaryLayerTopOffset,
                    width: '100%',
                    zIndex: 1000
                } as IStyle
            ],
            draggable: [classNames.draggable, draggablePositionStyle],
            separator: [classNames.separator, {} as IStyle],
            modalContainer: [
                classNames.modalContainer,
                {
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'stretch',
                    minWidth: 200,
                    maxWidth: 340,
                    maxHeight: 'calc(100% - 40px)',
                    backgroundColor: 'var(--cb-color-glassy-modal)',
                    backdropFilter: 'blur(24px) brightness(150%)',
                    borderRadius: 2,
                    border: modalBorderStyle,
                    cursor: 'move',
                    position: 'absolute',
                    pointerEvents: 'auto'
                } as IStyle
            ],
            modalHeaderContainer: [
                classNames.modalHeaderContainer,
                {
                    borderBottom: modalBorderStyle,
                    padding: '8px 8px 8px 20px'
                } as IStyle
            ],
            modalHeader: [
                classNames.modalHeader,
                {
                    flex: '1 1 auto',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: FontWeights.semibold,
                    fontSize: FontSizes.size16,
                    height: 32
                } as IStyle
            ],
            modalTitle: [
                classNames.modalTitle,
                {
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    overflow: 'hidden'
                } as IStyle
            ],
            modalContents: [
                classNames.modalTitle,
                {
                    overflowX: 'hidden',
                    overflowY: 'auto'
                } as IStyle
            ]
        });
    }
);

export const getSeparatorStyles = (
    theme: ITheme,
    mode: BehaviorModalMode
): Partial<ISeparatorStyles> => {
    return {
        root: {
            ':before': {
                backgroundColor: getBorderStyle(theme, mode, 'color')
            },
            padding: 0,
            height: 1
        }
    };
};

export const dismissButtonStyles: IButtonStyles = {
    root: {
        color: 'var(--cb-color-text-primary)',
        marginLeft: 'auto',
        alignSelf: 'flex-end'
    },
    rootHovered: {
        color: 'var(--cb-color-text-primary)'
    }
};
