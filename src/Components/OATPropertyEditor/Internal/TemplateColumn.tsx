import React, { useRef } from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text,
    useTheme,
    Label
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getPropertyEditorTextFieldStyles,
    getTemplateColumnStyles,
    getTemplateColumnPaddingStyles
} from '../OATPropertyEditor.styles';
import TemplateList from './TemplateList';
import { TemplateColumnProps } from './TemplateColumn.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

export const TemplateColumn: React.FC<TemplateColumnProps> = (props) => {
    const { dispatch, enteredPropertyRef, enteredTemplateRef, state } = props;

    // hooks
    const { t } = useTranslation();

    // context
    const { oatPageDispatch } = useOatPageContext();

    // styles
    const theme = useTheme();
    const propertyInspectorStyles = getPropertyInspectorStyles(theme);
    const textFieldStyles = getPropertyEditorTextFieldStyles({ theme });
    const templateColumnStyles = getTemplateColumnStyles({ theme });
    const templateColumnPaddingStyles = getTemplateColumnPaddingStyles();

    // state
    const draggedTemplateItemRef = useRef(null);

    // state
    const { draggingTemplate, draggingProperty } = state;

    return (
        <Stack styles={templateColumnStyles}>
            <Stack styles={templateColumnPaddingStyles}>
                <div className={propertyInspectorStyles.rowSpaceBetween}>
                    <Label>{t('OATPropertyEditor.templates')}</Label>
                    <ActionButton
                        onClick={() =>
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_OAT_TEMPLATES_ACTIVE,
                                payload: { isActive: false }
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
                draggingTemplate={draggingTemplate}
                enteredTemplateRef={enteredTemplateRef}
                draggingProperty={draggingProperty}
            />
        </Stack>
    );
};

export default TemplateColumn;
