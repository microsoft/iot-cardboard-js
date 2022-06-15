import React, { useState } from 'react';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    IAction,
    OATDisplayNameLengthLimit
} from '../../../../Models/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../../Models/Constants/ActionTypes';
import { getModelPropertyListItemName } from '../../../../Components/OATPropertyEditor/Utils';
import { deepCopy } from '../../../../Models/Services/Utils';
import { IOATEditorState } from '../../OATEditorPage.types';

type IOATTexField = {
    autoFocus?: boolean;
    borderless?: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    disabled?: boolean;
    displayName: string;
    onCommitCallback?: () => void;
    onChangeCallback?: () => void;
    placeholder?: string;
    setDisplayName: (value: string) => void;
    state?: IOATEditorState;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    styles?: React.CSSProperties;
};

const OATTextFieldDisplayName = ({
    autoFocus,
    borderless,
    dispatch,
    disabled,
    displayName,
    onChangeCallback,
    onCommitCallback,
    placeholder,
    setDisplayName,
    state,
    styles
}: IOATTexField) => {
    const { t } = useTranslation();
    const [displayNameLengthError, setDisplayNameLengthError] = useState(null);
    const { model } = state;

    const handleOnChange = (value) => {
        // Check length
        if (value.length <= OATDisplayNameLengthLimit) {
            setDisplayNameLengthError(null);
            setDisplayName(value);
            onChangeCallback();
        } else {
            setDisplayNameLengthError(true);
        }
    };

    const onCommitChange = () => {
        if (!displayNameLengthError) {
            // Update model
            const modelCopy = deepCopy(model);
            modelCopy.displayName = displayName;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
        } else {
            setDisplayName(getModelPropertyListItemName(model.displayName));
            setDisplayNameLengthError(false);
        }
        onCommitCallback();
    };

    const onKeyDown = (event) => {
        if (event.key === 'Enter') {
            onCommitChange();
        }
    };

    const getErrorMessage = () => {
        return displayNameLengthError
            ? t('OATPropertyEditor.errorDisplayNameLength')
            : '';
    };

    return (
        <TextField
            disabled={disabled}
            borderless={borderless}
            placeholder={placeholder}
            styles={styles}
            value={getModelPropertyListItemName(displayName)}
            placeholder={placeholder}
            onChange={(_ev, value) => {
                handleOnChange(value);
            }}
            errorMessage={getErrorMessage()}
            onKeyDown={onKeyDown}
            onBlur={onCommitChange}
            autoFocus={autoFocus}
        />
    );
};

export default OATTextFieldDisplayName;

OATTextFieldDisplayName.defaultProps = {
    autoFocus: false,
    borderless: false,
    disabled: false,
    onChangeCallback: () => {
        // Do nothing
    },
    onCommitCallback: () => {
        // Do nothing
    },
    placeholder: ''
};
