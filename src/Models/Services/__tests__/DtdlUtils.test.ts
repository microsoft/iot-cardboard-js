import { cleanup } from '@testing-library/react-hooks';
import {
    DTDLArray,
    DTDLEnum,
    DTDLMap,
    DTDLMapKey,
    DTDLMapValue,
    DTDLObject,
    DTDLProperty
} from '../../Classes/DTDL';
import { isComplexSchemaProperty } from '../DtdlUtils';

afterEach(cleanup);

describe('DtdlUtils', () => {
    describe('isComplexSchemaProperty', () => {
        test('array is complex', () => {
            // ARRANGE
            const property = new DTDLProperty('', new DTDLArray('', 'integer'));

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
            const property = new DTDLProperty('', new DTDLObject('', []));

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
                    '',
                    new DTDLMapKey('key 1'),
                    new DTDLMapValue('value 1', 'string')
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
});
