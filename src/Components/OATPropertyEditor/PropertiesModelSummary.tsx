import React, { useState, useEffect } from 'react';
import { TextField, Stack, Label, Text, IconButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getGeneralPropertiesWrapStyles,
    getPropertyEditorTextFieldStyles,
    geIconWrapFitContentStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { deepCopy } from '../../Models/Services/Utils';
import { getModelPropertyListItemName } from './Utils';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { ModelTypes } from '../../Models/Constants/Enums';
import {
    DTDLNameRegex,
    OATDisplayNameLengthLimit,
    OATNameLengthLimit,
    OATIdLengthLimit,
    DTMIRegex
} from '../../Models/Constants/Constants';
import { FormBody } from './Constants';

type IPropertiesModelSummary = {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
};

export const PropertiesModelSummary = ({
    dispatch,
    setModalBody,
    setModalOpen,
    state
}: IPropertiesModelSummary) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const iconWrapStyles = geIconWrapFitContentStyles();
    const generalPropertiesWrapStyles = getGeneralPropertiesWrapStyles();
    const textFieldStyes = getPropertyEditorTextFieldStyles();
    const [displayNameLengthError, setDisplayNameLengthError] = useState(null);
    const [idLengthError, setIdLengthError] = useState(null);
    const { model, models } = state;
    const [
        errorDisplayNameAlreadyUsed,
        setErrorDisplayNameAlreadyUsed
    ] = useState(null);
    const [errorIdAlreadyUsed, setErrorIdAlreadyUsed] = useState(null);
    const [
        errorRepeatedRelationshipName,
        setErrorRepeatedRelationshipName
    ] = useState(null);
    const [errorNameAlreadyUsed, setErrorNameAlreadyUsed] = useState(null);
    const [nameLengthError, setNameLengthError] = useState(null);
    const [nameValidCharactersError, setNameValidCharactersError] = useState(
        false
    );
    const [idValidDTMIError, setIdValidDTMIError] = useState(null);
    const [displayName, setDisplayName] = useState(
        model && model.displayName ? model.displayName : ''
    );
    const [name, setName] = useState(model && model.name ? model.name : '');
    const [id, setId] = useState(model && model['@id'] ? model['@id'] : '');

    useEffect(() => {
        if (model) {
            setDisplayName(model.displayName);
            setName(model.name);
            setId(model['@id']);
        }
    }, [model]);

    const handleNameChange = (value) => {
        // Check length
        if (value.length <= OATNameLengthLimit) {
            setNameLengthError(null);
            setName(value);
            // Check format/syntax
            if (DTDLNameRegex.test(value)) {
                setNameValidCharactersError(null);
                if (model['@type'] === ModelTypes.relationship) {
                    // Loop over every model's content attribute in the models array, to find a repeated name
                    const repeatedNameOnRelationship = models.find(
                        (model) =>
                            model.contents &&
                            model.contents.find(
                                (content) => content.name === value
                            )
                    );
                    if (!repeatedNameOnRelationship) {
                        setErrorIdAlreadyUsed(null);
                        const modelCopy = deepCopy(model);
                        modelCopy.name = value;
                        dispatch({
                            type: SET_OAT_PROPERTY_EDITOR_MODEL,
                            payload: modelCopy
                        });
                    } else {
                        setErrorRepeatedRelationshipName(true);
                    }
                } else {
                    // Check current value is not used by another model as name within models - checks interfaces
                    const repeatedDisplayNameModel = models.find(
                        (model) => model.name === value
                    );
                    if (repeatedDisplayNameModel) {
                        setErrorNameAlreadyUsed(true);
                    } else {
                        setErrorNameAlreadyUsed(null);
                        // Check repeated name on Relationships
                        const modelCopy = deepCopy(model);
                        modelCopy.name = value;
                        dispatch({
                            type: SET_OAT_PROPERTY_EDITOR_MODEL,
                            payload: modelCopy
                        });
                    }
                }
            } else {
                setNameValidCharactersError(true);
            }
        } else {
            setNameLengthError(true);
        }
    };

    const handleIdChange = (value) => {
        // Check length
        if (value.length <= OATIdLengthLimit) {
            setIdLengthError(null);
            setId(value);
            // Check format/syntax
            if (DTMIRegex.test(value)) {
                setIdValidDTMIError(null);
                // // Check current value is not used by another model as @id within models
                const repeatedIdModel = models.find(
                    (model) => model['@id'] === value
                );
                if (repeatedIdModel) {
                    setErrorIdAlreadyUsed(true);
                } else {
                    setErrorIdAlreadyUsed(null);
                    const modelCopy = deepCopy(model);
                    modelCopy['@id'] = value;
                    dispatch({
                        type: SET_OAT_PROPERTY_EDITOR_MODEL,
                        payload: modelCopy
                    });
                }
            } else {
                setIdValidDTMIError(true);
            }
        } else {
            setIdLengthError(true);
        }
    };

    const handleDisplayNameChange = (value) => {
        //Check length
        if (value.length <= OATDisplayNameLengthLimit) {
            setDisplayNameLengthError(null);
            setDisplayName(value);
            // Check current value is not used by another model as displayName within models
            const repeatedDisplayNameModel = models.find(
                (model) => model.displayName === value
            );
            if (repeatedDisplayNameModel) {
                setErrorDisplayNameAlreadyUsed(true);
            } else {
                setErrorDisplayNameAlreadyUsed(null);
                // Update model
                const modelCopy = deepCopy(model);
                modelCopy.displayName = value;
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: modelCopy
                });
            }
        } else {
            setDisplayNameLengthError(true);
        }
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
                    {model ? model['@type'] : ''}
                </Text>
            </div>
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('id')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!model}
                    value={id}
                    placeholder={t('id')}
                    onChange={(_ev, value) => {
                        handleIdChange(value);
                    }}
                    errorMessage={
                        idLengthError
                            ? t('OATPropertyEditor.errorIdLength')
                            : idValidDTMIError
                            ? t('OATPropertyEditor.errorIdValidDTMI')
                            : errorIdAlreadyUsed
                            ? t('OATPropertyEditor.errorRepeatedId')
                            : ''
                    }
                />
            </div>
            {model && model.name && (
                <div className={propertyInspectorStyles.gridRow}>
                    <Text>{t('name')}</Text>
                    <TextField
                        styles={textFieldStyes}
                        borderless
                        disabled={!model}
                        value={name}
                        placeholder={t('name')}
                        onChange={(_ev, value) => {
                            handleNameChange(value);
                        }}
                        errorMessage={
                            nameLengthError
                                ? t('OATPropertyEditor.errorNameLength')
                                : nameValidCharactersError
                                ? t('OATPropertyEditor.errorName')
                                : errorNameAlreadyUsed
                                ? t('OATPropertyEditor.errorRepeatedName')
                                : errorRepeatedRelationshipName
                                ? t('OATPropertyEditor.errorRepeatedEdgeName')
                                : ''
                        }
                    />
                </div>
            )}
            <div className={propertyInspectorStyles.gridRow}>
                <Text>{t('OATPropertyEditor.displayName')}</Text>
                <TextField
                    styles={textFieldStyes}
                    borderless
                    disabled={!model}
                    value={getModelPropertyListItemName(displayName)}
                    placeholder={t('OATPropertyEditor.displayName')}
                    onChange={(_ev, value) => {
                        handleDisplayNameChange(value);
                    }}
                    errorMessage={
                        displayNameLengthError
                            ? t('OATPropertyEditor.errorDisplayNameLength')
                            : errorDisplayNameAlreadyUsed
                            ? t('OATPropertyEditor.errorRepeatedDisplayName')
                            : ''
                    }
                />
            </div>
        </Stack>
    );
};

export default PropertiesModelSummary;
