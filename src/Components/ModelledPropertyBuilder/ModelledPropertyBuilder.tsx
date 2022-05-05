import React, { useCallback, useEffect, useState } from 'react';
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

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = ({
    adapter,
    twinIdParams,
    propertyExpression,
    mode = 'TOGGLE',
    allowedPropertyValueTypes = defaultAllowedPropertyValueTypes,
    onChange,
    required = false
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
                modelledProperties.flattenedFormat
            );

            setDropdownOptions(dropdownOptions);
        }
    }, [modelledProperties]);

    useEffect(() => {
        // If expression doesn't match option key, snap to expression mode
        if (
            modelledProperties &&
            dropdownOptions &&
            !getIsExpressionValidOption(propertyExpression, dropdownOptions)
        ) {
            setInternalMode('INTELLISENSE');
        }
    }, [propertyExpression, dropdownOptions, modelledProperties]);

    const onChangeDropdownSelection = useCallback(
        (option: IDropdownOption) => {
            onChange({
                property: option.data.property,
                expression: option.data.property.fullPath
            });
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

    if (isLoading) return <Spinner />;

    return (
        <Stack tokens={{ childrenGap: 4 }}>
            {internalMode === 'PROPERTY_SELECTION' && (
                <ModelledPropertyDropdown
                    required={required}
                    dropdownOptions={dropdownOptions}
                    onChange={onChangeDropdownSelection}
                    selectedKey={propertyExpression.expression}
                    label={t(
                        '3dSceneBuilder.ModelledPropertyBuilder.selectProperty'
                    )}
                />
            )}
            {internalMode === 'INTELLISENSE' && (
                <Intellisense
                    autoCompleteProps={{
                        textFieldProps: {
                            label: t(
                                '3dSceneBuilder.ModelledPropertyBuilder.expressionLabel'
                            ),
                            multiline: true,
                            placeholder: t(
                                '3dSceneBuilder.ModelledPropertyBuilder.expressionPlaceholder'
                            )
                        },
                        required
                    }}
                    onChange={(value) => onChange({ expression: value })}
                    defaultValue={propertyExpression.expression}
                    aliasNames={Object.keys(modelledProperties.nestedFormat)}
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
    flattenedProperties: IFlattenedModelledPropertiesFormat
) => {
    let modelledPropertyOptions: Array<IDropdownOption> = [];

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
