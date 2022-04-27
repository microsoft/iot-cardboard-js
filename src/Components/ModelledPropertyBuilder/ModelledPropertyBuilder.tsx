// TODO remove no unused vars in second pass PR once modelled properties supported
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { ModelledPropertyBuilderProps } from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import { linkedTwinName } from '../../Models/Constants';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = ({
    adapter,
    primaryTwinIds,
    primaryTwinTag = linkedTwinName,
    selectedPropertyOrExpression,
    aliasedTwinMap,
    mode,
    allowedPrimitiveTypes,
    allowedComplexTypes,
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

    return <div>Hello ModelledPropertyBuilder!</div>;
};

export default ModelledPropertyBuilder;
