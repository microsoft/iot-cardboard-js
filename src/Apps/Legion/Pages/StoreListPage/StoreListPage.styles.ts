import { CardboardClassNamePrefix } from '../../../../Models/Constants';
import {
    IStoreListPageStyleProps,
    IStoreListPageStyles
} from './StoreListPage.types';

const classPrefix = `${CardboardClassNamePrefix}-StoreListPage`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const StoreListPage_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IStoreListPageStyleProps
): IStoreListPageStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
