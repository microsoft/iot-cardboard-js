
import { DtdlInterface, DtdlProperty, DtdlRelationship } from "./dtdlInterfaces";

export const MediaMemberPosition: DtdlInterface = {
    '@type': 'Interface',
    "@context": "dtmi:dtdl:context;2",
    "@id": "dtmi:com:niusoff:mediamemberposition;1",
    'displayName': 'MediaMemberPosition',
    contents: [
        {
            '@type': 'Property',
            name: 'x',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'y',
            schema: 'double',
            
        },
        {
            '@type': 'Property',
            name: 'z',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'lat',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'long',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'id',
            schema: 'string'
        },
        {
            '@type': 'Property',
            name: 'scale',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'rotation',
            schema: 'double'
        },
        {
            '@type': 'Property',
            name: 'zoom',
            schema: 'double'
        }
    ]
}

export const MediaTwinRelationships: DtdlRelationship[] = [
    {
        '@type': 'Relationship',
        name: 'HasMember',
        '@id': "dtmi:com:niusoff:mediatwinhasmember;1",
        properties: [
            {
                '@type': 'Property',
                name: 'MediaMemberProperties',
                schema: {
                    type: 'Object',
                    fields: [
                        {
                            '@type': 'Component',
                            name: 'Position',
                            schema: 'dtmi:com:niusoff:mediamemberposition;1'
                        },
                        {
                            name: 'PropertyName',
                            schema: 'string'
                        },
                        {
                            name: 'DisplayProperties',
                            schema: {
                                type: 'Object',
                                fields: [
                                    {
                                        name: 'DisplayType',
                                        schema: 'string'
                                    },
                                    {
                                        name: 'OperatingRange',
                                        schema: {
                                            type: 'Object',
                                            fields: [
                                                {
                                                    name: 'UpperBound',
                                                    schema: 'Number'
                                                },
                                                {
                                                    name: 'LowerBound',
                                                    schema: 'Number'
                                                },
                                                {
                                                    name: 'Unit',
                                                    schema: 'string'
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
        ]
    },
    {
        '@type': 'Relationship',
        name: 'Represents',
        '@id': "dtmi:com:niusoff:mediatwinrepresents;1",
        minMultiplicity: 0,
        maxMultiplicity: 1
    }
]

const properties: DtdlProperty[] = [
    {
        '@type': 'Property',
        name: 'MediaSrc',
        schema: 'string'
    },
    {
        '@type': 'Property',
        name: 'MediaSrcSecret',
        schema: 'string'
    },
    {
        '@type': 'Property',
        name: 'MediaType',
        schema: 'string' // TODO enum
    },
    {
        '@type': 'Property',
        name: 'MediaSrcSecret',
        schema: 'string',
    },
];

export const MediaTwinModel: DtdlInterface = {
    '@type': 'Interface',
    "@context": "dtmi:dtdl:context;2",
    "@id": "dtmi:com:niusoff:mediatwin;1",
    displayName: 'MediaTwinModel',
    contents: [...properties, ...MediaTwinRelationships],
}