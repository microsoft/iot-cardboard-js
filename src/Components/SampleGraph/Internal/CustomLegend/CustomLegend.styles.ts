import {
    ICustomLegendStyleProps,
    ICustomLegendStyles
} from './CustomLegend.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-customlegend`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const CUSTOMLEGEND_CLASS_NAMES = classNames;
export const getStyles = (
    _props: ICustomLegendStyleProps
): ICustomLegendStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
