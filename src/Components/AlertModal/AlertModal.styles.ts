import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const alertModalClassPrefix = 'cb-alert-modal';
const classNames = {
    boundaryLayer: `${alertModalClassPrefix}-boundary-layer`,
    modalContainer: `${alertModalClassPrefix}-modal-container`
};

const modalBorderColor = 'var(--cb-color-modal-border)';

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        boundaryLayer: [
            classNames.boundaryLayer,
            {
                pointerEvents: 'auto',
                position: 'absolute',
                zIndex: 1000,
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'stretch',
                minWidth: 200,
                backgroundColor: 'var(--cb-color-glassy-modal)',
                backdropFilter: 'blur(24px) brightness(150%)',
                borderRadius: 2,
                border: `1px solid ${modalBorderColor}`,
                borderTop: '0px'
            } as IStyle
        ]
    });
});
