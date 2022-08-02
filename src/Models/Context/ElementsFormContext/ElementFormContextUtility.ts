import { IConsoleLogFunction } from '../../Constants/Types';
import { IElement } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import { IElementFormContextState } from './ElementFormContext.types';

/**
 * Looks at the state and determines whether anything has been changed
 * @param state the current state of the form
 * @param originalElement the element that the form was initialized with
 * @param originalLayers the list of layers that the form was initialized with
 * @returns boolean indicating whether anything has been changed
 */
export function isStateDirty(
    state: IElementFormContextState,
    originalElement: IElement,
    originalBehaviorIds: string[],
    logger: IConsoleLogFunction
): boolean {
    const newElement = state.elementToEdit;
    const newBehaviors = state.linkedBehaviorIds;

    const hasElementChanged =
        JSON.stringify(newElement) !== JSON.stringify(originalElement);
    const hasBehaviorsChanged =
        JSON.stringify(newBehaviors) !== JSON.stringify(originalBehaviorIds);

    const isDirty = hasElementChanged || hasBehaviorsChanged;
    logger(
        'debug',
        `IsFormDirty: ${isDirty}. ElementDirty: ${hasElementChanged}, BehaviorsDirty: ${hasBehaviorsChanged}`
    );

    return isDirty;
}
