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
    DTDLType
} from '../../Classes/DTDL';
import {
    isComplexSchemaProperty,
    isValidDtmiId,
    isValidDtmiPath,
    isValidModelName,
    isValidReferenceName,
    movePropertyInCollection
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
            return new DTDLRelationship('', name, '', '', '', false, []);
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
                const testName = 'Teststring';
                // ACT
                const result = isValidDtmiId(testName);
                // ASSERT
                expect(result).toBeTruthy();
            });
        });
    });
});
