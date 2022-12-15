import { cleanup } from '@testing-library/react-hooks';
import { DTDLType } from '../../../Classes/DTDL';
import {
    DtdlComponent,
    DtdlRelationship,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../../Constants';
import {
    getMockModelItem,
    GET_MOCK_OAT_CONTEXT_STATE
} from '../OatPageContext.mock';
import { IOatPageContextState } from '../OatPageContext.types';
import { addTargetedRelationship } from '../OatPageContextUtils';

afterEach(cleanup);

describe('OatPageContextUtils', () => {
    describe('addTargetedRelationship', () => {
        let contextState: IOatPageContextState;

        const getModelById = (id: string, state: IOatPageContextState) => {
            return state.currentOntologyModels.find((x) => x['@id'] === id);
        };
        const getMockComponent = (name: string, targetModelId: string) => {
            const component: DtdlComponent = {
                '@type': DTDLType.Component,
                name: name,
                schema: targetModelId
            };
            return component;
        };
        const getMockRelationship = (name: string, targetModelId: string) => {
            const relationship: DtdlRelationship = {
                '@type': DTDLType.Relationship,
                name: name,
                target: targetModelId
            };
            return relationship;
        };

        beforeEach(() => {
            contextState = GET_MOCK_OAT_CONTEXT_STATE();
        });

        test('COMPONENT - first relationship of this type, gets added to the contents', () => {
            // ARRANGE
            const sourceModelId = 'sourceId1';
            const targetModelId = 'targetId1';
            const sourceModel = getMockModelItem(sourceModelId);
            const targetModel = getMockModelItem(targetModelId);
            contextState.currentOntologyModels.push(sourceModel);
            contextState.currentOntologyModels.push(targetModel);

            const beforeCount = getModelById(
                sourceModelId,
                contextState
            ).contents.filter((x) => x['@type'] === DTDLType.Component).length;

            // ACT
            addTargetedRelationship(
                contextState,
                sourceModelId,
                targetModelId,
                DTDLType.Component
            );
            const updatedModel = getModelById(sourceModelId, contextState);

            // ASSERT
            const afterCount = updatedModel.contents.filter(
                (x) => x['@type'] === DTDLType.Component
            ).length;
            expect(beforeCount).not.toEqual(afterCount);

            const lastComponent = updatedModel.contents.pop() as DtdlComponent;
            expect(lastComponent).toBeDefined();
            expect(lastComponent.name).toEqual('mock_name_targetId1_0');
            expect(lastComponent.schema).toEqual(targetModelId);
        });

        test('COMPONENT - second relationship of this type, name incremented', () => {
            // ARRANGE
            const sourceModelId = 'sourceId1';
            const targetModelId = 'targetId1';
            const sourceModel = getMockModelItem(sourceModelId);
            const targetModel = getMockModelItem(targetModelId);
            sourceModel.contents = [
                getMockComponent('mock_name_targetId1_0', targetModelId)
            ];
            contextState.currentOntologyModels.push(sourceModel);
            contextState.currentOntologyModels.push(targetModel);

            const beforeCount = getModelById(
                sourceModelId,
                contextState
            ).contents.filter((x) => x['@type'] === DTDLType.Component).length;

            // ACT
            addTargetedRelationship(
                contextState,
                sourceModelId,
                targetModelId,
                DTDLType.Component
            );
            const updatedModel = getModelById(sourceModelId, contextState);

            // ASSERT
            const afterCount = updatedModel.contents.filter(
                (x) => x['@type'] === DTDLType.Component
            ).length;
            expect(beforeCount).not.toEqual(afterCount);

            const lastComponent = updatedModel.contents.pop() as DtdlComponent;
            expect(lastComponent).toBeDefined();
            expect(lastComponent.name).toEqual('mock_name_targetId1_1');
            expect(lastComponent.schema).toEqual(targetModelId);
        });

        test('RELATIONSHIP - first relationship of this type, gets added to the contents', () => {
            // ARRANGE
            const sourceModelId = 'sourceId1';
            const targetModelId = 'targetId1';
            const sourceModel = getMockModelItem(sourceModelId);
            const targetModel = getMockModelItem(targetModelId);
            contextState.currentOntologyModels.push(sourceModel);
            contextState.currentOntologyModels.push(targetModel);

            const beforeCount = getModelById(
                sourceModelId,
                contextState
            ).contents.filter((x) => x['@type'] === DTDLType.Relationship)
                .length;

            // ACT
            addTargetedRelationship(
                contextState,
                sourceModelId,
                targetModelId,
                DTDLType.Relationship
            );
            const updatedModel = getModelById(sourceModelId, contextState);

            // ASSERT
            const afterCount = updatedModel.contents.filter(
                (x) => x['@type'] === DTDLType.Relationship
            ).length;
            expect(beforeCount).not.toEqual(afterCount);

            const lastRelationship = updatedModel.contents.pop() as DtdlRelationship;
            expect(lastRelationship).toBeDefined();
            expect(lastRelationship.name).toEqual(
                OAT_RELATIONSHIP_HANDLE_NAME + '_0'
            );
            expect(lastRelationship.target).toEqual(targetModelId);
        });

        test('RELATIONSHIP - second relationship of this type, name incremented', () => {
            // ARRANGE
            const sourceModelId = 'sourceId1';
            const targetModelId = 'targetId1';
            const sourceModel = getMockModelItem(sourceModelId);
            const targetModel = getMockModelItem(targetModelId);
            sourceModel.contents = [
                getMockRelationship(
                    OAT_RELATIONSHIP_HANDLE_NAME + '_0',
                    targetModelId
                )
            ];
            contextState.currentOntologyModels.push(sourceModel);
            contextState.currentOntologyModels.push(targetModel);

            const beforeCount = getModelById(
                sourceModelId,
                contextState
            ).contents.filter((x) => x['@type'] === DTDLType.Relationship)
                .length;

            // ACT
            addTargetedRelationship(
                contextState,
                sourceModelId,
                targetModelId,
                DTDLType.Relationship
            );
            const updatedModel = getModelById(sourceModelId, contextState);

            // ASSERT
            const afterCount = updatedModel.contents.filter(
                (x) => x['@type'] === DTDLType.Relationship
            ).length;
            expect(beforeCount).not.toEqual(afterCount);

            const lastComponent = updatedModel.contents.pop() as DtdlRelationship;
            expect(lastComponent).toBeDefined();
            expect(lastComponent.name).toEqual(
                OAT_RELATIONSHIP_HANDLE_NAME + '_1'
            );
            expect(lastComponent.target).toEqual(targetModelId);
        });
    });
});
