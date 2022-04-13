import React from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

interface IProperySelectorProps {
    data?: any;
    setPropertySelectorVisible?: (visible: boolean) => boolean;
    model?: any;
    setModel: (value: Record<string, unknown>) => Record<string, unknown>;
    lastPropertyFocused: any;
}

const PropertySelector = ({
    data,
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
                    schema:
                        tag === 'object'
                            ? {
                                  '@type': 'Object',
                                  fields: []
                              }
                            : tag
                }
            ]
        ];
        setModel(modelCopy);
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
