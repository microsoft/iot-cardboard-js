import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    TextField,
    Text,
    Stack,
    DirectionalHint
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getRadioGroupRowStyles
} from '../../../../OATPropertyEditor.styles';
import {
    getModelPropertyListItemName,
    isValidComment,
    isValidDisplayName,
    getDisplayName,
    isValidDescription
} from '../../../../Utils';
import {
    IPropertyDetailsEditorModalContentStyleProps,
    IPropertyDetailsEditorModalContentStyles,
    IModalFormRootModelContentProps
} from './PropertyDetailsEditorModalContent.types';
import { useOatPageContext } from '../../../../../../Models/Context/OatPageContext/OatPageContext';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { getStyles } from './PropertyDetailsEditorModalContent.styles';
import {
    contextHasVersion2,
    getDtdlVersionFromContext,
    getModelOrParentContext,
    isDTDLModel,
    isDTDLReference,
    isDTDLRelationshipReference,
    updateDtdlVersion
} from '../../../../../../Models/Services/DtdlUtils';
import {
    DOCUMENTATION_LINKS,
    DtdlInterface,
    OAT_RELATIONSHIP_HANDLE_NAME
} from '../../../../../../Models/Constants';
import TooltipCallout from '../../../../../TooltipCallout/TooltipCallout';
import produce from 'immer';
import {
    getDebugLogger,
    isDefined
} from '../../../../../../Models/Services/Utils';
import Version3UpgradeButton from '../../../Version3UpgradeButton/Version3UpgradeButton';
import { DTDL_CONTEXT_VERSION_3 } from '../../../../../../Models/Classes/DTDL';
import useTelemetry from '../../../../../../Models/Hooks/useTelemetry';
import { TelemetryTrigger } from '../../../../../../Models/Constants/TelemetryConstants';
import {
    AppRegion,
    ComponentName,
    TelemetryEvents
} from '../../../../../../Models/Constants/OatTelemetryConstants';

const SINGLE_LANGUAGE_KEY = 'singleLanguage';
const MULTI_LANGUAGE_KEY = 'multiLanguage';
const PLACEHOLDER_LANGUAGE = 'unset';

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'PropertyDetailsEditorModalContent',
    debugLogging
);

const getClassNames = classNamesFunction<
    IPropertyDetailsEditorModalContentStyleProps,
    IPropertyDetailsEditorModalContentStyles
>();

const PropertyDetailsEditorModalContent: React.FC<IModalFormRootModelContentProps> = (
    props
) => {
    const { onUpdateItem, selectedItem, styles } = props;
    const isReferenceSelected = isDTDLReference(selectedItem);
    const isRelationshipReference =
        selectedItem?.['@type'] === OAT_RELATIONSHIP_HANDLE_NAME;

    // hooks
    const { t } = useTranslation();
    const { sendEventTelemetry } = useTelemetry();

    // contexts
    const { oatPageState } = useOatPageContext();

    // data

    // state
    const isDisplayNameMultiLanguage =
        selectedItem.displayName &&
        typeof selectedItem.displayName === 'object';
    const isDescriptionMultiLanguage =
        selectedItem.description &&
        typeof selectedItem.description === 'object';

    const modelContext = useMemo(() => {
        return getModelOrParentContext(
            selectedItem,
            oatPageState.currentOntologyModels,
            oatPageState.selection
        );
    }, [
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        selectedItem
    ]);

    const [
        isAMultiLanguageDisplayNameEmpty,
        setIsAMultiLanguageDisplayNameEmpty
    ] = useState(true);
    const multiLanguageDisplayNames = useMemo(
        () =>
            typeof selectedItem.displayName === 'object'
                ? Object.keys(selectedItem.displayName)
                : [],
        [selectedItem.displayName]
    );
    const multiLanguageDescriptions = useMemo(
        () =>
            typeof selectedItem.description === 'object'
                ? Object.keys(selectedItem.description)
                : [],
        [selectedItem.description]
    );
    const [
        isAMultiLanguageDescriptionEmpty,
        setIsAMultiLanguageDescriptionEmpty
    ] = useState(true);
    const [hasCommentError, setHasCommentError] = useState<boolean>(false);
    const [hasDescriptionError, setHasDescriptionError] = useState(null);
    const [displayNameError, setHasDisplayNameError] = useState(null);

    // callbacks
    const onValidateNumber = useCallback(
        (currentValue: string, newValue: string) => {
            if (!isDefined(newValue) || newValue.trim() === '') {
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
    const onUpgradeVersion = useCallback(() => {
        onUpdateItem(
            produce((draft) => {
                return updateDtdlVersion(
                    draft as DtdlInterface,
                    DTDL_CONTEXT_VERSION_3
                );
            })
        );
        sendEventTelemetry({
            name: TelemetryEvents.upgradeModelVersion,
            triggerType: TelemetryTrigger.UserAction,
            appRegion: AppRegion.OAT,
            componentName: ComponentName.OAT
        });
    }, [onUpdateItem, sendEventTelemetry]);

    // data
    const displayNameMultiLangOptions: IChoiceGroupOption[] = [
        {
            key: SINGLE_LANGUAGE_KEY,
            text: t('OATPropertyEditor.singleLanguage'),
            disabled: multiLanguageDisplayNames.length > 0
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
            disabled: multiLanguageDescriptions.length > 0
        },
        {
            key: MULTI_LANGUAGE_KEY,
            text: t('OATPropertyEditor.multiLanguage')
        }
    ];

    // side effects
    // Update multiLanguageSelectionsDisplayNames on every new language change
    useEffect(() => {
        if (typeof selectedItem.displayName === 'object') {
            // Check if array of object includes empty values
            const hasEmptyValues = multiLanguageDisplayNames.some(
                (language) => selectedItem.displayName[language] === ''
            );
            setIsAMultiLanguageDisplayNameEmpty(hasEmptyValues);
        }
    }, [multiLanguageDisplayNames, selectedItem.displayName]);

    // Update multiLanguageSelectionsDescriptions on every new language change
    useEffect(() => {
        if (typeof selectedItem.description === 'object') {
            // Check if array of object includes empty values
            const hasEmptyValues = multiLanguageDescriptions.some(
                (language) => selectedItem.description[language] === ''
            );
            setIsAMultiLanguageDescriptionEmpty(hasEmptyValues);
        }
    }, [multiLanguageDescriptions, selectedItem.description]);

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const radioGroupRowStyle = getRadioGroupRowStyles();
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render. {selectedItem}', selectedItem);

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
                    onChange={(_ev, option) => {
                        const isMultiLang = option.key === MULTI_LANGUAGE_KEY;
                        onUpdateItem(
                            produce((draft) => {
                                draft.displayName = isMultiLang ? {} : '';
                                return draft;
                            })
                        );
                    }}
                    required={true}
                    styles={radioGroupRowStyle}
                />
            </div>
            {!isDisplayNameMultiLanguage && (
                <div className={propertyInspectorStyles.modalRow}>
                    <div></div> {/* Needed for gridTemplateColumns style  */}
                    <TextField
                        aria-describedby={'display-name-label'}
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
                        value={getDisplayName(selectedItem.displayName)}
                    />
                </div>
            )}
            {isDisplayNameMultiLanguage &&
                multiLanguageDisplayNames.length > 0 &&
                multiLanguageDisplayNames.map((language, index) => {
                    return (
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
                                onClick={() => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            delete draft.displayName[language];
                                            return draft;
                                        })
                                    );
                                }}
                            />
                            <Dropdown
                                id={`display-name-language-selector-${index}`}
                                placeholder={t('OATPropertyEditor.region')}
                                options={oatPageState.languageOptions}
                                onChange={(_ev, option) => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            // if this was the first language, remove the placeholder
                                            if (
                                                language ===
                                                PLACEHOLDER_LANGUAGE
                                            ) {
                                                delete draft.displayName[
                                                    PLACEHOLDER_LANGUAGE
                                                ];
                                            }
                                            draft.displayName[option.key] = '';
                                            return draft;
                                        })
                                    );
                                }}
                                selectedKey={language}
                            />
                            <TextField
                                aria-describedby={`display-name-label display-name-language-selector-${index}`}
                                placeholder={t(
                                    'OATPropertyEditor.displayNamePlaceholder'
                                )}
                                value={selectedItem.displayName[language]}
                                onChange={(_ev, value) => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            draft.displayName[language] = value;
                                            return draft;
                                        })
                                    );
                                }}
                                disabled={
                                    !language ||
                                    language === PLACEHOLDER_LANGUAGE
                                }
                                errorMessage={
                                    displayNameError
                                        ? t(
                                              'OATPropertyEditor.errorDisplayName'
                                          )
                                        : ''
                                }
                            />
                        </div>
                    );
                })}
            {isDisplayNameMultiLanguage && (
                <div className={propertyInspectorStyles.regionButton}>
                    <ActionButton
                        iconProps={{
                            iconName: 'Add',
                            className: propertyInspectorStyles.iconAddProperty
                        }}
                        disabled={
                            isAMultiLanguageDisplayNameEmpty &&
                            multiLanguageDisplayNames.length !== 0
                        }
                        onClick={() => {
                            onUpdateItem(
                                produce((draft) => {
                                    draft.displayName[PLACEHOLDER_LANGUAGE] =
                                        '';
                                    return draft;
                                })
                            );
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
                    onChange={(_ev, option) => {
                        const isMultiLang = option.key === MULTI_LANGUAGE_KEY;
                        onUpdateItem(
                            produce((draft) => {
                                draft.description = isMultiLang ? {} : '';
                                logDebugConsole(
                                    'debug',
                                    `Setting description name multi-lange to ${isMultiLang}. {displayName}`,
                                    draft.description
                                );
                                return draft;
                            })
                        );
                    }}
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
                        value={getModelPropertyListItemName(
                            selectedItem.description
                        )}
                        onChange={(_ev, value) => {
                            if (isValidDescription(value)) {
                                setHasDescriptionError(false);
                                onUpdateItem(
                                    produce((draft) => {
                                        draft.description = value;
                                        return draft;
                                    })
                                );
                            } else {
                                setHasDescriptionError(true);
                            }
                        }}
                        errorMessage={
                            hasDescriptionError
                                ? t('OATPropertyEditor.errorDescription')
                                : ''
                        }
                    />
                </div>
            )}
            {isDescriptionMultiLanguage &&
                multiLanguageDescriptions.length > 0 &&
                multiLanguageDescriptions.map((language, index) => (
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
                            onClick={() => {
                                onUpdateItem(
                                    produce((draft) => {
                                        delete draft.description[language];
                                        return draft;
                                    })
                                );
                            }}
                        />
                        <Dropdown
                            id={`description-language-selector-${index}`}
                            aria-labelledby={'description-label'}
                            placeholder={t('OATPropertyEditor.region')}
                            options={oatPageState.languageOptions}
                            onChange={(_ev, option) => {
                                onUpdateItem(
                                    produce((draft) => {
                                        // if this was the first language, remove the placeholder
                                        if (language === PLACEHOLDER_LANGUAGE) {
                                            delete draft.description[
                                                PLACEHOLDER_LANGUAGE
                                            ];
                                        }
                                        draft.description[option.key] = '';
                                        return draft;
                                    })
                                );
                            }}
                            selectedKey={language}
                        />
                        <TextField
                            aria-describedby={`description-label description-language-selector-${index}`}
                            placeholder={t(
                                'OATPropertyEditor.descriptionPlaceholder'
                            )}
                            value={selectedItem.description[language]}
                            onChange={(_ev, value) => {
                                onUpdateItem(
                                    produce((draft) => {
                                        draft.description[language] = value;
                                        return draft;
                                    })
                                );
                            }}
                            disabled={
                                !language || language === PLACEHOLDER_LANGUAGE
                            }
                            errorMessage={
                                hasDescriptionError
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
                            multiLanguageDescriptions.length !== 0
                        }
                        onClick={() => {
                            onUpdateItem(
                                produce((draft) => {
                                    draft.description[PLACEHOLDER_LANGUAGE] =
                                        '';
                                    return draft;
                                })
                            );
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

            {/* version */}
            {isDTDLModel(selectedItem) && (
                <div className={propertyInspectorStyles.modalRow}>
                    <Stack className={classNames.label} horizontal>
                        <Label>{t('OATPropertyEditor.contextVersion')}</Label>
                        <TooltipCallout
                            content={{
                                calloutContent: t(
                                    'OATPropertyEditor.contextVersion3Description'
                                ),
                                buttonAriaLabel: t('learnMore'),
                                link: {
                                    url:
                                        DOCUMENTATION_LINKS.ontologyConceptsVersions,
                                    text: t('learn more')
                                }
                            }}
                            calloutProps={{
                                directionalHint: DirectionalHint.bottomAutoEdge
                            }}
                        />
                    </Stack>
                    <Stack
                        className={classNames.contextVersionValue}
                        horizontal
                        tokens={{ childrenGap: 8 }}
                    >
                        <Text>{getDtdlVersionFromContext(modelContext)}</Text>
                        {contextHasVersion2(modelContext) && (
                            <Version3UpgradeButton
                                onUpgrade={onUpgradeVersion}
                            />
                        )}
                    </Stack>
                </div>
            )}

            {/* reference specific properties */}
            {isReferenceSelected && isRelationshipReference && (
                <>
                    <div className={propertyInspectorStyles.modalRow}>
                        <div className={classNames.labelWithTooltip}>
                            <Label id={'minMultiplicityLabel'}>
                                {t('OATPropertyEditor.minMultiplicityLabel')}
                            </Label>
                            {contextHasVersion2(modelContext) && (
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
                            )}
                        </div>
                        <div className={classNames.splitInputColumn}>
                            <SpinButton
                                aria-labelledby={'minMultiplicityLabel'}
                                decrementButtonAriaLabel={t('decreaseBy1')}
                                incrementButtonAriaLabel={t('increaseBy1')}
                                min={0}
                                disabled={contextHasVersion2(modelContext)} // this is always 0 in V2
                                onValidate={(value) =>
                                    onValidateNumber(
                                        isDTDLRelationshipReference(
                                            selectedItem
                                        ) &&
                                            isDefined(
                                                selectedItem.minMultiplicity
                                            )
                                            ? String(
                                                  selectedItem.minMultiplicity
                                              )
                                            : '',
                                        value
                                    )
                                }
                                onChange={(_ev, value) => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            if (
                                                isDTDLRelationshipReference(
                                                    draft
                                                )
                                            ) {
                                                draft.minMultiplicity = Number(
                                                    value
                                                );
                                            }
                                        })
                                    );
                                }}
                                value={
                                    isDTDLRelationshipReference(selectedItem) &&
                                    isDefined(selectedItem.minMultiplicity)
                                        ? String(selectedItem.minMultiplicity)
                                        : ''
                                }
                            />
                            <ActionButton
                                text={t('clear')}
                                disabled={contextHasVersion2(modelContext)} // this is always 0 in V2
                                onClick={() => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            if (
                                                isDTDLRelationshipReference(
                                                    draft
                                                )
                                            ) {
                                                delete draft.minMultiplicity;
                                                return draft;
                                            }
                                        })
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className={propertyInspectorStyles.modalRow}>
                        <Label
                            id={'maxMultiplicityLabel'}
                            className={classNames.label}
                        >
                            {t('OATPropertyEditor.maxMultiplicityLabel')}
                        </Label>
                        <div className={classNames.splitInputColumn}>
                            <SpinButton
                                aria-labelledby={'maxMultiplicityLabel'}
                                decrementButtonAriaLabel={t('decreaseBy1')}
                                incrementButtonAriaLabel={t('increaseBy1')}
                                min={0}
                                onValidate={(value) =>
                                    onValidateNumber(
                                        isDTDLRelationshipReference(
                                            selectedItem
                                        ) &&
                                            isDefined(
                                                selectedItem.maxMultiplicity
                                            )
                                            ? String(
                                                  selectedItem.maxMultiplicity
                                              )
                                            : '',
                                        value
                                    )
                                }
                                onChange={(_ev, value) => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            if (
                                                isDTDLRelationshipReference(
                                                    draft
                                                )
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
                                    isDTDLRelationshipReference(selectedItem) &&
                                    isDefined(selectedItem.maxMultiplicity)
                                        ? String(selectedItem.maxMultiplicity)
                                        : ''
                                }
                            />
                            <ActionButton
                                text={t('clear')}
                                onClick={() => {
                                    onUpdateItem(
                                        produce((draft) => {
                                            if (
                                                isDTDLRelationshipReference(
                                                    draft
                                                )
                                            ) {
                                                delete draft.maxMultiplicity;
                                                return draft;
                                            }
                                        })
                                    );
                                }}
                            />
                        </div>
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
    IPropertyDetailsEditorModalContentStyleProps,
    IPropertyDetailsEditorModalContentStyles
>(PropertyDetailsEditorModalContent, getStyles);
