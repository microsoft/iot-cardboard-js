import React, { useState, useEffect, useContext } from 'react';
import { TextField } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    IOATTwinModelNodes,
    OATDisplayNameLengthLimit
} from '../../../../Models/Constants';
import { getModelPropertyListItemName } from '../../../../Components/OATPropertyEditor/Utils';

type IOATTexField = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    value: string;
    onCommit?: (value: string) => void;
    onChange?: () => void;
    placeholder?: string;
    model?: IOATTwinModelNodes;
    styles?: React.CSSProperties;
};

const OATTextFieldDisplayName = ({
    autoFocus,
    borderless,
    disabled,
    value,
    onChange,
    onCommit,
    placeholder,
    model,
    styles
}: IOATTexField) => {
    const { t } = useTranslation();
    const [displayNameLengthError, setDisplayNameLengthError] = useState(null);
    const [temporaryValue, setTemporaryValue] = useState(value);

    const onChangeClick = (value: string) => {
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
        setTemporaryValue(value);
    }, [value]);

    const onCommitChange = () => {
        if (!displayNameLengthError) {
            onCommit(temporaryValue);
        } else {
            setTemporaryValue(getModelPropertyListItemName(model.displayName));
            setDisplayNameLengthError(false);
        }
        document.activeElement.blur();
    };

    const onKeyDown = (event: Event) => {
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
