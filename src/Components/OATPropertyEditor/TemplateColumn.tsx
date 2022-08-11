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
    getTemplateColumnStyles,
    getTemplateColumnPaddingStyles
} from './OATPropertyEditor.styles';
import TemplateList from './TemplateList';
import { SET_OAT_TEMPLATES_ACTIVE } from '../../Models/Constants/ActionTypes';
import { TemplateColumnProps } from './TemplateColumn.types';

export const TemplateColumn = ({
    enteredPropertyRef,
    enteredTemplateRef,
    dispatch,
    state
}: TemplateColumnProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const templateColumnStyles = getTemplateColumnStyles();
    const templateColumnPaddingStyles = getTemplateColumnPaddingStyles();
    const draggedTemplateItemRef = useRef(null);
    const { draggingTemplate, draggingProperty } = state;

    return (
        <Stack styles={templateColumnStyles}>
            <Stack styles={templateColumnPaddingStyles}>
                <div className={propertyInspectorStyles.rowSpaceBetween}>
                    <Label>{t('OATPropertyEditor.templates')}</Label>
                    <ActionButton
                        onClick={() =>
                            dispatch({
                                type: SET_OAT_TEMPLATES_ACTIVE,
                                payload: false
                            })
                        }
                    >
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
                />
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
                draggedTemplateItemRef={draggedTemplateItemRef}
                enteredPropertyRef={enteredPropertyRef}
                dispatch={dispatch}
                state={state}
                draggingTemplate={draggingTemplate}
                enteredTemplateRef={enteredTemplateRef}
                draggingProperty={draggingProperty}
            />
        </Stack>
    );
};

export default TemplateColumn;
