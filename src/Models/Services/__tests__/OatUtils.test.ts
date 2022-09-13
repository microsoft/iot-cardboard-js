import { cleanup } from '@testing-library/react-hooks';
import { ProjectData } from '../../../Pages/OATEditorPage/Internal/Classes/ProjectData';
import {
    IOATModelPosition,
    IOATModelsMetadata
} from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { DTDLModel } from '../../Classes/DTDL';
import { OATDataStorageKey } from '../../Constants';
import {
    getStoredEditorData,
    getStoredEditorModelMetadata,
    getStoredEditorModelPositionsData,
    getStoredEditorModelsData,
    getStoredEditorNamespaceData,
    getStoredEditorTemplateData,
    storeEditorData
} from '../OatUtils';

afterEach(cleanup);

describe('OatUtils', () => {
    describe('Get/set editor data', () => {
        let originalStorage: Storage;
        let mockLocalStorage: {
            getItem: jest.Mock;
            clear: jest.Mock;
            removeItem: jest.Mock;
            setItem: jest.Mock;
            key: jest.Mock;
            length: number;
        };
        const getMockStorage = () => ({
            getItem: jest.fn(),
            clear: jest.fn(),
            removeItem: jest.fn(),
            setItem: jest.fn(),
            key: jest.fn(),
            length: 0
        });
        const MOCK_MODEL_ID = 'mock model id';
        const getMockModel = (id?: string): DTDLModel => {
            return new DTDLModel(
                id || MOCK_MODEL_ID,
                'pretty name',
                'my description',
                'a comment',
                [{ prop2: 'other' }],
                [{ prop3: 'value3' }],
                [{ prop4: 'value4' }]
            );
        };

        beforeEach(() => {
            originalStorage = Storage.prototype;
            mockLocalStorage = getMockStorage();
            // swap out the real storage APIs for our mock
            Storage.prototype.clear = mockLocalStorage.clear;
            Storage.prototype.getItem = mockLocalStorage.getItem;
            Storage.prototype.key = mockLocalStorage.key;
            Storage.prototype.removeItem = mockLocalStorage.removeItem;
            Storage.prototype.setItem = mockLocalStorage.setItem;
        });
        afterEach(() => {
            // replace storage APIs to the original values
            Storage.prototype.clear = originalStorage.clear;
            Storage.prototype.getItem = originalStorage.getItem;
            Storage.prototype.key = originalStorage.key;
            Storage.prototype.removeItem = originalStorage.removeItem;
            Storage.prototype.setItem = originalStorage.setItem;
        });

        test('StoreEditorData - valid data gets serialized', () => {
            // ARRANGE
            const data: ProjectData = {
                templates: [],
                models: [getMockModel()]
            };

            // ACT
            storeEditorData(data);

            // ASSERT
            expect(mockLocalStorage.setItem).toBeCalledTimes(1);
            expect(mockLocalStorage.setItem).toBeCalledWith(
                OATDataStorageKey,
                JSON.stringify(data)
            );
        });

        test('StoreEditorData - null data does not get serialized', () => {
            // ARRANGE

            // ACT
            storeEditorData(null);

            // ASSERT
            expect(mockLocalStorage.setItem).toBeCalledTimes(1);
            expect(mockLocalStorage.setItem).toBeCalledWith(
                OATDataStorageKey,
                undefined
            );
        });

        test('GetEditorData - stored data gets returned', () => {
            // ARRANGE
            const data: ProjectData = {
                templates: [],
                models: [getMockModel()]
            };
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(data));

            // ACT
            const result = getStoredEditorData();

            // ASSERT
            expect(result.templates.length).toEqual(0);
            expect(result.models.length).toEqual(1);
        });

        test('GetEditorData - null data gets returned when none set', () => {
            // ARRANGE
            mockLocalStorage.getItem.mockReturnValue(undefined);

            // ACT
            const result = getStoredEditorData();

            // ASSERT
            expect(result).toEqual({});
        });

        describe('fetching parts of data', () => {
            let mockData: ProjectData;
            const storeMockData = (mockData: ProjectData) => {
                mockLocalStorage.getItem.mockReturnValue(
                    mockData ? JSON.stringify(mockData) : mockData
                );
            };

            beforeEach(() => {
                const mockTemplate1 = {
                    '@type': 'Property',
                    name: 'Time',
                    schema: 'integer'
                };
                const mockTemplate2 = {
                    '@type': 'Property',
                    name: 'Test object',
                    schema: {
                        '@type': 'Object',
                        fields: [
                            {
                                name: 'Property_1',
                                displayName: 'Property_1',
                                schema: 'string'
                            }
                        ]
                    }
                };

                const mockPosition: IOATModelPosition = {
                    '@id': MOCK_MODEL_ID,
                    position: {
                        x: 123,
                        y: 234
                    }
                };

                const mockMetadata: IOATModelsMetadata = {
                    '@id': MOCK_MODEL_ID,
                    directoryPath: 'some path',
                    fileName: 'filename.json'
                };

                const mockNamespace = 'my mock namespace';

                mockData = {
                    templates: [mockTemplate1, mockTemplate2],
                    modelPositions: [mockPosition, mockPosition],
                    models: [
                        getMockModel(),
                        getMockModel('model 2'),
                        getMockModel('model 3')
                    ],
                    modelsMetadata: [mockMetadata],
                    namespace: mockNamespace
                };
                storeMockData(mockData);
            });

            test('getStoredEditorTemplateData - returns stored data', () => {
                // ARRANGE

                // ACT
                const result = getStoredEditorTemplateData();

                // ASSERT
                expect(result.length).toEqual(mockData.templates.length);
                expect(result[0].name).toEqual('Time');
            });

            test('getStoredEditorTemplateData - null data gives default value', () => {
                // ARRANGE
                storeMockData(undefined);

                // ACT
                const result = getStoredEditorTemplateData();

                // ASSERT
                expect(result).toBeDefined();
                expect(result).toEqual({});
            });

            test('getStoredEditorModelsData - returns stored data', () => {
                // ARRANGE

                // ACT
                const result = getStoredEditorModelsData();

                // ASSERT
                expect(result.length).toEqual(mockData.models.length);
                expect(result[0]['@id']).toEqual(MOCK_MODEL_ID);
            });

            test('getStoredEditorModelsData - null data gives default value', () => {
                // ARRANGE
                storeMockData({ ...mockData, models: undefined });

                // ACT
                const result = getStoredEditorModelsData();

                // ASSERT
                expect(result).toBeDefined();
                expect(result.length).toEqual(0);
            });

            test('getStoredEditorModelPositionsData - returns stored data', () => {
                // ARRANGE

                // ACT
                const result = getStoredEditorModelPositionsData();

                // ASSERT
                expect(result.length).toEqual(mockData.modelPositions.length);
                expect(result[0]['@id']).toEqual(MOCK_MODEL_ID);
            });

            test('getStoredEditorModelPositionsData - null data gives default value', () => {
                // ARRANGE
                storeMockData({ ...mockData, modelPositions: undefined });

                // ACT
                const result = getStoredEditorModelPositionsData();

                // ASSERT
                expect(result).toBeDefined();
                expect(result.length).toEqual(0);
            });

            test('getStoredEditorModelMetadata - returns stored data', () => {
                // ARRANGE

                // ACT
                const result = getStoredEditorModelMetadata();

                // ASSERT
                expect(result.length).toEqual(mockData.modelsMetadata.length);
                expect(result[0]['@id']).toEqual(MOCK_MODEL_ID);
                expect(result[0].directoryPath).toEqual('some path');
                expect(result[0].fileName).toEqual('filename.json');
            });

            test('getStoredEditorModelMetadata - null data gives default value', () => {
                // ARRANGE
                storeMockData({ ...mockData, modelsMetadata: undefined });

                // ACT
                const result = getStoredEditorModelMetadata();

                // ASSERT
                expect(result).toBeDefined();
                expect(result.length).toEqual(0);
            });

            test('getStoredEditorNamespaceData - returns stored data', () => {
                // ARRANGE

                // ACT
                const result = getStoredEditorNamespaceData();

                // ASSERT
                expect(result).toEqual('my mock namespace');
            });

            test('getStoredEditorModelMetadata - null data gives default value', () => {
                // ARRANGE
                storeMockData({ ...mockData, namespace: undefined });

                // ACT
                const result = getStoredEditorNamespaceData();

                // ASSERT
                expect(result).toEqual(null);
            });
        });
    });
});
