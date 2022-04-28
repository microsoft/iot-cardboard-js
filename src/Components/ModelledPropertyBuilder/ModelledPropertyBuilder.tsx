import React, { useState } from 'react';
import {
    IntellisenseModeProps,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps,
    PropertySelectionModeProps
} from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import { Stack, Toggle } from '@fluentui/react';
import TwinPropertyDropown from './Internal/TwinPropertyDropdown';
import { Intellisense } from '../AutoComplete/Intellisense';
import { useTranslation } from 'react-i18next';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = (
    props
) => {
    const { t } = useTranslation();
    const styles = getStyles();
    const [mode, setMode] = useState<ModelledPropertyBuilderMode>(
        props.mode === 'TOGGLE' ? 'PROPERTY_SELECTION' : props.mode
    );

    /* MODELLED_PROPERTY_TODO build view model for modelled properties
    useEffect(() => {
        if (adapter.cachedModels?.length > 0) {
            // using primaryTwinIds & aliasedTwinMap
            // Modelled properties will come in v2 of this changeset
        }
    }, [adapter.cachedModels]);
    */

    return (
        <Stack tokens={{ childrenGap: 4 }}>
            {mode === 'PROPERTY_SELECTION' && (
                <TwinPropertyDropown
                    {...(props as PropertySelectionModeProps)
                        .twinPropertyDropdownProps}
                    label={t(
                        '3dSceneBuilder.ModelledPropertyBuilder.selectProperty'
                    )}
                ></TwinPropertyDropown>
            )}
            {mode === 'INTELLISENSE' && (
                <Intellisense
                    {...(props as IntellisenseModeProps).intellisenseProps}
                    autoCompleteProps={{
                        textFieldProps: {
                            label: t(
                                '3dSceneBuilder.ModelledPropertyBuilder.expressionLabel'
                            ),
                            placeholder: t(
                                '3dSceneBuilder.ModelledPropertyBuilder.expressionPlaceholder'
                            )
                        }
                    }}
                ></Intellisense>
            )}
            {props.mode === 'TOGGLE' && (
                <div className={styles.toggleContainer}>
                    <Toggle
                        label={t(
                            '3dSceneBuilder.ModelledPropertyBuilder.toggleLabel'
                        )}
                        inlineLabel
                        onText={t('on')}
                        offText={t('off')}
                        onChange={(_event, checked) =>
                            setMode(
                                checked ? 'INTELLISENSE' : 'PROPERTY_SELECTION'
                            )
                        }
                    />
                </div>
            )}
        </Stack>
    );
};

export default ModelledPropertyBuilder;
