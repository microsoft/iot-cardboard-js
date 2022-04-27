// TODO remove no unused vars in second pass PR once modelled properties supported
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { ModelledPropertyBuilderProps } from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import { linkedTwinName } from '../../Models/Constants';
import { Stack, Text } from '@fluentui/react';
import TwinPropertyDropown from './Internal/TwinPropertyDropdown';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = ({
    adapter,
    mode,
    onChange
}) => {
    const styles = getStyles();

    useEffect(() => {
        if (adapter.cachedModels?.length > 0) {
            // TODO build view model for modelled properties
            // using primaryTwinIds & aliasedTwinMap
            // Modelled properties will come in v2 of this changeset
        }
    }, [adapter.cachedModels]);

    return (
        <Stack tokens={{ padding: 8 }}>
            <Text>Select Property</Text>
        </Stack>
    );
};

export default ModelledPropertyBuilder;
