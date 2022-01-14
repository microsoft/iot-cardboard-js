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

export const dtdlPrimitiveTypesList = [
    'boolean',
    'date',
    'dateTime',
    'double',
    'duration',
    'float',
    'integer',
    'long',
    'string',
    'time'
];

export enum dtdlPropertyTypesEnum {
    boolean = 'boolean',
    date = 'date',
    dateTime = 'dateTime',
    double = 'double',
    duration = 'duration',
    float = 'float',
    integer = 'integer',
    long = 'long',
    string = 'string',
    time = 'time',
    Array = 'Array',
    Enum = 'Enum',
    Map = 'Map',
    Object = 'Object'
}

export const dtdlComplexTypesList = ['Array', 'Enum', 'Map', 'Object'];
export const ADTSceneTwinModelId = 'dtmi:com:visualontology:scene;1';

/*eslint-disable-next-line: */
// prettier-ignore
export const CharacterWidths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625];

export const ADT3DSceneConfigFileNameInBlobStore = 'vconfigDecFinal'; //TODO: update this as appropriate
