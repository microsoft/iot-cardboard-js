import { DTDLModel } from '../../Models/Classes/DTDL';

export const mockTwin = {
    $dtId: 'PasteurizationMachine_A01',
    $etag: 'W/"9af7d33c-3c92-4371-85ac-f10ead57f70a"',
    cb_viewdata: {
        processGraphicImageSrc:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Pasteurization.png',
        processGraphicLabelPositions:
            '{"InFlow":{"left":"20%","top":"40%"},"OutFlow":{"left":"50%","top":"40%"},"Temperature":{"left":"30%","top":"70%"},"PercentFull":{"left":"60%","top":"5%"}}'
    },
    InFlow: 61.57923042361593,
    OutFlow: 125.69830944243206,
    $metadata: {
        $model: 'dtmi:assetGen:PasteurizationMachine;1',
        cb_viewdata: {
            lastUpdateTime: '2021-07-30T18:45:32.3282278Z'
        },
        InFlow: {
            lastUpdateTime: '2021-07-30T18:45:39.3620552Z'
        },
        OutFlow: {
            lastUpdateTime: '2021-07-30T18:45:39.3620552Z'
        },
        Temperature: {
            lastUpdateTime: '2021-07-30T18:45:39.3620552Z'
        },
        PercentFull: {
            lastUpdateTime: '2021-07-30T18:45:39.3620552Z'
        }
    }
};

export const mockModel = new DTDLModel(
    'dtmi:assetGen:PasteurizationMachine;1',
    'PasteurizationMachine',
    '',
    '',
    [
        {
            '@type': 'Property',
            name: 'InFlow',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'OutFlow',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'Temperature',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'PercentFull',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'cb_viewdata',
            schema: {
                '@type': 'Object',
                fields: [
                    {
                        name: 'boardInfo',
                        schema: 'string'
                    },
                    {
                        name: 'processGraphicImageSrc',
                        schema: 'string'
                    },
                    {
                        name: 'processGraphicLabelPositions',
                        schema: 'string'
                    }
                ]
            }
        }
    ],
    [
        {
            '@type': 'Relationship',
            name: 'feeds',
            properties: [
                {
                    '@type': 'Property',
                    name: 'targetModel',
                    schema: 'string'
                }
            ],
            target: 'dtmi:assetGen:SaltMachine;1'
        },
        {
            '@type': 'Relationship',
            name: 'adjacentTo',
            properties: [
                {
                    '@type': 'Property',
                    name: 'targetModel',
                    schema: 'string'
                }
            ],
            target: 'dtmi:assetGen:PasteurizationMachine;1'
        },
        {
            '@type': 'Relationship',
            name: 'isMaintainedBy',
            properties: [
                {
                    '@type': 'Property',
                    name: 'targetModel',
                    schema: 'string'
                }
            ],
            target: 'dtmi:assetGen:MaintenancePersonnel;1'
        },
        {
            '@type': 'Relationship',
            name: 'isLocatedIn',
            properties: [
                {
                    '@type': 'Property',
                    name: 'targetModel',
                    schema: 'string'
                }
            ],
            target: 'dtmi:assetGen:Factory;1'
        }
    ],
    []
);
