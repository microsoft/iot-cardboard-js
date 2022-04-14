import React from 'react';
import { useTranslation } from 'react-i18next';
import FocusCalloutButton from '../FocusCalloutButton/FocusCalloutButton';
import LayersListRoot from './Internal/LayersListRoot';

interface SceneLayersProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const SceneLayers: React.FC<SceneLayersProps> = ({ isOpen, setIsOpen }) => {
    const { t } = useTranslation();

    return (
        <FocusCalloutButton
            buttonText={t('sceneLayers.sceneLayers')}
            iconName="Stack"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <LayersListRoot />
        </FocusCalloutButton>
    );
};

export default SceneLayers;
