import { IPickerBaseStyleProps, IPickerBaseStyles } from './Picker.base.types';

const classPrefix = 'color-select-button';
const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`
};
export const getStyles = (_props: IPickerBaseStyleProps): IPickerBaseStyles => {
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
            callout: {
                root: {
                    margin: 8
                },
                calloutMain: {
                    '& .ms-swatchColorPickerBodyContainer': {
                        minWidth: 'unset'
                    }
                }
            }
        }
    };
};
