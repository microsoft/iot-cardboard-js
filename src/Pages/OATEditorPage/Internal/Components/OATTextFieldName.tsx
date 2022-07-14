import React, { useState, useEffect } from 'react';
import {
    IStyleFunctionOrObject,
    ITextFieldStyleProps,
    ITextFieldStyles,
    TextField
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    DTDLNameRegex,
    IOATTwinModelNodes,
    ModelTypes,
    OATNameLengthLimit
} from '../../../../Models/Constants';
import { IOATEditorState } from '../../OATEditorPage.types';

type IOATTextFieldNameProps = {
    autoFocus?: boolean;
    borderless?: boolean;
    disabled?: boolean;
    value: string;
    onCommit?: (value: string) => void;
    placeholder?: string;
    state?: IOATEditorState;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    styles?: IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>;
    model: IOATTwinModelNodes;
    models: IOATTwinModelNodes[];
};

const OATTextFieldName = ({
    autoFocus,
    borderless,
    value,
    disabled,
    placeholder,
    onCommit,
    styles,
    model,
    models
}: IOATTextFieldNameProps) => {
    const { t } = useTranslation();
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
    const [temporaryName, setTemporaryName] = useState(value);
    const originalValue = value;

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
            onCommit(temporaryName);
        } else {
            setTemporaryName(value);
            setNameDuplicateInterfaceError(false);
            setNameDuplicateRelationshipError(false);
            setNameValidCharactersError(false);
            setNameLengthError(false);
        }
        document.activeElement.blur();
    };

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            document.activeElement.blur();
        }
        if (event.key === 'Escape' || event.key === 'Tab') {
            setTemporaryName(originalValue);
            onCommit(temporaryName);
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
