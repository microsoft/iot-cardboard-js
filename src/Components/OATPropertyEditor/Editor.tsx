import React, { useCallback, useRef } from 'react';
import { Pivot, PivotItem } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import NoResultImg from '../../Resources/Static/noResults.svg';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import TemplateColumn from './Internal/TemplateColumn';
import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../Models/Constants/ActionTypes';
import OATModal from '../../Pages/OATEditorPage/Internal/Components/OATModal';
import FormAddEnumItem from './Internal/FormAddEnumItem';
import { FormBody } from './Shared/Constants';
import { IEditorProps } from './Editor.types';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import FormUpdateProperty from './Internal/FormUpdateProperty';
import EditorJsonTab from './Internal/EditorJsonTab/EditorJsonTab';
import { getDebugLogger } from '../../Models/Services/Utils';
import EditorPropertiesTab from './Internal/EditorPropertiesTab/EditorPropertiesTab';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import { PROPERTY_EDITOR_VERTICAL_SPACING } from '../../Models/Constants/OatStyleConstants';
import { IOatPropertyEditorTabKey } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

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
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();

    // state
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);

    // callbacks
    const onTabClick = useCallback(
        (item: PivotItem) => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_SELECTED_PROPERTY_EDITOR_TAB,
                payload: {
                    selectedTabKey: item.props
                        .itemKey as IOatPropertyEditorTabKey
                }
            });
        },
        [oatPageDispatch]
    );
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

    logDebugConsole('debug', 'Render. {selectedItem}', selectedItem);
    if (!selectedItem) {
        return (
            <div className={propertyInspectorStyles.root}>
                <IllustrationMessage
                    type={'info'}
                    width={'compact'}
                    descriptionText={t('OATPropertyEditor.noSelectionMessage')}
                    imageProps={{
                        height: 100,
                        src: NoResultImg
                    }}
                    styles={{
                        container: {
                            alignItems: 'unset'
                        },
                        subComponentStyles: {
                            image: {
                                root: {
                                    display: 'flex',
                                    justifyContent: 'center'
                                }
                            }
                        }
                    }}
                />
            </div>
        );
    }
    return (
        <>
            <div className={propertyInspectorStyles.root}>
                <Pivot
                    className={propertyInspectorStyles.pivot}
                    selectedKey={oatPageState.selectedPropertyEditorTab}
                    onLinkClick={onTabClick}
                >
                    <PivotItem
                        headerButtonProps={{
                            disabled: oatPageState.modified
                        }}
                        headerText={t('OATPropertyEditor.properties')}
                        className={propertyInspectorStyles.pivotItem}
                        itemKey={IOatPropertyEditorTabKey.Properties}
                    >
                        <EditorPropertiesTab
                            parentModelId={parentModelId}
                            selectedItem={selectedItem}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('OATPropertyEditor.json')}
                        className={propertyInspectorStyles.pivotItem}
                        itemKey={IOatPropertyEditorTabKey.Json}
                        // remove pivot height - padding
                        style={{
                            height: `calc(100vh - ${PROPERTY_EDITOR_VERTICAL_SPACING}px - 32px - 36px)` // 32px=padding, 36px=tab headers
                        }}
                    >
                        <EditorJsonTab
                            selectedItem={selectedItem}
                            selectedThemeName={selectedThemeName}
                        />
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
