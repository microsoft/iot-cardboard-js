import { cleanup } from '@testing-library/react-hooks';
import { DurationUnits } from '../Constants';
import { formatTimeInRelevantUnits } from './Utils';

afterEach(cleanup);

describe('Utils', () => {
    describe('formatTimeInRelevantUnits', () => {
        test('invalid input returns 0 milliseconds', () => {
            // ARRANGE
            const durationInMs = -2;

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(0);
            expect(result.displayStringKey).toEqual('duration.seconds');
        });
        test('input less than 1000 returns milliseconds', () => {
            // ARRANGE
            const durationInMs = 500;

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(500);
            expect(result.displayStringKey).toEqual('duration.milliseconds');
        });
        test('returns seconds if minimum unit is seconds and input is less than a second', () => {
            // ARRANGE
            const durationInMs = 500;

            // ACT
            const result = formatTimeInRelevantUnits(
                durationInMs,
                DurationUnits.seconds
            );

            // ASSERT
            expect(result).toBeDefined();
            expect(Math.round(result.value)).toEqual(0);
            expect(result.displayStringKey).toEqual('duration.seconds');
        });
        test('input single millisecond ', () => {
            // ARRANGE
            const durationInMs = 1;

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(1);
            expect(result.displayStringKey).toEqual('duration.millisecond');
        });
        test('input between 1 sec and 1 min returns seconds', () => {
            // ARRANGE
            const durationInMs = 4 * 1000; // 4 seconds

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(4);
            expect(result.displayStringKey).toEqual('duration.seconds');
        });
        test('returns 0 minutes if minimum unit is minutes and input is less than a minute', () => {
            // ARRANGE
            const durationInMs = 4 * 1000; // 4 seconds

            // ACT
            const result = formatTimeInRelevantUnits(
                durationInMs,
                DurationUnits.minutes
            );

            // ASSERT
            expect(result).toBeDefined();
            expect(Math.round(result.value)).toEqual(0);
            expect(result.displayStringKey).toEqual('duration.minutes');
        });
        test('input single second', () => {
            // ARRANGE
            const durationInMs = 1 * 1000; // 1 second

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(1);
            expect(result.displayStringKey).toEqual('duration.second');
        });
        test('input between 1 min and 60 min returns minutes', () => {
            // ARRANGE
            const durationInMs = 4 * 60 * 1000; // 4 minutes

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(4);
            expect(result.displayStringKey).toEqual('duration.minutes');
        });
        test('returns 0 hours if minimum unit is hours and input is less than an hour', () => {
            // ARRANGE
            const durationInMs = 4 * 1000; // 4 seconds

            // ACT
            const result = formatTimeInRelevantUnits(
                durationInMs,
                DurationUnits.hours
            );

            // ASSERT
            expect(result).toBeDefined();
            expect(Math.round(result.value)).toEqual(0);
            expect(result.displayStringKey).toEqual('duration.hours');
        });
        test('input between 60 min and 1 day returns hours', () => {
            // ARRANGE
            const durationInMs = 4 * 60 * 60 * 1000; // 4 hours

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(4);
            expect(result.displayStringKey).toEqual('duration.hours');
        });
        test('input single hour', () => {
            // ARRANGE
            const durationInMs = 1 * 60 * 60 * 1000; // 1 hour

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(1);
            expect(result.displayStringKey).toEqual('duration.hour');
        });
        test('input between 24 hours and 365 days returns days', () => {
            // ARRANGE
            const durationInMs = 4 * 60 * 60 * 24 * 1000; // 4 days

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(4);
            expect(result.displayStringKey).toEqual('duration.days');
        });
        test('returns 0 days if minimum unit is days and input is less than a day', () => {
            // ARRANGE
            const durationInMs = 4 * 60 * 60 * 1000; // 4 hours

            // ACT
            const result = formatTimeInRelevantUnits(
                durationInMs,
                DurationUnits.days
            );

            // ASSERT
            expect(result).toBeDefined();
            expect(Math.round(result.value)).toEqual(0);
            expect(result.displayStringKey).toEqual('duration.days');
        });
        test('input single day', () => {
            // ARRANGE
            const durationInMs = 1 * 60 * 60 * 24 * 1000; // 1 day

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(1);
            expect(result.displayStringKey).toEqual('duration.day');
        });
        test('input above 365 days returns years', () => {
            // ARRANGE
            const durationInMs = 4 * 60 * 60 * 24 * 365 * 1000; // 4 years

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(4);
            expect(result.displayStringKey).toEqual('duration.years');
        });
        test('returns 0 years if minimum unit is years and input is less than a year', () => {
            // ARRANGE
            const durationInMs = 1 * 60 * 60 * 24 * 1000; // 1 day

            // ACT
            const result = formatTimeInRelevantUnits(
                durationInMs,
                DurationUnits.years
            );

            // ASSERT
            expect(result).toBeDefined();
            expect(Math.round(result.value)).toEqual(0);
            expect(result.displayStringKey).toEqual('duration.years');
        });
        test('input single year', () => {
            // ARRANGE
            const durationInMs = 1 * 60 * 60 * 24 * 365 * 1000; // 1 year

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(1);
            expect(result.displayStringKey).toEqual('duration.year');
        });
    });
});
