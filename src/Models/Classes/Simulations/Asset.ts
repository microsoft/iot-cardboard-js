import {
    AssetRelationship,
    AssetTwin,
    ADTPatch,
    IAssetDevice,
} from '../../Constants';
import AssetSimulation from './AssetSimulation';

export class Asset {
    public name: string;
    public assetSimulation: AssetSimulation;
    public relationships: Array<AssetRelationship>;
    public twins: Array<AssetTwin>;
    public devices: Array<IAssetDevice>;

    private getDeviceInstances() {
        const deviceInstances = [];
        this.devices.forEach((device) => {
            deviceInstances.push(new AssetDevice(device));
        });
        return deviceInstances;
    }

    constructor(name: string, assetSimulation: AssetSimulation) {
        this.devices = [];
        this.relationships = [];
        this.twins = [];
        this.name = name;
        this.assetSimulation = assetSimulation;
        switch (name) {
            case 'Car': {
                this.devices = [
                    {
                        id: this.name,
                        deviceName: 'Speed',
                        seedValue: Math.floor(Math.random() * 20) + 40,
                        minValue: 0,
                        maxValue: 100,
                        properties: { Units: 'MPH' },
                    },
                    {
                        id: this.name,
                        deviceName: 'OutdoorTemperature',
                        seedValue: Math.floor(Math.random()) + 40,
                        minValue: 20,
                        maxValue: 80,
                        properties: { Units: 'DegF' },
                    },
                    {
                        id: this.name,
                        deviceName: 'OilPressure',
                        seedValue: Math.floor(Math.random()) + 30,
                        minValue: 28,
                        maxValue: 32,
                        properties: { Units: 'KPA' },
                    },
                ];
                this.twins.push({
                    name: 'CarTwin',
                    devices: this.getDeviceInstances(),
                });
                break;
            }
            case 'Windmill': {
                this.devices = [
                    {
                        id: this.name,
                        deviceName: 'OutdoorTemperature',
                        seedValue: Math.floor(Math.random() * 20) + 40,
                        minValue: 0,
                        maxValue: 100,
                        properties: { Units: 'degF' },
                    },
                    {
                        id: this.name,
                        deviceName: 'AtmosphericPressure',
                        seedValue: Math.floor(Math.random()) + 30,
                        minValue: 29,
                        maxValue: 31,
                        properties: { Units: 'in' },
                    },

                    {
                        id: this.name,
                        deviceName: 'WindVelocity',
                        seedValue: Math.floor(Math.random() * 30),
                        minValue: 0,
                        maxValue: 70,
                        properties: { Units: 'mph' },
                    },
                    {
                        id: this.name,
                        deviceName: 'BearingTemperature',
                        seedValue: Math.floor(Math.random() * 30) + 90,
                        minValue: 90,
                        maxValue: 200,
                        properties: { Units: 'degF' },
                    },
                    {
                        id: this.name,
                        deviceName: 'OilViscosity',
                        seedValue: Math.floor(Math.random() * 5) + 10,
                        minValue: 10,
                        maxValue: 80,
                        properties: { Units: 'cSt' },
                    },
                ];

                this.twins.push({
                    name: 'Windmill_1',
                    devices: this.getDeviceInstances(),
                });
                break;
            }
            case 'HVACSystem': {
                this.devices = [
                    {
                        id: this.name,
                        deviceName: 'FanSpeed',
                        seedValue: Math.floor(Math.random() * 20) + 40,
                        minValue: 0,
                        maxValue: 100,
                        properties: { Units: 'MPH' },
                    },
                    {
                        id: this.name,
                        deviceName: 'CoolerTemperature',
                        seedValue: Math.floor(Math.random()) + 40,
                        minValue: 20,
                        maxValue: 60,
                        properties: { Units: 'DegF' },
                    },
                    {
                        id: this.name,
                        deviceName: 'HeaterTemperature',
                        seedValue: Math.floor(Math.random()) + 50,
                        minValue: 40,
                        maxValue: 100,
                        properties: { Units: 'DegF' },
                    },
                ];

                this.twins.push({
                    name: 'HVACSystem_1',
                    devices: this.getDeviceInstances(),
                });
                break;
            }
            case 'PasteurizationMachine': {
                this.devices = [
                    {
                        id: this.name,
                        deviceName: 'InFlow',
                        seedValue: Math.floor(Math.random() * 300) + 50,
                        minValue: 50,
                        maxValue: 600,
                        properties: { Units: 'Gallons' },
                    },
                    {
                        id: this.name,
                        deviceName: 'OutFlow',
                        seedValue: Math.floor(Math.random() * 300) + 50,
                        minValue: 50,
                        maxValue: 600,
                        properties: { Units: 'Gallons' },
                    },
                    {
                        id: this.name,
                        deviceName: 'Temperature',
                        seedValue: Math.floor(Math.random()) + 120,
                        minValue: 110,
                        maxValue: 250,
                        properties: { Units: 'DegF' },
                    },
                    {
                        id: this.name,
                        deviceName: 'PercentFull',
                        seedValue: Math.floor(Math.random()),
                        minValue: 0,
                        maxValue: 1,
                        properties: { Units: 'Percent' },
                    },
                ];

                this.relationships.push({
                    name: 'feeds',
                    target: 'SaltMachine',
                });

                this.twins.push({
                    name: 'PasteurizationMachine_A01',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine',
                        },
                    ],
                    devices: this.getDeviceInstances(),
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A02',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine',
                        },
                    ],
                    devices: this.getDeviceInstances(),
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A03',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine',
                        },
                    ],
                    devices: this.getDeviceInstances(),
                });
                this.twins.push({
                    name: 'PasteurizationMachine_A04',
                    assetRelationships: [
                        {
                            name: 'feeds',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine',
                        },
                    ],
                    devices: this.getDeviceInstances(),
                });
                break;
            }
            case 'SaltMachine': {
                this.devices = [
                    {
                        id: this.name,
                        deviceName: 'InFlow',
                        seedValue: Math.floor(Math.random() * 300) + 50,
                        minValue: 50,
                        maxValue: 600,
                        properties: { Units: 'Gallons' },
                    },
                    {
                        id: this.name,
                        deviceName: 'OutFlow',
                        seedValue: Math.floor(Math.random() * 300) + 50,
                        minValue: 50,
                        maxValue: 600,
                        properties: { Units: 'Gallons' },
                    },
                ];

                this.twins.push({
                    name: 'SaltMachine_C0',
                    devices: this.getDeviceInstances(),
                });
                this.twins.push({
                    name: 'SaltMachine_C1',
                    devices: this.getDeviceInstances(),
                });
                this.twins.push({
                    name: 'SaltMachine_C2',
                    devices: this.getDeviceInstances(),
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
                            targetModel: 'SaltMachine',
                        },
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine',
                        },
                    ],
                    devices: [],
                });

                this.twins.push({
                    name: 'Amy',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine',
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine',
                        },
                    ],
                    devices: [],
                });

                this.twins.push({
                    name: 'John',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine',
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A03',
                            targetModel: 'PasteurizationMachine',
                        },
                    ],
                    devices: [],
                });

                this.twins.push({
                    name: 'Phillip',
                    assetRelationships: [
                        {
                            name: 'maintains',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine',
                        },
                        {
                            name: 'maintains',
                            target: 'PasteurizationMachine_A04',
                            targetModel: 'PasteurizationMachine',
                        },
                    ],
                    devices: [],
                });

                break;
            }
            case 'Factory': {
                this.relationships.push({ name: 'contains' });
                this.relationships.push({
                    name: 'employs',
                    target: 'MaintenancePersonnel',
                });

                this.twins.push({
                    name: 'OsloFactory',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'SaltMachine_C0',
                            targetModel: 'SaltMachine',
                        },
                        {
                            name: 'contains',
                            target: 'SaltMachine_C1',
                            targetModel: 'SaltMachine',
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A01',
                            targetModel: 'PasteurizationMachine',
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A02',
                            targetModel: 'PasteurizationMachine',
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A03',
                            targetModel: 'PasteurizationMachine',
                        },
                        {
                            name: 'employs',
                            target: 'Amy',
                            targetModel: 'MaintenancePersonnel',
                        },
                        {
                            name: 'employs',
                            target: 'John',
                            targetModel: 'MaintenancePersonnel',
                        },
                        {
                            name: 'employs',
                            target: 'Xenia',
                            targetModel: 'MaintenancePersonnel',
                        },
                    ],
                    devices: [],
                });

                this.twins.push({
                    name: 'StockholmFactory',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'SaltMachine_C2',
                            targetModel: 'SaltMachine',
                        },
                        {
                            name: 'contains',
                            target: 'PasteurizationMachine_A04',
                            targetModel: 'PasteurizationMachine',
                        },
                        {
                            name: 'employs',
                            target: 'Phillip',
                            targetModel: 'MaintenancePersonnel',
                        },
                    ],
                    devices: [],
                });

                break;
            }
            case 'Country': {
                this.relationships.push({
                    name: 'contains',
                    target: 'Factory',
                });
                this.twins.push({
                    name: 'Norway',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'OsloFactory',
                            targetModel: 'Factory',
                        },
                    ],
                    devices: [],
                });
                this.twins.push({
                    name: 'Sweden',
                    assetRelationships: [
                        {
                            name: 'contains',
                            target: 'StockholmFactory',
                            targetModel: 'Factory',
                        },
                    ],
                    devices: [],
                });
                break;
            }
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

    constructor(assetParams: IAssetDevice) {
        this.id = assetParams.id;
        this.deviceName = assetParams.deviceName;
        this.seedValue = assetParams.seedValue;
        this.minValue = assetParams.minValue;
        this.maxValue = assetParams.maxValue;
        this.properties = assetParams.properties;
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
        const event: ADTPatch = {
            op: 'replace',
            path: `/${this.deviceName}`,
            value: this.seedValue,
        };
        return event;
    }
}
