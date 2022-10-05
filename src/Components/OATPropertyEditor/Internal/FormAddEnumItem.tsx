import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
    TextField,
    Text,
    ActionButton,
    FontIcon,
    Label,
    ChoiceGroup,
    IconButton,
    Dropdown,
    IChoiceGroupOption
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getModalLabelStyles,
    getRadioGroupRowStyles,
    getModalTextFieldStyles
} from '../OATPropertyEditor.styles';
import { deepCopy } from '../../../Models/Services/Utils';
import { MultiLanguageSelectionType } from '../../../Models/Constants/Enums';
import {
    getModelPropertyCollectionName,
    validateCommentChange,
    validateDescriptionChange,
    setMultiLanguageSelectionRemoval,
    setMultiLanguageSelectionsDescriptionKey,
    getTargetFromSelection
} from '../Utils';
import {
    DTDLNameRegex,
    OAT_NAME_LENGTH_LIMIT
} from '../../../Models/Constants/Constants';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { ModalFormAddEnumItemProps } from './FormAddEnumItem.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

const multiLanguageOptionValue = 'multiLanguage';
const singleLanguageOptionValue = 'singleLanguage';

export const FormAddEnumItem: React.FC<ModalFormAddEnumItemProps> = (props) => {
    const { onClose, state, languages } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const columnLeftTextStyles = getModalLabelStyles();
    const textFieldStyles = getModalTextFieldStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();

    // state
    const [name, setName] = useState('');
    const [enumValue, setEnumValue] = useState('');
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState('');
    const [errorRepeatedEnumValue, setErrorRepeatedEnumValue] = useState(null);
    const [
        languageSelectionDescription,
        setLanguageSelectionDescription
    ] = useState(singleLanguageOptionValue);
    const [
        multiLanguageSelectionsDisplayName,
        setMultiLanguageSelectionsDisplayName
    ] = useState({});
    const [
        multiLanguageSelectionsDisplayNames,
        setMultiLanguageSelectionsDisplayNames
    ] = useState([]);
    const [
        multiLanguageSelectionsDescription,
        setMultiLanguageSelectionsDescription
    ] = useState({});
    const [
        multiLanguageSelectionsDescriptions,
        setMultiLanguageSelectionsDescriptions
    ] = useState([]);
    const [
        isAMultiLanguageDescriptionEmpty,
        setIsAMultiLanguageDescriptionEmpty
    ] = useState(true);
    const [commentError, setCommentError] = useState(null);
    const [descriptionError, setDescriptionError] = useState(null);
    const [nameLengthError, setNameLengthError] = useState(false);
    const [nameValidCharactersError, setNameValidCharactersError] = useState(
        false
    );
    const { currentPropertyIndex } = state;

    // TODO: migrate to `selectedModelTarget`
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const optionsDescription: IChoiceGroupOption[] = [
        {
            key: singleLanguageOptionValue,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDescriptions.length > 0
        },
        {
            key: multiLanguageOptionValue,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    const onLanguageSelectDescription = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelectionDescription(option.key);
    };

    const onAddEnumValue = () => {
        const update = () => {
            const prop = {
                name: name ? name : '',
                description:
                    languageSelectionDescription === singleLanguageOptionValue
                        ? description
                            ? description
                            : ''
                        : multiLanguageSelectionsDescription,
                enumValue: enumValue ? enumValue : '',
                comment: comment ? comment : ''
            };

            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            modelCopy[propertiesKeyName][
                currentPropertyIndex
            ].schema.enumValues.push(prop);

            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: modelsCopy }
            });
        };

        const undoUpdate = () => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_CURRENT_MODELS,
                payload: { models: oatPageState.currentOntologyModels }
            });
        };

        execute(update, undoUpdate);

        onClose();
    };

    const getErrorMessage = (value: string) => {
        const find = model[propertiesKeyName][
            currentPropertyIndex
        ].schema.enumValues.find((item) => item.enumValue === value);
        if (!find && value !== '') {
            setEnumValue(value);
        }

        setErrorRepeatedEnumValue(!!find);

        return find ? `${t('OATPropertyEditor.errorRepeatedEnumValue')}` : '';
    };

    const onNameChange = (value: string) => {
        if (value.length <= OAT_NAME_LENGTH_LIMIT) {
            setNameLengthError(null);
            // Name may only contain the characters a-z, A-Z, 0-9, and underscore.
            if (DTDLNameRegex.test(value)) {
                setNameValidCharactersError(null);
                setName(value);
            } else {
                setNameValidCharactersError(true);
            }
        } else {
            setNameLengthError(true);
        }
    };

    const getNameErrorMessage = () => {
        return nameLengthError
            ? t('OATPropertyEditor.errorNameLength')
            : nameValidCharactersError
            ? t('OATPropertyEditor.errorName')
            : '';
    };
    useEffect(() => {
        // Create an array of the keys and values
        const newMultiLanguageSelectionsDisplayNames = Object.keys(
            multiLanguageSelectionsDisplayName
        ).map((key) => {
            return {
                key,
                value: multiLanguageSelectionsDisplayName[key]
            };
        });

        setMultiLanguageSelectionsDisplayNames(
            newMultiLanguageSelectionsDisplayNames
        );
    }, [multiLanguageSelectionsDisplayName]);

    // Update multiLanguageSelectionsDescriptions on every new language change
    useEffect(() => {
        // Create an array of the keys and values
        const newMultiLanguageSelectionsDescriptions = Object.keys(
            multiLanguageSelectionsDescription
        ).map((key) => {
            return {
                key,
                value: multiLanguageSelectionsDescription[key]
            };
        });

        setMultiLanguageSelectionsDescriptions(
            newMultiLanguageSelectionsDescriptions
        );

        // Check if array of object includes empty values
        const hasEmptyValues = newMultiLanguageSelectionsDescriptions.some(
            (item) => item.value === ''
        );
        setIsAMultiLanguageDescriptionEmpty(hasEmptyValues);
    }, [multiLanguageSelectionsDescription]);

    return (
        <>
            <div className={propertyInspectorStyles.modalRowSpaceBetween}>
                <Label>{t('OATPropertyEditor.addEnumValue')}</Label>
                <ActionButton onClick={onClose}>
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                    />
                </ActionButton>
            </div>

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <ChoiceGroup
                    defaultSelectedKey={singleLanguageOptionValue}
                    options={optionsDescription}
                    onChange={onLanguageSelectDescription}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>

            {languageSelectionDescription === singleLanguageOptionValue && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolderDescription'
                        )}
                        value={description}
                        styles={textFieldStyles}
                        onChange={(_ev, value) =>
                            validateDescriptionChange(
                                value,
                                setDescription,
                                setDescriptionError
                            )
                        }
                        errorMessage={
                            descriptionError
                                ? t('OATPropertyEditor.errorDescription')
                                : ''
                        }
                    />
                </div>
            )}

            {languageSelectionDescription === multiLanguageOptionValue &&
                multiLanguageSelectionsDescriptions.length > 0 &&
                multiLanguageSelectionsDescriptions.map((language, index) => (
                    <div
                        key={index}
                        className={
                            propertyInspectorStyles.modalRowLanguageSelection
                        }
                    >
                        <IconButton
                            iconProps={{ iconName: 'Cancel' }}
                            title={t('OATPropertyEditor.delete')}
                            ariaLabel={t('OATPropertyEditor.delete')}
                            onClick={() =>
                                setMultiLanguageSelectionRemoval(
                                    index,
                                    MultiLanguageSelectionType.description,
                                    multiLanguageSelectionsDisplayName,
                                    multiLanguageSelectionsDisplayNames,
                                    multiLanguageSelectionsDescription,
                                    multiLanguageSelectionsDescriptions,
                                    setMultiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayNames,
                                    setMultiLanguageSelectionsDescription,
                                    setMultiLanguageSelectionsDescriptions
                                )
                            }
                        />
                        <Dropdown
                            placeholder={t('OATPropertyEditor.region')}
                            options={languages}
                            onChange={(_ev, option) =>
                                setMultiLanguageSelectionsDescriptionKey(
                                    option.key,
                                    index,
                                    multiLanguageSelectionsDescription,
                                    setMultiLanguageSelectionsDescription
                                )
                            }
                            defaultSelectedKey={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.description')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                validateMultiLanguageSelectionsDescriptionValueChange(
                                    value,
                                    index,
                                    multiLanguageSelectionsDescription,
                                    multiLanguageSelectionsDescriptions,
                                    setMultiLanguageSelectionsDescription,
                                    setDescriptionError
                                )
                            }
                            disabled={
                                !multiLanguageSelectionsDescriptions[index].key
                            }
                            styles={textFieldStyles}
                            errorMessage={
                                descriptionError
                                    ? t('OATPropertyEditor.errorDescription')
                                    : ''
                            }
                        />
                    </div>
                ))}

            {languageSelectionDescription === multiLanguageOptionValue && (
                <div className={propertyInspectorStyles.regionButton}>
                    <ActionButton
                        disabled={
                            isAMultiLanguageDescriptionEmpty &&
                            multiLanguageSelectionsDescriptions.length !== 0
                        }
                        onClick={() => {
                            const newMultiLanguageSelectionsDescriptions = [
                                ...multiLanguageSelectionsDescriptions,
                                {
                                    key: '',
                                    value: ''
                                }
                            ];

                            setMultiLanguageSelectionsDescriptions(
                                newMultiLanguageSelectionsDescriptions
                            );
                            if (
                                newMultiLanguageSelectionsDescriptions.length >
                                0
                            ) {
                                setIsAMultiLanguageDescriptionEmpty(true);
                            }
                        }}
                    >
                        <FontIcon
                            iconName={'Add'}
                            className={propertyInspectorStyles.iconAddProperty}
                        />
                        <Text>{t('OATPropertyEditor.region')}</Text>
                    </ActionButton>
                </div>
            )}

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.comment')}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    styles={textFieldStyles}
                    onChange={(_ev, value) =>
                        validateCommentChange(
                            value,
                            setComment,
                            setCommentError
                        )
                    }
                    errorMessage={
                        commentError ? t('OATPropertyEditor.errorComment') : ''
                    }
                />
            </div>

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {`*${t('OATPropertyEditor.name')}`}
                </Text>
                <TextField
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    onChange={(_ev, value) => onNameChange(value)}
                    styles={textFieldStyles}
                    errorMessage={getNameErrorMessage()}
                />
            </div>

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {`*${t('OATPropertyEditor.enumValue')}`}
                </Text>
                <TextField
                    className={propertyInspectorStyles.modalTexField}
                    placeholder={t(
                        'OATPropertyEditor.modalTextInputPlaceHolder'
                    )}
                    type="number"
                    validateOnFocusOut
                    onGetErrorMessage={getErrorMessage}
                    styles={textFieldStyles}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATPropertyEditor.update')}
                    allowDisabledFocus
                    onClick={onAddEnumValue}
                    disabled={
                        errorRepeatedEnumValue ||
                        !enumValue ||
                        !name ||
                        nameLengthError ||
                        nameValidCharactersError ||
                        commentError ||
                        descriptionError
                    }
                />
            </div>
        </>
    );
};

export default FormAddEnumItem;
