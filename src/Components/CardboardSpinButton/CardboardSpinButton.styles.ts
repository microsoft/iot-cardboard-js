import {
    ICardboardSpinButtonStyleProps,
    ICardboardSpinButtonStyles
} from './CardboardSpinButton.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

export const classPrefix = `${CardboardClassNamePrefix}-cardboardspinbutton`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ICardboardSpinButtonStyleProps
): ICardboardSpinButtonStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
