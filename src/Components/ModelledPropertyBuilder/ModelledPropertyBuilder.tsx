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

    // TODO -- remove debug logging
    useEffect(() => {
        if (modelledProperties) {
            console.log('Modelled properties: ', modelledProperties);
        }
    }, [modelledProperties]);

    const onChangeDropdownSelection = (option: IDropdownOption) => {
        onChange({
            property: option.data.property,
            expression: option.data.property.fullPath
        });
    };

    if (isLoading) return <Spinner />;

    return (
        <Stack tokens={{ childrenGap: 4 }}>
            {internalMode === 'PROPERTY_SELECTION' && (
                <ModelledPropertyDropdown
                    flattenedProperties={modelledProperties.flattenedFormat}
                    onChange={onChangeDropdownSelection}
                    selectedKey={propertyExpression.expression}
                />
            )}
            {internalMode === 'INTELLISENSE' && <div>Intellisense mode</div>}
            {mode === 'TOGGLE' && (
                <div className={styles.toggleContainer}>
                    <Toggle
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

export default ModelledPropertyBuilder;
