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

export const customShaderTag = 'customShaderTag';
export const RenderModes: IADT3DViewerRenderMode[] = [
    {
        id: ADT3DRenderMode.Default,
        text: '3dSceneViewer.renderModes.default',
        baseColor: null,
        fresnelColor: null,
        //opacity: 1,
        isWireframe: false,
        coloredMeshColor: '#00FF00FF',
        meshHoverColor: '#FF0000ff',
        coloredMeshHoverColor: '#eaed00ff',
        background: null
    },
    {
        id: ADT3DRenderMode.Wireframe,
        text: '3dSceneViewer.renderModes.wireframe',
        baseColor: null,
        fresnelColor: null,
        //opacity: 1,
        isWireframe: true,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#00FF00',
        coloredMeshHoverColor: '#00EDD9',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.Red,
        text: '3dSceneViewer.renderModes.red',
        baseColor: '#ff550a', // { r: 1, g: 0.33, b: 0.1, a: 1 },
        fresnelColor: '#cc000a', //{ r: 0.8, g: 0, b: 0.1, a: 1 },
        //opacity: 0.1, // @coryboyle Doesn't seem to work
        isWireframe: false,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#00FF00',
        coloredMeshHoverColor: '#00EDD9',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.RedWireframe,
        text: '3dSceneViewer.renderModes.redWireframe',
        baseColor: '#ff550a', // { r: 1, g: 0.33, b: 0.1, a: 1 },
        fresnelColor: '#cc000a', //{ r: 0.8, g: 0, b: 0.1, a: 1 },
        //opacity: 0.5,
        isWireframe: true,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.Green,
        text: '3dSceneViewer.renderModes.green',
        baseColor: '#0ae555', // { r: 0.1, g: 0.9, b: 0.3, a: 1 },
        fresnelColor: '#66ff0a', // { r: 0.4, g: 1, b: 0.1, a: 1 },
        //opacity: 0.5,
        isWireframe: false,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.GreenWireframe,
        text: '3dSceneViewer.renderModes.greenWireframe',
        baseColor: '#0ae555', // { r: 0.1, g: 0.9, b: 0.3, a: 1 },
        fresnelColor: '#66ff0a', // { r: 0.4, g: 1, b: 0.1, a: 1 },
        //opacity: 0.5,
        isWireframe: true,
        coloredMeshColor: '#00A8F0',
        meshHoverColor: '#F3FF14',
        coloredMeshHoverColor: '#00EDD9',
        background: 'radial-gradient(#0a0a54, #020024)'
    },
    {
        id: ADT3DRenderMode.Blue,
        text: '3dSceneViewer.renderModes.blue',
        baseColor: '#368DFF1A',
        fresnelColor: '#1342734D',
        isWireframe: false,
        coloredMeshColor: '#0059e4FC',
        meshHoverColor: '#1342734D',
        coloredMeshHoverColor: '#134273FC',
        background: 'radial-gradient(#141631, #060617)',
        reflectionTexture: null
    },
    {
        id: ADT3DRenderMode.Gold,
        text: '3dSceneViewer.renderModes.gold',
        baseColor: '#BBBBBB1A',
        fresnelColor: '#FFFFFF4D',
        isWireframe: false,
        coloredMeshColor: '#999999FC',
        meshHoverColor: '#DDDDDD4D',
        coloredMeshHoverColor: '#FFFFFFFD',
        background: 'radial-gradient(#13120e, #000)',
        reflectionTexture:
            'data:image/jpeg;base64,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'
    }
];

export const EnvironmentsLocalStorageKey = 'cb-environments';
export const ContainersLocalStorageKey = 'cb-containers';
export const SelectedEnvironmentLocalStorageKey = 'cb-selected-environment';
export const SelectedContainerLocalStorageKey = 'cb-selected-container';

export const StyleConstants = {
    listItems: {
        hoverBackgroundColor: 'var(--fluent-color-grey-20)'
    },
    icons: {
        size20: FontSizes.size20,
        size16: FontSizes.size16
    }
};
