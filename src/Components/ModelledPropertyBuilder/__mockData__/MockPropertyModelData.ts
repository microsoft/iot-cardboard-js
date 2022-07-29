import { I3DScenesConfig } from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export const config: I3DScenesConfig = {
    $schema:
        'https://github.com/microsoft/iot-cardboard-js/tree/main/schemas/3DScenesConfiguration/v1.0.0/3DScenesConfiguration.schema.json',
    configuration: {
        scenes: [
            {
                id: '7913dd70d6b34ffaf8c1f1f2e277f6a4',
                displayName: 'Scene A',
                assets: [
                    {
                        type: '3DAsset',
                        url:
                            'https://cardboardresources.blob.core.windows.net/cardboard-mock-files/BasicObjects.gltf'
                    }
                ],
                elements: [
                    {
                        type: 'TwinToObjectMapping',
                        id: '37707f49068935a8f1f0a8f03f957460',
                        displayName: 'Tesla',
                        primaryTwinID: 'Tesla',
                        objectIDs: [
                            'Mesh3 LKHP_40_15_254TC2 Centrifugal_Pumps2 Model',
                            'Mesh4 LKHP_40_15_254TC3 Centrifugal_Pumps2 Model'
                        ],
                        twinAliases: {
                            ElectricityTag: 'SaltMachine_C1',
                            TemperatureTag: 'PasteurizationMachine_A04'
                        }
                    },
                    {
                        type: 'TwinToObjectMapping',
                        id: 'f6e98b086fc5759c39cbcd94f24277bb',
                        displayName: 'PasteurizationMachine_A02',
                        primaryTwinID: 'PasteurizationMachine_A02',
                        objectIDs: [
                            'Mesh2 LKHP_40_15_254TC1 Centrifugal_Pumps1 Model',
                            'Mesh6 LKHP_40_15_254TC5 Centrifugal_Pumps3 Model'
                        ],
                        twinAliases: {
                            ElectricityTag: 'SaltMachine_C2',
                            TemperatureTag: 'PasteurizationMachine_A04'
                        }
                    }
                ],
                behaviorIDs: ['447a049a3cf23c8e762d6d3b13fedef3']
            },
            {
                id: '1c3bb91abdab686290a134828a5538f2',
                displayName: 'Scene B',
                assets: [
                    {
                        type: '3DAsset',
                        url:
                            'https://cardboardresources.blob.core.windows.net/cardboard-mock-files/BluePackingLine.gltf'
                    }
                ],
                elements: [
                    {
                        type: 'TwinToObjectMapping',
                        id: '675dc118e97acd4821fa06e2de984ddb',
                        displayName: 'SaltMachine_C2',
                        primaryTwinID: 'SaltMachine_C2',
                        objectIDs: ['Mesh_0.719', 'Mesh_0.723', 'Mesh_0.724']
                    }
                ],
                behaviorIDs: ['447a049a3cf23c8e762d6d3b13fedef3']
            }
        ],
        behaviors: [
            {
                id: '447a049a3cf23c8e762d6d3b13fedef3',
                displayName: 'Flow rate status ',
                datasources: [
                    {
                        type: 'ElementTwinToObjectMappingDataSource',
                        elementIDs: [
                            '37707f49068935a8f1f0a8f03f957460',
                            'f6e98b086fc5759c39cbcd94f24277bb'
                        ]
                    }
                ],
                visuals: [
                    {
                        type: 'StatusColoring',
                        statusValueExpression: 'PrimaryTwin.InFlow',
                        valueRanges: [
                            {
                                color: '#33A1FD',
                                min: '-Infinity',
                                max: 0,
                                id: 'db20120a5aa7422bff222a5b2fb9ce9d'
                            },
                            {
                                color: '#26C485',
                                min: 0,
                                max: 'Infinity',
                                id: 'b7f873ea2cfa78303622d36c3500fdf7'
                            }
                        ],
                        objectIDs: {
                            expression: 'objectIDs'
                        }
                    }
                ],
                twinAliases: ['ElectricityTag', 'TemperatureTag']
            }
        ],
        layers: [
            {
                id: '8904b620aa83c649888dadc7c8fdf492',
                displayName: 'Flow',
                behaviorIDs: ['d6a2d68bc4007f3fa624eab19105e44b']
            }
        ]
    }
};
