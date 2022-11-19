import React, { useState, useEffect, useCallback } from 'react';
import {
    ActionButton,
    ChoiceGroup,
    classNamesFunction,
    Dropdown,
    IChoiceGroupOption,
    IconButton,
    Label,
    SpinButton,
    styled,
    TextField
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getRadioGroupRowStyles
} from '../../OATPropertyEditor.styles';
import { MultiLanguageSelectionType } from '../../../../Models/Constants/Enums';
import {
    validateDescriptionChange,
    setMultiLanguageSelectionRemoval,
    setMultiLanguageSelectionsDescriptionKey,
    validateMultiLanguageSelectionsDescriptionValueChange,
    setMultiLanguageSelectionsDisplayNameKey,
    setMultiLanguageSelectionsDisplayNameValue,
    getModelPropertyListItemName,
    isValidComment,
    isValidDisplayName
} from '../../Utils';
import {
    IFormRootModelDetailsContentStyleProps,
    IFormRootModelDetailsContentStyles,
    IModalFormRootModelContentProps
} from './FormRootModelDetailsContent.types';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getStyles } from './FormRootModelDetailsContent.styles';
import {
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../../../Models/Services/DtdlUtils';
import { OAT_RELATIONSHIP_HANDLE_NAME } from '../../../../Models/Constants';
import TooltipCallout from '../../../TooltipCallout/TooltipCallout';
import produce from 'immer';

const SINGLE_LANGUAGE_KEY = 'singleLanguage';
const MULTI_LANGUAGE_KEY = 'multiLanguage';

const getClassNames = classNamesFunction<
    IFormRootModelDetailsContentStyleProps,
    IFormRootModelDetailsContentStyles
>();

export const FormRootModelDetailsContent: React.FC<IModalFormRootModelContentProps> = (
    props
) => {
    const { onUpdateItem, selectedItem, styles } = props;
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
    const [displayName, setDisplayName] = useState(
        getModelPropertyListItemName(selectedItem.displayName)
    );
    const [
        isDisplayNameMultiLanguage,
        setIsDisplayNameMultiLanguage
    ] = useState<boolean>(
        selectedItem.displayName && typeof selectedItem.displayName === 'object'
    );
    const [
        isDescriptionMultiLanguage,
        setIsDescriptionMultiLanguage
    ] = useState<boolean>(
        selectedItem.description && typeof selectedItem.description === 'object'
    );

    const [
        isAMultiLanguageDisplayNameEmpty,
        setIsAMultiLanguageDisplayNameEmpty
    ] = useState(true);
    const [
        multiLanguageSelectionsDisplayNames,
        setMultiLanguageSelectionsDisplayNames
    ] = useState<{ key: string; value: string }[]>([]);
    const [
        multiLanguageSelectionsDescriptions,
        setMultiLanguageSelectionsDescriptions
    ] = useState<{ key: string; value: string }[]>([]);
    const [
        isAMultiLanguageDescriptionEmpty,
        setIsAMultiLanguageDescriptionEmpty
    ] = useState(true);
    const [hasCommentError, setHasCommentError] = useState<boolean>(false);
    const [descriptionError, setDescriptionError] = useState(null);
    const [displayNameError, setHasDisplayNameError] = useState(null);

    // callbacks

    // const onFormSubmit = () => {
    //     const modelCopy = deepCopy(selectedItem);
    //     modelCopy.displayName = !isDisplayNameMultiLanguage
    //         ? displayName
    //             ? displayName
    //             : selectedItem.displayName
    //         : multiLanguageSelectionsDisplayName
    //         ? multiLanguageSelectionsDisplayName
    //         : selectedItem.displayName;
    //     modelCopy.description =
    //         languageSelectionDescription === SINGLE_LANGUAGE_KEY
    //             ? description
    //                 ? description
    //                 : selectedItem.description
    //             : multiLanguageSelectionsDescription
    //             ? multiLanguageSelectionsDescription
    //             : selectedItem.description;

    //     onUpdateItem(modelCopy);
    // };

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
    const displayNameMultiLangOptions: IChoiceGroupOption[] = [
        {
            key: SINGLE_LANGUAGE_KEY,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDisplayNames.length > 0
        },
        {
            key: MULTI_LANGUAGE_KEY,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    const descriptionMultiLangOptions: IChoiceGroupOption[] = [
        {
            key: SINGLE_LANGUAGE_KEY,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageSelectionsDescriptions.length > 0
        },
        {
            key: MULTI_LANGUAGE_KEY,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    // side effects
    // initialize all state variables when the selected item changes
    useEffect(() => {
        setDisplayName(getModelPropertyListItemName(selectedItem.displayName));
        setIsDisplayNameMultiLanguage(
            selectedItem.displayName &&
                typeof selectedItem.displayName === 'object'
        );
        setIsDescriptionMultiLanguage(
            selectedItem.description &&
                typeof selectedItem.description === 'object'
        );
    }, [selectedItem]);

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
            {/* display name */}
            <div className={propertyInspectorStyles.modalRow}>
                <Label className={classNames.label} id={'display-name-label'}>
                    {t('OATPropertyEditor.displayName')}
                </Label>
                <ChoiceGroup
                    aria-labelledby={'display-name-label'}
                    selectedKey={
                        isDisplayNameMultiLanguage
                            ? MULTI_LANGUAGE_KEY
                            : SINGLE_LANGUAGE_KEY
                    }
                    options={displayNameMultiLangOptions}
                    onChange={(_ev, option) =>
                        setIsDisplayNameMultiLanguage(
                            option.key === MULTI_LANGUAGE_KEY
                        )
                    }
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>
            {!isDisplayNameMultiLanguage && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        aria-aria-describedby={'display-name-label'}
                        placeholder={t(
                            'OATPropertyEditor.displayNamePlaceholder'
                        )}
                        onChange={(_e, value) => {
                            if (isValidDisplayName(value)) {
                                setHasDisplayNameError(false);
                                onUpdateItem(
                                    produce((draft) => {
                                        draft.displayName = value;
                                        return draft;
                                    })
                                );
                            } else {
                                setHasDisplayNameError(true);
                            }
                        }}
                        errorMessage={
                            displayNameError
                                ? t('OATPropertyEditor.errorDisplayName')
                                : ''
                        }
                        value={getModelPropertyListItemName(displayName)}
                    />
                </div>
            )}
            {isDisplayNameMultiLanguage &&
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
                                displayNameMultiLangOptions &&
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
                                value &&
                                setMultiLanguageSelectionsDisplayNameValue(
                                    value,
                                    index,
                                    multiLanguageSelectionsDisplayNames,
                                    multiLanguageSelectionsDisplayName,
                                    setMultiLanguageSelectionsDisplayName,
                                    setHasDisplayNameError
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
            {isDisplayNameMultiLanguage && (
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
                    selectedKey={
                        isDescriptionMultiLanguage
                            ? MULTI_LANGUAGE_KEY
                            : SINGLE_LANGUAGE_KEY
                    }
                    options={descriptionMultiLangOptions}
                    onChange={(_ev, option) =>
                        setIsDescriptionMultiLanguage(
                            option.key === MULTI_LANGUAGE_KEY
                        )
                    }
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>
            {!isDescriptionMultiLanguage && (
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
            {isDescriptionMultiLanguage &&
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
            {isDescriptionMultiLanguage && (
                <div className={propertyInspectorStyles.regionButton}>
                    <ActionButton
                        iconProps={{
                            iconName: 'Add',
                            className: propertyInspectorStyles.iconAddProperty
                        }}
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
                        text={t('OATPropertyEditor.region')}
                    />
                </div>
            )}

            {/* comment */}
            <div className={propertyInspectorStyles.modalRow}>
                <Label className={classNames.label}>
                    {t('OATPropertyEditor.comment')}
                </Label>
                <TextField
                    placeholder={t('OATPropertyEditor.commentPlaceholder')}
                    onChange={(_ev, value) => {
                        if (isValidComment(value)) {
                            setHasCommentError(false);
                            onUpdateItem(
                                produce((draft) => {
                                    draft.comment = value;
                                    return draft;
                                })
                            );
                        } else {
                            setHasCommentError(true);
                        }
                    }}
                    errorMessage={
                        hasCommentError
                            ? t('OATPropertyEditor.errorComment')
                            : ''
                    }
                    value={selectedItem.comment}
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
                                onValidateNumber(
                                    String(
                                        isDTDLRelationshipReference(
                                            selectedItem
                                        ) && selectedItem.minMultiplicity
                                    ),
                                    value
                                )
                            }
                            onChange={(_ev, _value) => {
                                onUpdateItem(
                                    produce((draft) => {
                                        if (
                                            isDTDLRelationshipReference(draft)
                                        ) {
                                            // draft.minMultiplicity = Number(
                                            //     value
                                            // );
                                        }
                                    })
                                );
                            }}
                            value={
                                String(
                                    isDTDLRelationshipReference(selectedItem) &&
                                        selectedItem.minMultiplicity
                                ) ?? ''
                            }
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
                                onValidateNumber(
                                    String(
                                        isDTDLRelationshipReference(
                                            selectedItem
                                        ) && selectedItem.maxMultiplicity
                                    ),
                                    value
                                )
                            }
                            onChange={(_ev, value) => {
                                onUpdateItem(
                                    produce((draft) => {
                                        if (
                                            isDTDLRelationshipReference(draft)
                                        ) {
                                            draft.maxMultiplicity = Number(
                                                value
                                            );
                                            return draft;
                                        }
                                    })
                                );
                            }}
                            value={
                                String(
                                    isDTDLRelationshipReference(selectedItem) &&
                                        selectedItem.maxMultiplicity
                                ) ?? ''
                            }
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
                            selectedKey={
                                isDTDLRelationshipReference(selectedItem) &&
                                String(selectedItem.writable ?? false)
                            }
                            options={[
                                { key: 'false', text: t('false') },
                                { key: 'true', text: t('true') }
                            ]}
                            onChange={(_ev, value) =>
                                onUpdateItem(
                                    produce((draft) => {
                                        if (
                                            isDTDLRelationshipReference(draft)
                                        ) {
                                            draft.writable = JSON.parse(
                                                value.key
                                            );
                                            return draft;
                                        }
                                    })
                                )
                            }
                            styles={
                                classNames.subComponentStyles
                                    .writeableChoiceGroup
                            }
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default styled<
    IModalFormRootModelContentProps,
    IFormRootModelDetailsContentStyleProps,
    IFormRootModelDetailsContentStyles
>(FormRootModelDetailsContent, getStyles);
