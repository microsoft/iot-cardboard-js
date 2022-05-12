import { Pivot, PivotItem, useTheme } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DScenePageModes } from '../../../Models/Constants/Enums';
import { pivotStyles } from './FloatingScenePageModeToggle.styles';

interface Props {
    handleScenePageModeChange: (newScenePageMode: ADT3DScenePageModes) => void;
    selectedMode: ADT3DScenePageModes;
    sceneId: string;
}

const FloatingScenePageModeToggle: React.FC<Props> = ({
    handleScenePageModeChange,
    selectedMode,
    sceneId
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    if (!sceneId) return null;

    return (
        <div className="cb-scene-page-mode-toggle-container">
            <Pivot
                selectedKey={selectedMode}
                onLinkClick={(item) =>
                    handleScenePageModeChange(
                        item.props.itemKey as ADT3DScenePageModes
                    )
                }
                styles={pivotStyles(theme)}
            >
                <PivotItem
                    headerText={t('build')}
                    itemKey={ADT3DScenePageModes.BuildScene}
                ></PivotItem>
                <PivotItem
                    headerText={t('view')}
                    itemKey={ADT3DScenePageModes.ViewScene}
                ></PivotItem>
            </Pivot>
        </div>
    );
};

export default FloatingScenePageModeToggle;
