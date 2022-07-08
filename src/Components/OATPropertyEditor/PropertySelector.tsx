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
    const addNestedProperty = (tag: string, lastPropertyFocusedCopy) => {
        console.log('add nested property');
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
        console.log('addProperty', tag);
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
        console.log('onTagClick', tag);
        if (onTagClickCallback) {
            onTagClickCallback();
        }

        const lastPropertyFocusedCopy = deepCopy(lastPropertyFocused);

        const onClick = () => {
            console.log('lastPropertyFocusedCopy', lastPropertyFocusedCopy);
            lastPropertyFocused &&
            typeof lastPropertyFocused.item.schema === 'object'
                ? addNestedProperty(tag, lastPropertyFocusedCopy)
                : addProperty(tag);
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
                    {propertySelectorData.propertyTags.complex
                        .filter((tag) =>
                            lastPropertyFocused &&
                            lastPropertyFocused.item.schema['@type'] ===
                                'object'
                                ? tag.type === 'object'
                                : tag.type !== 'object'
                        )
                        .map((tag) => (
                            <ActionButton
                                key={tag.name}
                                onClick={() => {
                                    onTagClick(tag.name);
                                }}
                                onKeyPress={() => {
                                    onTagClick(tag.name);
                                }}
                            >
                                <Svg
                                    className={
                                        propertyInspectorStyles.propertyTag
                                    }
                                    src={tag.icon}
                                    title={t(tag.title)}
                                ></Svg>
                            </ActionButton>
                        ))}
                </div>
                <Separator styles={propertySelectorSeparatorStyles} vertical />
                <div className={propertyInspectorStyles.propertyTagsWrapFirst}>
                    {propertySelectorData.propertyTags.primitive.map((tag) => (
                        <ActionButton
                            key={tag.name}
                            onClick={() => {
                                onTagClick(tag.name);
                            }}
                            onKeyPress={() => {
                                onTagClick(tag.name);
                            }}
                        >
                            <Svg
                                className={propertyInspectorStyles.propertyTag}
                                src={tag.icon}
                                title={t(tag.title)}
                            ></Svg>
                        </ActionButton>
                    ))}
                </div>
                <Separator styles={propertySelectorSeparatorStyles} vertical />
                <div className={propertyInspectorStyles.propertyTagsWrapThird}>
                    {propertySelectorData.propertyTags.geospatial.map((tag) => (
                        <ActionButton
                            key={tag.name}
                            onClick={() => {
                                onTagClick(tag.name);
                            }}
                            onKeyPress={() => {
                                onTagClick(tag.name);
                            }}
                        >
                            <Svg
                                className={propertyInspectorStyles.propertyTag}
                                src={tag.icon}
                                title={t(tag.title)}
                            ></Svg>
                        </ActionButton>
                    ))}
                </div>
            </Stack>
        </div>
    );
};

export default PropertySelector;
