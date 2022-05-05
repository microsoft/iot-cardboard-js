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
import {
    getPropertyInspectorStyles,
    getPropertyEditorTextFieldStyles,
    getTemplateColumnStyles
} from './OATPropertyEditor.styles';
import TemplateList from './TemplateList';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTDLProperty } from '../../Models/Constants/Interfaces';

type ITemplateColumn = {
    setTemplatesActive: (active: boolean) => boolean;
    templates?: DTDLProperty[];
    setTemplates: React.Dispatch<React.SetStateAction<DTDLProperty>>;
    enteredPropertyRef: any;
    model: DTDLModel;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
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
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const templateColumnStyles = getTemplateColumnStyles();
    const draggedTemplateItemRef = useRef(null);

    return (
        <Stack styles={templateColumnStyles}>
            <Stack styles={{ root: { padding: '8px' } }}>
                <div className={propertyInspectorStyles.rowSpaceBetween}>
                    <Label>{t('OATPropertyEditor.templates')}</Label>
                    <ActionButton onClick={() => setTemplatesActive(false)}>
                        <FontIcon
                            iconName={'ChromeClose'}
                            className={
                                propertyInspectorStyles.iconClosePropertySelector
                            }
                        />
                    </ActionButton>
                </div>
                <TextField
                    styles={textFieldStyles}
                    borderless
                    placeholder={t(
                        'OATPropertyEditor.templateSearchPlaceholder'
                    )}
                ></TextField>
            </Stack>
            <Stack className={propertyInspectorStyles.gridRowPropertyHeading}>
                <div className={propertyInspectorStyles.row}>
                    <Text>{t('OATPropertyEditor.name')}</Text>
                </div>
                <div className={propertyInspectorStyles.row}>
                    <FontIcon
                        className={propertyInspectorStyles.propertyHeadingIcon}
                        iconName={'SwitcherStartEnd'}
                    />
                    <Text>{t('OATPropertyEditor.schemaType')}</Text>
                </div>
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
