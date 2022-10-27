import { IActionItemStyleProps, IActionItemStyles } from './ActionItem.types';

export const classPrefix = 'cb-actionitem';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (_props: IActionItemStyleProps): IActionItemStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            dropdown: {
                root: {
                    minWidth: '126px'
                }
            },
            colorPicker: {
                // match the icon picker
                button: {
                    height: 32,
                    width: 32
                }
            }
        }
    };
};
