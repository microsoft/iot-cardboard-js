import React, { useRef, useMemo } from 'react';
import { Stack, Pivot, PivotItem, Label } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getPropertyListPivotColumnContentStyles,
    getPropertyListStackItemStyles
} from './OATPropertyEditor.styles';
import PropertyList from './Internal/PropertyList';
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
import {
    OAT_INTERFACE_TYPE,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../Models/Constants/Constants';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import FormUpdateProperty from './Internal/FormUpdateProperty';
import { getDebugLogger } from '../../Models/Services/Utils';
import FormRootModelDetails from './Internal/FormRootModelDetails/FormRootModelDetails';
import PropertyTypePicker from './Internal/PropertyTypePicker/PropertyTypePicker';
import { DTDLProperty } from '../../Models/Classes/DTDL';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Editor', debugLogging);

const Editor: React.FC<IEditorProps> = (props) => {
    const {
        editorDispatch,
        selectedItem,
        editorState,
        selectedThemeName
    } = props;

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
            // Exclude relationships from propertyList
            propertyItems = selectedItem[propertiesKeyName].filter(
                (property: DTDLProperty) => property['@type'] === 'Property'
            );
        }
        return propertyItems;
    }, [selectedItem, propertiesKeyName]);

    const isSupportedModelType = useMemo(() => {
        return (
            (selectedItem && selectedItem['@type'] === OAT_INTERFACE_TYPE) ||
            (selectedItem &&
                selectedItem['@type'] === OAT_RELATIONSHIP_HANDLE_NAME)
        );
    }, [selectedItem]);

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
            case FormBody.rootModel:
                return (
                    <FormRootModelDetails
                        onClose={onModalClose}
                        selectedItem={selectedItem}
                    />
                );
            default:
                <></>;
        }
    };

    logDebugConsole('debug', 'Render. {selectedItem}', selectedItem);
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
                                    dispatch={editorDispatch}
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
                                        <PropertyTypePicker
                                            onSelect={(item) =>
                                                alert(
                                                    'To be implemented. Selected ' +
                                                        item.type
                                                )
                                            }
                                        />
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
                                <PropertyList
                                    dispatch={editorDispatch}
                                    enteredPropertyRef={enteredPropertyRef}
                                    enteredTemplateRef={enteredTemplateRef}
                                    isSupportedModelType={isSupportedModelType}
                                    propertyList={propertyList}
                                    selectedItem={selectedItem}
                                    state={editorState}
                                />
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
