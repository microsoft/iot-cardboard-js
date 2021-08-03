export const mockTwin = {
    $dtId: 'LeoTheDog',
    $etag: 'W/"6b19c2e7-5b26-44d9-ae35-9d32f4fe4a1f"',
    Mileage: 1,
    BatteryDeadState: true,
    BatteryLevel: 92,
    BatteryCapacity: 75,
    CarName: 'LeoTheDog',
    CarPackage: 'Standard',
    $metadata: {
        $model: 'dtmi:com:cocrowle:teslamodely;1',
        Mileage: {
            lastUpdateTime: '2021-08-03T00:12:45.1002616Z'
        },
        BatteryDeadState: {
            lastUpdateTime: '2021-08-03T03:17:13.5440666Z'
        },
        BatteryLevel: {
            lastUpdateTime: '2021-08-03T03:17:13.5440666Z'
        },
        BatteryCapacity: {
            lastUpdateTime: '2021-08-03T03:17:13.5440666Z'
        },
        CarName: {
            lastUpdateTime: '2021-08-03T03:17:13.5440666Z'
        },
        CarPackage: {
            lastUpdateTime: '2021-08-03T03:17:13.5440666Z'
        }
    }
};

export const mockModel = {
    '@type': 'Interface',
    '@context': 'dtmi:dtdl:context;2',
    '@id': 'dtmi:com:cocrowle:teslamodely;1',
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
            '@type': 'Component',
            name: 'location',
            schema: 'dtmi:digitaltwins:ngsi_ld:city:geoLocation;1'
        }
    ]
};

export const mockComponents = [
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
