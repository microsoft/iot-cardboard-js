import { IVisualRuleFormStyles } from './VisualRuleForm.types';

export const getStyles = (): IVisualRuleFormStyles => {
    return {
        subComponentStyles: {
            label: {
                root: {
                    paddingLeft: 12
                }
            }
        }
    };
};
