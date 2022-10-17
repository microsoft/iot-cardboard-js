import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    defaultAllowedPropertyValueTypes,
    IFlattenedModelledPropertiesFormat,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps,
    PropertyExpression
} from './ModelledPropertyBuilder.types';
import {
    choiceGroupOptionStyles,
    choiceGroupStyles,
    getStyles,
    propertyExpressionLabelStyles,
    getClearButtonStyles
} from './ModelledPropertyBuilder.styles';
import {
    DropdownMenuItemType,
    IDropdownOption,
    Spinner,
    Stack,
    ChoiceGroup,
    Label,
    IChoiceGroupOption,
    SpinnerSize,
    Text,
    ActionButton,
    FontSizes,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useModelledProperties } from './useModelledProperties';
import ModelledPropertyDropdown, {
    IModelledPropertyDropdownItem
} from './Internal/ModelledPropertyDropdown';
import {
    GetPropertyNamesFunc,
    Intellisense,
    separators
} from '../AutoComplete/Intellisense';
import { getProperty } from 'dot-prop';
import { DTDLPropertyIconographyMap } from '../../Models/Constants/Constants';
import i18next from 'i18next';
import TooltipCallout from '../TooltipCallout/TooltipCallout';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = ({
    adapter,
    description,
    twinIdParams,
    propertyExpression,
    mode = ModelledPropertyBuilderMode.TOGGLE,
    allowedPropertyValueTypes = defaultAllowedPropertyValueTypes,
    onChange,
    required = false,
    enableNoneDropdownOption = false,
    dropdownTestId = 'cb-modelled-property-dropdown-test-id',
    intellisensePlaceholder,
    customLabel,
    customLabelTooltip,
    isClearEnabled,
    onInternalModeChanged,
    excludeDtid = false
}) => {
    const { t } = useTranslation();
    const styles = getStyles();
    const [
        internalMode,
        setInternalMode
    ] = useState<ModelledPropertyBuilderMode>(
        mode === ModelledPropertyBuilderMode.TOGGLE ||
            mode === ModelledPropertyBuilderMode.PROPERTY_SELECT
            ? ModelledPropertyBuilderMode.PROPERTY_SELECT
            : ModelledPropertyBuilderMode.INTELLISENSE
    );

    // When the expression can't be parsed into
    // a dropdown option key on initial load,
    // we snap to intellisense mode.  This ref is
    // used to indicate that this logic has already been
    // executed
    const initialModeFound = useRef(false);

    const [dropdownOptions, setDropdownOptions] = useState([]);

    const { isLoading, modelledProperties } = useModelledProperties({
        adapter,
        twinIdParams,
        allowedPropertyValueTypes
    });

    useEffect(() => {
        if (modelledProperties) {
            // Once modelled properties load, construct dropdown options
            const dropdownOptions = getDropdownOptions(
                modelledProperties.flattenedFormat,
                enableNoneDropdownOption,
                excludeDtid
            );

            setDropdownOptions(dropdownOptions);
        }
    }, [enableNoneDropdownOption, excludeDtid, modelledProperties]);

    useEffect(() => {
        // Report internal mode change
        onInternalModeChanged?.(internalMode);
    }, [internalMode, onInternalModeChanged]);

    useEffect(() => {
        // If expression doesn't match option key, snap to expression mode
        if (
            modelledProperties &&
            dropdownOptions?.length > 0 &&
            !initialModeFound.current
        ) {
            initialModeFound.current = true;
            if (
                !getDropdownOptionByExpressionKey(
                    propertyExpression,
                    dropdownOptions
                ) &&
                propertyExpression.expression !== ''
            ) {
                setInternalMode(ModelledPropertyBuilderMode.INTELLISENSE);
            }
        }
    }, [propertyExpression, dropdownOptions, modelledProperties]);

    const onChangeDropdownSelection = useCallback(
        (option: IDropdownOption) => {
            if (option.key === 'none') {
                onChange({
                    expression: ''
                });
            } else {
                onChange({
                    property: option.data.property,
                    expression: option.data.property.fullPath
                });
            }
        },
        [onChange]
    );

    const onClearButtonClick = useCallback(() => {
        onChange({
            expression: ''
        });
        setInternalMode(ModelledPropertyBuilderMode.PROPERTY_SELECT);
    }, [onChange]);

    const getIntellisenseProperty: GetPropertyNamesFunc = useCallback(
        (_twinId, { leafToken, tokens }) => {
            const nonPathChars = separators.replace('.', '');
            let pathRootIdx = leafToken;
            for (let i = leafToken; i >= 0; i--) {
                if (!nonPathChars.includes(tokens[i])) {
                    pathRootIdx = i;
                } else {
                    break;
                }
            }

            const propertyPath = tokens
                .slice(pathRootIdx, leafToken + 1)
                .join('');

            // Return properties @ path if present
            const properties = Object.keys(
                getProperty(
                    modelledProperties.intellisenseFormat,
                    propertyPath,
                    {}
                )
            );

            return properties;
        },
        [modelledProperties?.intellisenseFormat]
    );

    const onChangeMode = useCallback(
        (
            _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
            option?: IChoiceGroupOption
        ) => {
            const newInternalMode = option.key as ModelledPropertyBuilderMode;

            // When changing from intellisense mode to property selection mode
            // if expression doesn't match up with option, report onChange of
            // empty expression to reset dropdown
            if (internalMode === ModelledPropertyBuilderMode.INTELLISENSE) {
                const targetOption = getDropdownOptionByExpressionKey(
                    propertyExpression,
                    dropdownOptions
                );
                if (!targetOption) {
                    onChange({ expression: '' });
                } else {
                    // If matching option found, reset propertyExpression to typed property
                    onChange({
                        expression: targetOption.data.property.fullPath,
                        property: targetOption.data.property
                    });
                }
            }

            setInternalMode(newInternalMode);
        },
        [dropdownOptions, internalMode, onChange, propertyExpression]
    );

    const autoCompleteProps = useMemo(
        () => ({
            textFieldProps: {
                multiline: true,
                placeholder:
                    intellisensePlaceholder ??
                    t(
                        '3dSceneBuilder.ModelledPropertyBuilder.expressionPlaceholder'
                    )
            }
        }),
        [t, intellisensePlaceholder]
    );

    const onIntellisenseChange = useCallback(
        (value) => onChange({ expression: value }),
        [onChange]
    );

    const aliasNames = useMemo(
        () => Object.keys(modelledProperties?.nestedFormat || {}),
        [modelledProperties?.nestedFormat]
    );

    const theme = useTheme();
    const clearButtonStyles = getClearButtonStyles(!!customLabelTooltip, theme);

    return (
        <Stack tokens={{ childrenGap: 4 }} className={styles.root}>
            <div className={styles.labelContainer}>
                <Stack horizontal>
                    <Label
                        styles={propertyExpressionLabelStyles}
                        required={required}
                    >
                        {customLabel ??
                            t(
                                '3dSceneBuilder.ModelledPropertyBuilder.expressionLabel'
                            )}
                    </Label>
                    {customLabelTooltip && (
                        <TooltipCallout
                            content={{
                                ...customLabelTooltip,
                                iconName: customLabelTooltip.iconName || 'Info'
                            }}
                        />
                    )}
                </Stack>
                <Stack horizontal>
                    {isClearEnabled && (
                        <ActionButton
                            styles={clearButtonStyles}
                            text={t(
                                '3dSceneBuilder.ModelledPropertyBuilder.clearButtonText'
                            )}
                            data-testid={
                                'modelled-property-builder-clear-button'
                            }
                            onClick={onClearButtonClick}
                        />
                    )}
                </Stack>
                {(mode === ModelledPropertyBuilderMode.INTELLISENSE ||
                    mode === ModelledPropertyBuilderMode.PROPERTY_SELECT) && (
                    <LoadingSpinner isLoading={isLoading} />
                )}
            </div>
            {mode === 'TOGGLE' && (
                <div className={styles.toggleContainer}>
                    <ChoiceGroup
                        selectedKey={internalMode}
                        options={choiceGroupOptions}
                        onChange={onChangeMode}
                        styles={choiceGroupStyles}
                    />
                    <LoadingSpinner isLoading={isLoading} />
                </div>
            )}
            {internalMode === 'PROPERTY_SELECTION' && (
                <ModelledPropertyDropdown
                    dropdownOptions={dropdownOptions}
                    onChange={onChangeDropdownSelection}
                    selectedKey={propertyExpression.expression}
                    dropdownTestId={dropdownTestId}
                    isLoading={isLoading}
                />
            )}
            {internalMode === 'INTELLISENSE' && (
                <Intellisense
                    autoCompleteProps={autoCompleteProps}
                    onChange={onIntellisenseChange}
                    defaultValue={propertyExpression.expression}
                    aliasNames={aliasNames}
                    getPropertyNames={getIntellisenseProperty}
                    isLoading={isLoading}
                />
            )}
            {description && (
                <Text styles={{ root: { fontSize: FontSizes.small } }}>
                    {description}
                </Text>
            )}
        </Stack>
    );
};

const LoadingSpinner: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    const styles = getStyles();
    return (
        <div className={styles.loadingSpinnerContainer}>
            {isLoading && (
                <Spinner size={SpinnerSize.small} ariaLive="assertive" />
            )}
        </div>
    );
};

const getDropdownOptionByExpressionKey = (
    propertyExpression: PropertyExpression,
    dropdownOptions: IDropdownOption<IModelledPropertyDropdownItem>[]
) => {
    return dropdownOptions.find((o) => o.key === propertyExpression.expression);
};

const choiceGroupOptions = [
    {
        key: 'PROPERTY_SELECTION',
        text: i18next.t(
            '3dSceneBuilder.ModelledPropertyBuilder.singleProperty'
        ),
        styles: choiceGroupOptionStyles
    },
    {
        key: 'INTELLISENSE',
        text: i18next.t(
            '3dSceneBuilder.ModelledPropertyBuilder.customExpression'
        ),
        styles: choiceGroupOptionStyles
    }
];

const getDropdownOptions = (
    flattenedProperties: IFlattenedModelledPropertiesFormat,
    enableNoneDropdownOption: boolean,
    excludeDtid: boolean
) => {
    let modelledPropertyOptions: Array<
        IDropdownOption<IModelledPropertyDropdownItem>
    > = [
        ...(enableNoneDropdownOption
            ? [
                  {
                      key: 'none',
                      text: i18next.t(
                          '3dSceneBuilder.ModelledPropertyBuilder.none'
                      )
                  }
              ]
            : [])
    ];

    for (const tag of Object.keys(flattenedProperties)) {
        let tagProperties = [
            {
                key: `${tag}-header`,
                text: tag,
                itemType: DropdownMenuItemType.Header
            },
            ...flattenedProperties[tag].map((property) => {
                const propertyIcon =
                    DTDLPropertyIconographyMap[property.propertyType];

                return {
                    key: property.fullPath,
                    text: property.localPath,
                    data: {
                        ...(propertyIcon && {
                            icon: propertyIcon.icon,
                            iconTitle: propertyIcon.text
                        }),
                        property
                    }
                };
            })
        ];

        if (excludeDtid) {
            tagProperties = tagProperties.filter((t) => {
                return !t.key.includes('$dtId');
            });
        }

        modelledPropertyOptions = modelledPropertyOptions.concat(tagProperties);
    }

    return modelledPropertyOptions;
};

export default React.memo(ModelledPropertyBuilder);
