import { cleanup } from '@testing-library/react-hooks';
import {
    EXPORT_LOC_KEYS,
    IMPORT_LOC_KEYS
} from '../../../Components/OATHeader/OATHeader';
import { DTDLMapValue, DTDLObjectField } from '../../Classes/DTDL';
import {
    DtdlArray,
    DtdlEnum,
    DtdlInterface,
    DtdlMap,
    DtdlObject,
    DtdlProperty
} from '../../Constants';
import { getMockModelItem } from '../../Context/OatPageContext/OatPageContext.mock';
import {
    createZipFileFromModels,
    parseFilesToModels,
    stripV3Features
} from '../OatPublicUtils';
import {
    getMockArraySchema,
    getMockMapSchema,
    getMockObjectSchema,
    getMockProperty
} from '../OatTestUtils';

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

type ArrayProperty = DtdlProperty & { schema: DtdlArray };
type EnumProperty = DtdlProperty & { schema: DtdlEnum };
type ObjectProperty = DtdlProperty & { schema: DtdlObject };
type MapProperty = DtdlProperty & { schema: DtdlMap };

describe('OatPublicUtils', () => {
    const mockTranslate = (key: string, args?: any) => {
        if (args) {
            return `${key}:${JSON.stringify(args)}`;
        } else {
            return key;
        }
    };
    describe('parseFilesToModels', () => {
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
                JSON.stringify(
                    getMockModelItem(args?.modelId ?? DEFAULT_MODEL_ID)
                );
            const file = new File([], name, {
                type: args?.fileType ?? 'application/json'
            });
            file.text = () => Promise.resolve(content);
            return file;
        };
        test('empty file list is success with no models or errors', async () => {
            // ARRANGE
            const files = [];
            // ACT
            const result = await parseFilesToModels({
                files: files,
                currentModels: [],
                localizationKeys: IMPORT_LOC_KEYS,
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
                localizationKeys: IMPORT_LOC_KEYS,
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
                localizationKeys: IMPORT_LOC_KEYS,
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
                localizationKeys: IMPORT_LOC_KEYS,
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
    describe('createZipFileFromModels', () => {
        const DEFAULT_MODEL_ID = 'dtmi:test-model-1;1';
        test('model count matches file count', () => {
            // ARRANGE
            const models: DtdlInterface[] = [
                getMockModelItem(DEFAULT_MODEL_ID),
                getMockModelItem(DEFAULT_MODEL_ID + 1)
            ];
            // ACT
            const result = createZipFileFromModels({
                models: models,
                localizationKeys: EXPORT_LOC_KEYS,
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Success');
            expect(Object.keys(result.file.files).length).toEqual(2);
        });
        test('files nested based on id path', () => {
            // ARRANGE
            const models: DtdlInterface[] = [
                getMockModelItem('dtmi:folder1:folder2:modelId;1')
            ];
            // ACT
            const result = createZipFileFromModels({
                models: models,
                localizationKeys: EXPORT_LOC_KEYS,
                translate: mockTranslate
            });
            // ASSERT
            expect(result.status).toEqual('Success');
            const files = result.file.files;
            expect(Object.keys(files).length).toEqual(3);
            expect(files['folder1/']).toBeDefined();
            expect(files['folder1/'].dir).toBeTruthy();
            expect(files['folder1/folder2/']).toBeDefined();
            expect(files['folder1/folder2/'].dir).toBeTruthy();
            expect(files['folder1/folder2/modelId-1.json']).toBeDefined();
            expect(files['folder1/folder2/modelId-1.json'].dir).toBeFalsy();
        });
    });
    describe('stripV3Features', () => {
        describe('RemoveArrays', () => {
            test('removes top level array properties', () => {
                // ARRANGE
                const arrayProperty = getMockProperty({
                    type: 'Array',
                    itemSchema: 'boolean'
                }) as ArrayProperty;
                const enumProperty = getMockProperty({
                    type: 'Enum',
                    enumType: 'integer'
                }) as EnumProperty;

                const mockModel = getMockModelItem('dtmi:mockmodel;1');
                mockModel.contents = [arrayProperty, enumProperty];
                const propertyCountBefore = mockModel.contents.length;

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                const properties = result[0].contents;
                expect(properties.length).toEqual(propertyCountBefore - 1); // removed array
                expect(properties[0]['@id']).toEqual(enumProperty['@id']);
            });
            test('removes arrays from nested objects', () => {
                // ARRANGE
                const objectProperty = getMockProperty({
                    type: 'Object',
                    complexity: 'simple' // ignored, set custom data below
                }) as ObjectProperty;
                objectProperty.schema.fields = [
                    new DTDLObjectField(
                        'array_to_remove',
                        getMockArraySchema({
                            itemSchema: 'boolean',
                            type: 'Array'
                        })
                    ),
                    new DTDLObjectField('non-array', 'boolean')
                ];

                const mockModel = getMockModelItem('dtmi:mockmodel;1');
                mockModel.contents = [objectProperty];

                const propertyCountBefore = mockModel.contents.length;

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                const properties = result[0].contents;
                expect(properties.length).toEqual(propertyCountBefore);
                expect(properties[0]['@id']).toEqual(objectProperty['@id']);
                const firstProperty = properties[0] as ObjectProperty;
                expect(firstProperty.schema.fields.length).toEqual(1);
                expect(firstProperty.schema.fields[0].name).toEqual(
                    'non-array'
                );
            });
            test('removes arrays from maps', () => {
                // ARRANGE
                // create an object schema for the value field
                const nestedObjectProperty = getMockObjectSchema({
                    type: 'Object',
                    complexity: 'simple'
                });
                nestedObjectProperty.fields = [
                    new DTDLObjectField(
                        'array_to_remove',
                        getMockArraySchema({
                            itemSchema: 'boolean',
                            type: 'Array'
                        })
                    ),
                    new DTDLObjectField('non-array', 'boolean')
                ];
                // set the value of the map to be the object
                const valueSchema = getMockMapSchema({
                    type: 'Map',
                    valueType: 'Primitive'
                });
                valueSchema.mapValue = new DTDLMapValue(
                    'map-value',
                    nestedObjectProperty
                );
                // bind the map to the property
                const mapProperty = getMockProperty({
                    type: 'Map',
                    valueType: 'Primitive'
                }) as MapProperty;
                mapProperty.schema = valueSchema;

                const mockModel = getMockModelItem('dtmi:mockmodel;1');
                mockModel.contents = [mapProperty];

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                const properties = result[0].contents;
                expect(properties.length).toEqual(1);
                expect(properties[0]['@id']).toEqual(mapProperty['@id']);
                const firstProperty = properties[0] as MapProperty;
                const mapValueSchema = firstProperty.schema.mapValue
                    .schema as DtdlObject;
                expect(mapValueSchema.fields).toBeDefined();
                expect(mapValueSchema.fields[0].name).toEqual('non-array'); // originally index 1
            });
        });
        describe('RemoveGeoSpatial', () => {
            test('removes top level geo properties', () => {
                // ARRANGE
                const geoProperty = getMockProperty({
                    type: 'linestring'
                }) as ArrayProperty;
                const enumProperty = getMockProperty({
                    type: 'Enum',
                    enumType: 'integer'
                }) as EnumProperty;

                const mockModel = getMockModelItem('dtmi:mockmodel;1');
                mockModel.contents = [geoProperty, enumProperty];
                const propertyCountBefore = mockModel.contents.length;

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                const properties = result[0].contents;
                expect(properties.length).toEqual(propertyCountBefore - 1); // removed array
                expect(properties[0]['@id']).toEqual(enumProperty['@id']);
            });
            test('removes geo spatial fields from nested objects', () => {
                // ARRANGE
                const objectProperty = getMockProperty({
                    type: 'Object',
                    complexity: 'simple' // ignored, set custom data below
                }) as ObjectProperty;
                objectProperty.schema.fields = [
                    new DTDLObjectField('field_to_remove', 'linestring'),
                    new DTDLObjectField('non-geo', 'boolean')
                ];

                const mockModel = getMockModelItem('dtmi:mockmodel;1');
                mockModel.contents = [objectProperty];

                const propertyCountBefore = mockModel.contents.length;

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                const properties = result[0].contents;
                expect(properties.length).toEqual(propertyCountBefore);
                expect(properties[0]['@id']).toEqual(objectProperty['@id']);
                const firstProperty = properties[0] as ObjectProperty;
                expect(firstProperty.schema.fields.length).toEqual(1);
                expect(firstProperty.schema.fields[0].name).toEqual('non-geo');
            });
            test('removes geo spatials from maps', () => {
                // ARRANGE
                // create an object schema for the value field
                const nestedObjectProperty = getMockObjectSchema({
                    type: 'Object',
                    complexity: 'simple'
                });
                nestedObjectProperty.fields = [
                    new DTDLObjectField('array_to_remove', 'linestring'),
                    new DTDLObjectField('non-array', 'boolean')
                ];
                // set the value of the map to be the object
                const valueSchema = getMockMapSchema({
                    type: 'Map',
                    valueType: 'Primitive'
                });
                valueSchema.mapValue = new DTDLMapValue(
                    'map-value',
                    nestedObjectProperty
                );
                // bind the map to the property
                const mapProperty = getMockProperty({
                    type: 'Map',
                    valueType: 'Primitive'
                }) as MapProperty;
                mapProperty.schema = valueSchema;

                const mockModel = getMockModelItem('dtmi:mockmodel;1');
                mockModel.contents = [mapProperty];

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                const properties = result[0].contents;
                expect(properties.length).toEqual(1);
                expect(properties[0]['@id']).toEqual(mapProperty['@id']);
                const firstProperty = properties[0] as MapProperty;
                const mapValueSchema = firstProperty.schema.mapValue
                    .schema as DtdlObject;
                expect(mapValueSchema.fields).toBeDefined();
                expect(mapValueSchema.fields[0].name).toEqual('non-array'); // originally index 1
            });
        });
        describe('AddVersionIfNotPresent', () => {
            test('No version number, adds version', () => {
                // ARRANGE
                const mockModel = getMockModelItem('dtmi:mockmodel;');

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                expect(result[0]['@id']).toEqual('dtmi:mockmodel;1');
            });
            test('Has integer version number, leaves it', () => {
                // ARRANGE
                const mockModel = getMockModelItem('dtmi:mockmodel;3');

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                expect(result[0]['@id']).toEqual('dtmi:mockmodel;3');
            });
            test('Has decimal version number, leaves it', () => {
                // ARRANGE
                const mockModel = getMockModelItem('dtmi:mockmodel;3.2');

                const models: DtdlInterface[] = [mockModel];

                // ACT
                const result = stripV3Features(models) as DtdlInterface[];

                // ASSERT
                expect(result.length).toEqual(models.length);
                expect(result[0]['@id']).toEqual('dtmi:mockmodel;3.2');
            });
        });
    });
});
