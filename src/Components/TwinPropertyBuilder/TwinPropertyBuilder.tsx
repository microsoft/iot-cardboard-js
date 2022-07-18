import React, { useState } from 'react';
import {
    IntellisenseModeProps,
    TwinPropertyBuilderMode,
    TwinPropertyBuilderProps,
    PropertySelectionModeProps
} from './TwinPropertyBuilder.types';
import { getStyles } from './TwinPropertyBuilder.styles';
import { Stack, Toggle } from '@fluentui/react';
import TwinPropertyDropown from './Internal/TwinPropertyDropdown';
import { Intellisense } from '../AutoComplete/Intellisense';
import { useTranslation } from 'react-i18next';

const TwinPropertyBuilder: React.FC<TwinPropertyBuilderProps> = (props) => {
    const { t } = useTranslation();
    const styles = getStyles();
    const [mode, setMode] = useState<TwinPropertyBuilderMode>(
        props.mode === 'TOGGLE' ? 'PROPERTY_SELECTION' : props.mode
    );

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
                        ...(props as IntellisenseModeProps).intellisenseProps
                            .autoCompleteProps,
                        textFieldProps: {
                            ...(props as IntellisenseModeProps)
                                .intellisenseProps.autoCompleteProps
                                ?.textFieldProps,
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
                        styles={{ root: { marginBottom: 0 } }}
                    />
                </div>
            )}
        </Stack>
    );
};

export default TwinPropertyBuilder;
