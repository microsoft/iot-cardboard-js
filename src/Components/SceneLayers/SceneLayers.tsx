import React from 'react';
import { useTranslation } from 'react-i18next';
import FocusCalloutButton from '../FocusCalloutButton/FocusCalloutButton';
import LayersListRoot from './Internal/LayersListRoot';

interface SceneLayersProps {
    isInitiallyOpen?: boolean;
}

const SceneLayers: React.FC<SceneLayersProps> = ({ isInitiallyOpen }) => {
    const { t } = useTranslation();

    return (
        <FocusCalloutButton
            buttonText={t('sceneLayers.sceneLayers')}
            iconName="Stack"
            isInitiallyOpen={isInitiallyOpen}
        >
            <LayersListRoot />
        </FocusCalloutButton>
    );
};

export default SceneLayers;
