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
import { deepCopy, updateModelId } from '../../Models/Services/Utils';
import {
    SET_OAT_MODELS,
    SET_OAT_MODELS_POSITIONS,
    SET_OAT_PROPERTY_MODAL_BODY,
    SET_OAT_PROPERTY_MODAL_OPEN,
    SET_OAT_SELECTED_MODEL
} from '../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getModelPropertyListItemName, getTargetFromSelection } from './Utils';
import { PropertiesModelSummaryProps } from './PropertiesModelSummary.types';
import { OATInterfaceType } from '../../Models/Constants/Constants';

export const PropertiesModelSummary = ({
    dispatch,
    state,
    isSupportedModelType
}: PropertiesModelSummaryProps) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const { selection, models, modelPositions } = state;
    const model = useMemo(
        () => selection && getTargetFromSelection(models, selection),
        [models, selection]
    );
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = getIconWrapFitContentStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
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
            const [modelsCopy, modelPositionsCopy] = updateModelId(
                id,
                value,
                models,
                modelPositions
            );

            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelPositionsCopy
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: modelsCopy
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload:
                    selection && selection.contentId
                        ? { ...selection }
                        : { modelId: value }
            });

            setId(value);
            setIdEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_MODELS_POSITIONS,
                payload: modelPositions
            });
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: model
            });
        };

        execute(commit, undoCommit);
    };

    const onDisplayNameCommit = (value) => {
        const commit = () => {
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            if (modelCopy) {
                modelCopy.displayName = value;
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
                });
            }
            setDisplayName(value);
            setDisplayNameEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
        };

        execute(commit, undoCommit);
    };

    const onNameCommit = (value) => {
        const commit = () => {
            const modelsCopy = deepCopy(models);
            const modelCopy = getTargetFromSelection(modelsCopy, selection);
            if (modelCopy) {
                modelCopy.name = value;
                dispatch({
                    type: SET_OAT_MODELS,
                    payload: modelsCopy
                });
                dispatch({
                    type: SET_OAT_SELECTED_MODEL,
                    payload: { ...selection, contentId: name }
                });
            }
            setName(value);
            setNameEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_MODELS,
                payload: models
            });
            dispatch({
                type: SET_OAT_SELECTED_MODEL,
                payload: selection
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

    return (
        <Stack styles={generalPropertiesWrapStyles}>
            <div className={propertyInspectorStyles.rowSpaceBetween}>
                <Label>{`${t('OATPropertyEditor.general')}`}</Label>
                {model && model['@type'] === OATInterfaceType && (
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
                    {isSupportedModelType && model ? model['@type'] : ''}
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
                        models={models}
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
                            models={models}
                            onCommit={onNameCommit}
                            borderless
                            autoFocus
                        />
                    )}
                </div>
            )}
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
        </Stack>
    );
};

export default PropertiesModelSummary;
