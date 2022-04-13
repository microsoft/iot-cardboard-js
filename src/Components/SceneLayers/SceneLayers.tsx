import { useTheme } from '@fluentui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getStyles } from './SceneLayers.styles';
import FocusCalloutButton from '../FocusCalloutButton/FocusCalloutButton';

const SceneLayers: React.FC = () => {
    const { t } = useTranslation();

    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <FocusCalloutButton
            buttonText={t('sceneLayers.sceneLayers')}
            iconName="Stack"
        >
            <div>test</div>
        </FocusCalloutButton>
    );
};

export default SceneLayers;
