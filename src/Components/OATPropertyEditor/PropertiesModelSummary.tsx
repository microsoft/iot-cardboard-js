import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Stack, Label, Text, IconButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getGeneralPropertiesWrapStyles,
    getPropertyEditorTextFieldStyles,
    getIconWrapFitContentStyles
} from './OATPropertyEditor.styles';
import { FormBody } from './Constants';
import OATTextFieldDisplayName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldName';
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import { deepCopy } from '../../Models/Services/Utils';

import {
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN
} from '../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getModelPropertyListItemName, getTargetFromSelection } from './Utils';
import { PropertiesModelSummaryProps } from './PropertiesModelSummary.types';
import { OAT_INTERFACE_TYPE } from '../../Models/Constants/Constants';
import { updateModelId } from '../../Models/Services/OatUtils';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../Models/Context/OatPageContext/OatPageContext.types';

export const PropertiesModelSummary: React.FC<PropertiesModelSummaryProps> = (
    props
) => {
    const { dispatch, isSupportedModelType } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(oatPageState.models, oatPageState.selection),
        [oatPageState.models, oatPageState.selection]
    );

    const [displayName, setDisplayName] = useState(
        model && model.displayName
            ? getModelPropertyListItemName(model.displayName)
            : ''
    );
    const [name, setName] = useState(model ? model.name : '');
    const [id, setId] = useState(model && model['@id'] ? model['@id'] : '');
    const [idEditor, setIdEditor] = useState(false);
    const [nameEditor, setNameEditor] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);

    useEffect(() => {
        setDisplayName(
            model && model.displayName
                ? getModelPropertyListItemName(model.displayName)
                : ''
        );
        setName(model && model.name ? model.name : '');
        setId(model && model['@id'] ? model['@id'] : '');
    }, [model]);

    const onIdCommit = (value) => {
        const commit = () => {
            const {
                models: modelsCopy,
                positions: modelPositionsCopy
            } = updateModelId(
                id,
                value,
                oatPageState.models,
                oatPageState.modelPositions
            );

            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS_POSITIONS,
                payload: { positions: modelPositionsCopy }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: modelsCopy }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: {
                    selection:
                        oatPageState.selection &&
                        oatPageState.selection.contentId
                            ? deepCopy(oatPageState.selection)
                            : { modelId: value }
                }
            });

            setId(value);
            setIdEditor(false);
        };

        const undoCommit = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS_POSITIONS,
                payload: { positions: oatPageState.modelPositions }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: oatPageState.models }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: oatPageState.selection }
            });
        };

        execute(commit, undoCommit);
    };

    const onDisplayNameCommit = (value) => {
        const commit = () => {
            const modelsCopy = deepCopy(oatPageState.models);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            if (modelCopy) {
                modelCopy.displayName = value;
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_MODELS,
                    payload: { models: modelsCopy }
                });
            }
            setDisplayName(value);
            setDisplayNameEditor(false);
        };

        const undoCommit = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: oatPageState.models }
            });
        };

        execute(commit, undoCommit);
    };

    const onNameCommit = (value) => {
        const commit = () => {
            const modelsCopy = deepCopy(oatPageState.models);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            if (modelCopy) {
                modelCopy.name = value;
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_MODELS,
                    payload: { models: modelsCopy }
                });
                const selectionCopy = deepCopy(oatPageState.selection);
                selectionCopy.contentId = name;
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                    payload: { selection: selectionCopy }
                });
            }
            setName(value);
            setNameEditor(false);
        };

        const undoCommit = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_MODELS,
                payload: { models: oatPageState.models }
            });
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: oatPageState.selection }
            });
        };

        execute(commit, undoCommit);
    };

    const onInfoButtonClick = () => {
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_BODY,
            payload: FormBody.rootModel
        });
        dispatch({
            type: SET_OAT_PROPERTY_MODAL_OPEN,
            payload: true
        });
    };
    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = getIconWrapFitContentStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();

    return (
        <Stack styles={generalPropertiesWrapStyles}>
            <div className={propertyInspectorStyles.rowSpaceBetween}>
                <Label>{`${t('OATPropertyEditor.general')}`}</Label>
                {model && model['@type'] === OAT_INTERFACE_TYPE && (
                    <IconButton
                        styles={iconWrapStyles}
                        iconProps={{ iconName: 'info' }}
                        title={t('OATPropertyEditor.info')}
                        onClick={onInfoButtonClick}
                    />
                )}
            </div>
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('type')}</Text>
                <Text className={propertyInspectorStyles.typeTextField}>
                    {model ? model['@type'] : ''}
                </Text>
            </div>

            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('id')}</Text>
                {!idEditor && model && (
                    <Text
                        className={propertyInspectorStyles.typeTextField}
                        onDoubleClick={() => setIdEditor(true)}
                    >
                        {id}
                    </Text>
                )}
                {idEditor && model && (
                    <OATTextFieldId
                        placeholder={t('id')}
                        styles={textFieldStyles}
                        disabled={!model}
                        value={isSupportedModelType && id}
                        model={model}
                        models={oatPageState.models}
                        onCommit={onIdCommit}
                        borderless
                        autoFocus
                    />
                )}
            </div>
            {model && model.name && (
                <div className={propertyInspectorStyles.gridRow}>
                    <Text>{t('name')}</Text>
                    {!nameEditor && model && (
                        <Text
                            className={propertyInspectorStyles.typeTextField}
                            onDoubleClick={() => setNameEditor(true)}
                        >
                            {name}
                        </Text>
                    )}
                    {nameEditor && model && (
                        <OATTextFieldName
                            placeholder={t('name')}
                            styles={textFieldStyles}
                            disabled={!model}
                            value={
                                isSupportedModelType &&
                                getModelPropertyListItemName(name)
                            }
                            model={model}
                            models={oatPageState.models}
                            onCommit={onNameCommit}
                            borderless
                            autoFocus
                        />
                    )}
                </div>
            )}
            {isSupportedModelType && (
                <div className={propertyInspectorStyles.gridRow}>
                    <Text>{t('OATPropertyEditor.displayName')}</Text>
                    {!displayNameEditor && model && (
                        <Text
                            className={
                                displayName.length > 0
                                    ? propertyInspectorStyles.typeTextField
                                    : propertyInspectorStyles.typeTextFieldPlaceholder
                            }
                            onDoubleClick={() => setDisplayNameEditor(true)}
                        >
                            {displayName !== ''
                                ? displayName
                                : t('OATPropertyEditor.displayName')}
                        </Text>
                    )}
                    {displayNameEditor && model && (
                        <OATTextFieldDisplayName
                            styles={textFieldStyles}
                            borderless
                            placeholder={t('OATPropertyEditor.displayName')}
                            disabled={!model}
                            value={isSupportedModelType && displayName}
                            onCommit={onDisplayNameCommit}
                            model={model}
                            autoFocus
                        />
                    )}
                </div>
            )}
        </Stack>
    );
};

export default PropertiesModelSummary;
