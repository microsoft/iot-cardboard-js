import { AssetRelationship, AssetTwin, AdtPatch } from '../../Constants';
import AssetSimulation from './AssetSimulation';

export class Asset {
    public name: string;
    public devices: Array<AssetDevice>;
    public assetSimulation: AssetSimulation;
    public relationships: Array<AssetRelationship>;
    public twins: Array<AssetTwin>;

    constructor(name: string, assetSimulation: AssetSimulation) {
        this.devices = [];
        this.relationships = [];
        this.twins = [];
        this.name = name;
        this.assetSimulation = assetSimulation;
        switch (name) {
            case 'Car':
                this.devices.push(
                    new AssetDevice(
                        'Speed',
                        this,
                        Math.floor(Math.random() * 20) + 40,
                        0,
                        100,
                        { Units: 'MPH' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'OutdoorTemperature',
                        this,
                        Math.floor(Math.random()) + 40,
                        20,
                        80,
                        { Units: 'DegF' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'OilPressure',
                        this,
                        Math.floor(Math.random()) + 30,
                        28,
                        32,
                        { Units: 'KPA' }
                    )
                );
                this.twins.push({ name: 'CarTwin' });
                break;
            case 'Windmill':
                this.devices.push(
                    new AssetDevice(
                        'OutdoorTemperature',
                        this,
                        Math.floor(Math.random() * 20) + 40,
                        0,
                        100,
                        { Units: 'degF' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'AtmosphericPressure',
                        this,
                        Math.floor(Math.random()) + 30,
                        29,
                        31,
                        { Units: 'in' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'WindVelocity',
                        this,
                        Math.floor(Math.random() * 30),
                        0,
                        70,
                        { Units: 'mph' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'BearingTemperature',
                        this,
                        Math.floor(Math.random() * 30) + 90,
                        90,
                        200,
                        { Units: 'degF' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'OilViscosity',
                        this,
                        Math.floor(Math.random() * 5) + 10,
                        10,
                        80,
                        { Units: 'cSt' }
                    )
                );
                this.twins.push({ name: 'Windmill_1' });
                break;
            case 'HVACSystem':
                this.devices.push(
                    new AssetDevice(
                        'FanSpeed',
                        this,
                        Math.floor(Math.random() * 20) + 40,
                        0,
                        100,
                        { Units: 'MPH' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'CoolerTemperature',
                        this,
                        Math.floor(Math.random()) + 40,
                        20,
                        60,
                        { Units: 'DegF' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'HeaterTemperature',
                        this,
                        Math.floor(Math.random()) + 50,
                        40,
                        100,
                        { Units: 'DegF' }
                    )
                );
                this.twins.push({ name: 'HVACSystem_1' });
                break;
            case 'PasteurizationMachine':
                this.devices.push(
                    new AssetDevice(
                        'InFlow',
                        this,
                        Math.floor(Math.random() * 300) + 50,
                        50,
                        600,
                        { Units: 'Gallons' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'OutFlow',
                        this,
                        Math.floor(Math.random() * 300) + 50,
                        50,
                        600,
                        { Units: 'Gallons' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'Temperature',
                        this,
                        Math.floor(Math.random()) + 120,
                        110,
                        250,
                        { Units: 'DegF' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'PercentFull',
                        this,
                        Math.floor(Math.random()),
                        0,
                        1,
                        { Units: 'Percent' }
                    )
                );
                this.relationships.push({
                    name: 'feeds',
                    target: 'SaltMachine'
                });
                this.relationships.push({
                    name: 'adjacentTo',
                    target: 'PasteurizationMachine'
                });
                this.relationships.push({
                    name: 'isMaintainedBy',
                    target: 'MaintenancePersonnel'
                });
                this.relationships.push({
                    name: 'isLocatedIn',
                    target: 'Factory'
                });

                this.twins.push({
                    name: 'PasteurizationMachine_A01',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'John',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'adjacentTo',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine'
                        }
                    ]
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A02',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'OsloFactory',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'John',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'adjacentTo',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'adjacentTo',
                            target: 'PasteurizationMachine_A03',
                            targetModel: 'PasteurizationMachine'
                        }
                    ]
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A03',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'Xenia',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'adjacentTo',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine'
                        }
                    ]
                });

                break;
            case 'SaltMachine':
                this.devices.push(
                    new AssetDevice(
                        'InFlow',
                        this,
                        Math.floor(Math.random() * 300) + 50,
                        50,
                        600,
                        { Units: 'Gallons' }
                    )
                );
                this.devices.push(
                    new AssetDevice(
                        'OutFlow',
                        this,
                        Math.floor(Math.random() * 300) + 50,
                        50,
                        600,
                        { Units: 'Gallons' }
                    )
                );
                this.relationships.push({
                    name: 'isFedBy',
                    target: 'PasteurizationMachine'
                });
                this.relationships.push({
                    name: 'isMaintainedBy',
                    target: 'MaintenancePersonnel'
                });
                this.relationships.push({
                    name: 'isLocatedIn',
                    target: 'Factory'
                });

                this.twins.push({
                    name: 'SaltMachine_C0',
                    assetRelationships: [
                        {
                            name: 'isFedBy',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'Xenia',
                            targetModel: 'MaintenancePersonnel'
                        }
                    ]
                });
                this.twins.push({
                    name: 'SaltMachine_C1',
                    assetRelationships: [
                        {
                            name: 'isFedBy',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'Xenia',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'Amy',
                            targetModel: 'MaintenancePersonnel'
                        }
                    ]
                });
                this.twins.push({
                    name: 'SaltMachine_C2',
                    assetRelationships: [
                        {
                            name: 'isFedBy',
                            target: 'PasteurizationMachine_A03',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'StockholmFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'isMaintainedBy',
                            target: 'Phillip',
                            targetModel: 'MaintenancePersonnel'
                        }
                    ]
                });

                break;
            case 'MaintenancePersonnel':
                this.relationships.push({ name: 'maintains' });
                this.relationships.push({
                    name: 'isEmployedAt',
                    target: 'Factory'
                });

                this.twins.push({
                    name: 'Amy',
                    assetRelationships: [
                        {
                            name: 'isEmployedAt',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine'
                        }
                    ]
                });
                this.twins.push({
                    name: 'John',
                    assetRelationships: [
                        {
                            name: 'isEmployedAt',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine'
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine'
                        }
                    ]
                });
                this.twins.push({
                    name: 'Phillip',
                    assetRelationships: [
                        {
                            name: 'isEmployedAt',
                            target: 'StockholmFactory',
                            targetModel: 'Factory'
                        },
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine'
                        }
                    ]
                });
                this.twins.push({
                    name: 'Xenia',
                    assetRelationships: [
                        {
                            name: 'isEmployedAt',
                            target: 'OsloFactory',
                            targetModel: 'Factory'
                        },
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
                    ]
                });

                break;
            case 'Factory':
                this.relationships.push({ name: 'contains' });
                this.relationships.push({
                    name: 'employs',
                    target: 'MaintenancePersonnel'
                });
                this.relationships.push({
                    name: 'isLocatedIn',
                    target: 'Country'
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
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'Norway',
                            targetModel: 'Country'
                        }
                    ]
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
                            name: 'employs',
                            target: 'Phillip',
                            targetModel: 'MaintenancePersonnel'
                        },
                        {
                            name: 'isLocatedIn',
                            target: 'Sweden',
                            targetModel: 'Country'
                        }
                    ]
                });

                break;
            case 'Country':
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
                    ]
                });
                this.twins.push({
                    name: 'Sweden',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'StockholmFactory',
                            targetModel: 'Factory'
                        }
                    ]
                });
                break;
            default:
                break;
        }
    }
}

export class AssetDevice {
    public id: string;
    public deviceName: string;
    private seedValue: number;
    public minValue: number;
    private maxValue: number;
    public properties: any;

    constructor(
        deviceName: string,
        asset: Asset,
        seedValue: number,
        minValue: number,
        maxValue: number,
        properties: any
    ) {
        this.id = asset.name;
        this.deviceName = deviceName;
        this.seedValue = seedValue;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.properties = properties;
    }

    tick() {
        const direction =
            this.seedValue > this.maxValue
                ? -1
                : this.seedValue < this.minValue
                ? 1
                : Math.random() < 0.5
                ? -1
                : 1;
        const step =
            direction *
            (Math.random() * (this.maxValue - this.minValue) * 0.02);
        this.seedValue += step;
        const event: AdtPatch = {
            op: 'replace',
            path: `/${this.deviceName}`,
            value: this.seedValue
        };
        return event;
    }
}
