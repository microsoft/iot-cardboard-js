import React, { useState, useEffect, useCallback } from 'react';
import {
    ActionButton,
    ChoiceGroup,
    classNamesFunction,
    Dropdown,
    FontIcon,
    IChoiceGroupOption,
    IconButton,
    Label,
    SpinButton,
    Stack,
    styled,
    Text,
    TextField
} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getRadioGroupRowStyles
} from '../../OATPropertyEditor.styles';
import { deepCopy } from '../../../../Models/Services/Utils';
import { MultiLanguageSelectionType } from '../../../../Models/Constants/Enums';
import {
    validateCommentChange,
    validateDescriptionChange,
    validateDisplayNameChange,
    setMultiLanguageSelectionRemoval,
    setMultiLanguageSelectionsDescriptionKey,
    validateMultiLanguageSelectionsDescriptionValueChange,
    setMultiLanguageSelectionsDisplayNameKey,
    setMultiLanguageSelectionsDisplayNameValue,
    getModelPropertyListItemName
} from '../../Utils';
import {
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles,
    IModalFormRootModelProps
} from './FormRootModelDetails.types';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getStyles } from './FormRootModelDetails.styles';
import ModelPropertyHeader from '../ModelPropertyHeader/ModelPropertyHeader';
import {
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../../../Models/Services/DtdlUtils';
import {
    DtdlRelationship,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../../../Models/Constants';
import TooltipCallout from '../../../TooltipCallout/TooltipCallout';

const multiLanguageOptionValue = 'multiLanguage';
const singleLanguageOptionValue = 'singleLanguage';

const getClassNames = classNamesFunction<
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles
>();

export const FormRootModelDetails: React.FC<IModalFormRootModelProps> = (
    props
) => {
    const { onClose, onSubmit, selectedItem, styles } = props;
    // const isModelSelected = isDTDLModel(selectedItem);
    const isReferenceSelected = isDTDLReference(selectedItem);
    const isRelationshipReference =
        selectedItem?.['@type'] === OAT_RELATIONSHIP_HANDLE_NAME;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageState } = useOatPageContext();

    // data

    // state
    const [comment, setComment] = useState(selectedItem.comment);
    const [displayName, setDisplayName] = useState(
        getModelPropertyListItemName(selectedItem.displayName)
    );
    const [description, setDescription] = useState(selectedItem.description);
    const [languageSelection, setLanguageSelection] = useState(
        !selectedItem.displayName ||
            typeof selectedItem.displayName === 'string'
            ? singleLanguageOptionValue
            : multiLanguageOptionValue
    );
    const [
        languageSelectionDescription,
        setLanguageSelectionDescription
    ] = useState(
        !selectedItem.description ||
            typeof selectedItem.description === 'string'
            ? singleLanguageOptionValue
            : multiLanguageOptionValue
    );
    const [
        multiLanguageSelectionsDisplayName,
        setMultiLanguageSelectionsDisplayName
    ] = useState(
        selectedItem.displayName && typeof selectedItem.displayName === 'object'
            ? selectedItem.displayName
            : {}
    );
    const [
        multiLanguageSelectionsDescription,
        setMultiLanguageSelectionsDescription
    ] = useState(
        selectedItem.description && typeof selectedItem.description === 'object'
            ? selectedItem.description
            : {}
    );
    const [
        isAMultiLanguageDisplayNameEmpty,
        setIsAMultiLanguageDisplayNameEmpty
    ] = useState(true);
    const [
        multiLanguageSelectionsDisplayNames,
        setMultiLanguageSelectionsDisplayNames
    ] = useState([]);
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
    const [minMultiplicity, setMinMultiplicity] = useState<string>(null);
    const [maxMultiplicity, setMaxMultiplicity] = useState<string>(null);
    const [writeable, setWriteable] = useState<boolean>(null);

    // callbacks
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

    const onFormSubmit = () => {
        const modelCopy = deepCopy(selectedItem);
        modelCopy.comment = comment ? comment : selectedItem.comment;
        modelCopy.displayName =
            languageSelection === singleLanguageOptionValue
                ? displayName
                    ? displayName
                    : selectedItem.displayName
                : multiLanguageSelectionsDisplayName
                ? multiLanguageSelectionsDisplayName
                : selectedItem.displayName;
        modelCopy.description =
            languageSelectionDescription === singleLanguageOptionValue
                ? description
                    ? description
                    : selectedItem.description
                : multiLanguageSelectionsDescription
                ? multiLanguageSelectionsDescription
                : selectedItem.description;
        if (
            isDTDLRelationshipReference(selectedItem) &&
            isDTDLRelationshipReference(modelCopy)
        ) {
            // if (!isNaN(Number(minMultiplicity))) {
            //     modelCopy.minMultiplicity = Number(minMultiplicity);
            // }
            if (!isNaN(Number(maxMultiplicity))) {
                modelCopy.maxMultiplicity = Number(maxMultiplicity);
            }
            modelCopy.writable = writeable;
        }

        onSubmit(modelCopy);
        onClose();
    };

    const onValidateNumber = useCallback(
        (currentValue: string, newValue: string) => {
            if (!newValue || newValue.trim() === '') {
                return null;
            }

            const number = Number(newValue.trim());
            if (!isNaN(number)) {
                return newValue;
            }
            return currentValue;
        },
        []
    );

    // data
    const options: IChoiceGroupOption[] = [
        {
            key: singleLanguageOptionValue,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDisplayNames.length > 0
        },
        {
            key: multiLanguageOptionValue,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

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

    // side effects
    // initialize all state variables when the selected item changes
    useEffect(() => {
        setComment(selectedItem.comment);
        setDisplayName(getModelPropertyListItemName(selectedItem.displayName));
        setDescription(selectedItem.description);
        setLanguageSelection(
            !selectedItem.displayName ||
                typeof selectedItem.displayName === 'string'
                ? singleLanguageOptionValue
                : multiLanguageOptionValue
        );
        setLanguageSelectionDescription(
            !selectedItem.description ||
                typeof selectedItem.description === 'string'
                ? singleLanguageOptionValue
                : multiLanguageOptionValue
        );
        setMultiLanguageSelectionsDisplayName(
            selectedItem.displayName &&
                typeof selectedItem.displayName === 'object'
                ? selectedItem.displayName
                : {}
        );
        setMultiLanguageSelectionsDescription(
            selectedItem.description &&
                typeof selectedItem.description === 'object'
                ? selectedItem.description
                : {}
        );
        setMinMultiplicity(
            isRelationshipReference
                ? String((selectedItem as DtdlRelationship).minMultiplicity) ??
                      '0' // DTDL default
                : null
        );
        setMaxMultiplicity(
            isRelationshipReference
                ? String((selectedItem as DtdlRelationship).maxMultiplicity)
                : null
        );
        setWriteable(
            isRelationshipReference
                ? (selectedItem as DtdlRelationship).writable ?? false // DTDL default
                : null
        );
    }, [isRelationshipReference, selectedItem]);

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

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <Stack
                horizontal
                className={propertyInspectorStyles.modalRowSpaceBetween}
            >
                <ModelPropertyHeader
                    entityId={selectedItem?.['@id']}
                    entityName={displayName}
                    entityType={selectedItem['@type']?.toString() || ''}
                />
                <ActionButton onClick={onClose}>
                    <FontIcon
                        iconName={'ChromeClose'}
                        className={
                            propertyInspectorStyles.iconClosePropertySelector
                        }
                    />
                </ActionButton>
            </Stack>

            {/* display name */}
            <div className={propertyInspectorStyles.modalRow}>
                <Label className={classNames.label} id={'display-name-label'}>
                    {t('OATPropertyEditor.displayName')}
                </Label>
                <ChoiceGroup
                    aria-labelledby={'display-name-label'}
                    selectedKey={languageSelection}
                    options={options}
                    onChange={onLanguageSelect}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>
            {languageSelection === singleLanguageOptionValue && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        aria-aria-describedby={'display-name-label'}
                        placeholder={t(
                            'OATPropertyEditor.displayNamePlaceholder'
                        )}
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
                        value={getModelPropertyListItemName(displayName)}
                    />
                </div>
            )}
            {languageSelection === multiLanguageOptionValue &&
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
                            id={`display-name-language-selector-${index}`}
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
                            aria-aria-describedby={`display-name-label display-name-language-selector-${index}`}
                            placeholder={t(
                                'OATPropertyEditor.displayNamePlaceholder'
                            )}
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
            {languageSelection === multiLanguageOptionValue && (
                <div className={propertyInspectorStyles.regionButton}>
                    <ActionButton
                        iconProps={{
                            iconName: 'Add',
                            className: propertyInspectorStyles.iconAddProperty
                        }}
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
                        text={t('OATPropertyEditor.region')}
                    />
                </div>
            )}

            {/* description */}
            <div className={propertyInspectorStyles.modalRow}>
                <Label className={classNames.label} id={'description-label'}>
                    {t('OATPropertyEditor.description')}
                </Label>
                <ChoiceGroup
                    aria-labelledby={'description-label'}
                    selectedKey={languageSelectionDescription}
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
                        aria-labelledby={'description-label'}
                        multiline
                        rows={3}
                        placeholder={t(
                            'OATPropertyEditor.descriptionPlaceholder'
                        )}
                        value={getModelPropertyListItemName(description)}
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
                            id={`description-language-selector-${index}`}
                            aria-labelledby={'description-label'}
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
                            aria-describedby={`description-label description-language-selector-${index}`}
                            placeholder={t(
                                'OATPropertyEditor.descriptionPlaceholder'
                            )}
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

            {/* comment */}
            <div className={propertyInspectorStyles.modalRow}>
                <Label className={classNames.label}>
                    {t('OATPropertyEditor.comment')}
                </Label>
                <TextField
                    placeholder={t('OATPropertyEditor.commentPlaceholder')}
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

            {/* reference specific properties */}
            {isReferenceSelected && isRelationshipReference && (
                <>
                    <div className={propertyInspectorStyles.modalRow}>
                        <div className={classNames.labelWithTooltip}>
                            <Label id={'minMultiplicityLabel'}>
                                {t('OATPropertyEditor.minMultiplicityLabel')}
                            </Label>
                            <TooltipCallout
                                content={{
                                    calloutContent: t(
                                        'OATPropertyEditor.minMultiplicityMessage'
                                    ),
                                    buttonAriaLabel: t(
                                        'OATPropertyEditor.minMultiplicityMessage'
                                    )
                                }}
                            />
                        </div>
                        <SpinButton
                            aria-labelledby={'minMultiplicityLabel'}
                            decrementButtonAriaLabel={t('decreaseBy1')}
                            incrementButtonAriaLabel={t('increaseBy1')}
                            disabled // this is always 0 in V2 so just lock it for now
                            onValidate={(value) =>
                                onValidateNumber(minMultiplicity, value)
                            }
                            onChange={(_ev, value) => {
                                setMinMultiplicity(value);
                            }}
                            value={minMultiplicity}
                        />
                    </div>
                    <div className={propertyInspectorStyles.modalRow}>
                        <Label
                            id={'maxMultiplicityLabel'}
                            className={classNames.label}
                        >
                            {t('OATPropertyEditor.maxMultiplicityLabel')}
                        </Label>
                        <SpinButton
                            aria-labelledby={'maxMultiplicityLabel'}
                            decrementButtonAriaLabel={t('decreaseBy1')}
                            incrementButtonAriaLabel={t('increaseBy1')}
                            onValidate={(value) =>
                                onValidateNumber(maxMultiplicity, value)
                            }
                            onChange={(_ev, value) => {
                                setMaxMultiplicity(value);
                            }}
                            value={maxMultiplicity ?? ''}
                        />
                    </div>
                    <div className={propertyInspectorStyles.modalRow}>
                        <Label
                            id={'writeableLabel'}
                            className={classNames.label}
                        >
                            {t('OATPropertyEditor.writable')}
                        </Label>
                        <ChoiceGroup
                            aria-labelledby={'writeableLabel'}
                            selectedKey={String(writeable)}
                            options={[
                                { key: 'false', text: t('false') },
                                { key: 'true', text: t('true') }
                            ]}
                            onChange={(_ev, value) =>
                                setWriteable(JSON.parse(value.key))
                            }
                            styles={
                                classNames.subComponentStyles
                                    .writeableChoiceGroup
                            }
                        />
                    </div>
                </>
            )}

            {/* footer */}
            <div className={propertyInspectorStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATPropertyEditor.update')}
                    allowDisabledFocus
                    onClick={onFormSubmit}
                    disabled={
                        displayNameError || commentError || descriptionError
                    }
                />

                <PrimaryButton
                    text={t('OATPropertyEditor.cancel')}
                    allowDisabledFocus
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

export default styled<
    IModalFormRootModelProps,
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles
>(FormRootModelDetails, getStyles);
