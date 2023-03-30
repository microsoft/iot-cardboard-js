import {
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
} from './CustomContextMenu.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-customcontextmenu`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const CUSTOMCONTEXTMENU_CLASS_NAMES = classNames;
export const getStyles = (
    _props: ICustomContextMenuStyleProps
): ICustomContextMenuStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
