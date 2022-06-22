import React, { useState, useEffect } from 'react';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    IAction,
    IOATTwinModelNodes,
    OATDisplayNameLengthLimit
} from '../../../../Models/Constants';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../../../Models/Constants/ActionTypes';
import { getModelPropertyListItemName } from '../../../../Components/OATPropertyEditor/Utils';
import { deepCopy } from '../../../../Models/Services/Utils';

type IOATTexField = {
    autoFocus?: boolean;
    borderless?: boolean;
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    disabled?: boolean;
    displayName: string;
    onCommit?: () => void;
    onChange?: () => void;
    placeholder?: string;
    setDisplayName: (value: string) => void;
    model?: IOATTwinModelNodes;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    styles?: React.CSSProperties;
};

const OATTextFieldDisplayName = ({
    autoFocus,
    borderless,
    dispatch,
    disabled,
    displayName,
    onChange,
    onCommit,
    placeholder,
    setDisplayName,
    model,
    styles
}: IOATTexField) => {
    const { t } = useTranslation();
    const [displayNameLengthError, setDisplayNameLengthError] = useState(null);
    const [temporaryValue, setTemporaryValue] = useState(displayName);

    const onChangeClick = (value) => {
        // Check length
        if (value.length <= OATDisplayNameLengthLimit) {
            setDisplayNameLengthError(null);
            setTemporaryValue(value);
            onChange();
        } else {
            setDisplayNameLengthError(true);
        }
    };

    useEffect(() => {
        setTemporaryValue(displayName);
    }, [displayName]);

    const onCommitChange = () => {
        onCommit();
        if (!displayNameLengthError) {
            // Update model
            const modelCopy = deepCopy(model);
            modelCopy.displayName = temporaryValue;
            dispatch({
                type: SET_OAT_PROPERTY_EDITOR_MODEL,
                payload: modelCopy
            });
            setDisplayName(temporaryValue);
        } else {
            setTemporaryValue(getModelPropertyListItemName(model.displayName));
            setDisplayName(getModelPropertyListItemName(model.displayName));
            setDisplayNameLengthError(false);
        }
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
            value={getModelPropertyListItemName(temporaryValue)}
            placeholder={placeholder}
            onChange={(_ev, value) => {
                onChangeClick(value);
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
    onChange: () => {
        // Do nothing
    },
    onCommit: () => {
        // Do nothing
    },
    placeholder: ''
};
