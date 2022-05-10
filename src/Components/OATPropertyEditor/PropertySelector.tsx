import React, { useContext } from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/context/CommandHistoryContext';

const data = {
    propertyTags: {
        primitive: [
            'boolean',
            'data',
            'dateTime',
            'double',
            'duration',
            'float',
            'integer',
            'long',
            'string',
            'time'
        ],
        complex: ['enum', 'map', 'object']
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
    const { execute } = useContext(CommandHistoryContext);

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

    const addProperty = async (tag) => {
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

    const handleAddPropertyUndo = () => {
        // Revert to previous state
        const modelCopy = Object.assign({}, model);
        const contentsLength = modelCopy.contents.length;
        if (contentsLength > 0) {
            const foundCreatedProperty = modelCopy.contents.find(
                (prop) =>
                    prop['@id'] ===
                    `dtmi:com:adt:model1:New_Property_${contentsLength + 1}`
            );
            if (foundCreatedProperty) {
                modelCopy.contents.pop();
            }
        }
        setModel(modelCopy);
    };

    const handleAddNestedPropertyUndo = () => {
        const modelCopy = Object.assign({}, model);
        // Find latest nested prop index
        const foundNestedPropIndex = modelCopy.contents.findIndex(
            (prop) => prop['@id'] === lastPropertyFocused.item['@id']
        );
        //  Remove latest property from object-property
        if (foundNestedPropIndex > 0) {
            modelCopy.contents[foundNestedPropIndex].schema.fields.pop();
        }
        setModel(modelCopy);
    };
    const handleTagClick = async (tag) => {
        if (
            lastPropertyFocused &&
            typeof lastPropertyFocused.item.schema === 'object'
        ) {
            // addNestedProperty(tag);
            execute(
                () => addNestedProperty(tag),
                () => handleAddNestedPropertyUndo()
            );
            return;
        }

        execute(
            () => addProperty(tag),
            () => handleAddPropertyUndo()
        );
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
                <Text>{t('OATPropertyEditor.primitive')}</Text>
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
            <Stack className={propertyInspectorStyles.propertyTagsWrap}>
                {data.propertyTags.primitive.map((tag, i) => (
                    <Stack
                        key={i}
                        className={propertyInspectorStyles.propertyTag}
                        onClick={() => {
                            handleTagClick(tag);
                        }}
                    >
                        <Text>{tag}</Text>
                    </Stack>
                ))}
            </Stack>
            <Stack className={propertyInspectorStyles.separator}></Stack>
            {(lastPropertyFocused &&
                typeof lastPropertyFocused.schema !== 'object') ||
                (lastPropertyFocused === null && (
                    <>
                        <Stack
                            className={
                                propertyInspectorStyles.propertySelectorHeader
                            }
                        >
                            <Text>{t('OATPropertyEditor.complex')}</Text>
                        </Stack>
                        <Stack
                            className={propertyInspectorStyles.propertyTagsWrap}
                        >
                            {data.propertyTags.complex.map((tag, i) => (
                                <Stack
                                    key={i}
                                    className={
                                        propertyInspectorStyles.propertyTag
                                    }
                                    onClick={() => {
                                        handleTagClick(tag);
                                    }}
                                >
                                    <Text>{tag}</Text>
                                </Stack>
                            ))}
                        </Stack>
                    </>
                ))}
        </Stack>
    );
};

export default PropertySelector;
