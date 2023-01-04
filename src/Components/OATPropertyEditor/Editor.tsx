import React, { useRef, useMemo, useCallback } from 'react';
import { Stack, Pivot, PivotItem, Label } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getPropertyListPivotColumnContentStyles,
    getPropertyListStackItemStyles
} from './OATPropertyEditor.styles';
import PropertyListOld from './Internal/PropertyList';
import PropertyList from './Internal/PropertyList/PropertyList';
import JSONEditor from './Internal/JSONEditor';
import TemplateColumn from './Internal/TemplateColumn';
import PropertiesModelSummary from './Internal/PropertiesModelSummary';
import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../Models/Constants/ActionTypes';
import { getModelPropertyCollectionName } from './Utils';
import OATModal from '../../Pages/OATEditorPage/Internal/Components/OATModal';
import FormAddEnumItem from './Internal/FormAddEnumItem';
import { FormBody } from './Shared/Constants';
import { IEditorProps } from './Editor.types';
import { OAT_INTERFACE_TYPE } from '../../Models/Constants/Constants';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import FormUpdateProperty from './Internal/FormUpdateProperty';
import { deepCopy, getDebugLogger } from '../../Models/Services/Utils';
import PropertyTypePicker from './Internal/PropertyTypePicker/PropertyTypePicker';
import { DTDLProperty, DTDLSchemaTypes } from '../../Models/Classes/DTDL';
import {
    getDefaultProperty,
    isDTDLModel,
    isDTDLProperty,
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../Models/Services/DtdlUtils';
import { useCommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import { DtdlProperty } from '../../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Editor', debugLogging);

const Editor: React.FC<IEditorProps> = (props) => {
    const {
        editorDispatch,
        selectedItem,
        editorState,
        selectedThemeName,
        parentModelId
    } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { execute } = useCommandHistoryContext();

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const propertyListPivotColumnContent = getPropertyListPivotColumnContentStyles();
    const propertyListStackItem = getPropertyListStackItemStyles();

    // state
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);

    // data
    const propertiesKeyName = getModelPropertyCollectionName(
        selectedItem ? selectedItem['@type'] : OAT_INTERFACE_TYPE
    );

    const propertyList = useMemo(() => {
        // Get contents excluding relationship items
        let propertyItems: DTDLProperty[] = [];
        if (
            selectedItem &&
            selectedItem[propertiesKeyName] &&
            selectedItem[propertiesKeyName].length > 0
        ) {
            // Exclude relationships from propertyList. Handle DTDL V3 where type can be an array for Semantic types
            propertyItems = selectedItem[
                propertiesKeyName
            ].filter((property: DTDLProperty) => isDTDLProperty(property));
        }
        return propertyItems;
    }, [selectedItem, propertiesKeyName]);

    const isSupportedModelType = useMemo(
        () =>
            isDTDLModel(selectedItem) ||
            isDTDLRelationshipReference(selectedItem),
        [selectedItem]
    );

    // callbacks
    // const onToggleTemplatesActive = () => {
    //     oatPageDispatch({
    //         type: OatPageContextActionType.SET_OAT_TEMPLATES_ACTIVE,
    //         payload: { isActive: !oatPageState.templatesActive }
    //     });
    // };

    const onModalClose = () => {
        editorDispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: false
        });
        editorDispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: null
        });
    };

    const getModalBody = () => {
        switch (editorState.modalBody) {
            case FormBody.property:
                return (
                    <FormUpdateProperty
                        dispatch={editorDispatch}
                        onClose={onModalClose}
                        state={editorState}
                    />
                );
            case FormBody.enum:
                return (
                    <FormAddEnumItem
                        onClose={onModalClose}
                        state={editorState}
                    />
                );
            default:
                <></>;
        }
    };

    const onAddType = useCallback(
        (data: { schema: DTDLSchemaTypes }) => {
            logDebugConsole(
                'info',
                'Updating schema with data. {selectedItem, property, data}',
                selectedItem,
                data
            );

            const selectedItemCopy = deepCopy(selectedItem);
            if (!selectedItemCopy[propertiesKeyName]) {
                selectedItemCopy[propertiesKeyName] = [];
            }
            (selectedItemCopy[propertiesKeyName] as DtdlProperty[]).push(
                getDefaultProperty(
                    data.schema,
                    selectedItemCopy[propertiesKeyName].length
                )
            );

            if (isDTDLModel(selectedItemCopy)) {
                const updateModel = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.UPDATE_MODEL,
                        payload: {
                            model: selectedItemCopy
                        }
                    });
                };

                const undoUpdate = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.GENERAL_UNDO,
                        payload: {
                            models: oatPageState.currentOntologyModels,
                            positions:
                                oatPageState.currentOntologyModelPositions,
                            selection: oatPageState.selection
                        }
                    });
                };

                execute(updateModel, undoUpdate);
            } else if (isDTDLReference(selectedItemCopy)) {
                const updateModel = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.UPDATE_REFERENCE,
                        payload: {
                            modelId: parentModelId,
                            reference: selectedItemCopy
                        }
                    });
                };

                const undoUpdate = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.GENERAL_UNDO,
                        payload: {
                            models: oatPageState.currentOntologyModels,
                            positions:
                                oatPageState.currentOntologyModelPositions,
                            selection: oatPageState.selection
                        }
                    });
                };

                execute(updateModel, undoUpdate);
            }
        },
        [
            execute,
            oatPageDispatch,
            oatPageState.currentOntologyModelPositions,
            oatPageState.currentOntologyModels,
            oatPageState.selection,
            parentModelId,
            propertiesKeyName,
            selectedItem
        ]
    );

    logDebugConsole('debug', 'Render. {selectedItem}', selectedItem);
    const useNewList = true;
    return (
        <>
            <div className={propertyInspectorStyles.root}>
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
                                    isSupportedModelType={isSupportedModelType}
                                    selectedItem={selectedItem}
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
                                        {isSupportedModelType && (
                                            <PropertyTypePicker
                                                onSelect={onAddType}
                                            />
                                        )}
                                        {/* <ActionButton
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
                                        </ActionButton> */}
                                    </Stack>
                                </div>
                            </Stack.Item>

                            <Stack.Item grow styles={propertyListStackItem}>
                                {isDTDLReference(selectedItem) ||
                                isDTDLModel(selectedItem) ? (
                                    useNewList ? (
                                        <PropertyList
                                            selectedItem={selectedItem}
                                            properties={propertyList}
                                            parentModelId={parentModelId}
                                        />
                                    ) : (
                                        <PropertyListOld
                                            dispatch={editorDispatch}
                                            enteredPropertyRef={
                                                enteredPropertyRef
                                            }
                                            enteredTemplateRef={
                                                enteredTemplateRef
                                            }
                                            isSupportedModelType={
                                                isSupportedModelType
                                            }
                                            propertyList={propertyList}
                                            selectedItem={selectedItem}
                                            state={editorState}
                                        />
                                    )
                                ) : (
                                    'Property list not supported'
                                )}
                            </Stack.Item>
                        </Stack>
                    </PivotItem>
                    <PivotItem
                        headerText={t('OATPropertyEditor.json')}
                        className={propertyInspectorStyles.pivotItem}
                        // remove pivot height - padding
                        style={{ height: 'calc(70vh - 36px - 32px)' }}
                    >
                        {isSupportedModelType && (
                            <JSONEditor theme={selectedThemeName} />
                        )}
                    </PivotItem>
                </Pivot>
                {oatPageState.templatesActive && (
                    <TemplateColumn
                        enteredPropertyRef={enteredPropertyRef}
                        enteredTemplateRef={enteredTemplateRef}
                        dispatch={editorDispatch}
                        state={editorState}
                    />
                )}
            </div>
            <OATModal
                isOpen={editorState.modalOpen}
                className={propertyInspectorStyles.modal}
            >
                {getModalBody()}
            </OATModal>
        </>
    );
};

export default Editor;
