import { cleanup } from '@testing-library/react-hooks';
import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLMapKey,
    DTDLMapValue,
    DTDLObject,
    DTDLProperty,
    DTDLRelationship
} from '../../Classes/DTDL';
import {
    isComplexSchemaProperty,
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
});
