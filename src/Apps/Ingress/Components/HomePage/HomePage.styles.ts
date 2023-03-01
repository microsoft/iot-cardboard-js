import { IHomePageStyleProps, IHomePageStyles } from './HomePage.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-ingresshome`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const INGRESSHOME_CLASS_NAMES = classNames;
export const getStyles = (_props: IHomePageStyleProps): IHomePageStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
