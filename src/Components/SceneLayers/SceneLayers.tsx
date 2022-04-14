import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FocusCalloutButton from '../FocusCalloutButton/FocusCalloutButton';
import LayersListRoot from './Internal/LayersListRoot';
import NewLayer from './Internal/NewLayer';
import i18n from '../../i18n';

interface SceneLayersProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

enum LayerDialogMode {
    Root = 'root',
    NewLayer = 'newlayer'
}

const getCalloutTitle = (mode: LayerDialogMode) => {
    switch (mode) {
        case LayerDialogMode.NewLayer:
            return i18n.t('sceneLayers.createNewLayer');
        default:
            return i18n.t('sceneLayers.sceneLayers');
    }
};

const SceneLayers: React.FC<SceneLayersProps> = ({ isOpen, setIsOpen }) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState(LayerDialogMode.Root);

    return (
        <FocusCalloutButton
            buttonText={t('sceneLayers.sceneLayers')}
            calloutTitle={getCalloutTitle(mode)}
            iconName="Stack"
            isOpen={isOpen}
            setIsOpen={(isOpen: boolean) => {
                setMode(LayerDialogMode.Root);
                setIsOpen(isOpen);
            }}
            onBackIconClick={
                mode !== LayerDialogMode.Root
                    ? () => setMode(LayerDialogMode.Root)
                    : null
            }
        >
            {mode === LayerDialogMode.Root && (
                <LayersListRoot
                    onPrimaryAction={() => setMode(LayerDialogMode.NewLayer)}
                />
            )}
            {mode === LayerDialogMode.NewLayer && (
                <NewLayer onCreateLayer={() => null} />
            )}
        </FocusCalloutButton>
    );
};

export default SceneLayers;
