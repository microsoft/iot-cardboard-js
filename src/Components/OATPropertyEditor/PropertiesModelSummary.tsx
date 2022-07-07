import React, { useContext, useState, useEffect } from 'react';
import { Stack, Label, Text, IconButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getGeneralPropertiesWrapStyles,
    getPropertyEditorTextFieldStyles,
    geIconWrapFitContentStyles
} from './OATPropertyEditor.styles';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { ModelTypes } from '../../Models/Constants/Enums';
import { FormBody } from './Constants';
import OATTextFieldDisplayName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldDisplayName';
import OATTextFieldName from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldName';
import OATTextFieldId from '../../Pages/OATEditorPage/Internal/Components/OATTextFieldId';
import { deepCopy } from '../../Models/Services/Utils';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { CommandHistoryContext } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

type IPropertiesModelSummary = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
    isSupportedModelType?: boolean;
};

export const PropertiesModelSummary = ({
    dispatch,
    setModalBody,
    setModalOpen,
    state,
    isSupportedModelType
}: IPropertiesModelSummary) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const { model, models } = state;
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = geIconWrapFitContentStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyes = getPropertyEditorTextFieldStyles();
    const [displayName, setDisplayName] = useState(
        model && model.displayName ? model.displayName : ''
    );
    const [name, setName] = useState(model ? model.name : '');
    const [id, setId] = useState(model && model['@id'] ? model['@id'] : '');
    const [idEditor, setIdEditor] = useState(false);
    const [nameEditor, setNameEditor] = useState(false);
    const [displayNameEditor, setDisplayNameEditor] = useState(false);
    useEffect(() => {
        setDisplayName(model && model.displayName ? model.displayName : '');
        setName(model && model.name ? model.name : '');
        setId(model && model['@id'] ? model['@id'] : '');
    }, [model]);

    const onIdCommit = (value) => {
        const commit = () => {
            const modelCopy = deepCopy(model);
            modelCopy['@id'] = value;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
            setId(value);
            setIdEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
            });
        };

        execute(commit, undoCommit);
    };

    const onDisplayNameCommit = (value) => {
        const commit = () => {
            const modelCopy = deepCopy(model);
            modelCopy.displayName = value;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
            setDisplayName(value);
            setDisplayNameEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
            });
        };

        execute(commit, undoCommit);
    };

    const onNameCommit = (value) => {
        const commit = () => {
            const modelCopy = deepCopy(model);
            modelCopy.name = value;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
            setName(value);
            setNameEditor(false);
        };

        const undoCommit = () => {
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: model
            });
        };

        execute(commit, undoCommit);
    };

    return (
        <Stack styles={generalPropertiesWrapStyles}>
            <div className={propertyInspectorStyles.rowSpaceBetween}>
                <Label>{`${t('OATPropertyEditor.general')}`}</Label>
                {model && model['@type'] === ModelTypes.interface && (
                    <IconButton
                        styles={iconWrapStyles}
                        iconProps={{ iconName: 'info' }}
                        title={t('OATPropertyEditor.info')}
                        onClick={() => {
                            setModalBody(FormBody.rootModel);
                            setModalOpen(true);
                        }}
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
                        styles={textFieldStyes}
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
                            styles={textFieldStyes}
                            disabled={!model}
                            value={isSupportedModelType && name}
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
                        className={propertyInspectorStyles.typeTextField}
                        onDoubleClick={() => setDisplayNameEditor(true)}
                    >
                        {displayName.length > 0
                            ? displayName
                            : t('OATPropertyEditor.displayName')}
                    </Text>
                )}
                {displayNameEditor && model && (
                    <OATTextFieldDisplayName
                        styles={textFieldStyes}
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
