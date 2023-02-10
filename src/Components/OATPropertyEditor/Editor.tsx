import React, { useCallback, useRef } from 'react';
import { classNamesFunction, Pivot, PivotItem, styled } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import NoResultImg from '../../Resources/Static/emptyClipboard.svg';
import TemplateColumn from './Internal/TemplateColumn';
import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../Models/Constants/ActionTypes';
import OATModal from '../../Pages/OATEditorPage/Internal/Components/OATModal';
import { FormBody } from './Shared/Constants';
import { IEditorProps, IEditorStyleProps, IEditorStyles } from './Editor.types';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import FormUpdateProperty from './Internal/FormUpdateProperty';
import { getDebugLogger } from '../../Models/Services/Utils';
import EditorPropertiesTab from './Internal/EditorPropertiesTab/EditorPropertiesTab';
import EditorJsonTab from './Internal/EditorJsonTab/EditorJsonTab';
import IllustrationMessage from '../IllustrationMessage/IllustrationMessage';
import { PANEL_VERTICAL_SPACING } from '../../Models/Constants/OatStyleConstants';
import { IOatPropertyEditorTabKey } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { getStyles } from './Editor.styles';
import Version3PreviewLabel from './Internal/Version3PreviewLabel/Version3PreviewLabel';
import {
    isDTDLModel,
    modelHasVersion3Context
} from '../../Models/Services/DtdlUtils';
import Version3UpgradeButton from './Internal/Version3UpgradeButton/Version3UpgradeButton';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Editor', debugLogging);

const getClassNames = classNamesFunction<IEditorStyleProps, IEditorStyles>();

const Editor: React.FC<IEditorProps> = (props) => {
    const {
        editorDispatch,
        selectedItem,
        editorState,
        selectedThemeName,
        parentModelId,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageState, oatPageDispatch } = useOatPageContext();

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

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
            default:
                <></>;
        }
    };

    logDebugConsole('debug', 'Render. {selectedItem}', selectedItem);
    if (!selectedItem) {
        return (
            <div className={classNames.root}>
                <IllustrationMessage
                    type={'info'}
                    width={'wide'}
                    descriptionText={t('OATPropertyEditor.noSelectionMessage')}
                    imageProps={{
                        height: 100,
                        src: NoResultImg
                    }}
                    styles={classNames.subComponentStyles?.illustrationMessage?.()}
                />
            </div>
        );
    }
    return (
        <>
            <div className={classNames.root}>
                <Pivot
                    className={classNames.pivot}
                    selectedKey={oatPageState.selectedPropertyEditorTab}
                    onLinkClick={onTabClick}
                >
                    <PivotItem
                        headerButtonProps={{
                            disabled: oatPageState.modified
                        }}
                        headerText={t('OATPropertyEditor.properties')}
                        className={classNames.pivotItem}
                        itemKey={IOatPropertyEditorTabKey.Properties}
                    >
                        <EditorPropertiesTab
                            parentModelId={parentModelId}
                            selectedItem={selectedItem}
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('OATPropertyEditor.json')}
                        className={classNames.pivotItem}
                        itemKey={IOatPropertyEditorTabKey.Json}
                        // remove pivot height - padding
                        style={{
                            height: `calc(100vh - ${PANEL_VERTICAL_SPACING}px - 32px - 36px)` // 32px=padding, 36px=tab headers
                        }}
                    >
                        <EditorJsonTab
                            selectedItem={selectedItem}
                            selectedThemeName={selectedThemeName}
                        />
                    </PivotItem>
                </Pivot>
                {isDTDLModel(selectedItem) && (
                    <div className={classNames.previewLabelContainer}>
                        {modelHasVersion3Context(selectedItem) ? (
                            <Version3PreviewLabel />
                        ) : (
                            <Version3UpgradeButton
                                selectedModel={selectedItem}
                            />
                        )}
                    </div>
                )}
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
                className={classNames.modal}
            >
                {getModalBody()}
            </OATModal>
        </>
    );
};

export default styled<IEditorProps, IEditorStyleProps, IEditorStyles>(
    Editor,
    getStyles
);
