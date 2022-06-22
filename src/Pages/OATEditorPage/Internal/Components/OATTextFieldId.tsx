import React, { useState } from 'react';
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
    onChangeCallback?: () => void;
    onCommitCallback?: () => void;
    placeholder?: string;
    setId: (value: string) => void;
    state?: IOATEditorState;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    styles?: React.CSSProperties;
};

const OATTextFieldId = ({
    autoFocus,
    borderless,
    disabled,
    dispatch,
    id,
    onChangeCallback,
    onCommitCallback,
    placeholder,
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
    const { model, models } = state;
    const originalValue = id;

    const onChange = (value) => {
        // Check length
        if (value.length <= OATIdLengthLimit) {
            setIdLengthError(null);
            setId(value);
            onChangeCallback();
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
        onCommitCallback();
        if (
            !idLengthError &&
            !idAlreadyUsedInterfaceError &&
            !idAlreadyUsedRelationshipError &&
            !validDTMIError
        ) {
            // Update model
            const modelCopy = deepCopy(model);
            modelCopy['@id'] = id;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
        } else {
            setId(model['@id']);
            setIdLengthError(false);
            setIdAlreadyUsedRelationshipError(false);
            setIdAlreadyUsedInterfaceError(false);
            setValidDTMIError(false);
        }
    };

    const onKeyDown = (event) => {
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

    return (
        <TextField
            autoFocus={autoFocus}
            disabled={disabled}
            borderless={borderless}
            placeholder={placeholder}
            styles={styles}
            value={id}
            onChange={(_ev, value) => {
                onChange(value);
            }}
            errorMessage={getErrorMessage()}
            onKeyDown={onKeyDown}
            onBlur={onCommitChange}
        />
    );
};

export default OATTextFieldId;

OATTextFieldId.defaultProps = {
    autoFocus: false,
    borderless: false,
    disabled: false,
    placeholder: '',
    onChangeCallback: () => {
        // Do nothing
    },
    onCommitCallback: () => {
        // Do nothing
    }
};
