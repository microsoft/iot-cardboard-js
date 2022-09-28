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
    getPropertyListPivotColumnContentStyles,
    getPropertyListStackItemStyles
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
    OAT_INTERFACE_TYPE,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../Models/Constants/Constants';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';

const Editor: React.FC<EditorProps> = (props) => {
    const { dispatch, languages, state, theme } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageState } = useOatPageContext();

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const propertyListPivotColumnContent = getPropertyListPivotColumnContentStyles();
    const propertyListStackItem = getPropertyListStackItemStyles();

    // state
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);
    const { modalOpen, modalBody } = state;

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(oatPageState.models, oatPageState.selection),
        [oatPageState.models, oatPageState.selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : OAT_INTERFACE_TYPE
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
                (property) => property['@type'] === 'Property'
            );
        }
        return propertyItems;
    }, [model]);

    const isSupportedModelType = useMemo(() => {
        return (
            (model && model['@type'] === OAT_INTERFACE_TYPE) ||
            (model && model['@type'] === OAT_RELATIONSHIP_HANDLE_NAME)
        );
    }, [model]);

    // callbacks
    const onToggleTemplatesActive = () => {
        dispatch({
            type: SET_OAT_TEMPLATES_ACTIVE,
            payload: !oatPageState.templatesActive
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
                        languages={languages}
                        onClose={onModalClose}
                        state={state}
                    />
                );
            case FormBody.rootModel:
                return (
                    <FormRootModelDetails
                        onClose={onModalClose}
                        languages={languages}
                    />
                );
            default:
                <></>;
        }
    };

    return (
        <div>
            <div className={propertyInspectorStyles.container}>
                <Pivot className={propertyInspectorStyles.pivot}>
                    <PivotItem
                        headerButtonProps={{
                            disabled: oatPageState.modified
                        }}
                        headerText={t('OATPropertyEditor.properties')}
                        className={propertyInspectorStyles.pivotItem}
                    >
                        <Stack styles={propertyListPivotColumnContent}>
                            <Stack.Item>
                                <PropertiesModelSummary
                                    dispatch={dispatch}
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
                {oatPageState.templatesActive && (
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
        </div>
    );
};

export default Editor;
