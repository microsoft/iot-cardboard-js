import { cleanup } from '@testing-library/react-hooks';
import { OAT_MODEL_ID_PREFIX } from '../../Constants/Constants';
import { parseModelId } from '../OatUtils';

afterEach(cleanup);

describe('OatUtils', () => {
    describe('parseModelId', () => {
        test('parses out all parts of a valid model id', () => {
            // ARRANGE
            const id = `${OAT_MODEL_ID_PREFIX}:testNamespace:testFolder1:testModel;2`;

            // ACT
            const result = parseModelId(id);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.path).toEqual('testNamespace:testFolder1');
            expect(result.name).toEqual('testModel');
            expect(result.version).toEqual('2');
        });
        test('parses correctly even without a path', () => {
            // ARRANGE
            const id = `${OAT_MODEL_ID_PREFIX}:testModel;2`;

            // ACT
            const result = parseModelId(id);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.path).toEqual('');
            expect(result.name).toEqual('testModel');
            expect(result.version).toEqual('2');
        });
    });
});
