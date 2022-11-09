import { cleanup } from '@testing-library/react-hooks';
import { DTDLComponent, DTDLType } from '../../../Classes/DTDL';
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
        const getMockDtdlComponent = (name: string, targetId: string) => {
            const component = new DTDLComponent(
                null, // id
                name, // name
                targetId //schema
            );
            return component;
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
                'Component'
            );
            const updatedModel = getModelById(sourceModelId, contextState);

            // ASSERT
            const afterCount = updatedModel.contents.filter(
                (x) => x['@type'] === DTDLType.Component
            ).length;
            expect(beforeCount).not.toEqual(afterCount);

            const lastComponent = updatedModel.contents.pop();
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
            targetModel.contents = [
                getMockDtdlComponent('mock_name_targetId1_0', targetModelId)
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
                'Component'
            );
            const updatedModel = getModelById(sourceModelId, contextState);

            // ASSERT
            const afterCount = updatedModel.contents.filter(
                (x) => x['@type'] === DTDLType.Component
            ).length;
            expect(beforeCount).not.toEqual(afterCount);

            const lastComponent = updatedModel.contents.pop();
            expect(lastComponent).toBeDefined();
            expect(lastComponent.name).toEqual('mock_name_targetId1_1');
            expect(lastComponent.schema).toEqual(targetModelId);
        });
    });
});
