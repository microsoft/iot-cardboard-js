import {
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
} from './DataSourceStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-datasourcestep`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const DATASOURCESTEP_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IDataSourceStepStyleProps
): IDataSourceStepStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
