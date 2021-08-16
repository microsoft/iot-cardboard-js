import {
    ADTModel_ImgSrc_PropertyName,
    ADTModel_ImgPropertyPositions_PropertyName,
    DTModelContent,
    DTModel,
    DTwin,
    DTwinRelationship,
    IAdtPusherSimulation,
    ADTModel_ViewData_PropertyName,
    BoardInfoPropertyName
} from '../../Constants';
import {
    AssetRelationship,
    AssetTwin,
    AdtPatch,
    DTwinUpdateEvent
} from '../../Constants/Interfaces';
import { downloadText } from '../../Services/Utils';
import ADTModelImages from './ADTModelImageProperties';
import { Asset } from './Asset';

const modelTwinsRelationshipsData = {
    versionNumber: 1
};

export default class AssetSimulation implements IAdtPusherSimulation {
    private assets: Array<Asset>;
    private typeIds: any;
    public seedTimeMillis: number;
    private intervalMillis: number;
    private isADTModelImagesIncluded: boolean;

    constructor(seedTimeMillis: number, intervalMillis: number) {
        this.assets = [];
        this.seedTimeMillis = seedTimeMillis;
        this.intervalMillis = intervalMillis;
        this.isADTModelImagesIncluded = true;
        this.assets.push(new Asset('Car', this));
        this.assets.push(new Asset('Windmill', this));
        this.assets.push(new Asset('HVACSystem', this));
        this.assets.push(new Asset('PasteurizationMachine', this));
        this.assets.push(new Asset('SaltMachine', this));
        this.assets.push(new Asset('MaintenancePersonnel', this));
        this.assets.push(new Asset('Factory', this));
        this.assets.push(new Asset('Country', this));

        this.typeIds = {
            Car: '6fbe23a0-c676-44e2-b018-192d1b8cb0a6',
            Windmill: '28f203d6-c9b4-4ccd-90b0-9b7d9989684e',
            PasteurizationMachine: 'a259fb24-3359-4252-9bc8-c3c8583edc67',
            HVACSystem: '04bb3d5b-2b3e-4d45-933e-fb0087be3685'
        };
    }

    generateTwinId(name: string) {
        return `${name}Twin`;
    }

    generateModelId(name: string): string {
        return `dtmi:assetGen:${name};${modelTwinsRelationshipsData.versionNumber}`;
    }

    tick() {
        this.seedTimeMillis += this.intervalMillis;
        const events: any = [];
        this.assets.forEach(function (asset) {
            asset.twins.forEach(function (twin: AssetTwin) {
                const updateTwin: DTwinUpdateEvent = {
                    dtId: twin.name,
                    patchJSON: asset.devices.map(function (d) {
                        return d.tick() as AdtPatch;
                    })
                };
                events.push(updateTwin);
            });
        });
        return events;
    }

    generateDTModels(isImagesIncluded = true, download = false) {
        this.isADTModelImagesIncluded = isImagesIncluded;
        const dtdlModels = this.assets.map((asset) => {
            const propertyContents: Array<DTModelContent> = asset.devices.map(
                (device) => ({
                    '@type': 'Property',
                    name: device.deviceName,
                    schema: 'double'
                })
            );
            if (isImagesIncluded) {
                propertyContents.push({
                    '@type': 'Property',
                    name: ADTModel_ViewData_PropertyName,
                    schema: {
                        '@type': 'Object',
                        fields: [
                            {
                                name: BoardInfoPropertyName,
                                schema: 'string'
                            },
                            {
                                name: ADTModel_ImgSrc_PropertyName,
                                schema: 'string'
                            },
                            {
                                name: ADTModel_ImgPropertyPositions_PropertyName,
                                schema: 'string'
                            }
                        ]
                    }
                });
            }
            const relationshipContents: Array<any> = asset.relationships.map(
                (assetRelationship: AssetRelationship) => {
                    const relationship: any = {
                        '@type': 'Relationship',
                        name: assetRelationship.name,
                        properties: [
                            {
                                '@type': 'Property',
                                name: 'targetModel',
                                schema: 'string'
                            }
                        ]
                    };
                    if (assetRelationship.target) {
                        relationship.target = this.generateModelId(
                            assetRelationship.target
                        );
                    }
                    return relationship;
                }
            );

            const model: DTModel = {
                '@id': this.generateModelId(asset.name),
                '@type': 'Interface',
                '@context': 'dtmi:dtdl:context;2',
                displayName: asset.name,
                contents: [...propertyContents, ...relationshipContents]
            };
            return model;
        });
        if (download) {
            downloadText(JSON.stringify(dtdlModels), 'DT_Models.json');
        }
        return dtdlModels;
    }

    generateDTwins(isImagesIncluded = true, download = false) {
        this.isADTModelImagesIncluded = isImagesIncluded;
        const twins: Array<DTwin> = [];
        this.assets.forEach((asset: Asset) => {
            asset.twins.forEach((assetTwin: AssetTwin) => {
                const twin: DTwin = {
                    $dtId: assetTwin.name,
                    $metadata: {
                        $model: `dtmi:assetGen:${asset.name};${modelTwinsRelationshipsData.versionNumber}`
                    },
                    [ADTModel_ViewData_PropertyName]: {}
                };
                asset.devices.forEach((device) => {
                    twin[`${device.deviceName}`] = device.minValue;
                });
                if (this.isADTModelImagesIncluded) {
                    const modelId = this.generateModelId(asset.name);
                    twin[ADTModel_ViewData_PropertyName][
                        ADTModel_ImgSrc_PropertyName
                    ] = ADTModelImages[modelId][ADTModel_ImgSrc_PropertyName];

                    twin[ADTModel_ViewData_PropertyName][
                        ADTModel_ImgPropertyPositions_PropertyName
                    ] = JSON.stringify(
                        ADTModelImages[modelId][
                            ADTModel_ImgPropertyPositions_PropertyName
                        ]
                    );
                }

                twins.push(twin);
            });
        });
        if (download) {
            downloadText(JSON.stringify(twins), 'DT_Twins.json');
        }
        return twins;
    }

    generateTwinRelationships() {
        const relationships: Array<DTwinRelationship> = [];
        this.assets.forEach((asset: Asset) => {
            asset?.twins.forEach((twin: AssetTwin) => {
                twin.assetRelationships?.forEach(
                    (
                        relationship: AssetRelationship,
                        relationshipIndex: number
                    ) => {
                        relationships.push({
                            $relId: `${twin.name}_${relationship.name}_Relationship${relationshipIndex}`,
                            $dtId: twin.name,
                            $name: relationship.name,
                            $targetId: relationship.target
                                ? relationship.target
                                : '',
                            targetModel: relationship.targetModel
                                ? relationship.targetModel
                                : ''
                        });
                    }
                );
            });
        });
        return relationships;
    }
}
