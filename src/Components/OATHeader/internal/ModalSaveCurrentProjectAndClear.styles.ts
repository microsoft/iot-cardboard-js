import {
    IModalDeleteStyleProps,
    IModalDeleteStyles
} from './ModalDelete.types';
import { getCommonModalStyles } from './Shared.styles';

// const classPrefix = `${CardboardClassNamePrefix}-modal-delete`;
// const classNames = {};
export const getStyles = (
    props: IModalDeleteStyleProps
): IModalDeleteStyles => {
    return getCommonModalStyles(props);
};
