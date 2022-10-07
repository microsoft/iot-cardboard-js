import { CardboardClassNamePrefix } from '../../../../../Models/Constants/Constants';
import { IConditionsListStyles } from './ConditionsList.types';

const classPrefix = CardboardClassNamePrefix + '-conditions-list';
const classNames = {
    container: `${classPrefix}-container`
};

export const getStyles = (): IConditionsListStyles => {
    return {
        container: [
            classNames.container,
            // 29px is label size, since this is resizing need to calc the 100% - label
            { overflow: 'auto', height: 'calc(100% - 30px)' }
        ]
    };
};
