import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    defaultAllowedPropertyValueTypes,
    IFlattenedModelledPropertiesFormat,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps
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
    behavior,
    config,
    sceneId,
    disableAliasedTwins = false,
    propertyExpression,
    mode,
    allowedPropertyValueTypes = defaultAllowedPropertyValueTypes,
    onChange
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
        behavior,
        config,
        sceneId,
        disableAliasedTwins,
        allowedPropertyValueTypes
    });

    useEffect(() => {
        if (modelledProperties) {
            // Once modelled properties load, construct dropdown options
            const dropdownOptions = getDropdownOptions(
                modelledProperties.flattenedFormat
            );

            // If expression doesn't match option key, snap to expression mode
            if (
                !dropdownOptions
                    .map((o) => o.key)
                    .includes(propertyExpression.expression)
            ) {
                setInternalMode('INTELLISENSE');
            }
            setDropdownOptions(dropdownOptions);
        }
    }, [modelledProperties]);

    const onChangeDropdownSelection = (option: IDropdownOption) => {
        onChange({
            property: option.data.property,
            expression: option.data.property.fullPath
        });
    };

    const getIntellisenseProperty = (
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

        const propertyPath = tokens.slice(pathRootIdx, leafToken + 1).join('');

        // Return properties @ path if present
        const properties = Object.keys(
            getProperty(modelledProperties.intellisenseFormat, propertyPath, {})
        );

        return properties;
    };

    if (isLoading) return <Spinner />;

    return (
        <Stack tokens={{ childrenGap: 4 }}>
            {internalMode === 'PROPERTY_SELECTION' && (
                <ModelledPropertyDropdown
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
                        }
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
                        onChange={(_event, checked) =>
                            setInternalMode(
                                checked ? 'INTELLISENSE' : 'PROPERTY_SELECTION'
                            )
                        }
                        styles={{ root: { marginBottom: 0 } }}
                    />
                </div>
            )}
        </Stack>
    );
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
