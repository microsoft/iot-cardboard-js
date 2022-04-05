import {
    FontWeights,
    IButtonStyles,
    IPivotStyles,
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
    modalHeaderContainer: `${behaviorsModalClassPrefix}-modal-header-container`,
    modalHeader: `${behaviorsModalClassPrefix}-modal-header`,
    modalSubHeaderPivot: `${behaviorsModalClassPrefix}-modal-sub-header-pivor`,
    modalTitle: `${behaviorsModalClassPrefix}-modal-title`,
    modalContents: `${behaviorsModalClassPrefix}-modal-contents`
};

const initialPopoverTopOffset = 112;
const initialPopoverRightOffset = 10;

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
        modalHeaderContainer: [
            classNames.modalHeaderContainer,
            {
                // borderBottom: `1px solid ${modalBorderColor}`,
                padding: '4px 8px 4px 20px'
            } as IStyle
        ],
        modalHeader: [
            classNames.modalHeader,
            {
                flex: '1 1 auto',
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                fontSize: '16px'
            } as IStyle
        ],
        modalSubHeaderPivot: [classNames.modalSubHeaderPivot, {} as IStyle],
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

export const separatorStyles: Partial<ISeparatorStyles> = {
    root: {
        ':before': { backgroundColor: modalBorderColor },
        padding: 0,
        height: 1
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

export const pivotStyles: Partial<IPivotStyles> = {
    root: {
        // marginBottom: 8,
        marginLeft: -8
    }
};
