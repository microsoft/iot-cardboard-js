// TODO remove no unused vars in second pass PR once modelled properties supported
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
    IntellisenseModeProps,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps,
    PropertySelectionModeProps
} from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import { linkedTwinName } from '../../Models/Constants';
import { Stack, Text, Toggle } from '@fluentui/react';
import TwinPropertyDropown from './Internal/TwinPropertyDropdown';
import { Intellisense } from '../AutoComplete/Intellisense';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = (
    props
) => {
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
                ></TwinPropertyDropown>
            )}
            {mode === 'INTELLISENSE' && (
                <Intellisense
                    {...(props as IntellisenseModeProps).intellisenseProps}
                ></Intellisense>
            )}
            {props.mode === 'TOGGLE' && (
                <div className={styles.toggleContainer}>
                    <Toggle
                        label="Text entry mode"
                        inlineLabel
                        onText="On"
                        offText="Off"
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
