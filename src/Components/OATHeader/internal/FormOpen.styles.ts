import { IFormOpenStyleProps, IFormOpenStyles } from './FormOpen.types';
import { getCommonModalStyles } from './Shared.styles';

export const getStyles = (props: IFormOpenStyleProps): IFormOpenStyles => {
    return getCommonModalStyles(props);
};
