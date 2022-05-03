import React, { useEffect, useState } from 'react';
import {
    defaultAllowedPropertyValueTypes,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps
} from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import { IDropdownOption, Spinner, Stack, Toggle } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useModelledProperties } from './useModelledProperties';
import { ModelledPropertyDropdown } from './Internal/ModelledPropertyDropdown';
import { Intellisense, separators } from '../AutoComplete/Intellisense';
import { getProperty } from 'dot-prop';

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

    const { isLoading, modelledProperties } = useModelledProperties({
        adapter,
        behavior,
        config,
        sceneId,
        disableAliasedTwins,
        allowedPropertyValueTypes
    });

    const onChangeDropdownSelection = (option: IDropdownOption) => {
        onChange({
            property: option.data.property,
            expression: option.data.property.fullPath
        });
    };

    const getIntellisenseProperty = (
        propertyName: string,
        {
            search,
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
                    flattenedProperties={modelledProperties.flattenedFormat}
                    onChange={onChangeDropdownSelection}
                    selectedKey={propertyExpression.expression}
                    label={'Select property'}
                />
            )}
            {internalMode === 'INTELLISENSE' && (
                <Intellisense
                    autoCompleteProps={{
                        textFieldProps: {
                            label: 'Property expression',
                            multiline: true,
                            placeholder: 'Enter expression'
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

export default React.memo(ModelledPropertyBuilder);
