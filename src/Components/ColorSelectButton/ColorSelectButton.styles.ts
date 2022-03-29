import {
    IColorSelectButtonStyleProps,
    IColorSelectButtonStyles
} from './ColorSelectButton.types';

const classPrefix = 'color-select-button';
const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`
};
export const getStyles = (
    _props: IColorSelectButtonStyleProps
): IColorSelectButtonStyles => {
    return {
        root: [classNames.root],
        button: [
            classNames.button,
            {
                border: '1px solid var(--cb-color-input-border)',
                borderRadius: '50%',
                cursor: 'pointer',
                height: 28,
                width: 28
            }
        ],
        subComponentStyles: {
            callout: { root: { width: 100 } }
        }
    };
};
