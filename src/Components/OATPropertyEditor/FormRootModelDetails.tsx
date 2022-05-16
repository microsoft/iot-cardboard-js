import React, { useState, useEffect } from 'react';
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
    getRadioGroupRowStyles
} from './OATPropertyEditor.styles';
import { SET_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';
import { IOATEditorState } from '../../Pages/OATEditorPage/OATEditorPage.types';
import { deepCopy } from '../../Models/Services/Utils';
import CountryList from '../../Pages/OATEditorPage/Resources/CountryList.json';

const MULTI_LANGUAGE_OPTION_VALUE = 'multiLanguage';
const SINGLE_LANGUAGE_OPTION_VALUE = 'singleLanguage';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    state?: IOATEditorState;
}

enum multiLanguageSelectionType {
    displayName = 'displayName',
    description = 'description'
}

export const FormUpdateProperty = ({
    dispatch,
    setModalOpen,
    setModalBody,
    state
}: IModal) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const columnLeftTextStyles = getModalLabelStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const [comment, setComment] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [description, setDescription] = useState(null);
    const [id, setId] = useState(null);
    const [languageSelection, setLanguageSelection] = useState(
        SINGLE_LANGUAGE_OPTION_VALUE
    );
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
    const { model } = state;

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

    const onLanguageSelect = (
        ev: React.FormEvent<HTMLInputElement>,
        option: IChoiceGroupOption
    ): void => {
        setLanguageSelection(option.key);
    };

    const handleMultiLanguageSelectionsDisplayNameKeyChange = (
        value,
        index = null
    ) => {
        const multiLanguageSelectionsDisplayNamesKeys = Object.keys(
            multiLanguageSelectionsDisplayName
        );
        const key = multiLanguageSelectionsDisplayNamesKeys[index]
            ? multiLanguageSelectionsDisplayNamesKeys[index]
            : value;
        const newMultiLanguageSelectionsDisplayName = {
            ...multiLanguageSelectionsDisplayName,
            [key]: multiLanguageSelectionsDisplayName[value]
                ? multiLanguageSelectionsDisplayName[value]
                : ''
        };

        setMultiLanguageSelectionsDisplayName(
            newMultiLanguageSelectionsDisplayName
        );
    };

    const handleMultiLanguageSelectionsDisplayNameValueChange = (
        index,
        value
    ) => {
        const newMultiLanguageSelectionsDisplayName = {
            ...multiLanguageSelectionsDisplayName,
            [multiLanguageSelectionsDisplayNames[index].key]: value
        };

        setMultiLanguageSelectionsDisplayName(
            newMultiLanguageSelectionsDisplayName
        );
    };

    const handleMultiLanguageSelectionsDescriptionKeyChange = (
        value,
        index = null
    ) => {
        const multiLanguageSelectionsDescriptionsKeys = Object.keys(
            multiLanguageSelectionsDescription
        );
        const key = multiLanguageSelectionsDescriptionsKeys[index]
            ? multiLanguageSelectionsDescriptionsKeys[index]
            : value;
        const newMultiLanguageSelectionsDescription = {
            ...multiLanguageSelectionsDescription,
            [key]: multiLanguageSelectionsDescription[value]
                ? multiLanguageSelectionsDescription[value]
                : ''
        };

        setMultiLanguageSelectionsDescription(
            newMultiLanguageSelectionsDescription
        );
    };

    const handleMultiLanguageSelectionsDescriptionValueChange = (
        index,
        value
    ) => {
        const newMultiLanguageSelectionsDescription = {
            ...multiLanguageSelectionsDescription,
            [multiLanguageSelectionsDescriptions[index].key]: value
        };

        setMultiLanguageSelectionsDescription(
            newMultiLanguageSelectionsDescription
        );
    };

    const handleMultiLanguageSelectionRemoval = (index, type) => {
        if (type === multiLanguageSelectionType.displayName) {
            const newMultiLanguageSelectionsDisplayName = multiLanguageSelectionsDisplayName;
            delete newMultiLanguageSelectionsDisplayName[
                multiLanguageSelectionsDisplayNames[index].key
            ];
            setMultiLanguageSelectionsDisplayName(
                newMultiLanguageSelectionsDisplayName
            );

            const newMultiLanguageSelectionsDisplayNames = [
                ...multiLanguageSelectionsDisplayNames
            ];
            newMultiLanguageSelectionsDisplayNames.splice(index, 1);

            setMultiLanguageSelectionsDisplayNames(
                newMultiLanguageSelectionsDisplayNames
            );
        } else {
            const newMultiLanguageSelectionsDescription = multiLanguageSelectionsDescription;
            delete newMultiLanguageSelectionsDescription[
                multiLanguageSelectionsDescriptions[index].key
            ];
            setMultiLanguageSelectionsDescription(
                newMultiLanguageSelectionsDescription
            );

            const newMultiLanguageSelectionsDescriptions = [
                ...multiLanguageSelectionsDescriptions
            ];
            newMultiLanguageSelectionsDescriptions.splice(index, 1);

            setMultiLanguageSelectionsDescriptions(
                newMultiLanguageSelectionsDescriptions
            );
        }
    };

    const handleFormSubmit = () => {
        const modelCopy = deepCopy(model);
        modelCopy.comment = comment ? comment : model.comment;
        modelCopy.displayName =
            languageSelection === SINGLE_LANGUAGE_OPTION_VALUE
                ? displayName
                : multiLanguageSelectionsDisplayName;
        modelCopy.description =
            languageSelection === SINGLE_LANGUAGE_OPTION_VALUE
                ? description
                : multiLanguageSelectionsDescription;
        modelCopy['@id'] = id ? id : model['@id'];

        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
        setModalOpen(false);
        setModalBody(null);
    };

    // Update multiLanguageSelectionsDisplayNames on every new language change
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
                <Label>
                    {model
                        ? typeof model.displayName === 'string'
                            ? model.displayName
                            : Object.values(model.displayName)[0]
                        : ''}
                </Label>
                <ActionButton onClick={() => setModalOpen(false)}>
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
                    {t('OATPropertyEditor.id')}
                </Text>
                <TextField
                    placeholder={t('OATPropertyEditor.id')}
                    onChange={(_ev, value) => setId(value)}
                />
            </div>

            <div className={propertyInspectorStyles.modalRow}>
                <Text styles={columnLeftTextStyles}>
                    {t('OATPropertyEditor.displayName')}
                </Text>
                <ChoiceGroup
                    defaultSelectedKey={SINGLE_LANGUAGE_OPTION_VALUE}
                    options={options}
                    onChange={onLanguageSelect}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>

            {languageSelection === SINGLE_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        placeholder={t('OATPropertyEditor.displayName')}
                        onChange={(_ev, value) => setDisplayName(value)}
                        value={displayName}
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
                                handleMultiLanguageSelectionRemoval(
                                    index,
                                    multiLanguageSelectionType.displayName
                                )
                            }
                        />
                        <Dropdown
                            placeholder={t('OATPropertyEditor.region')}
                            options={CountryList}
                            onChange={(_ev, option) =>
                                handleMultiLanguageSelectionsDisplayNameKeyChange(
                                    option.key,
                                    index
                                )
                            }
                            value={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.displayName')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                handleMultiLanguageSelectionsDisplayNameValueChange(
                                    index,
                                    value
                                )
                            }
                            disabled={
                                !multiLanguageSelectionsDisplayNames[index].key
                            }
                        />
                    </div>
                ))}

            {languageSelection === MULTI_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.modalRow}>
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

            {languageSelection === SINGLE_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {t('OATPropertyEditor.description')}
                    </Text>
                    <TextField
                        multiline
                        rows={3}
                        placeholder={t(
                            'OATPropertyEditor.modalTextInputPlaceHolderDescription'
                        )}
                        onChange={(_ev, value) => setDescription(value)}
                        value={description}
                    />
                </div>
            )}

            {languageSelection === MULTI_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Text styles={columnLeftTextStyles}>
                        {t('OATPropertyEditor.description')}
                    </Text>
                </div>
            )}

            {languageSelection === MULTI_LANGUAGE_OPTION_VALUE &&
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
                                handleMultiLanguageSelectionRemoval(
                                    index,
                                    multiLanguageSelectionType.description
                                )
                            }
                        />
                        <Dropdown
                            placeholder={t('OATPropertyEditor.region')}
                            options={CountryList}
                            onChange={(_ev, option) =>
                                handleMultiLanguageSelectionsDescriptionKeyChange(
                                    option.key,
                                    index
                                )
                            }
                            value={language.key}
                        />
                        <TextField
                            placeholder={t('OATPropertyEditor.description')}
                            value={language.value}
                            onChange={(_ev, value) =>
                                handleMultiLanguageSelectionsDescriptionValueChange(
                                    index,
                                    value
                                )
                            }
                            disabled={
                                !multiLanguageSelectionsDescriptions[index].key
                            }
                        />
                    </div>
                ))}

            {languageSelection === MULTI_LANGUAGE_OPTION_VALUE && (
                <div className={propertyInspectorStyles.modalRow}>
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
                    onChange={(_ev, value) => setComment(value)}
                />
            </div>

            <div className={propertyInspectorStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATPropertyEditor.update')}
                    allowDisabledFocus
                    onClick={handleFormSubmit}
                />

                <PrimaryButton
                    text={t('OATPropertyEditor.cancel')}
                    allowDisabledFocus
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </>
    );
};

export default FormUpdateProperty;
