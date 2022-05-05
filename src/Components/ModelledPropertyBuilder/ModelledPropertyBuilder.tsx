import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    defaultAllowedPropertyValueTypes,
    IFlattenedModelledPropertiesFormat,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps,
    PropertyExpression
} from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import {
    DropdownMenuItemType,
    IDropdownOption,
    Spinner,
    Stack,
    Toggle
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useModelledProperties } from './useModelledProperties';
import { ModelledPropertyDropdown } from './Internal/ModelledPropertyDropdown';
import { Intellisense, separators } from '../AutoComplete/Intellisense';
import { getProperty } from 'dot-prop';
import { DTDLPropertyIconographyMap } from '../../Models/Constants/Constants';
import i18next from 'i18next';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = ({
    adapter,
    twinIdParams,
    propertyExpression,
    mode = 'TOGGLE',
    allowedPropertyValueTypes = defaultAllowedPropertyValueTypes,
    onChange,
    required = false,
    enableNoneDropdownOption = false,
    dropdownTestId = 'cb-modelled-property-dropdown-test-id',
    intellisenseLabel,
    intellisensePlaceholder,
    properyDropdownLabel
}) => {
    const { t } = useTranslation();
    const styles = getStyles();
    const [
        internalMode,
        setInternalMode
    ] = useState<ModelledPropertyBuilderMode>(
        mode === 'TOGGLE' ? 'PROPERTY_SELECTION' : mode
    );

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
                enableNoneDropdownOption
            );

            setDropdownOptions(dropdownOptions);
        }
    }, [modelledProperties]);

    useEffect(() => {
        // If expression doesn't match option key, snap to expression mode
        if (
            modelledProperties &&
            dropdownOptions?.length > 0 &&
            !getIsExpressionValidOption(propertyExpression, dropdownOptions)
        ) {
            setInternalMode('INTELLISENSE');
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

    const getIntellisenseProperty = useCallback(
        (
            _propertyName: string,
            {
                tokens,
                leafToken
            }: { search: string; tokens: string[]; leafToken: number }
        ) => {
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

    const toggleExpressionMode = useCallback(
        (_event, checked: boolean) => {
            const newInternalMode = checked
                ? 'INTELLISENSE'
                : 'PROPERTY_SELECTION';

            // When changing from intellisense mode to property selection mode
            // if expression doesn't match up with option, report onChange of
            // empty expression to reset dropdown
            if (
                !getIsExpressionValidOption(
                    propertyExpression,
                    dropdownOptions
                ) &&
                internalMode === 'INTELLISENSE'
            ) {
                onChange({ expression: '' });
            }

            setInternalMode(newInternalMode);
        },
        [dropdownOptions, internalMode, onChange, propertyExpression]
    );

    const autoCompleteProps = useMemo(
        () => ({
            textFieldProps: {
                label:
                    intellisenseLabel ??
                    t('3dSceneBuilder.ModelledPropertyBuilder.expressionLabel'),
                multiline: true,
                placeholder:
                    intellisensePlaceholder ??
                    t(
                        '3dSceneBuilder.ModelledPropertyBuilder.expressionPlaceholder'
                    )
            },
            required
        }),
        [required, t, intellisenseLabel, intellisensePlaceholder]
    );

    const onIntellisenseChange = useCallback(
        (value) => onChange({ expression: value }),
        [onChange]
    );

    const aliasNames = useMemo(
        () => Object.keys(modelledProperties?.nestedFormat || {}),
        [modelledProperties?.nestedFormat]
    );

    if (isLoading) return <Spinner />;

    return (
        <Stack tokens={{ childrenGap: 4 }}>
            {internalMode === 'PROPERTY_SELECTION' && (
                <ModelledPropertyDropdown
                    required={required}
                    dropdownOptions={dropdownOptions}
                    onChange={onChangeDropdownSelection}
                    selectedKey={propertyExpression.expression}
                    label={
                        properyDropdownLabel ??
                        t(
                            '3dSceneBuilder.ModelledPropertyBuilder.selectProperty'
                        )
                    }
                    dropdownTestId={dropdownTestId}
                />
            )}
            {internalMode === 'INTELLISENSE' && (
                <Intellisense
                    autoCompleteProps={autoCompleteProps}
                    onChange={onIntellisenseChange}
                    defaultValue={propertyExpression.expression}
                    aliasNames={aliasNames}
                    getPropertyNames={getIntellisenseProperty}
                />
            )}
            {mode === 'TOGGLE' && (
                <div className={styles.toggleContainer}>
                    <Toggle
                        checked={internalMode === 'INTELLISENSE'}
                        label={t(
                            '3dSceneBuilder.ModelledPropertyBuilder.toggleLabel'
                        )}
                        inlineLabel
                        onText={t('on')}
                        offText={t('off')}
                        onChange={toggleExpressionMode}
                        styles={{ root: { marginBottom: 0 } }}
                    />
                </div>
            )}
        </Stack>
    );
};

const getIsExpressionValidOption = (
    propertyExpression: PropertyExpression,
    dropdownOptions: IDropdownOption<any>[]
) => {
    // If expression doesn't match option key, snap to expression mode
    if (
        propertyExpression.expression === '' ||
        dropdownOptions
            .map((o) => o.key)
            .includes(propertyExpression.expression)
    ) {
        return true;
    }
    return false;
};

const getDropdownOptions = (
    flattenedProperties: IFlattenedModelledPropertiesFormat,
    enableNoneDropdownOption: boolean
) => {
    let modelledPropertyOptions: Array<IDropdownOption> = [
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
        const tagProperties = [
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

        modelledPropertyOptions = modelledPropertyOptions.concat(tagProperties);
    }

    return modelledPropertyOptions;
};

export default React.memo(ModelledPropertyBuilder);
