import { IADT3DViewerRenderMode } from '../Constants';
import { ADT3DRenderMode } from './Enums';
import {
    defaultGaugeWidget,
    IWidgetLibraryItem,
    WidgetType
} from '../Classes/3DVConfig';
import i18n from '../../i18n';
import { FontSizes } from '@fluentui/react';

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

export const ADT3DSceneConfigFileNameInBlobStore = '3DScenesConfiguration'; //TODO: update this as appropriate

export const availableWidgets: Array<IWidgetLibraryItem> = [
    {
        title: i18n.t('widgets.gauge.title'),
        description: i18n.t('widgets.gauge.description'),
        iconName: 'SpeedHigh',
        data: defaultGaugeWidget
    },
    {
        title: i18n.t('widgets.link.title'),
        description: i18n.t('widgets.link.description'),
        iconName: 'Link',
        data: {
            type: WidgetType.Link,
            widgetConfiguration: {
                linkExpression: 'https://mypowerbi.biz/${LinkedTwin.$dtId}'
            }
        }
    }
];

export const linkedTwinName = 'LinkedTwin';
export const ValidAdtHostSuffixes = [
    'digitaltwins.azure.net',
    'azuredigitaltwins-ppe.net',
    'azuredigitaltwins-test.net'
];
export const ValidContainerHostSuffixes = ['blob.core.windows.net'];

export const RenderModes: IADT3DViewerRenderMode[] = [
    {
        id: ADT3DRenderMode.Default,
        text: '3dSceneViewer.renderModes.default',
        baseColor: null,
        fresnelColor: null,
        opacity: 1,
        isWireframe: false,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        outlinedMeshHoverColor: '#00A8F0',
        outlinedMeshSelectedColor: '#f06900',
        outlinedMeshHoverSelectedColor: '#ffb780',
        background: null
    },
    {
        id: ADT3DRenderMode.Wireframe,
        text: '3dSceneViewer.renderModes.wireframe',
        baseColor: null,
        fresnelColor: null,
        opacity: 1,
        isWireframe: true,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#ff0000',
        coloredMeshHoverColor: '#00EDD9',
        outlinedMeshHoverColor: '#00A8F0',
        outlinedMeshSelectedColor: '#f06900',
        outlinedMeshHoverSelectedColor: '#ff9a4d',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.Red,
        text: '3dSceneViewer.renderModes.red',
        baseColor: '#ff550a', // { r: 1, g: 0.33, b: 0.1, a: 1 },
        fresnelColor: '#cc000a', //{ r: 0.8, g: 0, b: 0.1, a: 1 },
        opacity: 0.1, // @coryboyle Doesn't seem to work
        isWireframe: false,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#00FF00',
        coloredMeshHoverColor: '#00EDD9',
        outlinedMeshHoverColor: '#00A8F0',
        outlinedMeshSelectedColor: '#f06900',
        outlinedMeshHoverSelectedColor: '#f06900',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.RedWireframe,
        text: '3dSceneViewer.renderModes.redWireframe',
        baseColor: '#ff550a', // { r: 1, g: 0.33, b: 0.1, a: 1 },
        fresnelColor: '#cc000a', //{ r: 0.8, g: 0, b: 0.1, a: 1 },
        opacity: 0.5,
        isWireframe: true,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        outlinedMeshHoverColor: '#00A8F0',
        outlinedMeshSelectedColor: '#f06900',
        outlinedMeshHoverSelectedColor: '#f06900',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.Green,
        text: '3dSceneViewer.renderModes.green',
        baseColor: '#0ae555', // { r: 0.1, g: 0.9, b: 0.3, a: 1 },
        fresnelColor: '#66ff0a', // { r: 0.4, g: 1, b: 0.1, a: 1 },
        opacity: 0.5,
        isWireframe: false,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        outlinedMeshHoverColor: '#00A8F0',
        outlinedMeshSelectedColor: '#f06900',
        outlinedMeshHoverSelectedColor: '#f06900',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.GreenWireframe,
        text: '3dSceneViewer.renderModes.greenWireframe',
        baseColor: '#0ae555', // { r: 0.1, g: 0.9, b: 0.3, a: 1 },
        fresnelColor: '#66ff0a', // { r: 0.4, g: 1, b: 0.1, a: 1 },
        opacity: 0.5,
        isWireframe: true,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        outlinedMeshHoverColor: '#00A8F0',
        outlinedMeshSelectedColor: '#f06900',
        outlinedMeshHoverSelectedColor: '#f06900',
        background: 'radial-gradient(#0a0a54, #020024)'
    }
];

export const EnvironmentsLocalStorageKey = 'cb-environments';
export const ContainersLocalStorageKey = 'cb-containers';
export const SelectedEnvironmentLocalStorageKey = 'cb-selected-environment';
export const SelectedContainerLocalStorageKey = 'cb-selected-container';

export const defaultValueRangeColor = '#FF0000';

export const StyleConstants = {
    icons: {
        size20: FontSizes.size20,
        size16: FontSizes.size16
    }
};
