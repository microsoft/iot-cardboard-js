import { DTModel } from '.';

export const MediaTwinModel: DTModel = {
    '@type': 'Interface',
    '@context': 'dtmi:dtdl:context;2',
    '@id': 'dtmi:com:niusoff:mediatwin;1',
    displayName: 'MediaTwinModel',
    contents: [
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
            schema: 'string'
        },
        {
            '@type': 'Property',
            name: 'AdditionalProperties',
            schema: 'string'
        },
        {
            '@type': 'Relationship',
            name: 'HasMember',
            '@id': 'dtmi:com:niusoff:mediatwinhasmember;1',
            properties: [
                {
                    '@type': 'Property',
                    name: 'MediaMemberProperties',
                    schema: {
                        '@type': 'Object',
                        fields: [
                            {
                                name: 'Position',
                                schema: {
                                    '@type': 'Object',
                                    fields: [
                                        {
                                            name: 'x',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'y',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'z',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'lat',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'long',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'id',
                                            schema: 'string'
                                        },
                                        {
                                            name: 'scale',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'rotation',
                                            schema: 'double'
                                        },
                                        {
                                            name: 'zoom',
                                            schema: 'double'
                                        }
                                    ]
                                }
                            },
                            {
                                name: 'PropertyName',
                                schema: 'string'
                            },
                            {
                                name: 'DisplayProperties',
                                schema: {
                                    '@type': 'Object',
                                    fields: [
                                        {
                                            name: 'DisplayType',
                                            schema: 'string'
                                        },
                                        {
                                            name: 'OperatingRange',
                                            schema: {
                                                '@type': 'Object',
                                                fields: [
                                                    {
                                                        name: 'UpperBound',
                                                        schema: 'double'
                                                    },
                                                    {
                                                        name: 'LowerBound',
                                                        schema: 'double'
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
                }
            ]
        },
        {
            '@type': 'Relationship',
            name: 'Represents',
            '@id': 'dtmi:com:niusoff:mediatwinrepresents;1',
            minMultiplicity: 0,
            maxMultiplicity: 1
        }
    ]
};
