import React, { useState, useRef } from 'react';
import { Theme } from '../../Models/Constants/Enums';
import {
    FontIcon,
    Stack,
    Pivot,
    PivotItem,
    Label,
    Text,
    ActionButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { IAction } from '../../Models/Constants/Interfaces';
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';
import PropertySelector from './PropertySelector';
import AddPropertyBar from './AddPropertyBar';
import { SET_OAT_TEMPLATES_ACTIVE } from '../../Models/Constants/ActionTypes';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { getModelPropertyCollectionName } from './Utils';
interface IEditor {
    currentPropertyIndex?: number;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    theme?: Theme;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

const Editor = ({
    theme,
    setModalBody,
    setModalOpen,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    currentPropertyIndex,
    dispatch,
    state
}: IEditor) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const [draggingTemplate, setDraggingTemplate] = useState(false);
    const [draggingProperty, setDraggingProperty] = useState(false);
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);
    const [hover, setHover] = useState(false);
    const [propertyOnHover, setPropertyOnHover] = useState(false);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const { model, templatesActive } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    return (
        <div className={propertyInspectorStyles.container}>
            <Pivot className={propertyInspectorStyles.pivot}>
                <PivotItem
                    headerText={t('OATPropertyEditor.properties')}
                    className={propertyInspectorStyles.pivotItem}
                >
                    <PropertiesModelSummary
                        dispatch={dispatch}
                        state={state}
                        setModalBody={setModalBody}
                        setModalOpen={setModalOpen}
                    />
                    <div
                        className={
                            propertyInspectorStyles.propertyListHeaderWrap
                        }
                        onMouseOver={() => {
                            setHover(true);
                        }}
                        onMouseLeave={() => {
                            setHover(false);
                            setPropertySelectorVisible(false);
                            setPropertyOnHover(false);
                        }}
                    >
                        <Stack
                            className={propertyInspectorStyles.rowSpaceBetween}
                        >
                            <Label>{`${t('OATPropertyEditor.properties')} ${
                                model && model[propertiesKeyName].length > 0
                                    ? `(${model[propertiesKeyName].length})`
                                    : ''
                            }`}</Label>
                            <ActionButton
                                onClick={() =>
                                    dispatch({
                                        type: SET_OAT_TEMPLATES_ACTIVE,
                                        payload: true
                                    })
                                }
                                className={
                                    propertyInspectorStyles.viewTemplatesCta
                                }
                            >
                                <FontIcon
                                    className={
                                        propertyInspectorStyles.propertyHeadingIcon
                                    }
                                    iconName={'Library'}
                                />
                                <Text>
                                    {t('OATPropertyEditor.viewTemplates')}
                                </Text>
                            </ActionButton>
                        </Stack>
                        {propertySelectorVisible && (
                            <PropertySelector
                                setPropertySelectorVisible={
                                    setPropertySelectorVisible
                                }
                                lastPropertyFocused={null}
                                dispatch={dispatch}
                                state={state}
                            />
                        )}
                        {hover && model && model[propertiesKeyName].length > 0 && (
                            <AddPropertyBar
                                onMouseOver={() => {
                                    setPropertySelectorVisible(true);
                                }}
                            />
                        )}
                    </div>

                    <PropertyList
                        dispatch={dispatch}
                        state={state}
                        setCurrentPropertyIndex={setCurrentPropertyIndex}
                        setModalOpen={setModalOpen}
                        currentPropertyIndex={currentPropertyIndex}
                        enteredPropertyRef={enteredPropertyRef}
                        draggingTemplate={draggingTemplate}
                        enteredTemplateRef={enteredTemplateRef}
                        draggingProperty={draggingProperty}
                        setDraggingProperty={setDraggingProperty}
                        setCurrentNestedPropertyIndex={
                            setCurrentNestedPropertyIndex
                        }
                        setModalBody={setModalBody}
                        setPropertyOnHover={setPropertyOnHover}
                        propertyOnHover={propertyOnHover}
                    />
                </PivotItem>
                <PivotItem
                    headerText={t('OATPropertyEditor.json')}
                    className={propertyInspectorStyles.pivotItem}
                >
                    <JSONEditor
                        theme={theme}
                        dispatch={dispatch}
                        state={state}
                    />
                </PivotItem>
            </Pivot>
            {templatesActive && (
                <TemplateColumn
                    enteredPropertyRef={enteredPropertyRef}
                    draggingTemplate={draggingTemplate}
                    setDraggingTemplate={setDraggingTemplate}
                    draggingProperty={draggingProperty}
                    enteredTemplateRef={enteredTemplateRef}
                    dispatch={dispatch}
                    state={state}
                />
            )}
        </div>
    );
};

export default Editor;
