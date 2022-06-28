import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    DTMIRegex,
    IAction,
    ModelTypes,
    OATIdLengthLimit
} from '../../../../Models/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../../Models/Constants/ActionTypes';
import { deepCopy } from '../../../../Models/Services/Utils';
import { IOATEditorState } from '../../OATEditorPage.types';

type IOATTexField = {
    autoFocus?: boolean;
    borderless?: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    disabled?: boolean;
    id: string;
    onChange?: () => void;
    onCommit?: () => void;
    placeholder?: string;
    setId: (value: string) => void;
    state?: IOATEditorState;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    styles?: React.CSSProperties;
    modalFormCommit?: boolean;
};

const OATTextFieldId = ({
    autoFocus,
    borderless,
    disabled,
    dispatch,
    id,
    onChange,
    onCommit,
    placeholder,
    modalFormCommit,
    setId,
    state,
    styles
}: IOATTexField) => {
    const { t } = useTranslation();
    const [idLengthError, setIdLengthError] = useState(false);
    const [
        idAlreadyUsedInterfaceError,
        setIdAlreadyUsedInterfaceError
    ] = useState(false);
    const [
        idAlreadyUsedRelationshipError,
        setIdAlreadyUsedRelationshipError
    ] = useState(false);
    const [validDTMIError, setValidDTMIError] = useState(false);
    const [temporaryValue, setTemporaryValue] = useState(id);
    const { model, models } = state;
    const originalValue = id;
    const inputRef = useRef(null);

    useEffect(() => {
        setTemporaryValue(id);
    }, [id]);

    const onChangeClick = (value: string) => {
        // Check length
        if (value.length <= OATIdLengthLimit) {
            setIdLengthError(null);
            setTemporaryValue(value);
            onChange();
            // Check format
            if (DTMIRegex.test(value)) {
                setValidDTMIError(null);
                if (model['@type'] === ModelTypes.relationship) {
                    const repeatedIdOnRelationship = models.find(
                        (queryModel) =>
                            queryModel.contents &&
                            queryModel.contents.find(
                                (content) =>
                                    content['@id'] === value &&
                                    content['@id'] !== originalValue // Prevent checking for duplicate name to itself
                            )
                    );
                    if (!repeatedIdOnRelationship) {
                        setIdAlreadyUsedRelationshipError(false);
                    } else {
                        setIdAlreadyUsedRelationshipError(true);
                    }
                } else {
                    // Check current value is not used by another model as @id within models
                    const repeatedIdModel = models.find(
                        (queryModel) =>
                            queryModel['@id'] === value &&
                            queryModel['@id'] !== model['@id']
                    );
                    if (repeatedIdModel) {
                        setIdAlreadyUsedInterfaceError(true);
                    } else {
                        setIdAlreadyUsedInterfaceError(false);
                    }
                }
            } else {
                setValidDTMIError(true);
            }
        } else {
            setIdLengthError(true);
        }
    };

    const onCommitChange = () => {
        if (
            !idLengthError &&
            !idAlreadyUsedInterfaceError &&
            !idAlreadyUsedRelationshipError &&
            !validDTMIError
        ) {
            if (modalFormCommit) {
                setId(temporaryValue);
                return;
            }
            // Update model
            const modelCopy = deepCopy(model);
            modelCopy['@id'] = temporaryValue;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
            setId(temporaryValue);
        } else {
            setTemporaryValue(model['@id']);
            setId(model['@id']);
            setIdLengthError(false);
            setIdAlreadyUsedRelationshipError(false);
            setIdAlreadyUsedInterfaceError(false);
            setValidDTMIError(false);
        }
        onCommit();
    };

    const onKeyDown = (event: Event) => {
        if (event.key === 'Enter') {
            onCommitChange();
        }
    };

    const getErrorMessage = () => {
        if (model) {
            return idLengthError
                ? t('OATPropertyEditor.errorIdLength')
                : validDTMIError
                ? t('OATPropertyEditor.errorIdValidDTMI')
                : idAlreadyUsedInterfaceError || idAlreadyUsedRelationshipError
                ? t('OATPropertyEditor.errorRepeatedId')
                : '';
        }
    };

    const selectIdPath = () => {
        const selectionStart =
            inputRef.current.props.value.lastIndexOf(':') + 1;
        const selectionEnd = inputRef.current.props.value.lastIndexOf(';');
        if (selectionEnd === -1 || selectionStart === 0) {
            return;
        }
        inputRef.current.setSelectionRange(selectionStart, selectionEnd);
    };

    const onFocus = () => {
        if (inputRef.current) {
            selectIdPath();
        }
    };

    useEffect(() => {
        if (inputRef.current && inputRef.current.props.value) {
            selectIdPath();
        }
    }, [inputRef]);

    return (
        <TextField
            autoFocus={autoFocus}
            disabled={disabled}
            borderless={borderless}
            placeholder={placeholder}
            styles={styles}
            value={temporaryValue}
            onChange={(_ev, value) => {
                onChangeClick(value);
            }}
            errorMessage={getErrorMessage()}
            onKeyDown={onKeyDown}
            onBlur={onCommitChange}
            onFocus={onFocus}
            componentRef={inputRef}
        />
    );
};

export default OATTextFieldId;

OATTextFieldId.defaultProps = {
    autoFocus: false,
    borderless: false,
    disabled: false,
    modalFormCommit: false,
    onChange: () => {
        // Do nothing
    },
    onCommit: () => {
        // Do nothing
    },
    placeholder: ''
};
