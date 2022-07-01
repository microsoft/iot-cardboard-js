import React, { useContext } from 'react';
import { ActionButton, Separator, Stack } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getPropertySelectorSeparatorStyles
} from './OATPropertyEditor.styles';
import Svg from 'react-inlinesvg';
import { useTranslation } from 'react-i18next';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import {
    IAction,
    IOATLastPropertyFocused
} from '../../Models/Constants/Interfaces';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { deepCopy } from '../../Models/Services/Utils';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

import { getModelPropertyCollectionName } from './Utils';
import { DTDLSchemaType } from '../../Models/Classes/DTDL';
import { propertySelectorData } from '../../Models/Constants';

const versionClassBase = '1';
const leftOffset = 170; // Place selector's most used options above trigger element
const topOffset = 60; // Selector height

export interface IOATPropertySelectorPosition {
    top: number;
    left: number;
}

interface IPropertySelectorProps {
    onTagClickCallback?: () => void;
    className?: string;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    lastPropertyFocused?: IOATLastPropertyFocused;
    setPropertySelectorVisible: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    propertySelectorPosition?: IOATPropertySelectorPosition;
}

const PropertySelector = ({
    className,
    setPropertySelectorVisible,
    lastPropertyFocused,
    dispatch,
    onTagClickCallback,
    state,
    propertySelectorPosition
}: IPropertySelectorProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const propertySelectorSeparatorStyles = getPropertySelectorSeparatorStyles();
    const { model } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const data = {
        propertyTags: {
            primitive: [
                {
                    name: 'dateTime',
                    title: t('OATPropertyEditor.dateTime'),
                    icon: IconDatetime
                },
                {
                    name: 'duration',
                    title: t('OATPropertyEditor.duration'),
                    icon: IconDuration
                },
                {
                    name: 'boolean',
                    title: t('OATPropertyEditor.boolean'),
                    icon: IconBoolean
                },
                {
                    name: 'string',
                    title: t('OATPropertyEditor.string'),
                    icon: IconString
                },
                {
                    name: 'data',
                    title: t('OATPropertyEditor.data'),
                    icon: IconData
                },
                {
                    name: 'long',
                    title: t('OATPropertyEditor.long'),
                    icon: IconLong
                },
                {
                    name: 'integer',
                    title: t('OATPropertyEditor.integer'),
                    icon: IconInteger
                },
                {
                    name: 'double',
                    title: t('OATPropertyEditor.double'),
                    icon: IconDouble
                },
                {
                    name: 'float',
                    title: t('OATPropertyEditor.float'),
                    icon: IconFloat
                },
                {
                    name: 'time',
                    title: t('OATPropertyEditor.time'),
                    icon: IconTime
                }
            ],
            complex: [
                {
                    name: DTDLSchemaType.Object,
                    title: t('OATPropertyEditor.object'),
                    icon: IconObject,
                    complex: true
                },
                {
                    name: DTDLSchemaType.Map,
                    title: t('OATPropertyEditor.map'),
                    icon: IconMap,
                    complex: true
                },
                {
                    name: DTDLSchemaType.Enum,
                    title: t('OATPropertyEditor.enum'),
                    icon: IconEnum,
                    complex: true
                }
            ],
            geoSpatial: [
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

    const addNestedProperty = (tag: string, lastPropertyFocusedCopy) => {
        const modelCopy = deepCopy(model);
        const schemaCopy = deepCopy(lastPropertyFocusedCopy.item.schema);
        // We select the last property focused to add nested propertyes to that specific property
        const newProperty = {
            name: `${t('OATPropertyEditor.property')}_${
                schemaCopy.fields.length + 1
            }`,
            displayName: `${t('OATPropertyEditor.property')}_${
                schemaCopy.fields.length + 1
            }`,
            schema: tag
        };
        schemaCopy.fields.push(newProperty);

        modelCopy[propertiesKeyName][
            lastPropertyFocused.index
        ].schema = schemaCopy;
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setPropertySelectorVisible(false);
    };

    const addProperty = async (tag) => {
        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName] = [
            ...modelCopy[propertiesKeyName],
            ...[
                {
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

    const onTagClick = (tag: string) => {
        if (onTagClickCallback) {
            onTagClickCallback();
        }

        const lastPropertyFocusedCopy = deepCopy(lastPropertyFocused);

        const onClick = () => {
            lastPropertyFocused &&
            typeof lastPropertyFocused.item.schema === 'object'
                ? () => addNestedProperty(tag, lastPropertyFocusedCopy)
                : () => addProperty(tag);
        };

        const undoOnClick = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
            });
        };

        execute(onClick, undoOnClick);
    };

    const getSchema = (tag: string) => {
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
            style={{
                top: propertySelectorPosition
                    ? propertySelectorPosition.top - topOffset
                    : 0,
                left: propertySelectorPosition
                    ? propertySelectorPosition.left - leftOffset
                    : 0
            }}
        >
            <Stack horizontal>
                <div className={propertyInspectorStyles.propertyTagsWrapSecond}>
                    {propertySelectorData.propertyTags.sectionSecond.map(
                        (tag, i) => {
                            if (
                                lastPropertyFocused &&
                                typeof lastPropertyFocused.item.schema ===
                                    'object' &&
                                tag.complex
                            ) {
                                return <></>;
                            } else {
                                return (
                                    <ActionButton
                                        onClick={() => {
                                            onTagClick(tag.name);
                                        }}
                                        onKeyPress={() => {
                                            onTagClick(tag.name);
                                        }}
                                    >
                                        <Svg
                                            tabIndex={0}
                                            key={i}
                                            className={
                                                propertyInspectorStyles.propertyTag
                                            }
                                            src={tag.icon}
                                            title={t(tag.title)}
                                        ></Svg>
                                    </ActionButton>
                                );
                            }
                        }
                    )}
                </div>
                <Separator styles={propertySelectorSeparatorStyles} vertical />
                <div className={propertyInspectorStyles.propertyTagsWrapFirst}>
                    {propertySelectorData.propertyTags.sectionFirst.map(
                        (tag, i) => {
                            if (
                                lastPropertyFocused &&
                                typeof lastPropertyFocused.item.schema ===
                                    'object' &&
                                tag.complex
                            ) {
                                return <></>;
                            } else {
                                return (
                                    <ActionButton
                                        onClick={() => {
                                            onTagClick(tag.name);
                                        }}
                                        onKeyPress={() => {
                                            onTagClick(tag.name);
                                        }}
                                    >
                                        <Svg
                                            tabIndex={0}
                                            key={i}
                                            className={
                                                propertyInspectorStyles.propertyTag
                                            }
                                            src={tag.icon}
                                            title={t(tag.title)}
                                        ></Svg>
                                    </ActionButton>
                                );
                            }
                        }
                    )}
                </div>
                <Separator styles={propertySelectorSeparatorStyles} vertical />
                <div className={propertyInspectorStyles.propertyTagsWrapThird}>
                    {propertySelectorData.propertyTags.sectionThird.map(
                        (tag, i) => (
                            <ActionButton
                                onClick={() => {
                                    onTagClick(tag.name);
                                }}
                                onKeyPress={() => {
                                    onTagClick(tag.name);
                                }}
                            >
                                <Svg
                                    tabIndex={0}
                                    key={i}
                                    className={
                                        propertyInspectorStyles.propertyTag
                                    }
                                    src={tag.icon}
                                    title={t(tag.title)}
                                ></Svg>
                            </ActionButton>
                        )
                    )}
                </div>
            </Stack>
        </div>
    );
};

export default PropertySelector;
