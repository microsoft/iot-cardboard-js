import { FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../../../Models/Constants/Constants';
import {
    IConditionsListStyles,
    IConditionsListStylesProps
} from './ConditionsList.types';

const classPrefix = CardboardClassNamePrefix + '-conditions-list';
const classNames = {
    root: `${classPrefix}-root`
};

export const getStyles = (
    props: IConditionsListStylesProps
): IConditionsListStyles => {
    return {
        root: [
            classNames.root,
            // 30px is label size, since this is resizing need to calc the 100% - label
            { overflow: 'auto', height: 'calc(100% - 30px)' }
        ],
        subComponentStyles: {
            addButton: {
                root: {
                    color: props.theme.palette.themePrimary,
                    marginLeft: 2
                }
            }
        }
    };
};

export const getMeshColoringStyles = (color: string) => {
    return {
        root: {
            color: color,
            fontSize: FontSizes.size24,
            marginRight: 8
        }
    };
};

export const getBadgeStyles = (color: string) => {
    return {
        root: {
            background: color,
            borderRadius: '50%',
            fontSize: FontSizes.size16,
            padding: 4,
            marginRight: 8
        }
    };
};
