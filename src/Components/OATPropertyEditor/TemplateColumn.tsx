import React, { useRef } from 'react';
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

type ITemplateColumn = {
    setTemplatesActive: any;
    templates: any;
    setTemplates: any;
    enteredPropertyRef: any;
    model: any;
    setModel: any;
    draggingTemplate: boolean;
    setDraggingTemplate: any;
    enteredTemplateRef: any;
    draggingProperty: boolean;
};

export const TemplateColumn = ({
    setTemplatesActive,
    templates,
    setTemplates,
    enteredPropertyRef,
    model,
    setModel,
    draggingTemplate,
    setDraggingTemplate,
    enteredTemplateRef,
    draggingProperty
}: ITemplateColumn) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const draggedTemplateItemRef = useRef(null);

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
                    className={propertyInspectorStyles.propertyItemTextField}
                    borderless
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
                draggedTemplateItemRef={draggedTemplateItemRef}
                enteredPropertyRef={enteredPropertyRef}
                model={model}
                setModel={setModel}
                draggingTemplate={draggingTemplate}
                setDraggingTemplate={setDraggingTemplate}
                enteredTemplateRef={enteredTemplateRef}
                draggingProperty={draggingProperty}
            />
        </Stack>
    );
};

export default TemplateColumn;
