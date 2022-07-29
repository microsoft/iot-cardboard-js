import {
    AssetRelationship,
    AssetTwin,
    ADTPatch,
    IAssetProperty
} from '../../Constants';

export class Asset {
    public name: string;
    public relationships: Array<AssetRelationship>;
    public twins: Array<AssetTwin>;
    public properties: Array<IAssetProperty<any>>;

    public getDoubleValue = (minValue: number, maxValue: number) => {
        return (currentValue: number) => {
            const direction =
                currentValue > maxValue
                    ? -1
                    : currentValue < minValue
                    ? 1
                    : Math.random() < 0.5
                    ? -1
                    : 1;
            const step =
                direction * (Math.random() * (maxValue - minValue) * 0.02);
            return (currentValue += step);
        };
    };

    public getIntegerValue = (minValue: number, maxValue: number) => {
        return (currentValue: number) => {
            const direction =
                currentValue >= maxValue
                    ? -1
                    : currentValue <= minValue
                    ? 1
                    : Math.random() < 0.5
                    ? -1
                    : 1;
            return (currentValue += direction);
        };
    };

    public getBooleanValue = (isTrueThreshold: number) => {
        return (_currentValue: boolean) => {
            return Math.random() > isTrueThreshold;
        };
    };

    public getStringValue = () => {
        return (_currentValue: boolean) => {
            const fourDigitNumber = Math.floor(Math.random() * 1000);
            return `Box${fourDigitNumber}`;
        };
    };

    private getAssetProperties() {
        const assetProperties = [];
        this.properties.forEach((property) => {
            assetProperties.push(new AssetProperty(property));
        });
        return assetProperties;
    }

    constructor(name: string) {
        this.properties = [];
        this.relationships = [];
        this.twins = [];
        this.name = name;

        switch (name) {
            case 'RobotArm': {
                this.properties = [
                    {
                        id: this.name,
                        propertyName: 'FailedPickupsLastHr',
                        currentValue: 1,
                        getNextValue: this.getIntegerValue(0, 5),
                        schema: 'integer'
                    },
                    {
                        id: this.name,
                        propertyName: 'PickupFailedAlert',
                        currentValue: false,
                        getNextValue: this.getBooleanValue(0.75),
                        schema: 'boolean'
                    },
                    {
                        id: this.name,
                        propertyName: 'PickupFailedBoxID',
                        currentValue: 'Box1',
                        getNextValue: this.getStringValue(),
                        schema: 'string'
                    },
                    {
                        id: this.name,
                        propertyName: 'HydraulicPressure',
                        currentValue: 20,
                        getNextValue: this.getDoubleValue(10, 100)
                    }
                ];
                [1, 2, 3, 4, 5, 6].forEach((idx) => {
                    this.twins.push({
                        name: `Arm${idx}`,
                        properties: this.getAssetProperties()
                    });
                });
                break;
            }
            case 'DistributionCenter': {
                this.relationships.push({
                    name: 'contains',
                    target: 'RobotArm'
                });
                this.twins.push({
                    name: 'DistCtr',
                    assetRelationships: [1, 2, 3, 4, 5, 6].map((idx) => {
                        return {
                            name: 'contains',
                            target: `Arm${idx}`,
                            targetModel: 'RobotArm'
                        };
                    }),
                    properties: []
                });
                break;
            }
            case 'Car': {
                this.properties = [
                    {
                        id: this.name,
                        propertyName: 'Speed',
                        currentValue: Math.floor(Math.random() * 20) + 40,
                        getNextValue: this.getDoubleValue(0, 100)
                    },
                    {
                        id: this.name,
                        propertyName: 'OutdoorTemperature',
                        currentValue: Math.floor(Math.random()) + 40,
                        getNextValue: this.getDoubleValue(20, 80)
                    },
                    {
                        id: this.name,
                        propertyName: 'OilPressure',
                        currentValue: Math.floor(Math.random()) + 30,
                        getNextValue: this.getDoubleValue(28, 32)
                    }
                ];
                this.twins.push({
                    name: 'CarTwin',
                    properties: this.getAssetProperties()
                });
                break;
            }
            case 'Windmill': {
                this.properties = [
                    {
                        id: this.name,
                        propertyName: 'OutdoorTemperature',
                        currentValue: Math.floor(Math.random() * 20) + 40,
                        getNextValue: this.getDoubleValue(0, 100)
                    },
                    {
                        id: this.name,
                        propertyName: 'AtmosphericPressure',
                        currentValue: Math.floor(Math.random()) + 30,
                        getNextValue: this.getDoubleValue(29, 31)
                    },

                    {
                        id: this.name,
                        propertyName: 'WindVelocity',
                        currentValue: Math.floor(Math.random() * 30),
                        getNextValue: this.getDoubleValue(0, 70)
                    },
                    {
                        id: this.name,
                        propertyName: 'BearingTemperature',
                        currentValue: Math.floor(Math.random() * 30) + 90,
                        getNextValue: this.getDoubleValue(90, 200)
                    },
                    {
                        id: this.name,
                        propertyName: 'OilViscosity',
                        currentValue: Math.floor(Math.random() * 5) + 10,
                        getNextValue: this.getDoubleValue(10, 80)
                    }
                ];

                this.twins.push({
                    name: 'Windmill_1',
                    properties: this.getAssetProperties()
                });
                break;
            }
            case 'HVACSystem': {
                this.properties = [
                    {
                        id: this.name,
                        propertyName: 'FanSpeed',
                        currentValue: Math.floor(Math.random() * 20) + 40,
                        getNextValue: this.getDoubleValue(0, 100)
                    },
                    {
                        id: this.name,
                        propertyName: 'CoolerTemperature',
                        currentValue: Math.floor(Math.random()) + 40,
                        getNextValue: this.getDoubleValue(20, 60)
                    },
                    {
                        id: this.name,
                        propertyName: 'HeaterTemperature',
                        currentValue: Math.floor(Math.random()) + 50,
                        getNextValue: this.getDoubleValue(40, 100)
                    }
                ];

                this.twins.push({
                    name: 'HVACSystem_1',
                    properties: this.getAssetProperties()
                });
                break;
            }
            case 'PasteurizationMachine': {
                this.properties = [
                    {
                        id: this.name,
                        propertyName: 'InFlow',
                        currentValue: Math.floor(Math.random() * 300) + 50,
                        getNextValue: this.getDoubleValue(50, 600)
                    },
                    {
                        id: this.name,
                        propertyName: 'OutFlow',
                        currentValue: Math.floor(Math.random() * 300) + 50,
                        getNextValue: this.getDoubleValue(50, 600)
                    },
                    {
                        id: this.name,
                        propertyName: 'Temperature',
                        currentValue: Math.floor(Math.random()) + 120,
                        getNextValue: this.getDoubleValue(110, 250)
                    },
                    {
                        id: this.name,
                        propertyName: 'PercentFull',
                        currentValue: Math.floor(Math.random()),
                        getNextValue: this.getDoubleValue(0, 1)
                    }
                ];

                this.relationships.push({
                    name: 'feeds',
                    target: 'SaltMachine'
                });

                this.twins.push({
                    name: 'PasteurizationMachine_A01',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        }
                    ],
                    properties: this.getAssetProperties()
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A02',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        }
                    ],
                    properties: this.getAssetProperties()
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A03',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine'
                        }
                    ],
                    properties: this.getAssetProperties()
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A04',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine'
                        }
                    ],
                    properties: this.getAssetProperties()
                });
                break;
            }
            case 'SaltMachine': {
                this.properties = [
                    {
                        id: this.name,
                        propertyName: 'InFlow',
                        currentValue: Math.floor(Math.random() * 300) + 50,
                        getNextValue: this.getDoubleValue(50, 600)
                    },
                    {
                        id: this.name,
                        propertyName: 'OutFlow',
                        currentValue: Math.floor(Math.random() * 300) + 50,
                        getNextValue: this.getDoubleValue(50, 600)
                    }
                ];

                this.twins.push({
                    name: 'SaltMachine_C0',
                    properties: this.getAssetProperties()
                });
                this.twins.push({
                    name: 'SaltMachine_C1',
                    properties: this.getAssetProperties()
                });
                this.twins.push({
                    name: 'SaltMachine_C2',
                    properties: this.getAssetProperties()
                });
                break;
            }
            case 'MaintenancePersonnel': {
                this.relationships.push({ name: 'maintains' });

                this.twins.push({
                    name: 'Xenia',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine'
                        }
                    ],
                    properties: []
                });

                this.twins.push({
                    name: 'Amy',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine'
                        }
                    ],
                    properties: []
                });

                this.twins.push({
                    name: 'John',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A03',
                            targetModel: 'PasteurizationMachine'
                        }
                    ],
                    properties: []
                });

                this.twins.push({
                    name: 'Phillip',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A04',
                            targetModel: 'PasteurizationMachine'
                        }
                    ],
                    properties: []
                });

                break;
            }
            case 'Factory': {
                this.relationships.push({ name: 'contains' });
                this.relationships.push({
                    name: 'employs',
                    target: 'MaintenancePersonnel'
                });

                this.twins.push({
                    name: 'OsloFactory',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'contains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A03',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'employs',
                            target: 'Amy',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'employs',
                            target: 'John',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'employs',
                            target: 'Xenia',
                            targetModel: 'MaintenancePersonnel'
                        }
                    ],
                    properties: []
                });

                this.twins.push({
                    name: 'StockholmFactory',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A04',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'employs',
                            target: 'Phillip',
                            targetModel: 'MaintenancePersonnel'
                        }
                    ],
                    properties: []
                });

                break;
            }
            case 'Country': {
                this.relationships.push({
                    name: 'contains',
                    target: 'Factory'
                });
                this.twins.push({
                    name: 'Norway',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        }
                    ],
                    properties: []
                });
                this.twins.push({
                    name: 'Sweden',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'StockholmFactory',
                            targetModel: 'Factory'
                        }
                    ],
                    properties: []
                });
                break;
            }
            default:
                break;
        }
    }
}

export class AssetProperty<T> {
    public id: string;
    public propertyName: string;
    private currentValue: T;
    private getNextValue: (currentValue: T) => T;
    public schema: string;

    constructor({
        id,
        propertyName,
        currentValue,
        getNextValue,
        schema = 'double'
    }: IAssetProperty<T>) {
        this.id = id;
        this.propertyName = propertyName;
        this.currentValue = currentValue;
        this.getNextValue = getNextValue;
        this.schema = schema;
    }

    tick() {
        this.currentValue = this.getNextValue(this.currentValue);
        const event: ADTPatch = {
            op: 'replace',
            path: `/${this.propertyName}`,
            value: this.currentValue
        };
        return event;
    }
}
