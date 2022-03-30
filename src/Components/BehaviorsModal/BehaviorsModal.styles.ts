import {
    FontWeights,
    IButtonStyles,
    ISeparatorStyleProps,
    ISeparatorStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';

export const behaviorsModalClassPrefix = 'cb-behaviors-modal';
const classNames = {
    boundaryLayer: `${behaviorsModalClassPrefix}-boundary-layer`,
    draggable: `${behaviorsModalClassPrefix}-draggable`,
    separator: `${behaviorsModalClassPrefix}-separator`,
    modalContainer: `${behaviorsModalClassPrefix}-modal-container`,
    modalHeader: `${behaviorsModalClassPrefix}-modal-header`,
    modalTitle: `${behaviorsModalClassPrefix}-modal-title`,
    modalContents: `${behaviorsModalClassPrefix}-modal-contents`
};

const getModalBorderColor = (isPreview) => {
    return isPreview
        ? 'var(--cb-color-text-primary)'
        : 'var(--cb-color-modal-border)';
};

export const getStyles = memoizeFunction((isPreview: boolean) => {
    const modalBorderColor = getModalBorderColor(isPreview);
    const initialPopoverTopOffset = isPreview ? 124 : 112;
    const initialPopoverRightOffset = isPreview ? 8 : 10;
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
                border: `1px solid ${modalBorderColor}`,
                cursor: 'move',
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
                fontWeight: FontWeights.semibold,
                fontSize: '16px',
                borderBottom: `1px solid ${modalBorderColor}`,
                height: 40,
                padding: '4px 8px 4px 20px'
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
});

export const getSeparatorStyles = (_props: ISeparatorStyleProps, isPreview) => {
    return {
        root: {
            ':before': { backgroundColor: getModalBorderColor(isPreview) },
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
