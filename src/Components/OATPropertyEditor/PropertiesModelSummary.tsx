import React, { useState, useEffect } from 'react';
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
    const { model } = state;
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

    const onCommit = () => {
        setIdEditor(false);
        setNameEditor(false);
        setDisplayNameEditor(false);
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
                {!idEditor && (
                    <Text
                        className={propertyInspectorStyles.typeTextField}
                        onDoubleClick={() => setIdEditor(true)}
                    >
                        {id}
                    </Text>
                )}
                {idEditor && (
                    <OATTextFieldId
                        placeholder={t('id')}
                        styles={textFieldStyes}
                        disabled={!model}
                        id={isSupportedModelType && id}
                        setId={setId}
                        dispatch={dispatch}
                        state={state}
                        onCommit={onCommit}
                        borderless
                        autoFocus
                    />
                )}
            </div>
            {model && model.name && (
                <div className={propertyInspectorStyles.gridRow}>
                    <Text>{t('name')}</Text>
                    {!nameEditor && (
                        <Text
                            className={propertyInspectorStyles.typeTextField}
                            onDoubleClick={() => setNameEditor(true)}
                        >
                            {name}
                        </Text>
                    )}
                    {nameEditor && (
                        <OATTextFieldName
                            placeholder={t('name')}
                            styles={textFieldStyes}
                            disabled={!model}
                            name={isSupportedModelType && name}
                            setName={setName}
                            dispatch={dispatch}
                            state={state}
                            onCommit={onCommit}
                            borderless
                            autoFocus
                        />
                    )}
                </div>
            )}
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.displayName')}</Text>
                {!displayNameEditor && (
                    <Text
                        className={propertyInspectorStyles.typeTextField}
                        onDoubleClick={() => setDisplayNameEditor(true)}
                    >
                        {displayName}
                    </Text>
                )}
                {displayNameEditor && (
                    <OATTextFieldDisplayName
                        styles={textFieldStyes}
                        borderless
                        placeholder={t('OATPropertyEditor.displayName')}
                        disabled={!model}
                        displayName={isSupportedModelType && displayName}
                        setDisplayName={setDisplayName}
                        dispatch={dispatch}
                        onCommit={onCommit}
                        model={model}
                        autoFocus
                    />
                )}
            </div>
        </Stack>
    );
};

export default PropertiesModelSummary;
