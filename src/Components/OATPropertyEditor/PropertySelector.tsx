import React from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

interface IProperySelectorProps {
    data?: any;
    setPropertySelectorVisible?: (visible: boolean) => boolean;
    model?: any;
    setModel: (value: Record<string, unknown>) => Record<string, unknown>;
}

const PropertySelector = ({
    data,
    setPropertySelectorVisible,
    model,
    setModel
}: IProperySelectorProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

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
                            const modelCopy = Object.assign({}, model);
                            modelCopy.contents = [
                                ...modelCopy.contents,
                                ...[
                                    {
                                        '@id': `dtmi:com:adt:model1:New_Property_${
                                            model.contents.length + 1
                                        }`,
                                        '@type': ['property'],
                                        name: `New_Property_${
                                            model.contents.length + 1
                                        }`,
                                        schema: tag
                                    }
                                ]
                            ];
                            setModel(modelCopy);
                        }}
                    >
                        <Text>{tag}</Text>
                    </Stack>
                ))}
            </Stack>
            <Stack className={propertyInspectorStyles.separator}></Stack>
        </Stack>
    );
};

export default PropertySelector;
