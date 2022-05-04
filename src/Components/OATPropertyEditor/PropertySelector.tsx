import React from 'react';
import {
    FontIcon,
    ActionButton,
    Stack,
    Separator,
    FocusTrapCallout,
    DirectionalHint
} from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTDLSchemaType } from '../../Models/Classes/DTDL';
import Svg from 'react-inlinesvg';
import IconBoolean from '../../Resources/Static/Boolean.svg';
import IconData from '../../Resources/Static/Data.svg';
import IconDatetime from '../../Resources/Static/Datetime.svg';
import IconDouble from '../../Resources/Static/Double.svg';
import IconDuration from '../../Resources/Static/duration.svg';
import IconEnum from '../../Resources/Static/Enum.svg';
import IconFloat from '../../Resources/Static/Float.svg';
import IconInteger from '../../Resources/Static/Integer.svg';
import IconLineString from '../../Resources/Static/linestring.svg';
import IconLong from '../../Resources/Static/long.svg';
import IconMap from '../../Resources/Static/map.svg';
import IconMultiPoint from '../../Resources/Static/multipoint.svg';
import IconMultiLineString from '../../Resources/Static/multilinestring.svg';
import IconMultiPolygon from '../../Resources/Static/multipolygon.svg';
import IconObject from '../../Resources/Static/object.svg';
import IconPoint from '../../Resources/Static/point.svg';
import IconPolygon from '../../Resources/Static/polygon.svg';
import IconString from '../../Resources/Static/string.svg';
import IconTime from '../../Resources/Static/time.svg';
import { useTranslation } from 'react-i18next';

interface IProperySelectorProps {
    lastPropertyFocused: any;
    model?: DTDLModel;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const PropertySelector = ({
    setPropertySelectorVisible,
    model,
    setModel,
    lastPropertyFocused
}: IProperySelectorProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const data = {
        propertyTags: {
            sectionFirst: [
                {
                    name: 'boolean',
                    title: t('OATPropertyEditor.boolean'),
                    icon: IconBoolean
                },
                {
                    name: 'data',
                    title: t('OATPropertyEditor.data'),
                    icon: IconData
                },
                {
                    name: 'float',
                    title: t('OATPropertyEditor.float'),
                    icon: IconFloat
                },

                {
                    name: 'dateTime',
                    title: t('OATPropertyEditor.dateTime'),
                    icon: IconDatetime
                },

                {
                    name: 'integer',
                    title: t('OATPropertyEditor.integer'),
                    icon: IconInteger
                },
                {
                    name: 'long',
                    title: t('OATPropertyEditor.long'),
                    icon: IconLong
                },
                {
                    name: 'enum',
                    title: t('OATPropertyEditor.enum'),
                    icon: IconEnum,
                    complex: true
                },
                {
                    name: 'map',
                    title: t('OATPropertyEditor.map'),
                    icon: IconMap,
                    complex: true
                },
                {
                    name: 'double',
                    title: t('OATPropertyEditor.double'),
                    icon: IconDouble
                },
                {
                    name: 'duration',
                    title: t('OATPropertyEditor.duration'),
                    icon: IconDuration
                }
            ],
            sectionSecond: [
                {
                    name: 'string',
                    title: t('OATPropertyEditor.string'),
                    icon: IconString
                },
                {
                    name: 'time',
                    title: t('OATPropertyEditor.time'),
                    icon: IconTime
                },
                {
                    name: 'object',
                    title: t('OATPropertyEditor.object'),
                    icon: IconObject,
                    complex: true
                }
            ],
            sectionThird: [
                {
                    name: 'point',
                    title: t('OATPropertyEditor.point'),
                    icon: IconPoint
                },
                {
                    name: 'linestring',
                    title: t('OATPropertyEditor.linestring'),
                    icon: IconLineString
                },
                {
                    name: 'polygon',
                    title: t('OATPropertyEditor.polygon'),
                    icon: IconPolygon
                },
                {
                    name: 'multiPoint',
                    title: t('OATPropertyEditor.multiPoint'),
                    icon: IconMultiPoint
                },
                {
                    name: 'multiLinestring',
                    title: t('OATPropertyEditor.multiLinestring'),
                    icon: IconMultiLineString
                },
                {
                    name: 'multiPolygon',
                    title: t('OATPropertyEditor.multiPolygon'),
                    icon: IconMultiPolygon
                }
            ]
        }
    };

    const addNestedProperty = (tag) => {
        const modelCopy = Object.assign({}, model);
        const schemaCopy = Object.assign({}, lastPropertyFocused.item.schema);
        schemaCopy.fields.push({
            name: `${lastPropertyFocused.item.name}_${
                schemaCopy.fields.length + 1
            }`,
            schema: tag
        });

        modelCopy.contents[lastPropertyFocused.index].schema = schemaCopy;
        setModel(modelCopy);
        setPropertySelectorVisible(false);
    };

    const handleTagClick = (tag) => {
        if (
            lastPropertyFocused &&
            typeof lastPropertyFocused.item.schema === 'object'
        ) {
            addNestedProperty(tag);
            return;
        }

        const modelCopy = Object.assign({}, model);
        modelCopy.contents = [
            ...modelCopy.contents,
            ...[
                {
                    '@id': `dtmi:com:adt:model1:New_Property_${
                        model.contents.length + 1
                    }`,
                    '@type': ['property'],
                    name: `New_Property_${model.contents.length + 1}`,
                    schema: getSchema(tag)
                }
            ]
        ];
        setModel(modelCopy);
        setPropertySelectorVisible(false);
    };

    const getSchema = (tag) => {
        switch (tag) {
            case DTDLSchemaType.Object:
                return {
                    '@type': DTDLSchemaType.Object,
                    fields: []
                };
            case DTDLSchemaType.Map:
                return {
                    '@type': DTDLSchemaType.Map,
                    mapKey: {
                        name: 'moduleName',
                        schema: 'string'
                    },
                    mapValue: {
                        name: 'moduleState',
                        schema: 'string'
                    }
                };
            case DTDLSchemaType.Enum:
                return {
                    '@type': DTDLSchemaType.Enum,
                    valueSchema: 'integer',
                    enumValues: []
                };
            default:
                return tag;
        }
    };

    return (
        <FocusTrapCallout
            className={propertyInspectorStyles.propertySelector}
            role="alertdialog"
            gapSpace={0}
            target="#propertyList"
            isBeakVisible={false}
            setInitialFocus
            directionalHint={DirectionalHint.leftTopEdge}
        >
            <Stack className={propertyInspectorStyles.propertySelectorHeader}>
                <ActionButton
                    onClick={() => setPropertySelectorVisible(false)}
                    className={
                        propertyInspectorStyles.iconClosePropertySelectorWrap
                    }
                >
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                        title={t('OATPropertyEditor.close')}
                    />
                </ActionButton>
            </Stack>
            <Separator className={propertyInspectorStyles.separator} />
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.sectionFirst.map((tag, i) => (
                    <Svg
                        tabIndex={0}
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag.name);
                        }}
                        src={tag.icon}
                        title={tag.title}
                    ></Svg>
                ))}
            </Stack>
            <Separator className={propertyInspectorStyles.separator} />
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.sectionSecond.map((tag, i) => {
                    if (
                        lastPropertyFocused &&
                        typeof lastPropertyFocused.item.schema === 'object' &&
                        tag.complex
                    ) {
                        return <></>;
                    } else {
                        return (
                            <Svg
                                tabIndex={0}
                                key={i}
                                className={propertyInspectorStyles.propertyTag}
                                onClick={() => {
                                    handleTagClick(tag.name);
                                }}
                                src={tag.icon}
                                title={tag.title}
                            ></Svg>
                        );
                    }
                })}
            </Stack>
            <Separator className={propertyInspectorStyles.separator} />
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.sectionThird.map((tag, i) => (
                    <Svg
                        tabIndex={0}
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag.name);
                        }}
                        src={tag.icon}
                        title={tag.title}
                    ></Svg>
                ))}
            </Stack>
        </FocusTrapCallout>
    );
};

export default PropertySelector;
