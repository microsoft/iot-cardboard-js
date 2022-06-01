import React, { useState, useRef, useMemo } from 'react';
import { ModelTypes, Theme } from '../../Models/Constants/Enums';
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
    const [propertyOnHover, setPropertyOnHover] = useState(false);
    const { model, templatesActive } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : ModelTypes.interface
    );

    const propertyList = useMemo(() => {
        // Get contents excluding relationship items
        let propertyItems = [];
        if (
            model &&
            model[propertiesKeyName] &&
            model[propertiesKeyName].length > 0
        ) {
            propertyItems = model[propertiesKeyName].filter(
                (property) => property['@type'] !== ModelTypes.relationship
            );
            return propertyItems;
        }
        return propertyItems;
    }, [model]);

    return (
        <div className={propertyInspectorStyles.container}>
            <Pivot className={propertyInspectorStyles.pivot}>
                <PivotItem
                    headerButtonProps={{
                        disabled: state.modified
                    }}
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
                    >
                        <Stack
                            className={propertyInspectorStyles.rowSpaceBetween}
                        >
                            <Label>{`${t('OATPropertyEditor.properties')} ${
                                propertyList.length > 0
                                    ? `(${propertyList.length})`
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
                        propertyList={propertyList}
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
