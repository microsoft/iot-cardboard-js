import { IConsoleLogFunction } from '../../../../Models/Constants';
import { IVisualRuleFormState } from '../Behaviors/VisualRules/VisualRules.types';

/**
 * Looks at the state and determines whether anything has been changed
 * @param state the current state of the form contains both draft and original state
 * @returns boolean indicating whether anything has been changed
 */
export function isStateDirty(
    state: IVisualRuleFormState,
    logger: IConsoleLogFunction
): boolean {
    const newVisualRule = state.visualRuleToEdit;

    const hasVisualRuleChanged =
        JSON.stringify(newVisualRule) !==
        JSON.stringify(state.originalVisualRule);
    logger('debug', `hasVisualRuleChanged: ${hasVisualRuleChanged}`);

    return hasVisualRuleChanged;
}
