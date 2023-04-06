import {
    IPageManagerStyleProps,
    IPageManagerStyles
} from './PageManager.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-pagemanager`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const PAGEMANAGER_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IPageManagerStyleProps
): IPageManagerStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
