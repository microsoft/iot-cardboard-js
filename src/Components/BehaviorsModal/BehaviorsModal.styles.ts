import {
    FontWeights,
    IButtonStyles,
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
    modalTitle: `${behaviorsModalClassPrefix}-modal-title`
};

const initialPopoverTopOffset = 60;
const initialPopoverRightOffset = 20;

const modalBorderColor = 'var(--cb-color-modal-border)';

export const getStyles = memoizeFunction(() => {
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
                maxWidth: 300,
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
                paddingLeft: '8px'
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

export const separatorStyles: Partial<ISeparatorStyles> = {
    root: {
        ':before': { backgroundColor: modalBorderColor }
    }
};

export const dismissButtonStyles: IButtonStyles = {
    root: {
        color: 'var(--cb-color-text-primary)',
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
        alignSelf: 'flex-end'
    },
    rootHovered: {
        color: 'var(--cb-color-text-primary)'
    }
};
