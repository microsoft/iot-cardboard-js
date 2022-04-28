import React, { useEffect, useMemo, useState } from 'react';
import {
    defaultAllowedComplexTypes,
    defaultAllowedPrimitiveTypes,
    ModelledPropertyBuilderMode,
    ModelledPropertyBuilderProps
} from './ModelledPropertyBuilder.types';
import { getStyles } from './ModelledPropertyBuilder.styles';
import { Stack, Toggle } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { linkedTwinName } from '../../Models/Constants';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { useModelledProperties } from './useModelledProperties';

const ModelledPropertyBuilder: React.FC<ModelledPropertyBuilderProps> = ({
    adapter,
    behavior,
    config,
    sceneId,
    disableAliasedTwins = false,
    selectedPropertyOrExpression,
    mode,
    allowedPrimitiveTypes = defaultAllowedPrimitiveTypes,
    allowedComplexTypes = defaultAllowedComplexTypes,
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

    const result = useModelledProperties({
        adapter,
        behavior,
        config,
        sceneId,
        disableAliasedTwins,
        allowedPrimitiveTypes,
        allowedComplexTypes
    });

    return (
        <Stack tokens={{ childrenGap: 4 }}>
            {internalMode === 'PROPERTY_SELECTION' && (
                <div>Property select mode</div>
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
