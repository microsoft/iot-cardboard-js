import {
    FontWeights,
    IButtonStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

const classPrefix = 'cb-popover-visual';
const classNames = {
    boundaryLayer: `${classPrefix}-boundary-layer`,
    draggable: `${classPrefix}-draggable`,
    modalContainer: `${classPrefix}-modal-container`,
    modalHeader: `${classPrefix}-modal-header`,
    modalTitle: `${classPrefix}-modal-title`
};

const initialPopoverTopOffset = 60;
const initialPopoverRightOffset = 20;

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        boundaryLayer: [
            classNames.boundaryLayer,
            {
                height: `calc(100% - ${initialPopoverTopOffset}px)`,
                left: 0,
                pointerEvents: 'none',
                position: 'absolute',
                top: initialPopoverTopOffset,
                width: '100%',
                zIndex: 1000
            } as IStyle
        ],
        draggable: [
            classNames.draggable,
            {
                top: 0,
                right: initialPopoverRightOffset
            } as IStyle
        ],
        modalContainer: [
            classNames.modalContainer,
            {
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'stretch',
                minWidth: 288,
                maxWidth: 400,
                backgroundColor: 'var(--cb-color-bg-canvas)',
                borderRadius: 2,
                border: '1px solid var(--cb-color-input-border)',
                cursor: 'move',
                padding: '0px 8px 8px 8px',
                position: 'absolute',
                pointerEvents: 'auto'
            } as IStyle
        ],
        modalHeader: [
            classNames.modalHeader,
            {
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold
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
        ]
    });
});

export const getDismissButtonStyles = memoizeFunction(
    (theme: Theme): IButtonStyles => ({
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 'auto',
            marginTop: '4px',
            marginRight: '2px',
            alignSelf: 'flex-end'
        },
        rootHovered: {
            color: theme.palette.neutralDark
        }
    })
);
