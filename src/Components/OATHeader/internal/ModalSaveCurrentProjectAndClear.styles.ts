import {
    IModalDeleteStyleProps,
    IModalDeleteStyles
} from './ModalDelete.types';
import { getCommonModalStyles } from './Shared';

// const classPrefix = `${CardboardClassNamePrefix}-modal-delete`;
// const classNames = {};
export const getStyles = (
    _props: IModalDeleteStyleProps
): IModalDeleteStyles => {
    return {
        ...getCommonModalStyles()
    };
};
