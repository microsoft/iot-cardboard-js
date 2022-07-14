import React, { useState, useRef, useMemo } from 'react';
import { ModelTypes, Theme } from '../../Models/Constants/Enums';
import {
    FontIcon,
    Stack,
    Pivot,
    PivotItem,
    Label,
    Text,
    ActionButton,
    IDropdownOption
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getPropertyListPivotColumnContent,
    getPropertyListStackItem
} from './OATPropertyEditor.styles';
import { IAction } from '../../Models/Constants/Interfaces';
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';
import { SET_OAT_TEMPLATES_ACTIVE } from '../../Models/Constants/ActionTypes';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { getModelPropertyCollectionName } from './Utils';
import OATModal from '../../Pages/OATEditorPage/Internal/Components/OATModal';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';
import { FormBody } from './Constants';
import FormRootModelDetails from './FormRootModelDetails';
interface IEditor {
    currentNestedPropertyIndex?: number;
    currentPropertyIndex?: number;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    languages: IDropdownOption[];
    onCurrentPropertyIndexChange: (index: number) => void;
    onCurrentNestedPropertyIndexChange: (index: number) => void;
    state?: IOATEditorState;
    theme?: Theme;
}

const Editor = ({
    dispatch,
    languages,
    currentPropertyIndex,
    currentNestedPropertyIndex,
    onCurrentPropertyIndexChange,
    onCurrentNestedPropertyIndexChange,
    state,
    theme
}: IEditor) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const propertyListPivotColumnContent = getPropertyListPivotColumnContent();
    const propertyListStackItem = getPropertyListStackItem();

    const [modalOpen, setModalOpen] = useState(false);
    const [modalBody, setModalBody] = useState(null);
    const [draggingTemplate, setDraggingTemplate] = useState(false);
    const [draggingProperty, setDraggingProperty] = useState(false);
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);
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
            // Exclude relationships from propertyList
            propertyItems = model[propertiesKeyName].filter(
                (property) =>
                    property['@type'] !== ModelTypes.relationship &&
                    property['@type'] !== ModelTypes.untargeted
            );
        }
        return propertyItems;
    }, [model]);

    const isSupportedModelType = useMemo(() => {
        return (
            (model && model['@type'] === ModelTypes.interface) ||
            (model && model['@type'] === ModelTypes.relationship)
        );
    }, [model]);

    const onToggleTemplatesActive = () => {
        dispatch({
            type: SET_OAT_TEMPLATES_ACTIVE,
            payload: !templatesActive
        });
    };

    const onModalClose = () => {
        setModalOpen(false);
    };

    const getModalBody = () => {
        switch (modalBody) {
            case FormBody.property:
                return (
                    <FormUpdateProperty
                        dispatch={dispatch}
                        currentPropertyIndex={currentPropertyIndex}
                        currentNestedPropertyIndex={currentNestedPropertyIndex}
                        onCurrentNestedPropertyIndexChange={
                            onCurrentNestedPropertyIndexChange
                        }
                        setModalBody={setModalBody}
                        state={state}
                        languages={languages}
                        onClose={onModalClose}
                    />
                );
            case FormBody.enum:
                return (
                    <FormAddEnumItem
                        onClose={onModalClose}
                        dispatch={dispatch}
                        currentPropertyIndex={currentPropertyIndex}
                        currentNestedPropertyIndex={currentNestedPropertyIndex}
                        setModalBody={setModalBody}
                        state={state}
                        languages={languages}
                    />
                );
            case FormBody.rootModel:
                return (
                    <FormRootModelDetails
                        onClose={onModalClose}
                        dispatch={dispatch}
                        setModalBody={setModalBody}
                        state={state}
                        languages={languages}
                    />
                );
            default:
                <></>;
        }
    };

    return (
        <>
            <div className={propertyInspectorStyles.container}>
                <Pivot className={propertyInspectorStyles.pivot}>
                    <PivotItem
                        headerButtonProps={{
                            disabled: state.modified
                        }}
                        headerText={t('OATPropertyEditor.properties')}
                        className={propertyInspectorStyles.pivotItem}
                    >
                        <Stack styles={propertyListPivotColumnContent}>
                            <Stack.Item>
                                <PropertiesModelSummary
                                    dispatch={dispatch}
                                    state={state}
                                    setModalBody={setModalBody}
                                    setModalOpen={setModalOpen}
                                    isSupportedModelType={isSupportedModelType}
                                />
                            </Stack.Item>
                            <Stack.Item>
                                <div
                                    className={
                                        propertyInspectorStyles.propertyListHeaderWrap
                                    }
                                >
                                    <Stack
                                        className={
                                            propertyInspectorStyles.rowSpaceBetween
                                        }
                                    >
                                        <Label>{`${t(
                                            'OATPropertyEditor.properties'
                                        )} ${
                                            propertyList.length > 0
                                                ? `(${propertyList.length})`
                                                : ''
                                        }`}</Label>
                                        <ActionButton
                                            onClick={onToggleTemplatesActive}
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
                                                {t(
                                                    'OATPropertyEditor.viewTemplates'
                                                )}
                                            </Text>
                                        </ActionButton>
                                    </Stack>
                                </div>
                            </Stack.Item>

                            <Stack.Item grow styles={propertyListStackItem}>
                                <PropertyList
                                    dispatch={dispatch}
                                    state={state}
                                    onCurrentPropertyIndexChange={
                                        onCurrentPropertyIndexChange
                                    }
                                    setModalOpen={setModalOpen}
                                    currentPropertyIndex={currentPropertyIndex}
                                    enteredPropertyRef={enteredPropertyRef}
                                    draggingTemplate={draggingTemplate}
                                    enteredTemplateRef={enteredTemplateRef}
                                    draggingProperty={draggingProperty}
                                    setDraggingProperty={setDraggingProperty}
                                    onCurrentNestedPropertyIndexChange={
                                        onCurrentNestedPropertyIndexChange
                                    }
                                    setModalBody={setModalBody}
                                    propertyList={propertyList}
                                    isSupportedModelType={isSupportedModelType}
                                />
                            </Stack.Item>
                        </Stack>
                    </PivotItem>
                    <PivotItem
                        headerText={t('OATPropertyEditor.json')}
                        className={propertyInspectorStyles.pivotItem}
                    >
                        {isSupportedModelType && (
                            <JSONEditor
                                theme={theme}
                                dispatch={dispatch}
                                state={state}
                            />
                        )}
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
            <OATModal
                isOpen={modalOpen}
                className={propertyInspectorStyles.modal}
            >
                {getModalBody()}
            </OATModal>
        </>
    );
};

export default Editor;
