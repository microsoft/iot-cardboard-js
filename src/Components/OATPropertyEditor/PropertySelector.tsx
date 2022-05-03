import React from 'react';
import {
    FontIcon,
    ActionButton,
    Stack,
    Text,
    Image,
    Separator
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
// import IconBoolean from '../../../public/assets/icons/PNG.png';
import IconBoolean from '../../../public/assets/icons/Boolean.png';
import IconData from '../../../public/assets/icons/Data.png';
import IconDatetime from '../../../public/assets/icons/Datetime.png';
import IconDouble from '../../../public/assets/icons/Double.png';
import IconDuration from '../../../public/assets/icons/duration.png';
import IconEnum from '../../../public/assets/icons/enum.png';
import IconFloat from '../../../public/assets/icons/float.png';
import IconInteger from '../../../public/assets/icons/integer.png';
import IconLineString from '../../../public/assets/icons/linestring.png';
import IconLong from '../../../public/assets/icons/long.png';
import IconMap from '../../../public/assets/icons/map.png';
import IconMultiPoint from '../../../public/assets/icons/multipoint.png';
import IconMultiLineString from '../../../public/assets/icons/multilinestring.png';
import IconMultiPolygon from '../../../public/assets/icons/multipolygon.png';
import IconObject from '../../../public/assets/icons/object.png';
import IconPoint from '../../../public/assets/icons/point.png';
import IconPolygon from '../../../public/assets/icons/polygon.png';
import IconString from '../../../public/assets/icons/string.png';
import IconTime from '../../../public/assets/icons/time.png';

const data = {
    propertyTags: {
        sectionFirst: [
            {
                name: 'boolean',
                icon: IconBoolean
            },
            {
                name: 'data',
                icon: IconData
            },
            {
                name: 'float',
                icon: IconFloat
            },

            {
                name: 'datetime',
                icon: IconDatetime
            },

            {
                name: 'integer',
                icon: IconInteger
            },
            {
                name: 'long',
                icon: IconLong
            },
            {
                name: 'enum',
                icon: IconEnum,
                complex: true
            },
            {
                name: 'map',
                icon: IconMap,
                complex: true
            },
            {
                name: 'double',
                icon: IconDouble
            },
            {
                name: 'duration',
                icon: IconDuration
            }
        ],
        sectionSecond: [
            {
                name: 'string',
                icon: IconString
            },
            {
                name: 'time',
                icon: IconTime
            },
            {
                name: 'object',
                icon: IconObject,
                complex: true
            }
        ],
        sectionThird: [
            {
                name: 'point',
                icon: IconPoint
            },
            {
                name: 'linestring',
                icon: IconLineString
            },
            {
                name: 'polygon',
                icon: IconPolygon
            },
            {
                name: 'multipoint',
                icon: IconMultiPoint
            },
            {
                name: 'multilinestring',
                icon: IconMultiLineString
            },
            {
                name: 'multipolygon',
                icon: IconMultiPolygon
            }
        ]
    }
};
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
                    />
                </ActionButton>
            </Stack>
            <Separator className={propertyInspectorStyles.separator} />
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.sectionFirst.map((tag, i) => (
                    <img
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag.name);
                        }}
                        alt={tag.name}
                        src={tag.icon}
                        title={tag.name}
                    ></img>
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
                            <img
                                key={i}
                                className={propertyInspectorStyles.propertyTag}
                                onClick={() => {
                                    handleTagClick(tag.name);
                                }}
                                alt={tag.name}
                                src={tag.icon}
                                title={tag.name}
                            ></img>
                        );
                    }
                })}
            </Stack>
            <Separator className={propertyInspectorStyles.separator} />
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.sectionThird.map((tag, i) => (
                    <img
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag.name);
                        }}
                        alt={tag.name}
                        src={tag.icon}
                        title={tag.name}
                    ></img>
                ))}
            </Stack>
        </Stack>
    );
};

export default PropertySelector;
