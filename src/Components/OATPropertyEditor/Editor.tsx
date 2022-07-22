import React, { useRef, useMemo } from 'react';
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
import {
    getPropertyInspectorStyles,
    getPropertyListPivotColumnContent,
    getPropertyListStackItem
} from './OATPropertyEditor.styles';
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';
import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN,
    SET_OAT_TEMPLATES_ACTIVE
} from '../../Models/Constants/ActionTypes';
import {
    getModelPropertyCollectionName,
    getTargetFromSelection
} from './Utils';
import OATModal from '../../Pages/OATEditorPage/Internal/Components/OATModal';
import FormUpdateProperty from './FormUpdateProperty';
import FormAddEnumItem from './FormAddEnumItem';
import { FormBody } from './Constants';
import FormRootModelDetails from './FormRootModelDetails';
import { EditorProps } from './Editor.types';
import {
    OATComponentHandleName,
    OATInterfaceType,
    OATRelationshipHandleName,
    OATUntargetedRelationshipName
} from '../../Models/Constants/Constants';

const Editor = ({ dispatch, languages, state, theme }: EditorProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const propertyListPivotColumnContent = getPropertyListPivotColumnContent();
    const propertyListStackItem = getPropertyListStackItem();
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);
    const { models, selection, templatesActive, modalOpen, modalBody } = state;

    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : OATInterfaceType
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
                    property['@type'] !== OATRelationshipHandleName &&
                    property['@type'] !== OATUntargetedRelationshipName &&
                    property['@type'] !== OATComponentHandleName
            );
        }
        return propertyItems;
    }, [model]);

    const isSupportedModelType = useMemo(() => {
        return (
            (model && model['@type'] === OATInterfaceType) ||
            (model && model['@type'] === OATRelationshipHandleName)
        );
    }, [model]);

    const onToggleTemplatesActive = () => {
        dispatch({
            type: SET_OAT_TEMPLATES_ACTIVE,
            payload: !templatesActive
        });
    };

    const onModalClose = () => {
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: false
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: null
        });
    };

    const getModalBody = () => {
        switch (modalBody) {
            case FormBody.property:
                return (
                    <FormUpdateProperty
                        dispatch={dispatch}
                        languages={languages}
                        onClose={onModalClose}
                        state={state}
                    />
                );
            case FormBody.enum:
                return (
                    <FormAddEnumItem
                        dispatch={dispatch}
                        languages={languages}
                        onClose={onModalClose}
                        state={state}
                    />
                );
            case FormBody.rootModel:
                return (
                    <FormRootModelDetails
                        dispatch={dispatch}
                        onClose={onModalClose}
                        languages={languages}
                        state={state}
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
                                    enteredPropertyRef={enteredPropertyRef}
                                    enteredTemplateRef={enteredTemplateRef}
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
