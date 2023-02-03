import { cleanup } from '@testing-library/react-hooks';
import { getMockModelItem } from '../../Context/OatPageContext/OatPageContext.mock';
import { parseFilesToModels } from '../OatPublicUtils';

afterEach(cleanup);

jest.mock('azure-iot-dtdl-parser', () => {
    const originalModule = jest.requireActual('azure-iot-dtdl-parser');
    return {
        ...originalModule,
        createParser: jest.fn().mockImplementation(() => {
            return {
                parse: () => Promise.resolve()
            };
        })
    };
});

describe('OatPublicUtils', () => {
    const mockTranslate = (key: string, args: any) => {
        return `${key}:${JSON.stringify(args)}`;
    };
    const DEFAULT_MODEL_ID = 'dtmi:test-model-1;1';
    const DEFAULT_FILE_NAME = 'test-file-1';
    const getMockFile = (modelId?: string, fileName?: string): File => {
        const name = fileName ?? DEFAULT_FILE_NAME;
        const content = JSON.stringify(
            getMockModelItem(modelId ?? DEFAULT_MODEL_ID)
        );
        const file = new File([], name, {
            type: 'application/json'
        });
        file.text = () => Promise.resolve(content);
        return file;
    };
    describe('parseFilesToModels', () => {
        test('empty file list is success with no models or errors', async () => {
            // ARRANGE
            const files = [];
            // ACT
            const result = await parseFilesToModels({
                files: files,
                currentModels: [],
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Success');
            expect(result.errors).toEqual([]);
            expect(result.models).toEqual([]);
        });
        test('single file parses successfully', async () => {
            // ARRANGE
            const files = [getMockFile()];
            // ACT
            const result = await parseFilesToModels({
                files: files,
                currentModels: [],
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Success');
            expect(result.errors).toEqual([]);
            expect(result.models.length).toEqual(1);
            expect(result.models[0]['@id']).toEqual(DEFAULT_MODEL_ID);
        });
        xtest('do it', async () => {
            // ARRANGE
            const files = [];
            // ACT
            const result = await parseFilesToModels({
                files: files,
                currentModels: [],
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Success');
            expect(result.errors).toEqual([]);
            expect(result.models).toEqual([]);
        });
    });
});
