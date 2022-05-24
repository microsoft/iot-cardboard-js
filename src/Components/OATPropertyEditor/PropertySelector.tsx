import React from 'react';
import { Separator, Stack } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertySelectorSeparatorStyles
} from './OATPropertyEditor.styles';
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
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import {
    IAction,
    IOATLastPropertyFocused
} from '../../Models/Constants/Interfaces';
import { deepCopy } from '../../Models/Services/Utils';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

import { getModelPropertyCollectionName } from './Utils';

const ASCII_VALUE_BEFORE_LOWERCASE_ALPHABET = 96;
const versionClassBase = '1';
interface IPropertySelectorProps {
    onTagClickCallback?: () => void;
    className?: string;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    lastPropertyFocused?: IOATLastPropertyFocused;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

const PropertySelector = ({
    className,
    setPropertySelectorVisible,
    lastPropertyFocused,
    dispatch,
    onTagClickCallback,
    state
}: IPropertySelectorProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const propertySelectorSeparatorStyles = getPropertySelectorSeparatorStyles();
    const { model } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const data = {
        propertyTags: {
            sectionFirst: [
                {
                    name: 'boolean',
                    title: t('OATPropertyEditor.boolean'),
                    icon: IconBoolean
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
                    name: DTDLSchemaType.Enum,
                    title: t('OATPropertyEditor.enum'),
                    icon: IconEnum,
                    complex: true
                },
                {
                    name: 'double',
                    title: t('OATPropertyEditor.double'),
                    icon: IconDouble
                },
                {
                    name: 'data',
                    title: t('OATPropertyEditor.data'),
                    icon: IconData
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
                    name: DTDLSchemaType.Map,
                    title: t('OATPropertyEditor.map'),
                    icon: IconMap,
                    complex: true
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
                    name: DTDLSchemaType.Object,
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
        const modelCopy = deepCopy(model);
        const schemaCopy = deepCopy(lastPropertyFocused.item.schema);
        schemaCopy.fields.push({
            name: `${t('OATPropertyEditor.property')}_${String.fromCharCode(
                ASCII_VALUE_BEFORE_LOWERCASE_ALPHABET +
                    schemaCopy.fields.length +
                    1
            )}`,
            schema: tag
        });

        modelCopy[propertiesKeyName][
            lastPropertyFocused.index
        ].schema = schemaCopy;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setPropertySelectorVisible(false);
    };

    const handleTagClick = (tag) => {
        if (onTagClickCallback) {
            onTagClickCallback();
        }

        if (
            lastPropertyFocused &&
            typeof lastPropertyFocused.item.schema === 'object'
        ) {
            addNestedProperty(tag);
            return;
        }

        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName] = [
            ...modelCopy[propertiesKeyName],
            ...[
                {
                    '@id': `dtmi:com:adt:model1:New_Property_${
                        model[propertiesKeyName].length + 1
                    };${versionClassBase}`,
                    '@type': ['property'],
                    name: `New_Property_${model[propertiesKeyName].length + 1}`,
                    schema: getSchema(tag)
                }
            ]
        ];
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
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
        <div
            role="alertdialog"
            className={
                className ? className : propertyInspectorStyles.propertySelector
            }
            onMouseLeave={() => setPropertySelectorVisible(false)}
        >
            <Stack horizontal>
                <div className={propertyInspectorStyles.propertyTagsWrapFirst}>
                    {data.propertyTags.sectionFirst.map((tag, i) => {
                        if (
                            lastPropertyFocused &&
                            typeof lastPropertyFocused.item.schema ===
                                'object' &&
                            tag.complex
                        ) {
                            return <></>;
                        } else {
                            return (
                                <Svg
                                    tabIndex={0}
                                    key={i}
                                    className={
                                        propertyInspectorStyles.propertyTag
                                    }
                                    onClick={() => {
                                        handleTagClick(tag.name);
                                    }}
                                    src={tag.icon}
                                    title={tag.title}
                                ></Svg>
                            );
                        }
                    })}
                </div>
                <Separator styles={propertySelectorSeparatorStyles} vertical />
                <div className={propertyInspectorStyles.propertyTagsWrapSecond}>
                    {data.propertyTags.sectionSecond.map((tag, i) => {
                        if (
                            lastPropertyFocused &&
                            typeof lastPropertyFocused.item.schema ===
                                'object' &&
                            tag.complex
                        ) {
                            return <></>;
                        } else {
                            return (
                                <Svg
                                    tabIndex={0}
                                    key={i}
                                    className={
                                        propertyInspectorStyles.propertyTag
                                    }
                                    onClick={() => {
                                        handleTagClick(tag.name);
                                    }}
                                    src={tag.icon}
                                    title={tag.title}
                                ></Svg>
                            );
                        }
                    })}
                </div>
                <Separator styles={propertySelectorSeparatorStyles} vertical />
                <div className={propertyInspectorStyles.propertyTagsWrapThird}>
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
                </div>
            </Stack>
        </div>
    );
};

export default PropertySelector;
