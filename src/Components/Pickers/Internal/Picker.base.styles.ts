import { IPickerBaseStyleProps, IPickerBaseStyles } from './Picker.base.types';

const classPrefix = 'color-select-button';
const classNames = {
    root: `${classPrefix}-root`,
    button: `${classPrefix}-button`
};
export const getStyles = (_props: IPickerBaseStyleProps): IPickerBaseStyles => {
    return {
        root: [classNames.root],
        button: [],
        subComponentStyles: {
            callout: {
                calloutMain: {
                    // this is not exposed on the styles directly
                    '& .ms-swatchColorPickerBodyContainer': {
                        minWidth: 'unset',
                        ' .ms-Button': {
                            cursor: 'pointer',
                            backgroundColor: 'transparent',
                            width: 28,
                            height: 28,
                            margin: 0,
                            padding: '2px',
                            borderRadius: 0,
                            borderStyle: 'solid',
                            borderWidth: 0,
                            ':hover': {
                                backgroundColor:
                                    'var(--cb-color-card-contrast)',
                                '::before': {
                                    boxShadow: 'none'
                                },
                                borderRadius: 0,
                                margin: 0,
                                padding: '2px'
                            }
                        }
                    },
                    // there is no good class to grab here
                    '& table': {
                        margin: 8
                    }
                }
            }
        }
    };
};
