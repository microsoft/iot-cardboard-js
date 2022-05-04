import React from 'react';
import { FontIcon, ActionButton, Stack, Separator } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
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
                    name: t('OATPropertyEditor.boolean'),
                    icon: IconBoolean
                },
                {
                    name: t('OATPropertyEditor.data'),
                    icon: IconData
                },
                {
                    name: t('OATPropertyEditor.float'),
                    icon: IconFloat
                },

                {
                    name: t('OATPropertyEditor.dateTime'),
                    icon: IconDatetime
                },

                {
                    name: t('OATPropertyEditor.integer'),
                    icon: IconInteger
                },
                {
                    name: t('OATPropertyEditor.long'),
                    icon: IconLong
                },
                {
                    name: t('OATPropertyEditor.enum'),
                    icon: IconEnum,
                    complex: true
                },
                {
                    name: t('OATPropertyEditor.map'),
                    icon: IconMap,
                    complex: true
                },
                {
                    name: t('OATPropertyEditor.double'),
                    icon: IconDouble
                },
                {
                    name: t('OATPropertyEditor.duration'),
                    icon: IconDuration
                }
            ],
            sectionSecond: [
                {
                    name: t('OATPropertyEditor.string'),
                    icon: IconString
                },
                {
                    name: t('OATPropertyEditor.time'),
                    icon: IconTime
                },
                {
                    name: t('OATPropertyEditor.object'),
                    icon: IconObject,
                    complex: true
                }
            ],
            sectionThird: [
                {
                    name: t('OATPropertyEditor.point'),
                    icon: IconPoint
                },
                {
                    name: t('OATPropertyEditor.linestring'),
                    icon: IconLineString
                },
                {
                    name: t('OATPropertyEditor.polygon'),
                    icon: IconPolygon
                },
                {
                    name: t('OATPropertyEditor.multiPoint'),
                    icon: IconMultiPoint
                },
                {
                    name: t('OATPropertyEditor.multiLinestring'),
                    icon: IconMultiLineString
                },
                {
                    name: t('OATPropertyEditor.multiPolygon'),
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
            case 'object':
                return {
                    '@type': 'Object',
                    fields: []
                };
            case 'map':
                return {
                    '@type': 'Map',
                    mapKey: {
                        name: 'moduleName',
                        schema: 'string'
                    },
                    mapValue: {
                        name: 'moduleState',
                        schema: 'string'
                    }
                };
            case 'enum':
                return {
                    '@type': 'Enum',
                    valueSchema: 'integer',
                    enumValues: []
                };
            default:
                return tag;
        }
    };

    return (
        <Stack className={propertyInspectorStyles.propertySelector}>
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
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag.name);
                        }}
                        src={tag.icon}
                        title={tag.name}
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
                                key={i}
                                className={propertyInspectorStyles.propertyTag}
                                onClick={() => {
                                    handleTagClick(tag.name);
                                }}
                                src={tag.icon}
                                title={tag.name}
                            ></Svg>
                        );
                    }
                })}
            </Stack>
            <Separator className={propertyInspectorStyles.separator} />
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.sectionThird.map((tag, i) => (
                    <Svg
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag.name);
                        }}
                        src={tag.icon}
                        title={tag.name}
                    ></Svg>
                ))}
            </Stack>
        </Stack>
    );
};

export default PropertySelector;
