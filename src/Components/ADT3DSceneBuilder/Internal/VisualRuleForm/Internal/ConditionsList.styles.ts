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
            { overflow: 'auto', maxHeight: '100%' }
        ]
    };
};
