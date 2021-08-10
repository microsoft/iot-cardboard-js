export const mockTwin = {
    $dtId: 'LeoTheDog',
    $etag: 'W/"7cece777-dbf3-47ca-947e-5842ff8021fb"',
    CarName: 'Slaaaa',
    // WheelInformation: {
    //     leftFrontPressure: 34,
    //     rightFrontPressure: 36,
    //     leftRearPressure: 38,
    //     rightRearPressure: 39,
    //     tireSpecification: {
    //         tireModel: 'Sport',
    //         tireWidth: 19
    //     }
    // },
    address: {
        $metadata: {}
    },
    location: {
        $metadata: {}
    },
    $metadata: {
        $model: 'dtmi:com:cocrowle:teslamodely;1',
        CarName: {
            lastUpdateTime: '2021-08-09T20:51:23.7045803Z'
        }
    }
};

export const mockRootModel = {
    '@type': 'Interface',
    '@context': 'dtmi:dtdl:context;2',
    '@id': 'dtmi:com:cocrowle:teslamodely;1',
    extends: 'dtmi:digitaltwins:ngsi_ld:city:NGSILDBaseModel;1',
    displayName: 'Tesla Model Y',
    description: 'Zooooooooom',
    comment: '',
    contents: [
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:batterydead;1',
            name: 'BatteryDeadState',
            schema: 'boolean',
            comment: '',
            description: 'Battery state',
            displayName: 'Battery dead',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:dateactivated;1',
            name: 'DateActivated',
            schema: 'date',
            comment: '',
            description: 'Date car activated',
            displayName: 'Date activated',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:lastdriven;1',
            name: 'LastDriven',
            schema: 'dateTime',
            comment: '',
            description: 'Last time the card was driven',
            displayName: 'Last driven',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:batteryLevel;1',
            name: 'BatteryLevel',
            schema: 'double',
            comment: '',
            description: 'Current Battery Level',
            displayName: 'Battery level',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:timedriven;1',
            name: 'TimeDriven',
            schema: 'duration',
            comment: '',
            description: 'Driving time of the time in ISO 8601 duration format',
            displayName: 'Time driven',
            writable: true
        },
        {
            '@type': ['Property', 'Energy'],
            '@id': 'dtmi:com:cocrowle:batterycapacity;1',
            name: 'BatteryCapacity',
            schema: 'float',
            comment: '',
            description: 'Capacity of the car battery',
            displayName: 'Battery capacity',
            unit: 'kilowattHour',
            writable: true
        },
        {
            '@type': ['Property', 'Distance'],
            '@id': 'dtmi:com:cocrowle:mileage;1',
            name: 'Mileage',
            schema: 'integer',
            comment: '',
            description: 'Current mileage of car',
            displayName: 'Mileage',
            unit: 'mile',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:salenumber;1',
            name: 'SaleNumber',
            schema: 'long',
            comment: '',
            description: 'Sale number',
            displayName: 'Sale number',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:example:carname;1',
            name: 'CarName',
            schema: 'string',
            comment: '',
            description: 'Name of the car',
            displayName: 'Car name',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:example:chargestarttime;1',
            name: 'ChargeStartTime',
            schema: 'time',
            comment: '',
            description: 'Time of day to start car charging',
            displayName: 'Charge start time',
            writable: true
        },
        {
            '@type': 'Property',
            '@id': 'dtmi:com:cocrowle:carpackage;1',
            name: 'CarPackage',
            schema: {
                '@type': 'Enum',
                '@id': 'dtmi:com:cocrowle:carpackageschema;1',
                displayName: 'Car package schema',
                description: '',
                comment: '',
                valueSchema: 'string',
                enumValues: [
                    {
                        '@id': 'dtmi:com:cocrowle:carpackagebasic;1',
                        name: 'Basic',
                        enumValue: 'Basic',
                        displayName: 'Basic',
                        description: '',
                        comment: ''
                    },
                    {
                        '@id': 'dtmi:com:cocrowle:carpackagestandard;1',
                        name: 'Standard',
                        enumValue: 'Standard',
                        displayName: 'Standard',
                        description: '',
                        comment: ''
                    }
                ]
            },
            comment: '',
            description: '',
            displayName: 'Car package',
            writable: true
        },
        {
            '@type': 'Property',
            name: 'WheelInformation',
            displayName: 'Wheel information',
            description: 'Information about car tires',
            schema: {
                '@type': 'Object',
                fields: [
                    {
                        name: 'leftFrontPressure',
                        displayName: 'Left front pressure',
                        schema: 'double'
                    },
                    {
                        name: 'rightFrontPressure',
                        displayName: 'Right front pressure',
                        schema: 'double'
                    },
                    {
                        name: 'leftRearPressure',
                        displayName: 'Left rear pressure',
                        schema: 'double'
                    },
                    {
                        name: 'rightRearPressure',
                        displayName: 'Right rear pressure',
                        schema: 'double'
                    },
                    {
                        name: 'tireSpecification',
                        displayName: 'Tire specification',
                        schema: {
                            '@type': 'Object',
                            fields: [
                                {
                                    name: 'tireModel',
                                    displayName: 'Tire model',
                                    schema: 'string'
                                },
                                {
                                    name: 'tireWidth',
                                    displayName: 'Tire width',
                                    schema: 'double'
                                }
                            ]
                        }
                    }
                ]
            },
            writable: true
        },
        {
            '@type': 'Property',
            name: 'SystemModuleState',
            displayName: 'System state',
            writable: true,
            schema: {
                '@type': 'Map',
                mapKey: {
                    name: 'moduleName',
                    schema: 'string'
                },
                mapValue: {
                    name: 'moduleState',
                    schema: 'string'
                }
            }
        },
        {
            '@type': 'Relationship',
            name: 'chargedBy',
            minMultiplicity: 0,
            maxMultiplicity: 1,
            properties: [
                {
                    '@type': 'Property',
                    name: 'lastCharged',
                    schema: 'dateTime'
                }
            ]
        }
    ]
};

export const mockExpandedModel = [
    {
        '@type': 'Interface',
        '@context': 'dtmi:dtdl:context;2',
        '@id': 'dtmi:com:cocrowle:teslamodely;1',
        extends: 'dtmi:digitaltwins:ngsi_ld:city:NGSILDBaseModel;1',
        displayName: 'Tesla Model Y',
        description: 'Zooooooooom',
        comment: '',
        contents: [
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:batterydead;1',
                name: 'BatteryDeadState',
                schema: 'boolean',
                comment: '',
                description: 'Battery state',
                displayName: 'Battery dead',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:dateactivated;1',
                name: 'DateActivated',
                schema: 'date',
                comment: '',
                description: 'Date car activated',
                displayName: 'Date activated',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:lastdriven;1',
                name: 'LastDriven',
                schema: 'dateTime',
                comment: '',
                description: 'Last time the card was driven',
                displayName: 'Last driven',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:batteryLevel;1',
                name: 'BatteryLevel',
                schema: 'double',
                comment: '',
                description: 'Current Battery Level',
                displayName: 'Battery level',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:timedriven;1',
                name: 'TimeDriven',
                schema: 'duration',
                comment: '',
                description:
                    'Driving time of the time in ISO 8601 duration format',
                displayName: 'Time driven',
                writable: true
            },
            {
                '@type': ['Property', 'Energy'],
                '@id': 'dtmi:com:cocrowle:batterycapacity;1',
                name: 'BatteryCapacity',
                schema: 'float',
                comment: '',
                description: 'Capacity of the car battery',
                displayName: 'Battery capacity',
                unit: 'kilowattHour',
                writable: true
            },
            {
                '@type': ['Property', 'Distance'],
                '@id': 'dtmi:com:cocrowle:mileage;1',
                name: 'Mileage',
                schema: 'integer',
                comment: '',
                description: 'Current mileage of car',
                displayName: 'Mileage',
                unit: 'mile',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:salenumber;1',
                name: 'SaleNumber',
                schema: 'long',
                comment: '',
                description: 'Sale number',
                displayName: 'Sale number',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:example:carname;1',
                name: 'CarName',
                schema: 'string',
                comment: '',
                description: 'Name of the car',
                displayName: 'Car name',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:example:chargestarttime;1',
                name: 'ChargeStartTime',
                schema: 'time',
                comment: '',
                description: 'Time of day to start car charging',
                displayName: 'Charge start time',
                writable: true
            },
            {
                '@type': 'Property',
                '@id': 'dtmi:com:cocrowle:carpackage;1',
                name: 'CarPackage',
                schema: {
                    '@type': 'Enum',
                    '@id': 'dtmi:com:cocrowle:carpackageschema;1',
                    displayName: 'Car package schema',
                    description: '',
                    comment: '',
                    valueSchema: 'string',
                    enumValues: [
                        {
                            '@id': 'dtmi:com:cocrowle:carpackagebasic;1',
                            name: 'Basic',
                            enumValue: 'Basic',
                            displayName: 'Basic',
                            description: '',
                            comment: ''
                        },
                        {
                            '@id': 'dtmi:com:cocrowle:carpackagestandard;1',
                            name: 'Standard',
                            enumValue: 'Standard',
                            displayName: 'Standard',
                            description: '',
                            comment: ''
                        }
                    ]
                },
                comment: '',
                description: '',
                displayName: 'Car package',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'WheelInformation',
                displayName: 'Wheel information',
                description: 'Information about car tires',
                schema: {
                    '@type': 'Object',
                    fields: [
                        {
                            name: 'leftFrontPressure',
                            displayName: 'Left front pressure',
                            schema: 'double'
                        },
                        {
                            name: 'rightFrontPressure',
                            displayName: 'Right front pressure',
                            schema: 'double'
                        },
                        {
                            name: 'leftRearPressure',
                            displayName: 'Left rear pressure',
                            schema: 'double'
                        },
                        {
                            name: 'rightRearPressure',
                            displayName: 'Right rear pressure',
                            schema: 'double'
                        },
                        {
                            name: 'tireSpecification',
                            displayName: 'Tire specification',
                            schema: {
                                '@type': 'Object',
                                fields: [
                                    {
                                        name: 'tireModel',
                                        displayName: 'Tire model',
                                        schema: 'string'
                                    },
                                    {
                                        name: 'tireWidth',
                                        displayName: 'Tire width',
                                        schema: 'double'
                                    }
                                ]
                            }
                        }
                    ]
                },
                writable: true
            },
            {
                '@type': 'Property',
                name: 'SystemModuleState',
                displayName: 'System state',
                writable: true,
                schema: {
                    '@type': 'Map',
                    mapKey: {
                        name: 'moduleName',
                        schema: 'string'
                    },
                    mapValue: {
                        name: 'moduleState',
                        schema: 'string'
                    }
                }
            },
            {
                '@type': 'Component',
                name: 'location',
                schema: 'dtmi:digitaltwins:ngsi_ld:city:geoLocation;1'
            },
            {
                '@type': 'Relationship',
                name: 'chargedBy',
                minMultiplicity: 0,
                maxMultiplicity: 1,
                properties: [
                    {
                        '@type': 'Property',
                        name: 'lastCharged',
                        schema: 'dateTime'
                    }
                ]
            }
        ]
    },
    {
        '@id': 'dtmi:digitaltwins:ngsi_ld:city:NGSILDBaseModel;1',
        '@type': 'Interface',
        displayName: 'NGSILDBaseModel',
        contents: [
            {
                '@type': 'Property',
                name: 'dataProvider',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'dateModified',
                schema: 'dateTime',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'dateCreated',
                schema: 'dateTime',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'source',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'alternateName',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'name',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'description',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'owner',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'seeAlso',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Component',
                name: 'address',
                schema: 'dtmi:digitaltwins:ngsi_ld:city:Address;1'
            },
            {
                '@type': 'Component',
                name: 'location',
                schema: 'dtmi:digitaltwins:ngsi_ld:city:geoLocation;1'
            }
        ],
        '@context': ['dtmi:dtdl:context;2']
    },
    {
        '@id': 'dtmi:digitaltwins:ngsi_ld:city:Address;1',
        '@type': 'Interface',
        displayName: 'Address',
        contents: [
            {
                '@type': 'Property',
                name: 'addressCountry',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'addressLocality',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'addressRegion',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'postOfficeBoxNumber',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'postalCode',
                schema: 'string',
                writable: true
            },
            {
                '@type': 'Property',
                name: 'streetAddress',
                schema: 'string',
                writable: true
            }
        ],
        '@context': ['dtmi:dtdl:context;2']
    },
    {
        '@id': 'dtmi:digitaltwins:ngsi_ld:city:geoLocation;1',
        '@type': 'Interface',
        displayName: 'GeoLocation',
        contents: [
            {
                '@type': 'Property',
                name: 'type',
                schema: {
                    '@type': 'Enum',
                    valueSchema: 'string',
                    enumValues: [
                        {
                            name: 'position',
                            displayName: 'Position',
                            enumValue: 'Position'
                        },
                        {
                            name: 'point',
                            displayName: 'Point',
                            enumValue: 'Point'
                        },
                        {
                            name: 'multiPoint',
                            displayName: 'MultiPoint',
                            enumValue: 'MultiPoint'
                        },
                        {
                            name: 'lineString',
                            displayName: 'LineString',
                            enumValue: 'LineString'
                        },
                        {
                            name: 'multiLineString',
                            displayName: 'MultiLineString',
                            enumValue: 'MultiLineString'
                        },
                        {
                            name: 'polygon',
                            displayName: 'Polygon',
                            enumValue: 'Polygon'
                        },
                        {
                            name: 'multiPolygon',
                            displayName: 'MultiPolygon',
                            enumValue: 'MultiPolygon'
                        }
                    ]
                },
                writable: true
            },
            {
                '@type': 'Property',
                name: 'coordinates',
                schema: 'string',
                writable: true
            }
        ],
        '@context': ['dtmi:dtdl:context;2']
    }
];

export const mockRelationship = {
    $relationshipId: 'f100e83e-0d4c-4bd1-a7bc-bd186b741bbd',
    $etag: 'W/"7107e622-c4d9-499d-aff5-c3c900ebc714"',
    $sourceId: 'LeoTheDog',
    $relationshipName: 'chargedBy',
    $targetId: 'PasteurizationMachine_A03'
};
