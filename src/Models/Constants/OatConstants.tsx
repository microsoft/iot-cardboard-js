import React from 'react';
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
import { DTDLSchemaTypes, DTDLSchemaType, DTDLSchema } from '../Classes/DTDL';
import i18n from '../../i18n';
import PropertyIcon from '../../Components/OATPropertyEditor/Internal/PropertyList/Internal/PropertyListItem/Internal/PropertyIcon/PropertyIcon';

export const getSchemaTypeMenuOptions = (
    callback: (args: { schema: DTDLSchemaTypes }) => void,
    supportsV3Properties: boolean
) => {
    const menuOptions: IContextualMenuItem[] = [];

    // sort the items into the groups
    const primitiveGroup: IContextualMenuItem[] = [];
    const complexGroup: IContextualMenuItem[] = [];
    const geospatialGroup: IContextualMenuItem[] = [];
    PROPERTY_ICON_DATA.forEach((x) => {
        const isSupportedVersion = isSupportedPropertyType(
            supportsV3Properties,
            x
        );
        const item: IContextualMenuItem = {
            text: i18n.t(x.title),
            key: x.schema,
            disabled: !isSupportedVersion,
            title: !isSupportedVersion
                ? i18n.t('OAT.PropertyTypes.unsupportedPropertyType')
                : null,
            onClick: () => callback({ schema: x.schema }),
            iconProps: { iconName: x.schema }, // needed to trigger icon render, but value not used
            onRenderIcon: () => {
                return <PropertyIcon schema={x.schema as DTDLSchema} />;
            },
            style: {
                display: 'flex',
                alignItems: 'center'
            }
        };
        switch (x.category) {
            case 'complex':
                complexGroup.push(item);
                break;
            case 'geospatial':
                geospatialGroup.push(item);
                break;
            case 'primitive':
                primitiveGroup.push(item);
                break;
        }
    });

    // combine the groups under each header
    menuOptions.push({
        text: i18n.t('OAT.PropertyTypes.categories.complex'),
        itemType: ContextualMenuItemType.Header,
        key: 'complex-header'
    });
    menuOptions.push(...complexGroup);

    menuOptions.push({
        text: i18n.t('OAT.PropertyTypes.categories.primitive'),
        itemType: ContextualMenuItemType.Header,
        key: 'primitive-header'
    });
    menuOptions.push(...primitiveGroup);

    menuOptions.push({
        text: i18n.t('OAT.PropertyTypes.categories.geospatial'),
        itemType: ContextualMenuItemType.Header,
        key: 'geo-spatial-header'
    });
    menuOptions.push(...geospatialGroup);
    return menuOptions;
};

/** mark a property as not supported */
const isSupportedPropertyType = (
    v3PropertyTypesAllowed: boolean,
    property: IIconData
): boolean => {
    if (v3PropertyTypesAllowed) {
        return true;
    }
    return property.schema !== DTDLSchemaType.Array;
};

type IIconData = {
    category: 'primitive' | 'complex' | 'geospatial';
    title: string;
    schema: DTDLSchemaTypes;
} & (IIconDataFluent | IIconDataCustom);
interface IIconDataCustom {
    source: 'Custom';
    icon: any;
}
interface IIconDataFluent {
    source: 'Fluent';
    iconName: OatIconNames;
}
export const PROPERTY_ICON_DATA: Map<
    DTDLSchemaTypes | string,
    IIconData
> = new Map<DTDLSchemaTypes, IIconData>([
    [
        'boolean',
        {
            schema: 'boolean',
            title: 'OATPropertyEditor.boolean',
            iconName: 'ToggleRight',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'integer',
        {
            schema: 'integer',
            title: 'OATPropertyEditor.integer',
            icon: IconInteger,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'double',
        {
            schema: 'double',
            title: 'OATPropertyEditor.double',
            icon: IconDouble,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'float',
        {
            schema: 'float',
            title: 'OATPropertyEditor.float',
            icon: IconFloat,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'long',
        {
            schema: 'long',
            title: 'OATPropertyEditor.long',
            icon: IconLong,
            category: 'primitive',
            source: 'Custom'
        }
    ],
    [
        'date',
        {
            schema: 'date',
            title: 'OATPropertyEditor.date',
            iconName: 'Calendar',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'dateTime',
        {
            schema: 'dateTime',
            title: 'OATPropertyEditor.dateTime',
            iconName: 'DateTime',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'duration',
        {
            schema: 'duration',
            title: 'OATPropertyEditor.duration',
            iconName: 'BufferTimeBefore',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'string',
        {
            schema: 'string',
            title: 'OATPropertyEditor.string',
            iconName: 'TextField',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        'time',
        {
            schema: 'time',
            title: 'OATPropertyEditor.time',
            iconName: 'Clock',
            category: 'primitive',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Object,
        {
            schema: DTDLSchemaType.Object,
            title: 'OATPropertyEditor.object',
            iconName: 'CubeShape',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Array,
        {
            schema: DTDLSchemaType.Array,
            title: 'OATPropertyEditor.array',
            iconName: 'GroupList',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Map,
        {
            schema: DTDLSchemaType.Map,
            title: 'OATPropertyEditor.map',
            iconName: 'Code',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        DTDLSchemaType.Enum,
        {
            schema: DTDLSchemaType.Enum,
            title: 'OATPropertyEditor.enum',
            iconName: 'BulletedList2',
            category: 'complex',
            source: 'Fluent'
        }
    ],
    [
        'linestring',
        {
            schema: 'linestring',
            title: 'OATPropertyEditor.linestring',
            icon: IconLineString,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'multiLinestring',
        {
            schema: 'multiLinestring',
            title: 'OATPropertyEditor.multiLinestring',
            icon: IconMultiLineString,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'point',
        {
            schema: 'point',
            title: 'OATPropertyEditor.point',
            icon: IconPoint,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'multiPoint',
        {
            schema: 'multiPoint',
            title: 'OATPropertyEditor.multiPoint',
            icon: IconMultiPoint,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'polygon',
        {
            schema: 'polygon',
            title: 'OATPropertyEditor.polygon',
            icon: IconPolygon,
            category: 'geospatial',
            source: 'Custom'
        }
    ],
    [
        'multiPolygon',
        {
            schema: 'multiPolygon',
            title: 'OATPropertyEditor.multiPolygon',
            icon: IconMultiPolygon,
            category: 'geospatial',
            source: 'Custom'
        }
    ]
]);
