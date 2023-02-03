import { cleanup } from '@testing-library/react-hooks';
import { getMockModelItem } from '../../Context/OatPageContext/OatPageContext.mock';
import { IMPORT_LOC_KEYS, parseFilesToModels } from '../OatPublicUtils';

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
    const mockTranslate = (key: string, args?: any) => {
        if (args) {
            return `${key}:${JSON.stringify(args)}`;
        } else {
            return key;
        }
    };
    const DEFAULT_MODEL_ID = 'dtmi:test-model-1;1';
    const DEFAULT_FILE_NAME = 'test-file-1';
    const getMockFile = (args?: {
        modelId?: string;
        fileName?: string;
        fileType?: string;
        fileContent?: string;
    }): File => {
        const name = args?.fileName ?? DEFAULT_FILE_NAME;
        const content =
            args?.fileContent ??
            JSON.stringify(getMockModelItem(args?.modelId ?? DEFAULT_MODEL_ID));
        const file = new File([], name, {
            type: args?.fileType ?? 'application/json'
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
        test('file with non-json type causes failure', async () => {
            // ARRANGE
            const badFile = getMockFile({
                fileName: 'bad-file',
                fileType: 'somethingBad'
            });
            const files = [getMockFile(), badFile];
            // ACT
            const result = await parseFilesToModels({
                files: files,
                currentModels: [],
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Failed');
            expect(result.errors).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "message": "OAT.ImportErrors.fileFormatNotSupportedMessage:{\\"fileNames\\":\\"'bad-file'\\"}",
                    "title": "OAT.ImportErrors.fileFormatNotSupportedTitle",
                  },
                ]
            `);
            expect(result.models).toEqual([]);
        });
        test('file with malformed json causes failure', async () => {
            // ARRANGE
            const badData =
                JSON.stringify(getMockModelItem(DEFAULT_MODEL_ID)) +
                'something';
            const badFile = getMockFile({ fileContent: badData });
            const files = [badFile];
            // ACT
            const result = await parseFilesToModels({
                files: files,
                currentModels: [],
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Failed');
            expect(result.errors).toMatchInlineSnapshot(`
                Array [
                  Object {
                    "message": "OAT.ImportErrors.fileInvalidJSON:{\\"fileName\\":\\"test-file-1\\"}
                ",
                    "title": "OAT.ImportErrors.importFailedTitle",
                  },
                ]
            `);
            expect(result.models).toEqual([]);
        });
    });
});
