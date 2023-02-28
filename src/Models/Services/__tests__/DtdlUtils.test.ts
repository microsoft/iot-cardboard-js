import { cleanup } from '@testing-library/react-hooks';
import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLMapKey,
    DTDLMapValue,
    DTDLObject,
    DTDLProperty,
    DTDLRelationship,
    DTDLType,
    DTDL_CONTEXT_VERSION_2,
    DTDL_CONTEXT_VERSION_3
} from '../../Classes/DTDL';
import { DtdlInterface } from '../../Constants';
import {
    getMockModelItem,
    getMockReference
} from '../../Context/OatPageContext/OatPageContext.mock';
import {
    contextHasVersion3,
    getDtdlVersion,
    isComplexSchemaProperty,
    isModelOrParentDtdlVersion3,
    isValidDtmiId,
    isValidDtmiPath,
    isValidModelName,
    isValidModelVersion,
    isValidReferenceName,
    modelHasVersion3Context,
    movePropertyInCollection,
    updateDtdlVersion
} from '../DtdlUtils';

afterEach(cleanup);

describe('DtdlUtils', () => {
    describe('isComplexSchemaProperty', () => {
        test('array is complex', () => {
            // ARRANGE
            const property = new DTDLProperty('', new DTDLArray('integer'));

            // ACT
            const result = isComplexSchemaProperty(property);

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('enum is complex', () => {
            // ARRANGE
            const property = new DTDLProperty('', new DTDLEnum([], 'integer'));

            // ACT
            const result = isComplexSchemaProperty(property);

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('object is complex', () => {
            // ARRANGE
            const property = new DTDLProperty('', new DTDLObject([]));

            // ACT
            const result = isComplexSchemaProperty(property);

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('map is complex', () => {
            // ARRANGE
            const property = new DTDLProperty(
                '',
                new DTDLMap(
                    new DTDLMapKey('key 1'),
                    new DTDLMapValue('value 1', 'string'),
                    ''
                )
            );

            // ACT
            const result = isComplexSchemaProperty(property);

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('double is NOT complex', () => {
            // ARRANGE
            const property = new DTDLProperty('', 'double');

            // ACT
            const result = isComplexSchemaProperty(property);

            // ASSERT
            expect(result).toBeFalsy();
        });
    });

    describe('movePropertyInCollection', () => {
        const getProperty = (name: string): DTDLProperty => {
            return new DTDLProperty(name, 'double');
        };
        const getRelationship = (name: string): DTDLRelationship => {
            return new DTDLRelationship(name, '', '', '', '', false, []);
        };

        describe('Move up', () => {
            test('happy path - move item up in the list with only properties', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [getProperty('prop1'), property];

                // ACT
                const result = movePropertyInCollection(
                    'Up',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(2);
                expect(result[0].name).toEqual('targetProperty');
                expect(result[1].name).toEqual('prop1');
            });
            test('move item up in the list past non-property items', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [
                    getProperty('prop1'),
                    getRelationship('rel1'),
                    property
                ];

                // ACT
                const result = movePropertyInCollection(
                    'Up',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(3);
                expect(result[0].name).toEqual('targetProperty');
                expect(result[1].name).toEqual('prop1');
                expect(result[2].name).toEqual('rel1');
            });
            test('gracefully handle when item is already at the top of the list', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [
                    property,
                    getRelationship('rel1'),
                    getProperty('prop1')
                ];

                // ACT
                const result = movePropertyInCollection(
                    'Up',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(3);
                expect(result[0].name).toEqual('targetProperty');
                expect(result[1].name).toEqual('rel1');
                expect(result[2].name).toEqual('prop1');
            });
            test('gracefully handle when item has no properties before it', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [
                    getRelationship('rel1'),
                    property,
                    getRelationship('rel2'),
                    getProperty('prop1')
                ];

                // ACT
                const result = movePropertyInCollection(
                    'Up',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(4);
                expect(result[0].name).toEqual('rel1');
                expect(result[1].name).toEqual('targetProperty');
                expect(result[2].name).toEqual('rel2');
                expect(result[3].name).toEqual('prop1');
            });
        });
        describe('Move down', () => {
            test('happy path - move item down in the list with only properties', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [property, getProperty('prop1')];

                // ACT
                const result = movePropertyInCollection(
                    'Down',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(2);
                expect(result[0].name).toEqual('prop1');
                expect(result[1].name).toEqual('targetProperty');
            });
            test('move item down in the list past non-property items', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [
                    property,
                    getRelationship('rel1'),
                    getProperty('prop1')
                ];

                // ACT
                const result = movePropertyInCollection(
                    'Down',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(3);
                expect(result[0].name).toEqual('rel1');
                expect(result[1].name).toEqual('prop1');
                expect(result[2].name).toEqual('targetProperty');
            });
            test('gracefully handle when item is already at the bottom of the list', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [
                    getRelationship('rel1'),
                    getProperty('prop1'),
                    property
                ];

                // ACT
                const result = movePropertyInCollection(
                    'Down',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(3);
                expect(result[0].name).toEqual('rel1');
                expect(result[1].name).toEqual('prop1');
                expect(result[2].name).toEqual('targetProperty');
            });
            test('gracefully handle when item has no properties after it', () => {
                // ARRANGE
                const property = getProperty('targetProperty');
                const items = [
                    getRelationship('rel1'),
                    getProperty('prop1'),
                    property,
                    getRelationship('rel2')
                ];

                // ACT
                const result = movePropertyInCollection(
                    'Down',
                    property,
                    items.findIndex((x) => x.name === 'targetProperty'),
                    items
                );

                // ASSERT
                expect(result.length).toEqual(4);
                expect(result[0].name).toEqual('rel1');
                expect(result[1].name).toEqual('prop1');
                expect(result[2].name).toEqual('targetProperty');
                expect(result[3].name).toEqual('rel2');
            });
        });
    });

    describe('DTDL Versions', () => {
        describe('getDtdlVersion', () => {
            test('null model defaults to version 2', () => {
                // ARRANGE
                // ACT
                const result = getDtdlVersion(null);
                // ASSERT
                expect(result).toEqual('2');
            });
            test('context contains version 2 in array', () => {
                // ARRANGE
                const context = ['other stuff', DTDL_CONTEXT_VERSION_2];
                const model = getMockModelItem('dtmi:model1;1');
                model['@context'] = context;
                // ACT
                const result = getDtdlVersion(model);
                // ASSERT
                expect(result).toEqual('2');
            });
            test('context has unknown string, default to 2', () => {
                // ARRANGE
                const context = ['other stuff', DTDL_CONTEXT_VERSION_2];
                const model = getMockModelItem('dtmi:model1;1');
                model['@context'] = context;
                // ACT
                const result = getDtdlVersion(model);
                // ASSERT
                expect(result).toEqual('2');
            });
            test('context contains version 3 in array', () => {
                // ARRANGE
                const context = ['other stuff', DTDL_CONTEXT_VERSION_3];
                const model = getMockModelItem('dtmi:model1;1');
                model['@context'] = context;
                // ACT
                const result = getDtdlVersion(model);
                // ASSERT
                expect(result).toEqual('3');
            });
            test('context has version 2 as string', () => {
                // ARRANGE
                const context = DTDL_CONTEXT_VERSION_2;
                const model = getMockModelItem('dtmi:model1;1');
                model['@context'] = context;
                // ACT
                const result = getDtdlVersion(model);
                // ASSERT
                expect(result).toEqual('2');
            });
            test('context has unknown string default to 2', () => {
                // ARRANGE
                const context = 'other stuff';
                const model = getMockModelItem('dtmi:model1;1');
                model['@context'] = context;
                // ACT
                const result = getDtdlVersion(model);
                // ASSERT
                expect(result).toEqual('2');
            });
            test('context has version 3 as string', () => {
                // ARRANGE
                const context = DTDL_CONTEXT_VERSION_3;
                const model = getMockModelItem('dtmi:model1;1');
                model['@context'] = context;
                // ACT
                const result = getDtdlVersion(model);
                // ASSERT
                expect(result).toEqual('3');
            });
        });

        describe('hasVersion3Context', () => {
            test('context is array with v3, returns true', () => {
                // ARRANGE
                const context = ['something', DTDL_CONTEXT_VERSION_3];
                const model = { '@context': context } as DtdlInterface;
                // ACT
                const result = modelHasVersion3Context(model);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('context is array without v3, returns false', () => {
                // ARRANGE
                const context = ['something'];
                const model = { '@context': context } as DtdlInterface;
                // ACT
                const result = modelHasVersion3Context(model);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('context is string with v3, returns true', () => {
                // ARRANGE
                const context = DTDL_CONTEXT_VERSION_3;
                const model = { '@context': context } as DtdlInterface;
                // ACT
                const result = modelHasVersion3Context(model);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('context is string without v3, returns false', () => {
                // ARRANGE
                const context = 'something';
                const model = { '@context': context } as DtdlInterface;
                // ACT
                const result = modelHasVersion3Context(model);
                // ASSERT
                expect(result).toBeFalsy();
            });
        });

        describe('contextHasVersion3', () => {
            test('context is array with v3, returns true', () => {
                // ARRANGE
                const context = ['something', DTDL_CONTEXT_VERSION_3];
                // ACT
                const result = contextHasVersion3(context);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('context is array without v3, returns false', () => {
                // ARRANGE
                const context = ['something'];
                // ACT
                const result = contextHasVersion3(context);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('context is string with v3, returns true', () => {
                // ARRANGE
                const context = DTDL_CONTEXT_VERSION_3;
                // ACT
                const result = contextHasVersion3(context);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('context is string without v3, returns false', () => {
                // ARRANGE
                const context = 'something';
                // ACT
                const result = contextHasVersion3(context);
                // ASSERT
                expect(result).toBeFalsy();
            });
        });

        describe('isModelOrParentDtdlVersion3', () => {
            describe('model', () => {
                test('model has v3 context in array, returns true', () => {
                    // ARRANGE
                    const context = ['something', DTDL_CONTEXT_VERSION_3];
                    const model = getMockModelItem('test-id', context);
                    // ACT
                    const result = isModelOrParentDtdlVersion3(model, [], null);
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('model does not have v3 context in array, returns true', () => {
                    // ARRANGE
                    const context = ['something'];
                    const model = getMockModelItem('test-id', context);
                    // ACT
                    const result = isModelOrParentDtdlVersion3(model, [], null);
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('model has v3 context as string, returns true', () => {
                    // ARRANGE
                    const context = DTDL_CONTEXT_VERSION_3;
                    const model = getMockModelItem('test-id', context);
                    // ACT
                    const result = isModelOrParentDtdlVersion3(model, [], null);
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('model does not have v3 context as string, returns true', () => {
                    // ARRANGE
                    const context = 'something';
                    const model = getMockModelItem('test-id', context);
                    // ACT
                    const result = isModelOrParentDtdlVersion3(model, [], null);
                    // ASSERT
                    expect(result).toBeFalsy();
                });
            });
            describe('relationships', () => {
                test('relationship parent has v3 context in array, returns true', () => {
                    // ARRANGE
                    const context = ['something', DTDL_CONTEXT_VERSION_3];
                    const model = getMockModelItem('test-id', context);
                    const reference = getMockReference(
                        'test-ref',
                        DTDLType.Relationship
                    );
                    // ACT
                    const result = isModelOrParentDtdlVersion3(
                        reference,
                        [model],
                        {
                            modelId: model['@id']
                        }
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('relationship parent does not have v3 context in array, returns true', () => {
                    // ARRANGE
                    const context = ['something'];
                    const model = getMockModelItem('test-id', context);
                    const reference = getMockReference(
                        'test-ref',
                        DTDLType.Relationship
                    );
                    // ACT
                    const result = isModelOrParentDtdlVersion3(
                        reference,
                        [model],
                        {
                            modelId: model['@id']
                        }
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('relationship parent has v3 context as string, returns true', () => {
                    // ARRANGE
                    const context = DTDL_CONTEXT_VERSION_3;
                    const model = getMockModelItem('test-id', context);
                    const reference = getMockReference(
                        'test-ref',
                        DTDLType.Relationship
                    );
                    // ACT
                    const result = isModelOrParentDtdlVersion3(
                        reference,
                        [model],
                        {
                            modelId: model['@id']
                        }
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('relationship parent does not have v3 context as string, returns true', () => {
                    // ARRANGE
                    const context = 'something';
                    const model = getMockModelItem('test-id', context);
                    const reference = getMockReference(
                        'test-ref',
                        DTDLType.Relationship
                    );
                    // ACT
                    const result = isModelOrParentDtdlVersion3(
                        reference,
                        [model],
                        {
                            modelId: model['@id']
                        }
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
            });
        });

        describe('updateDtdlVersion', () => {
            test('update v2 with v3 in array context', () => {
                // ARRANGE
                const newVersion = DTDL_CONTEXT_VERSION_3;
                const model = getMockModelItem('test-id', [
                    'something',
                    DTDL_CONTEXT_VERSION_2
                ]);
                // ACT
                const result = updateDtdlVersion(model, newVersion);
                // ASSERT
                expect(result['@context'][0]).toEqual(newVersion);
            });
            test('update v3 with v2 in array context', () => {
                // ARRANGE
                const newVersion = DTDL_CONTEXT_VERSION_2;
                const model = getMockModelItem('test-id', [
                    'something',
                    DTDL_CONTEXT_VERSION_3
                ]);
                // ACT
                const result = updateDtdlVersion(model, newVersion);
                // ASSERT
                expect(result['@context'][0]).toEqual(newVersion);
            });
            test('update to v2 when no existing version found in array context', () => {
                // ARRANGE
                const newVersion = DTDL_CONTEXT_VERSION_3;
                const model = getMockModelItem('test-id', ['something']);
                // ACT
                const result = updateDtdlVersion(model, newVersion);
                // ASSERT
                expect(result['@context'][0]).toEqual(newVersion);
            });
            test('update v2 with v3 in string context', () => {
                // ARRANGE
                const newVersion = DTDL_CONTEXT_VERSION_3;
                const model = getMockModelItem(
                    'test-id',
                    DTDL_CONTEXT_VERSION_2
                );
                // ACT
                const result = updateDtdlVersion(model, newVersion);
                // ASSERT
                expect(result['@context']).toEqual(newVersion);
            });
            test('update v3 with v2 in string context', () => {
                // ARRANGE
                const newVersion = DTDL_CONTEXT_VERSION_2;
                const model = getMockModelItem(
                    'test-id',
                    DTDL_CONTEXT_VERSION_3
                );
                // ACT
                const result = updateDtdlVersion(model, newVersion);
                // ASSERT
                expect(result['@context']).toEqual(newVersion);
            });
        });
    });

    describe('Validations', () => {
        describe('Reference names', () => {
            describe('Relationships', () => {
                const referenceType = DTDLType.Relationship;
                test('length 0 is invalid', () => {
                    // ARRANGE
                    const testName = '';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('null is invalid', () => {
                    // ARRANGE
                    const testName = null;
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('undefined is invalid', () => {
                    // ARRANGE
                    const testName = undefined;
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('longer than max length is invalid', () => {
                    // ARRANGE
                    const testName = new Array(66).join('J');
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('Non-final with trailing _ is valid', () => {
                    // ARRANGE
                    const testName = 'Teststring_';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        false
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('Final with trailing _ is invalid', () => {
                    // ARRANGE
                    const testName = 'Teststring_';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('Non-final without trailing _ is valid', () => {
                    // ARRANGE
                    const testName = 'Teststring';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        false
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('Final without trailing _ is valid', () => {
                    // ARRANGE
                    const testName = 'Teststring';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
            });

            describe('Components', () => {
                const referenceType = DTDLType.Component;
                test('length 0 is invalid', () => {
                    // ARRANGE
                    const testName = '';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('null is invalid', () => {
                    // ARRANGE
                    const testName = null;
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('undefined is invalid', () => {
                    // ARRANGE
                    const testName = undefined;
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('longer than max length is invalid', () => {
                    // ARRANGE
                    const testName = new Array(66).join('\n');
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('Non-final with trailing _ is valid', () => {
                    // ARRANGE
                    const testName = 'Teststring_';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        false
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('Final with trailing _ is invalid', () => {
                    // ARRANGE
                    const testName = 'Teststring_';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('Non-final without trailing _ is valid', () => {
                    // ARRANGE
                    const testName = 'Teststring';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        false
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('Final without trailing _ is valid', () => {
                    // ARRANGE
                    const testName = 'Teststring';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeTruthy();
                });
            });

            describe('Extend', () => {
                const referenceType = 'Extend';
                test('Always false', () => {
                    // ARRANGE
                    const testName = 'Teststring';
                    // ACT
                    const result = isValidReferenceName(
                        testName,
                        referenceType,
                        true
                    );
                    // ASSERT
                    expect(result).toBeFalsy();
                });
            });
        });
        describe('Model names', () => {
            test('length 0 is invalid', () => {
                // ARRANGE
                const testName = '';
                // ACT
                const result = isValidModelName(testName, true);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('null is invalid', () => {
                // ARRANGE
                const testName = null;
                // ACT
                const result = isValidModelName(testName, true);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('undefined is invalid', () => {
                // ARRANGE
                const testName = undefined;
                // ACT
                const result = isValidModelName(testName, true);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('Non-final with trailing _ is valid', () => {
                // ARRANGE
                const testName = 'Teststring_';
                // ACT
                const result = isValidModelName(testName, false);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Final with trailing _ is invalid', () => {
                // ARRANGE
                const testName = 'Teststring_';
                // ACT
                const result = isValidModelName(testName, true);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('Non-final without trailing _ is valid', () => {
                // ARRANGE
                const testName = 'Teststring';
                // ACT
                const result = isValidModelName(testName, false);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Final without trailing _ is valid', () => {
                // ARRANGE
                const testName = 'Teststring';
                // ACT
                const result = isValidModelName(testName, true);
                // ASSERT
                expect(result).toBeTruthy();
            });
        });
        describe('Model path', () => {
            test('length 0 is valid', () => {
                // ARRANGE
                const testName = '';
                // ACT
                const result = isValidDtmiPath(testName, true);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('null is valid', () => {
                // ARRANGE
                const testName = null;
                // ACT
                const result = isValidDtmiPath(testName, true);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('undefined is valid', () => {
                // ARRANGE
                const testName = undefined;
                // ACT
                const result = isValidDtmiPath(testName, true);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Non-final with trailing _ is valid', () => {
                // ARRANGE
                const testName = 'Teststring_';
                // ACT
                const result = isValidDtmiPath(testName, false);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Final with trailing _ is invalid', () => {
                // ARRANGE
                const testName = 'Teststring_';
                // ACT
                const result = isValidDtmiPath(testName, true);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('Non-final without trailing _ is valid', () => {
                // ARRANGE
                const testName = 'Teststring';
                // ACT
                const result = isValidDtmiPath(testName, false);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Final without trailing _ is valid', () => {
                // ARRANGE
                const testName = 'Teststring';
                // ACT
                const result = isValidDtmiPath(testName, true);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Non-final with trailing : is valid', () => {
                // ARRANGE
                const testName = 'Teststring:';
                // ACT
                const result = isValidDtmiPath(testName, false);
                // ASSERT
                expect(result).toBeTruthy();
            });
            test('Final with trailing : is invalid', () => {
                // ARRANGE
                const testName = 'Teststring:';
                // ACT
                const result = isValidDtmiPath(testName, true);
                // ASSERT
                expect(result).toBeFalsy();
            });
        });
        describe('Model version', () => {
            describe('version 2', () => {
                test('includes alpha characters, returns false', () => {
                    // ARRANGE
                    const version = '123a';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '2', isFinal);

                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('ends with ., returns false', () => {
                    // ARRANGE
                    const version = '123.';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '2', isFinal);

                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('includes only numbers, returns true', () => {
                    // ARRANGE
                    const version = '123';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '2', isFinal);

                    // ASSERT
                    expect(result).toBeTruthy();
                });
            });
            describe('version 3', () => {
                test('includes alpha characters, returns false', () => {
                    // ARRANGE
                    const version = '123a';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('ends with . & in progress, returns true', () => {
                    // ARRANGE
                    const version = '123.';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('ends with . & NOT in progress, returns false', () => {
                    // ARRANGE
                    const version = '123.';
                    const isFinal = true;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('has multiple . and ends with ., returns false', () => {
                    // ARRANGE
                    const version = '123.234.';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('has multiple . and ends with #, returns false', () => {
                    // ARRANGE
                    const version = '123.234.3';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeFalsy();
                });
                test('includes decimal & NOT is final, returns true', () => {
                    // ARRANGE
                    const version = '123.3';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('includes decimal & is final, returns true', () => {
                    // ARRANGE
                    const version = '123.3';
                    const isFinal = true;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('includes only numbers & NOT is final, returns true', () => {
                    // ARRANGE
                    const version = '123';
                    const isFinal = false;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeTruthy();
                });
                test('includes only numbers & is final, returns true', () => {
                    // ARRANGE
                    const version = '123';
                    const isFinal = true;

                    // ACT
                    const result = isValidModelVersion(version, '3', isFinal);

                    // ASSERT
                    expect(result).toBeTruthy();
                });
            });
        });
        describe('Model id', () => {
            test('length 0 is invalid', () => {
                // ARRANGE
                const testName = '';
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('null is invalid', () => {
                // ARRANGE
                const testName = null;
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('undefined is invalid', () => {
                // ARRANGE
                const testName = undefined;
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('trailing _ is invalid', () => {
                // ARRANGE
                const testName = 'Teststring_';
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('trailing : is invalid', () => {
                // ARRANGE
                const testName = 'Teststring:';
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeFalsy();
            });
            test('basic string is valid', () => {
                // ARRANGE
                const testName = 'dtmi:Teststring:pathSeg_2:finalName;3';
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeTruthy();
            });
        });
    });
});
