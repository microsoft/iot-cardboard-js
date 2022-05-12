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
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';

type ITemplateColumn = {
    enteredPropertyRef: any;
    draggingTemplate: boolean;
    setDraggingTemplate: any;
    enteredTemplateRef: any;
    draggingProperty: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    state?: IOATEditorState;
};

export const TemplateColumn = ({
    enteredPropertyRef,
    draggingTemplate,
    setDraggingTemplate,
    enteredTemplateRef,
    draggingProperty,
    dispatch,
    state
}: ITemplateColumn) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const templateColumnStyles = getTemplateColumnStyles();
    const templateColumnPaddingStyles = getTemplateColumnPaddingStyles();
    const draggedTemplateItemRef = useRef(null);

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
                draggedTemplateItemRef={draggedTemplateItemRef}
                enteredPropertyRef={enteredPropertyRef}
                dispatch={dispatch}
                state={state}
                draggingTemplate={draggingTemplate}
                setDraggingTemplate={setDraggingTemplate}
                enteredTemplateRef={enteredTemplateRef}
                draggingProperty={draggingProperty}
            />
        </Stack>
    );
};

export default TemplateColumn;
