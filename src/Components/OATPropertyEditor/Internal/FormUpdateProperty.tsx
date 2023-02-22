import React, { useState, useEffect, useContext, useMemo } from 'react';
import { CommandHistoryContext } from '../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    TextField,
    Text,
    Toggle,
    ActionButton,
    FontIcon,
    Label,
    ChoiceGroup,
    IconButton,
    Dropdown,
    IChoiceGroupOption,
    IDropdownOption
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getModalLabelStyles,
    getRadioGroupRowStyles
} from '../OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX } from '../../../Models/Constants/ActionTypes';
import { deepCopy } from '../../../Models/Services/Utils';
import { FormUpdatePropertyProps } from './FormUpdateProperty.types';
import { DTDLNameRegex } from '../../../Models/Constants/Constants';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';
import { MultiLanguageSelectionType } from '../../../Models/Constants';
import {
    getTargetFromSelection,
    getModelPropertyCollectionName,
    getNestedPropertyCollectionName,
    getModelPropertyListItemName,
    validateDisplayNameChange,
    setMultiLanguageSelectionRemoval,
    setMultiLanguageSelectionsDisplayNameKey,
    setMultiLanguageSelectionsDisplayNameValue,
    validateDescriptionChange,
    setMultiLanguageSelectionsDescriptionKey,
    validateMultiLanguageSelectionsDescriptionValueChange,
    validateCommentChange
} from '../Utils';
import { useTheme } from '@fluentui/react';

const MULTI_LANGUAGE_OPTION_VALUE = 'multiLanguage';
const SINGLE_LANGUAGE_OPTION_VALUE = 'singleLanguage';
const valueSchemaOptions: IDropdownOption[] = [
    { key: 'integer', text: 'integer' },
    { key: 'string', text: 'string' }
];

export const FormUpdateProperty: React.FC<FormUpdatePropertyProps> = (
    props
) => {
    const { dispatch, onClose, state } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { execute } = useContext(CommandHistoryContext);
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { currentPropertyIndex, currentNestedPropertyIndex } = state;

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles(useTheme());
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const columnLeftTextStyles = getModalLabelStyles();

    // initial state
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
    const nestedPropertyCollectionName = getNestedPropertyCollectionName(
        model[propertiesKeyName][currentPropertyIndex].schema['@type']
    );
    const activeProperty = model[propertiesKeyName][currentPropertyIndex];
    const activeNestedProperty =
        model[propertiesKeyName][currentPropertyIndex].schema[
            nestedPropertyCollectionName
        ] &&
        model[propertiesKeyName][currentPropertyIndex].schema[
            nestedPropertyCollectionName
        ][currentNestedPropertyIndex];
    const targetProperty = activeNestedProperty || activeProperty;

    // state
    const [comment, setComment] = useState('');
    const [name, setName] = useState(targetProperty.name);
    const [enumValue, setEnumValue] = useState(targetProperty.enumValue);
    const [errorRepeatedEnumValue, setErrorRepeatedEnumValue] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [description, setDescription] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [writable, setWritable] = useState(true);
    const [languageSelection, setLanguageSelection] = useState('');
    const [
        languageSelectionDescription,
        setLanguageSelectionDescription
    ] = useState('');
    const [
        multiLanguageSelectionsDisplayName,
        setMultiLanguageSelectionsDisplayName
    ] = useState({});
    const [
        multiLanguageSelectionsDisplayNames,
        setMultiLanguageSelectionsDisplayNames
    ] = useState([]);
    const [
        isAMultiLanguageDisplayNameEmpty,
        setIsAMultiLanguageDisplayNameEmpty
    ] = useState(true);
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
    const [displayNameError, setDisplayNameError] = useState(null);

    const [valueSchema, setValueSchema] = useState(
        activeProperty.schema.valueSchema
            ? activeProperty.schema.valueSchema
            : 'integer'
    );

    useEffect(() => {
        setComment(targetProperty.comment);
        setDescription(targetProperty.description);
        setDisplayName(
            getModelPropertyListItemName(
                targetProperty.displayName || targetProperty.name
            )
        );
        setWritable(targetProperty.writable || true);
        setLanguageSelection(
            !targetProperty.displayName ||
                typeof targetProperty.displayName === 'string'
                ? SINGLE_LANGUAGE_OPTION_VALUE
                : MULTI_LANGUAGE_OPTION_VALUE
        );
        setLanguageSelectionDescription(
            !targetProperty.description ||
                typeof targetProperty.description === 'string'
                ? SINGLE_LANGUAGE_OPTION_VALUE
                : MULTI_LANGUAGE_OPTION_VALUE
        );
        setMultiLanguageSelectionsDisplayName(
            targetProperty.displayName &&
                typeof targetProperty.displayName === 'object'
                ? targetProperty.displayName
                : {}
        );
        setMultiLanguageSelectionsDescription(
            targetProperty.description &&
                typeof targetProperty.description === 'object'
                ? targetProperty.description
                : {}
        );
    }, [model]);

    const options: IChoiceGroupOption[] = [
        {
            key: SINGLE_LANGUAGE_OPTION_VALUE,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDisplayNames.length > 0
        },
        {
            key: MULTI_LANGUAGE_OPTION_VALUE,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    const optionsDescription: IChoiceGroupOption[] = [
        {
            key: SINGLE_LANGUAGE_OPTION_VALUE,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDescriptions.length > 0
        },
        {
            key: MULTI_LANGUAGE_OPTION_VALUE,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    const onLanguageSelect = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelection(option.key);
    };

    const onLanguageSelectDescription = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelectionDescription(option.key);
    };

    const handleUpdatedNestedProperty = () => {
        const update = () => {
            const prop = {
                comment: comment ? comment : activeNestedProperty.comment,
                description:
                    languageSelectionDescription ===
                    SINGLE_LANGUAGE_OPTION_VALUE
                        ? description
                            ? description
                            : activeNestedProperty.description
                        : multiLanguageSelectionsDescription,
                displayName:
                    languageSelection === SINGLE_LANGUAGE_OPTION_VALUE
                        ? displayName
                            ? displayName
                            : activeNestedProperty.name
                        : multiLanguageSelectionsDisplayName,
                writable,
                unit: activeNestedProperty.unit,
                schema: activeNestedProperty.schema,
                name: activeNestedProperty.name
            };

            // Update nested enum value
            if (
                activeNestedProperty &&
                activeProperty.schema['@type'] === 'Enum'
            ) {
                prop.displayName = name;
                prop.name = name;
                // prop.enumValue = enumValue;
            }

            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            modelCopy[propertiesKeyName][currentPropertyIndex].schema[
                nestedPropertyCollectionName
            ][currentNestedPropertyIndex] = prop;

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
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_CURRENT_NESTED_PROPERTY_INDEX,
            payload: null
        });
    };

    const onNameChange = (value) => {
        // Name may only contain the characters a-z, A-Z, 0-9, and underscore.
        if (DTDLNameRegex.test(value)) {
            setNameError(false);
            setName(value);
        } else {
            setNameError(true);
        }
    };

    const onUpdateProperty = () => {
        if (currentNestedPropertyIndex !== null) {
            handleUpdatedNestedProperty();
            return;
        }

        const update = () => {
            const prop = {
                comment: comment ? comment : activeProperty.comment,
                description:
                    languageSelectionDescription ===
                    SINGLE_LANGUAGE_OPTION_VALUE
                        ? description
                            ? description
                            : activeProperty.description
                        : multiLanguageSelectionsDescription
                        ? multiLanguageSelectionsDescription
                        : activeProperty.description,
                displayName:
                    languageSelection === SINGLE_LANGUAGE_OPTION_VALUE
                        ? displayName
                            ? displayName
                            : activeProperty.name
                        : multiLanguageSelectionsDisplayName
                        ? multiLanguageSelectionsDisplayName
                        : activeProperty.name,
                writable,
                '@type': activeProperty['@type'],
                unit: activeProperty.unit,
                schema: activeProperty.schema,
                name: activeProperty.name
            };

            // Set valueSchema if enum
            if (
                targetProperty.schema &&
                targetProperty.schema['@type'] === 'Enum'
            ) {
                prop.schema.valueSchema = valueSchema;
            }

            const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
            const modelCopy = getTargetFromSelection(
                modelsCopy,
                oatPageState.selection
            );
            modelCopy[propertiesKeyName][currentPropertyIndex] = prop;
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

    const onEnumValueChange = (value: string) => {
        const find = activeProperty.schema.enumValues.find(
            (item) => item.enumValue === value
        );

        // If enumValue found, but same value as before, do not set error
        if (find && find.enumValue === targetProperty.enumValue) {
            setEnumValue(value);
            return;
        }

        if (!find && value !== '') {
            setEnumValue(value);
        }

        setErrorRepeatedEnumValue(!!find);
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

        // Check if array of object includes empty values
        const hasEmptyValues = newMultiLanguageSelectionsDisplayNames.some(
            (item) => item.value === ''
        );
        setIsAMultiLanguageDisplayNameEmpty(hasEmptyValues);
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
                <Label>{targetProperty.name}</Label>
                <ActionButton onClick={onClose}>
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                    />
                </ActionButton>
            </div>

            {targetProperty.displayName && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {t('OATPropertyEditor.displayName')}
                    </Text>
                    <ChoiceGroup
                        selectedKey={languageSelection}
                        options={options}
                        onChange={onLanguageSelect}
                        required={true}
                        styles={radioGroupRowStyle}
                    />
                </div>
            )}

            {languageSelection === SINGLE_LANGUAGE_OPTION_VALUE &&
                targetProperty.displayName && (
                    <div className={propertyInspectorStyles.modalRow}>
                        <div></div>
                        {/* Needed for gridTemplateColumns style  */}
                        <TextField
                            placeholder={t(
                                'OATPropertyEditor.modalTextInputPlaceHolder'
                            )}
                            value={displayName}
                            validateOnFocusOut
                            onChange={(e, v) =>
                                validateDisplayNameChange(
                                    v,
                                    setDisplayName,
                                    setDisplayNameError
                                )
                            }
                            errorMessage={
                                displayNameError
                                    ? t('OATPropertyEditor.errorDisplayName')
                                    : ''
                            }
                        />
                    </div>
                )}

            {languageSelection === MULTI_LANGUAGE_OPTION_VALUE &&
                multiLanguageSelectionsDisplayNames.length > 0 &&
                multiLanguageSelectionsDisplayNames.map((language, index) => (
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
                                    MultiLanguageSelectionType.displayName,
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
                            options={oatPageState.languageOptions}
                            onChange={(_ev, option) =>
                                setMultiLanguageSelectionsDisplayNameKey(
                                    option.key,
                                    index,
                                    multiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayName
                                )
                            }
                            defaultSelectedKey={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.displayName')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                setMultiLanguageSelectionsDisplayNameValue(
                                    value,
                                    index,
                                    multiLanguageSelectionsDisplayNames,
                                    multiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayName,
                                    setDisplayNameError
                                )
                            }
                            disabled={
                                !multiLanguageSelectionsDisplayNames[index].key
                            }
                            errorMessage={
                                displayNameError
                                    ? t('OATPropertyEditor.errorDisplayName')
                                    : ''
                            }
                        />
                    </div>
                ))}

            {languageSelection === MULTI_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.regionButton}>
                    <ActionButton
                        disabled={
                            isAMultiLanguageDisplayNameEmpty &&
                            multiLanguageSelectionsDisplayNames.length !== 0
                        }
                        onClick={() => {
                            const newMultiLanguageSelectionsDisplayNames = [
                                ...multiLanguageSelectionsDisplayNames,
                                {
                                    key: '',
                                    value: ''
                                }
                            ];

                            setMultiLanguageSelectionsDisplayNames(
                                newMultiLanguageSelectionsDisplayNames
                            );
                            if (
                                newMultiLanguageSelectionsDisplayNames.length >
                                0
                            ) {
                                setIsAMultiLanguageDisplayNameEmpty(true);
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

            {activeNestedProperty && activeProperty.schema['@type'] === 'Enum' && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {t('OATPropertyEditor.name')}
                    </Text>
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolder'
                        )}
                        onChange={(_ev, value) => onNameChange(value)}
                        errorMessage={
                            nameError
                                ? t('OATPropertyEditor.errorDisplayNameLength')
                                : ''
                        }
                        value={name}
                    />
                </div>
            )}

            {activeNestedProperty && activeProperty.schema['@type'] === 'Enum' && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {`${t('OATPropertyEditor.enumValue')}`}
                    </Text>
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolder'
                        )}
                        type="number"
                        onChange={(_ev, value) => onEnumValueChange(value)}
                        value={enumValue}
                        errorMessage={
                            errorRepeatedEnumValue
                                ? t('OATPropertyEditor.errorRepeatedEnumValue')
                                : ''
                        }
                    />
                </div>
            )}

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.description')}
                </Text>
                <ChoiceGroup
                    selectedKey={languageSelectionDescription}
                    options={optionsDescription}
                    onChange={onLanguageSelectDescription}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>

            {languageSelectionDescription === SINGLE_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolderDescription'
                        )}
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
                        value={description}
                    />
                </div>
            )}

            {languageSelectionDescription === MULTI_LANGUAGE_OPTION_VALUE &&
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
                            options={oatPageState.languageOptions}
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
                            errorMessage={
                                descriptionError
                                    ? t('OATPropertyEditor.errorDescription')
                                    : ''
                            }
                        />
                    </div>
                ))}

            {languageSelectionDescription === MULTI_LANGUAGE_OPTION_VALUE && (
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
                    value={comment}
                />
            </div>

            {targetProperty.schema &&
                targetProperty.schema['@type'] === 'Enum' && (
                    <div className={propertyInspectorStyles.modalRow}>
                        <Text styles={columnLeftTextStyles}>
                            {t('OATPropertyEditor.valueSchema')}
                        </Text>
                        <Dropdown
                            placeholder={t('OATPropertyEditor.valueSchema')}
                            options={valueSchemaOptions}
                            onChange={(_ev, option) =>
                                setValueSchema(option.key)
                            }
                            defaultSelectedKey={valueSchema}
                        />
                    </div>
                )}

            <div className={propertyInspectorStyles.row}>
                <Toggle
                    styles={columnLeftTextStyles}
                    defaultChecked={writable}
                    onChange={() => {
                        setWritable(!writable);
                    }}
                />
                <Text>{t('OATPropertyEditor.writable')}</Text>
            </div>

            <div className={propertyInspectorStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATPropertyEditor.update')}
                    allowDisabledFocus
                    onClick={onUpdateProperty}
                    disabled={
                        displayNameError || commentError || descriptionError
                    }
                />
            </div>
        </>
    );
};

export default FormUpdateProperty;
