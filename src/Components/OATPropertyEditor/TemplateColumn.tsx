import React from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text,
    Label
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import TemplateList from './TemplateList';

export const TemplateColumn = ({
    setTemplatesActive,
    templates,
    setTemplates,
    draggedTemplateItem,
    enteredProperty,
    model,
    setModel,
    draggingTemplate,
    setDraggingTemplate,
    enteredTemplate,
    draggingProperty
}) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <Stack className={propertyInspectorStyles.templateColumn}>
            <Stack className={propertyInspectorStyles.paddingWrap}>
                <Stack className={propertyInspectorStyles.rowSpaceBetween}>
                    <Label>{t('OATPropertyEditor.templates')}</Label>
                    <ActionButton
                        onClick={() => setTemplatesActive(false)}
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
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.templateSearchPlaceholder'
                    )}
                ></TextField>
            </Stack>
            <Stack className={propertyInspectorStyles.gridRowPropertyHeading}>
                <Stack className={propertyInspectorStyles.row}>
                    <Text>{t('OATPropertyEditor.name')}</Text>
                </Stack>
                <Stack className={propertyInspectorStyles.row}>
                    <FontIcon
                        className={propertyInspectorStyles.propertyHeadingIcon}
                        iconName={'SwitcherStartEnd'}
                    />
                    <Text>{t('OATPropertyEditor.schemaType')}</Text>
                </Stack>
            </Stack>

            <TemplateList
                templates={templates}
                setTemplates={setTemplates}
                draggedTemplateItem={draggedTemplateItem}
                enteredProperty={enteredProperty}
                model={model}
                setModel={setModel}
                draggingTemplate={draggingTemplate}
                setDraggingTemplate={setDraggingTemplate}
                enteredTemplate={enteredTemplate}
                draggingProperty={draggingProperty}
            />
        </Stack>
    );
};

export default TemplateColumn;
