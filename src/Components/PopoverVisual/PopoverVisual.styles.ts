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
    popoverBoundaryLayer: `${classPrefix}-popover-boundary-layer`,
    modalContainer: `${classPrefix}-modal-container`,
    modalHeader: `${classPrefix}-modal-header`,
    modalTitle: `${classPrefix}-modal-title`
};

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        popoverBoundaryLayer: [
            classNames.popoverBoundaryLayer,
            {
                height: '100%',
                left: 0,
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                width: '100%'
            } as IStyle
        ],
        modalContainer: [
            classNames.modalContainer,
            {
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'stretch',
                maxWidth: 400,
                transform: 'translate(1000px, 0px)'
            } as IStyle
        ],
        modalHeader: [
            classNames.modalHeader,
            {
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 12px 14px 24px',
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
