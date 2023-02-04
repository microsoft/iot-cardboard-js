import { cleanup } from '@testing-library/react-hooks';
import {
    EXPORT_LOC_KEYS,
    IMPORT_LOC_KEYS
} from '../../../Components/OATHeader/OATHeader';
import {
    DtdlArray,
    DtdlEnum,
    DtdlInterface,
    DtdlObject,
    DtdlProperty
} from '../../Constants';
import { getMockModelItem } from '../../Context/OatPageContext/OatPageContext.mock';
import {
    createZipFileFromModels,
    parseFilesToModels,
    stripV3Features
} from '../OatPublicUtils';
import { getMockProperty } from '../OatTestUtils';

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
                complexity: 'complex'
            }) as ObjectProperty;
            const objectFieldCountBefore = objectProperty.schema.fields.length;

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
            const objectPropertyAfter = properties[0] as ObjectProperty;
            expect(objectPropertyAfter.schema.fields.length).toEqual(
                objectFieldCountBefore
            );
            expect(objectPropertyAfter).toMatchInlineSnapshot(`
                DTDLProperty {
                  "@id": "id1",
                  "@type": "Property",
                  "comment": "test comment",
                  "description": "test description",
                  "displayName": "test display name",
                  "name": "test Object property name",
                  "schema": DTDLObject {
                    "@id": "test object display name",
                    "@type": "Object",
                    "comment": undefined,
                    "description": "test object comment",
                    "displayName": "test object description",
                    "fields": Array [
                      Object {
                        "name": "double property 1 name",
                        "schema": "double",
                      },
                      Object {
                        "name": "string property 2 name",
                        "schema": "string",
                      },
                      Object {
                        "name": "mega object property name",
                        "schema": DTDLObject {
                          "@id": undefined,
                          "@type": "Object",
                          "comment": undefined,
                          "description": undefined,
                          "displayName": undefined,
                          "fields": Array [
                            DTDLObjectField {
                              "@id": undefined,
                              "comment": undefined,
                              "description": undefined,
                              "displayName": undefined,
                              "name": "name 1",
                              "schema": "string",
                            },
                            DTDLObjectField {
                              "@id": undefined,
                              "comment": undefined,
                              "description": undefined,
                              "displayName": undefined,
                              "name": "object 1",
                              "schema": DTDLObject {
                                "@id": undefined,
                                "@type": "Object",
                                "comment": undefined,
                                "description": undefined,
                                "displayName": undefined,
                                "fields": Array [
                                  DTDLObjectField {
                                    "@id": undefined,
                                    "comment": undefined,
                                    "description": undefined,
                                    "displayName": undefined,
                                    "name": "prop 1",
                                    "schema": "string",
                                  },
                                  DTDLObjectField {
                                    "@id": undefined,
                                    "comment": undefined,
                                    "description": undefined,
                                    "displayName": undefined,
                                    "name": "prop 2",
                                    "schema": "string",
                                  },
                                  DTDLObjectField {
                                    "@id": undefined,
                                    "comment": undefined,
                                    "description": undefined,
                                    "displayName": undefined,
                                    "name": "prop 3",
                                    "schema": "string",
                                  },
                                ],
                              },
                            },
                            DTDLObjectField {
                              "@id": undefined,
                              "comment": undefined,
                              "description": undefined,
                              "displayName": undefined,
                              "name": "enum 2",
                              "schema": DTDLEnum {
                                "@id": undefined,
                                "@type": "Enum",
                                "comment": undefined,
                                "description": undefined,
                                "displayName": undefined,
                                "enumValues": Array [
                                  DTDLEnumValue {
                                    "@id": undefined,
                                    "comment": undefined,
                                    "description": undefined,
                                    "displayName": undefined,
                                    "enumValue": 1,
                                    "name": "enum val 1",
                                  },
                                  DTDLEnumValue {
                                    "@id": undefined,
                                    "comment": undefined,
                                    "description": undefined,
                                    "displayName": undefined,
                                    "enumValue": 200,
                                    "name": "enum value 2",
                                  },
                                  DTDLEnumValue {
                                    "@id": undefined,
                                    "comment": undefined,
                                    "description": undefined,
                                    "displayName": undefined,
                                    "enumValue": 3,
                                    "name": "enum val 3",
                                  },
                                ],
                                "valueSchema": "integer",
                              },
                            },
                            DTDLObjectField {
                              "@id": undefined,
                              "comment": undefined,
                              "description": undefined,
                              "displayName": undefined,
                              "name": "name 3",
                              "schema": "string",
                            },
                          ],
                        },
                      },
                      Object {
                        "name": "long property 2 name",
                        "schema": "long",
                      },
                    ],
                  },
                  "unit": "",
                  "writable": true,
                }
            `);
        });
    });
});
