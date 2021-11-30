import { EntityKinds } from 'cleaningsuppliesareavailableforyouruse';
import { EntityKind } from './Enums';

// make sure models in the ADT instance have these definitions and twins have these properties for process graphics card
export const ADTModel_ImgSrc_PropertyName = 'processGraphicImageSrc';
export const ADTModel_ViewData_PropertyName = 'cb_viewdata';
export const ADTModel_ImgPropertyPositions_PropertyName =
    'processGraphicLabelPositions';
export const ADTModel_InBIM_RelationshipName = 'inBIM';
export const ADTModel_BimFilePath_PropertyName = 'bimFilePath';
export const ADTModel_MetadataFilePath_PropertyName = 'metadataFilePath';
export const ADTModel_BIMContainerId = 'BIMContainer';
export const ADT_ApiVersion = '2020-10-31';
export const ViewDataPropertyName = 'cb_viewdata';
export const BoardInfoPropertyName = 'boardInfo';
export const DTMIRegex = new RegExp(
    '^dtmi:[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?)*;[1-9][0-9]{0,8}$'
);
export const DTDLNameRegex = new RegExp(
    '^[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?$'
);

// export const EntityKind = {
//     ARRAY: 'array',
//     BOOLEAN: 'boolean',
//     COMMAND: 'command',
//     COMMANDPAYLOAD: 'commandpayload',
//     COMMANDTYPE: 'commandtype',
//     COMPONENT: 'component',
//     DATE: 'date',
//     DATETIME: 'datetime',
//     DOUBLE: 'double',
//     DURATION: 'duration',
//     ENUM: 'enum',
//     ENUMVALUE: 'enumvalue',
//     FIELD: 'field',
//     FLOAT: 'float',
//     INTEGER: 'integer',
//     INTERFACE: 'interface',
//     LONG: 'long',
//     MAP: 'map',
//     MAPKEY: 'mapkey',
//     MAPVALUE: 'mapvalue',
//     OBJECT: 'object',
//     PROPERTY: 'property',
//     RELATIONSHIP: 'relationship',
//     STRING: 'string',
//     TELEMETRY: 'telemetry',
//     TIME: 'time',
//     UNIT: 'unit',
//     UNITATTRIBUTE: 'unitattribute',
//     COMMANDREQUEST: 'commandrequest',
//     COMMANDRESPONSE: 'commandresponse',
//     LATENTTYPE: 'latenttype',
//     NAMEDLATENTTYPE: 'namedlatenttype',
//     REFERENCE: 'reference'
// };

export const primitiveDtdlEntityKinds: EntityKinds[] = [
    EntityKind.BOOLEAN,
    EntityKind.DATE,
    EntityKind.DATETIME,
    EntityKind.DOUBLE,
    EntityKind.DURATION,
    EntityKind.FLOAT,
    EntityKind.INTEGER,
    EntityKind.LONG,
    EntityKind.STRING,
    EntityKind.TIME
];

export const dtdlComplexTypesList = ['Array', 'Enum', 'Map', 'Object'];

/*eslint-disable-next-line: */
// prettier-ignore
export const CharacterWidths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625];
