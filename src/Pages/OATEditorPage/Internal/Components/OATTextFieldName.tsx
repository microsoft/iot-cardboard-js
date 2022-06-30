import React, { useState, useEffect, useContext } from 'react';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    DTDLNameRegex,
    IAction,
    ModelTypes,
    OATNameLengthLimit
} from '../../../../Models/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../../Models/Constants/ActionTypes';
import { deepCopy } from '../../../../Models/Services/Utils';
import { IOATEditorState } from '../../OATEditorPage.types';
import { CommandHistoryContext } from '../Context/CommandHistoryContext';

type IOATTexField = {
    autoFocus?: boolean;
    borderless?: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    disabled?: boolean;
    name: string;
    onCommit?: () => void;
    placeholder?: string;
    setName: (value: string) => void;
    state?: IOATEditorState;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    styles?: React.CSSProperties;
};

const OATTextFieldName = ({
    autoFocus,
    borderless,
    name,
    setName,
    disabled,
    dispatch,
    placeholder,
    state,
    onCommit,
    styles
}: IOATTexField) => {
    const { t } = useTranslation();
    const { execute } = useContext(CommandHistoryContext);
    const [nameLengthError, setNameLengthError] = useState(false);
    const [nameValidCharactersError, setNameValidCharactersError] = useState(
        false
    );
    const [
        nameDuplicateInterfaceError,
        setNameDuplicateInterfaceError
    ] = useState(false);
    const [
        nameDuplicateRelationshipError,
        setNameDuplicateRelationshipError
    ] = useState(false);
    const [temporaryName, setTemporaryName] = useState(name);
    const originalValue = name;

    const { model, models } = state;

    useEffect(() => {
        if (model && model.name) {
            setTemporaryName(model.name);
        }
    }, [model]);

    const onChange = (value: string) => {
        // Check length
        if (value.length <= OATNameLengthLimit) {
            setNameLengthError(null);
            setTemporaryName(value);
            // Check format
            if (DTDLNameRegex.test(value)) {
                setNameValidCharactersError(null);
                // Check for duplicate name
                // If model is a relationship, check if name is duplicate to any other relationship
                if (model['@type'] === ModelTypes.relationship) {
                    const repeatedNameOnRelationship = models.find(
                        (queryModel) =>
                            queryModel.contents &&
                            queryModel.contents.find(
                                (content) =>
                                    content.name === value &&
                                    content.name !== originalValue // Prevent checking for duplicate name to itself
                            )
                    );
                    if (!repeatedNameOnRelationship) {
                        setNameDuplicateRelationshipError(false);
                    } else {
                        setNameDuplicateRelationshipError(true);
                    }
                } else {
                    // Check if name is duplicate to any other interface
                    const repeatedNameOnInterface = models.find(
                        (model) =>
                            model.name === value && model.name !== originalValue // Prevent checking for duplicate name to itself
                    );
                    if (repeatedNameOnInterface) {
                        setNameDuplicateInterfaceError(true);
                    } else {
                        setNameDuplicateInterfaceError(false);
                    }
                }
            } else {
                setNameValidCharactersError(true);
            }
        } else {
            setNameLengthError(true);
        }
    };

    const onCommitChange = () => {
        if (
            !nameLengthError &&
            !nameValidCharactersError &&
            !nameDuplicateInterfaceError &&
            !nameDuplicateRelationshipError &&
            temporaryName !== originalValue // Prevent committing if name is not changed
        ) {
            const commit = () => {
                onCommit();
                // Update model
                const modelCopy = deepCopy(model);
                modelCopy.name = temporaryName;
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: modelCopy
                });
                setName(temporaryName);
            };

            const undoCommit = () => {
                dispatch({
                    type: SET_OAT_PROPERTY_EDITOR_MODEL,
                    payload: model
                });
            };

            execute(commit, undoCommit);
        } else {
            setTemporaryName(name);
            setNameDuplicateInterfaceError(false);
            setNameDuplicateRelationshipError(false);
            setNameValidCharactersError(false);
            setNameLengthError(false);
        }
        document.activeElement.blur();
    };

    const onKeyDown = (event: Event) => {
        if (event.key === 'Enter') {
            document.activeElement.blur();
        }
        if (event.key === 'Escape' || event.key === 'Tab') {
            setName(originalValue);
            setTemporaryName(originalValue);
            onCommit();
        }
    };

    const getErrorMessage = () => {
        if (model) {
            return nameLengthError
                ? t('OATPropertyEditor.errorNameLength')
                : nameValidCharactersError
                ? t('OATPropertyEditor.errorName')
                : model['@type'] === ModelTypes.relationship
                ? nameDuplicateRelationshipError
                    ? t('OATPropertyEditor.errorRepeatedEdgeName')
                    : ''
                : nameDuplicateInterfaceError
                ? t('OATPropertyEditor.errorRepeatedName')
                : '';
        }
    };

    return (
        <TextField
            disabled={disabled}
            borderless={borderless}
            placeholder={placeholder}
            styles={styles}
            value={temporaryName}
            onChange={(_ev, value) => {
                onChange(value);
            }}
            errorMessage={getErrorMessage()}
            onKeyDown={onKeyDown}
            onBlur={onCommitChange}
            autoFocus={autoFocus}
        />
    );
};

export default OATTextFieldName;

OATTextFieldName.defaultProps = {
    autoFocus: false,
    borderless: false,
    disabled: false,
    placeholder: '',
    onCommit: () => {
        // Do nothing
    }
};
