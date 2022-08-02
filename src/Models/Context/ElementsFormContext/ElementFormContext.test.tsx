import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    ElementFormContextProvider,
    ElementFormContextReducer
} from './ElementFormContext';
import { GET_MOCK_ELEMENT_FORM_STATE } from './ElementFormContext.mock';
import {
    ElementFormContextAction,
    ElementFormContextActionType
} from './ElementFormContext.types';
import { getDefaultElement } from '../../Classes/3DVConfig';

describe('ElementFormContext', () => {
    afterEach(cleanup);
    describe('Actions', () => {
        describe('Behaviors', () => {
            test('[Add] - adds the behavior to the list when no behavior exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.linkedBehaviorIds = []; // no items

                const behaviorId = 'id1';
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_ADD,
                    payload: {
                        id: behaviorId
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const behaviors = result.linkedBehaviorIds.filter(
                    (x) => x === behaviorId
                );
                expect(result.linkedBehaviorIds.length).toEqual(1);
                expect(behaviors.length).toEqual(1);
            });

            test('[Add] - updates the behaviors list when a matching behavior already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                const behaviorId = 'id1';
                initialState.linkedBehaviorIds = [behaviorId, 'something else']; // existing data

                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_ADD,
                    payload: {
                        id: behaviorId
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const behaviors = result.linkedBehaviorIds.filter(
                    (x) => x === behaviorId
                );
                expect(result.linkedBehaviorIds.length).toEqual(2);
                expect(behaviors.length).toEqual(1);
            });

            test('[Remove] - silently passes when trying to remove a behavior when there is none in the list', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.linkedBehaviorIds = []; // no data

                const behaviorId = 'id1';
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_REMOVE,
                    payload: { id: behaviorId }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const behaviors = result.linkedBehaviorIds.filter(
                    (x) => x === behaviorId
                );
                expect(result.linkedBehaviorIds.length).toEqual(0);
                expect(behaviors.length).toEqual(0);
            });

            test('[Remove] - removes the behavior fromt the list if a behavior already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                const behaviorId = 'id1';
                initialState.linkedBehaviorIds = [behaviorId, 'something else']; // has data

                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_REMOVE,
                    payload: { id: behaviorId }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const behaviors = result.linkedBehaviorIds.filter(
                    (x) => x === behaviorId
                );
                expect(result.linkedBehaviorIds.length).toEqual(1);
                expect(behaviors.length).toEqual(0);
            });
        });

        describe('Twin aliases', () => {
            const getTwinAlias = (aliasName: string, target: string) => {
                const alias = {};
                alias[aliasName] = target;
                return alias;
            };
            test('[Add/Update] - adds the twinAlias when no twinAlias exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.elementToEdit.twinAliases = {}; // no items

                const ALIAS_NAME = 'my alias 1';
                const ALIAS_TARGET = 'target alias';
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD,
                    payload: {
                        aliasName: ALIAS_NAME,
                        aliasTarget: ALIAS_TARGET
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const twinAliases = result.elementToEdit.twinAliases;
                expect(Object.keys(twinAliases).length).toEqual(1);
                expect(twinAliases[ALIAS_NAME]).toEqual(ALIAS_TARGET);
            });

            test('[Add/Update] - updates the twinAlias in the list of twin aliases when a matching twinAlias already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                const ALIAS_NAME = 'my alias 1';
                const ALIAS_TARGET = 'target alias';
                initialState.elementToEdit.twinAliases = getTwinAlias(
                    ALIAS_NAME,
                    ALIAS_TARGET
                ); // existing data

                const NEW_TARGET = 'new target';
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD,
                    payload: {
                        aliasName: ALIAS_NAME,
                        aliasTarget: NEW_TARGET
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const twinAliases = result.elementToEdit.twinAliases;
                expect(Object.keys(twinAliases).length).toEqual(1);
                expect(twinAliases[ALIAS_NAME]).toEqual(NEW_TARGET);
            });

            test('[Remove] - silently passes when trying to remove a twinAlias when there is none on the element', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.elementToEdit.twinAliases = {}; // no data

                const ALIAS_NAME = 'my alias 1';
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_REMOVE,
                    payload: {
                        aliasName: ALIAS_NAME
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const twinAliases = result.elementToEdit.twinAliases;
                expect(twinAliases).toBeUndefined();
            });

            test('[Remove] - removes the twinAlias in the list of twin aliases if a twinAlias already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                const ALIAS_NAME = 'my alias 1';
                const ALIAS_TARGET = 'target alias';
                initialState.elementToEdit.twinAliases = {
                    ...getTwinAlias(ALIAS_NAME, ALIAS_TARGET),
                    ...getTwinAlias('alias2', 'target2')
                }; // existing data

                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_REMOVE,
                    payload: {
                        aliasName: ALIAS_NAME
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                const twinAliases = result.elementToEdit.twinAliases;
                expect(Object.keys(twinAliases).length).toEqual(1);
                expect(twinAliases['alias2']).toEqual('target2');
            });
        });

        describe('Display name', () => {
            test('should set display name to provided value', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.elementToEdit.displayName = 'some initial value';

                const name = 'new name';
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_DISPLAY_NAME_SET,
                    payload: {
                        name: name
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                expect(result.elementToEdit.displayName).toEqual(name);
            });
        });

        describe('Mesh ids', () => {
            test('should set mesh ids to provided value', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.elementToEdit.objectIDs = ['some initial value'];

                const newMeshIds = ['new name', 'another'];
                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS,
                    payload: {
                        meshIds: newMeshIds
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                expect(result.elementToEdit.objectIDs.length).toEqual(
                    newMeshIds.length
                );
                expect(result.elementToEdit.objectIDs[0]).toEqual(
                    newMeshIds[0]
                );
            });
        });

        describe('Twin id', () => {
            test('should set twin id to provided value', () => {
                // ARRANGE
                const initialState = GET_MOCK_ELEMENT_FORM_STATE();
                initialState.elementToEdit.primaryTwinID = 'some initial value';

                const id = 'new id';
                const action: ElementFormContextAction = {
                    type: ElementFormContextActionType.FORM_ELEMENT_TWIN_ID_SET,
                    payload: {
                        twinId: id
                    }
                };

                // ACT
                const result = ElementFormContextReducer(initialState, action);

                // ASSERT
                expect(result.elementToEdit.primaryTwinID).toEqual(id);
            });
        });

        describe('isDirty', () => {
            const INITIAL_BEHAVIOR_NAME = 'initial display name';
            const INITIAL_LAYER_ID = 'initial layer id';
            const initialLayerList = [INITIAL_LAYER_ID];
            const initialElement: ITwinToObjectMapping = {
                ...getDefaultElement({
                    id: 'initialElementId',
                    displayName: INITIAL_BEHAVIOR_NAME
                })
            };

            beforeEach(() => {
                // instantiate the provider to capture the initial values
                render(
                    <ElementFormContextProvider
                        elementToEdit={initialElement}
                        linkedBehaviorIds={initialLayerList}
                    />
                );
            });

            test('triggering an action on the element sets the dirty state to true', () => {
                // ARRANGE
                const state = GET_MOCK_ELEMENT_FORM_STATE();
                state.elementToEdit = initialElement;
                state.linkedBehaviorIds = initialLayerList;
                state.isDirty = false;

                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD,
                    payload: {
                        aliasName: 'my alias',
                        aliasTarget: 'target'
                    }
                };

                // ACT
                const result = ElementFormContextReducer(state, action);

                // ASSERT
                expect(result.isDirty).toBeTruthy();
            });

            test('triggering an action on the behaviors sets the dirty state to true', () => {
                // ARRANGE
                const state = GET_MOCK_ELEMENT_FORM_STATE();
                state.elementToEdit = initialElement;
                state.linkedBehaviorIds = initialLayerList;
                state.isDirty = false;

                const action: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_ADD,
                    payload: {
                        id: 'something'
                    }
                };

                // ACT
                const result = ElementFormContextReducer(state, action);

                // ASSERT
                expect(result.isDirty).toBeTruthy();
            });

            test('reverting a change from an action sets the dirty state to false again', () => {
                // ARRANGE
                const state = GET_MOCK_ELEMENT_FORM_STATE();
                state.elementToEdit = initialElement;
                state.linkedBehaviorIds = initialLayerList;
                state.isDirty = false;

                const addAction: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD,
                    payload: {
                        aliasName: 'my alias',
                        aliasTarget: 'target'
                    }
                };
                const removeAction: ElementFormContextAction = {
                    type:
                        ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_REMOVE,
                    payload: {
                        aliasName: 'my alias'
                    }
                };

                // ACT
                const result1 = ElementFormContextReducer(state, addAction);
                const result2 = ElementFormContextReducer(
                    result1,
                    removeAction
                );

                // ASSERT
                expect(result1.isDirty).toBeTruthy();
                expect(result2.isDirty).toBeFalsy();
            });
        });
    });
});
