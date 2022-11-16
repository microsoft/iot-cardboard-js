import { cleanup } from '@testing-library/react-hooks';
import {
    MOCK_ADT_INSTANCE,
    MOCK_ADT_INSTANCE_URL,
    MOCK_STORAGE_ACCOUNT,
    MOCK_STORAGE_ACCOUNT_URL,
    MOCK_STORAGE_CONTAINER,
    MOCK_STORAGE_CONTAINER_NAME,
    MOCK_STORAGE_CONTAINER_URL
} from '../../../Components/EnvironmentPicker/EnvironmentPicker.mock';
import {
    AzureAccessPermissionRoleGroups,
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes,
    DurationUnits,
    IAzureResource
} from '../../Constants';
import {
    areResourceValuesEqual,
    formatTimeInRelevantUnits,
    getContainerNameFromUrl,
    getMissingRoleIdsFromRequired,
    getNameOfResource,
    getResourceUrl,
    getRoleIdsFromRoleAssignments,
    isDefined,
    sortCaseInsensitive
} from '../Utils';

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
        test('input single minute', () => {
            // ARRANGE
            const durationInMs = 1 * 60 * 1000; // 1 minute

            // ACT
            const result = formatTimeInRelevantUnits(durationInMs);

            // ASSERT
            expect(result).toBeDefined();
            expect(result.value).toEqual(1);
            expect(result.displayStringKey).toEqual('duration.minute');
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

    describe('sortCaseInsensitive', () => {
        test('sorts mixed case values correctly, b before a', () => {
            // ARRANGE
            const values = ['something', 'Everything'];

            // ACT
            values.sort(sortCaseInsensitive());
            // ASSERT
            expect(values[0]).toEqual('Everything');
            expect(values[1]).toEqual('something');

            // ACT
            values.sort(sortCaseInsensitive(true));
            expect(values[0]).toEqual('something');
            expect(values[1]).toEqual('Everything');
        });
        test('sorts mixed case values correctly, a before b', () => {
            // ARRANGE
            const values = ['Everything', 'something'];

            // ACT
            values.sort(sortCaseInsensitive());
            // ASSERT
            expect(values[0]).toEqual('Everything');
            expect(values[1]).toEqual('something');

            // ACT
            values.sort(sortCaseInsensitive(true));
            // ASSERT
            expect(values[0]).toEqual('something');
            expect(values[1]).toEqual('Everything');
        });
        test('handles nulls', () => {
            // ARRANGE
            const values = [null, 'something'];

            // ACT
            values.sort(sortCaseInsensitive());
            // ASSERT
            expect(values[0]).toEqual('something');
            expect(values[1]).toEqual(null);

            // ACT
            values.sort(sortCaseInsensitive(true));
            // ASSERT
            expect(values[0]).toEqual(null);
            expect(values[1]).toEqual('something');
        });
    });

    describe('isDefined', () => {
        test('null returns false', () => {
            expect(isDefined(null)).toBeFalsy();
        });
        test('undefined returns false', () => {
            expect(isDefined(undefined)).toBeFalsy();
        });
        test('0 returns true', () => {
            expect(isDefined(0)).toBeTruthy();
        });
        test('empty string returns true', () => {
            expect(isDefined('')).toBeTruthy();
        });
        test('a string returns true', () => {
            expect(isDefined('test')).toBeTruthy();
        });
    });

    describe('areResourceValuesEqual', () => {
        test('return true if two resource url property values are equal', () => {
            // ARRANGE
            const value1 = 'https://exampleurl-1/';
            const value2 = 'https://exampleurl-1';

            // ACT
            const result = areResourceValuesEqual(
                value1,
                value2,
                AzureResourceDisplayFields.url
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('return false if two resource url property values are not equal', () => {
            // ARRANGE
            const value1 = 'https://exampleurl-1';
            const value2 = 'https://exampleurl-2';

            // ACT
            const result = areResourceValuesEqual(
                value1,
                value2,
                AzureResourceDisplayFields.url
            );

            // ASSERT
            expect(result).toBeFalsy();
        });
        test('return true if two resource name property values are equal', () => {
            // ARRANGE
            const value1 = 'example1';
            const value2 = 'example1';

            // ACT
            const result = areResourceValuesEqual(
                value1,
                value2,
                AzureResourceDisplayFields.name
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('return false if two resource name property values are not equal', () => {
            // ARRANGE
            const value1 = 'example1';
            const value2 = 'example2';

            // ACT
            const result = areResourceValuesEqual(
                value1,
                value2,
                AzureResourceDisplayFields.name
            );

            // ASSERT
            expect(result).toBeFalsy();
        });
    });
    describe('getRoleIdsFromRoleAssignments', () => {
        test('return list of role ids from role assignments', () => {
            // ARRANGE
            const roleDefinitionId1 = '11111111-1111-1111-1111-111111111111';
            const roleDefinitionId2 = '22222222-2222-2222-2222-222222222222';
            const roleAssignments: Array<IAzureResource> = [
                {
                    id:
                        '/subscriptions/<subscription-id>/providers/Microsoft.Authorization/roleAssignments/<role-assignment-id>',
                    name: '<role-assignment-id>',
                    properties: {
                        createdBy: '<created-by-id>',
                        createdOn: '<created-on-date>',
                        principalId: '<principle-id>',
                        roleDefinitionId:
                            '/subscriptions/<subscription-id>/providers/Microsoft.Authorization/roleDefinitions/' +
                            roleDefinitionId1,
                        scope: '/subscriptions/<subscription-id>',
                        updatedBy: '<updated-by-id>',
                        updatedOn: '<updated-on-date>'
                    },
                    type: AzureResourceTypes.RoleAssignment
                },
                {
                    id:
                        '/subscriptions/<subscription-id>/providers/Microsoft.Authorization/roleAssignments/<role-assignment-id2>',
                    name: '<role-assignment-id2>',
                    properties: {
                        createdBy: '<created-by-id>',
                        createdOn: '<created-on-date>',
                        principalId: '<principle-id>',
                        roleDefinitionId:
                            '/subscriptions/<subscription-id>/providers/Microsoft.Authorization/roleDefinitions/' +
                            roleDefinitionId2,
                        scope: '/subscriptions/<subscription-id>',
                        updatedBy: '<updated-by-id>',
                        updatedOn: '<updated-on-date>'
                    },
                    type: AzureResourceTypes.RoleAssignment
                }
            ];

            // ACT
            const result = getRoleIdsFromRoleAssignments(roleAssignments);

            // ASSERT
            expect(result).toEqual([roleDefinitionId1, roleDefinitionId2]);
        });
    });
    describe('getMissingRoleIdsFromRequired', () => {
        test('return the group of missing roles', () => {
            // ARRANGE
            const assignedAccessPermissionRoles: Array<AzureAccessPermissionRoles> = [
                AzureAccessPermissionRoles.Contributor,
                AzureAccessPermissionRoles.Owner,
                AzureAccessPermissionRoles['Azure Digital Twins Data Owner']
            ];
            const requiredAccessPermissionRoles: AzureAccessPermissionRoleGroups = {
                enforced: [AzureAccessPermissionRoles.Contributor],
                interchangeables: [
                    [
                        AzureAccessPermissionRoles[
                            'Azure Digital Twins Data Reader'
                        ],
                        AzureAccessPermissionRoles[
                            'Azure Digital Twins Data Owner'
                        ]
                    ],
                    [
                        AzureAccessPermissionRoles[
                            'Storage Blob Data Contributor'
                        ],
                        AzureAccessPermissionRoles['Storage Blob Data Owner']
                    ]
                ]
            };

            // ACT
            const result = getMissingRoleIdsFromRequired(
                assignedAccessPermissionRoles,
                requiredAccessPermissionRoles
            );

            // ASSERT
            expect(result).toMatchObject({
                enforced: [],
                interchangeables: [
                    [
                        AzureAccessPermissionRoles[
                            'Storage Blob Data Contributor'
                        ],
                        AzureAccessPermissionRoles['Storage Blob Data Owner']
                    ]
                ]
            } as AzureAccessPermissionRoleGroups);
        });
    });
    describe('getResourceUrl', () => {
        test('Getting resource url properly', () => {
            const resourceUrl1 = getResourceUrl(
                MOCK_ADT_INSTANCE,
                AzureResourceTypes.DigitalTwinInstance
            );
            const resourceUrl2 = getResourceUrl(
                MOCK_ADT_INSTANCE_URL,
                AzureResourceTypes.DigitalTwinInstance
            );
            const resourceUrl3 = getResourceUrl(
                MOCK_STORAGE_ACCOUNT,
                AzureResourceTypes.StorageAccount
            );
            const resourceUrl4 = getResourceUrl(
                MOCK_STORAGE_ACCOUNT_URL,
                AzureResourceTypes.StorageAccount
            );
            const resourceUrl5 = getResourceUrl(
                MOCK_STORAGE_CONTAINER,
                AzureResourceTypes.StorageBlobContainer,
                MOCK_STORAGE_ACCOUNT
            );
            const resourceUrl6 = getResourceUrl(
                MOCK_STORAGE_CONTAINER_NAME,
                AzureResourceTypes.StorageBlobContainer,
                MOCK_STORAGE_ACCOUNT
            );

            expect(resourceUrl1).toBe(
                'https://testADTInstance.api.wcus.digitaltwins.azure.net'
            );
            expect(resourceUrl2).toBe(
                'https://testADTInstance.api.wcus.digitaltwins.azure.net'
            );
            expect(resourceUrl3).toBe(
                'https://teststorageaccount.blob.core.windows.net/'
            );
            expect(resourceUrl4).toBe(
                'https://teststorageaccount.blob.core.windows.net/'
            );
            expect(resourceUrl5).toBe(
                'https://teststorageaccount.blob.core.windows.net/teststoragecontainer'
            );
            expect(resourceUrl6).toBe(
                'https://teststorageaccount.blob.core.windows.net/teststoragecontainer'
            );
        });
    });
    describe('getNameOfResource', () => {
        test('ADT instance/environment name is displayed properly', () => {
            const displayText1 = getNameOfResource(
                MOCK_ADT_INSTANCE,
                AzureResourceTypes.DigitalTwinInstance
            );
            const displayText2 = getNameOfResource(
                MOCK_ADT_INSTANCE_URL,
                AzureResourceTypes.DigitalTwinInstance
            );

            expect(displayText1).toBe('testADTInstance');
            expect(displayText2).toBe('testADTInstance');
        });
    });
    describe('getContainerNameFromUrl', () => {
        test('Getting container name from container url successfully', () => {
            expect(getContainerNameFromUrl(MOCK_STORAGE_CONTAINER_URL)).toBe(
                'teststoragecontainer'
            );
        });
    });
});
