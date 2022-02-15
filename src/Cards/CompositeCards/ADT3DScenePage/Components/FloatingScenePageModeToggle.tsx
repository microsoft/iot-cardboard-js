import { Pivot, PivotItem } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IScene } from '../../../../Models/Classes/3DVConfig';
import { ADT3DScenePageModes } from '../../../../Models/Constants/Enums';

interface Props {
    handleScenePageModeChange: (newScenePageMode: ADT3DScenePageModes) => void;
    selectedMode: ADT3DScenePageModes;
    scene: IScene;
}

const FloatingScenePageModeToggle: React.FC<Props> = ({
    handleScenePageModeChange,
    selectedMode,
    scene
}) => {
    const { t } = useTranslation();

    if (!scene) return null;

    return (
        <div className="cb-scene-page-mode-toggle-container">
            <Pivot
                selectedKey={selectedMode}
                onLinkClick={(item) =>
                    handleScenePageModeChange(
                        item.props.itemKey as ADT3DScenePageModes
                    )
                }
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
