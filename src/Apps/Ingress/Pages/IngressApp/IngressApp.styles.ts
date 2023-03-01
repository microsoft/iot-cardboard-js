import { IIngressAppStyleProps, IIngressAppStyles } from './IngressApp.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';

const classPrefix = `${CardboardClassNamePrefix}-ingresspage`;
const classNames = {
    root: `${classPrefix}-root`
};

export const INGRESSPAGE_CLASS_NAMES = classNames;
export const getStyles = (_props: IIngressAppStyleProps): IIngressAppStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
