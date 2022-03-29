import { IIconPickerStyleProps, IIconPickerStyles } from './IconPicker.types';

export const getStyles = (_props: IIconPickerStyleProps): IIconPickerStyles => {
    return {
        subComponentStyles: {
            callout: {
                calloutMain: {
                    // there is no good class to grab here
                    '& td': {
                        padding: 2
                    }
                }
            }
        }
    };
};
