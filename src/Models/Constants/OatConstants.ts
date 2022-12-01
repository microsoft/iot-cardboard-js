import { ContextualMenuItemType, IContextualMenuItem } from '@fluentui/react';
import IconDouble from '../../Resources/Static/Double.svg';
import IconFloat from '../../Resources/Static/Float.svg';
import IconInteger from '../../Resources/Static/Integer.svg';
import IconLineString from '../../Resources/Static/linestring.svg';
import IconLong from '../../Resources/Static/long.svg';
import IconMultiPoint from '../../Resources/Static/multipoint.svg';
import IconMultiLineString from '../../Resources/Static/multilinestring.svg';
import IconMultiPolygon from '../../Resources/Static/multipolygon.svg';
import IconPoint from '../../Resources/Static/point.svg';
import IconPolygon from '../../Resources/Static/polygon.svg';
import { OatIconNames } from './Types';
import { DTDLSchemaTypes, DTDLSchemaType } from '../Classes/DTDL';

export const SCHEMA_ICON_MAP = new Map<
    | 'Object'
    | 'Map'
    | 'dateTime'
    | 'integer'
    | 'point'
    | 'multi-point'
    | string,
    OatIconNames
>([
    ['Object', 'SplitObject'],
    ['Map', 'MapPin'],
    ['dateTime', 'DateTime'],
    ['integer', 'NumberField'],
    ['point', 'AzureServiceEndpoint'],
    ['multi-point', '12PointStar']
]);

export const getSchemaTypeMenuOptions = (
    callback: (args: { type: string }) => void
) => {
    const menuOptions: IContextualMenuItem[] = [
        {
            text: 'Complex',
            itemType: ContextualMenuItemType.Header,
            key: 'complex-header'
        },
        {
            text: 'Object',
            iconProps: { iconName: SCHEMA_ICON_MAP.get('Object') },
            key: 'Object',
            onClick: () => callback({ type: 'Object' })
        },
        {
            text: 'Map',
            data: { iconName: SCHEMA_ICON_MAP.get('Map') },
            key: 'Map',
            onClick: () => callback({ type: 'Map' })
        },
        {
            text: 'Primitive',
            itemType: ContextualMenuItemType.Header,
            key: 'primitive-header'
        },
        {
            text: 'DateTime',
            iconProps: { iconName: SCHEMA_ICON_MAP.get('dateTime') },
            key: 'datetime',
            onClick: () => callback({ type: 'datetime' })
        },
        {
            text: 'Integer',
            iconProps: { iconName: SCHEMA_ICON_MAP.get('integer') },
            key: 'integer',
            onClick: () => callback({ type: 'integer' })
        },
        {
            text: 'Polygons',
            itemType: ContextualMenuItemType.Header,
            key: 'polygon-header'
        },
        {
            text: 'Point',
            iconProps: { iconName: SCHEMA_ICON_MAP.get('point') },
            key: 'point',
            onClick: () => callback({ type: 'point' })
        },
        {
            text: 'Multi-point',
            iconProps: { iconName: SCHEMA_ICON_MAP.get('multi-point') },
            key: 'multi-point',
            onClick: () => callback({ type: 'multi-point' })
        }
    ];
    return menuOptions;
};

type IIconData = {
    category: 'primitive' | 'complex' | 'geospatial';
    title: string;
} & (IIconDataFluent | IIconDataCustom);
interface IIconDataCustom {
    source: 'Custom';
    icon: any;
}
interface IIconDataFluent {
    source: 'Fluent';
    iconName: string;
}
export const PROPERTY_ICON_DATA: Map<
    DTDLSchemaTypes | string,
    IIconData
> = new Map<DTDLSchemaTypes, IIconData>([
    [
        'boolean',
        {
            title: 'OATPropertyEditor.boolean',
            iconName: 'ToggleRight',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'integer',
        {
            title: 'OATPropertyEditor.integer',
            icon: IconInteger,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'double',
        {
            title: 'OATPropertyEditor.double',
            icon: IconDouble,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'float',
        {
            title: 'OATPropertyEditor.float',
            icon: IconFloat,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'long',
        {
            title: 'OATPropertyEditor.long',
            icon: IconLong,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'date',
        {
            title: 'OATPropertyEditor.date',
            iconName: 'Calendar',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'dateTime',
        {
            title: 'OATPropertyEditor.dateTime',
            iconName: 'DateTime',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'duration',
        {
            title: 'OATPropertyEditor.duration',
            iconName: 'BufferTimeBefore',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'string',
        {
            title: 'OATPropertyEditor.string',
            iconName: 'TextField',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'time',
        {
            title: 'OATPropertyEditor.time',
            iconName: 'Clock',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Object,
        {
            title: 'OATPropertyEditor.object',
            iconName: 'CubeShape',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Array,
        {
            title: 'OATPropertyEditor.array',
            iconName: 'GroupList',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Map,
        {
            title: 'OATPropertyEditor.map',
            iconName: 'Code',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Enum,
        {
            title: 'OATPropertyEditor.enum',
            iconName: 'BulletedList2',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        'linestring',
        {
            title: 'OATPropertyEditor.linestring',
            icon: IconLineString,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'multiLinestring',
        {
            title: 'OATPropertyEditor.multiLinestring',
            icon: IconMultiLineString,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'point',
        {
            title: 'OATPropertyEditor.point',
            icon: IconPoint,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'multiPoint',
        {
            title: 'OATPropertyEditor.multiPoint',
            icon: IconMultiPoint,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'polygon',
        {
            title: 'OATPropertyEditor.polygon',
            icon: IconPolygon,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'multiPolygon',
        {
            title: 'OATPropertyEditor.multiPolygon',
            icon: IconMultiPolygon,
            category: 'geospatial',
            source: 'Custom'
        }
    ]
]);
