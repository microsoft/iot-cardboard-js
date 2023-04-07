import { IStoreListStyleProps, IStoreListStyles } from './StoreList.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-storelist`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const STORELIST_CLASS_NAMES = classNames;
export const getStyles = (_props: IStoreListStyleProps): IStoreListStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
