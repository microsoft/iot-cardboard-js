import { FontSizes } from '@fluentui/react';
import {
    IVisualRuleFormStyles,
    IVisualRuleFormStylesProps
} from './VisualRuleForm.types';

export const getStyles = (
    props: IVisualRuleFormStylesProps
): IVisualRuleFormStyles => {
    return {
        descriptionContainer: {
            fontSize: FontSizes.size14,
            color: props.theme.palette.neutralSecondary
        },
        subComponentStyles: {
            label: {
                root: {
                    paddingLeft: 12
                }
            }
        }
    };
};
