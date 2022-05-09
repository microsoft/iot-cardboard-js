import { Pivot, PivotItem } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DScenePageSteps } from '../../../Models/Constants/Enums';
import { getStyles } from './SceneListModeToggle.styles';

interface Props {
    handleSceneListModeChange: (SceneListMode: ADT3DScenePageSteps) => void;
    selectedMode: ADT3DScenePageSteps;
}

const SceneListModeToggle: React.FC<Props> = ({
    handleSceneListModeChange,
    selectedMode
}) => {
    const { t } = useTranslation();
    const customStyles = getStyles();
    return (
        <div className={customStyles.pivotContainer}>
            <Pivot
                selectedKey={selectedMode}
                onLinkClick={(item) =>
                    handleSceneListModeChange(
                        item.props.itemKey as ADT3DScenePageSteps
                    )
                }
            >
                <PivotItem
                    itemKey={ADT3DScenePageSteps.SceneLobby}
                    headerText={t('3dScenePage.listView')}
                    itemIcon="BulletedList2"
                />
                <PivotItem
                    itemKey={ADT3DScenePageSteps.Globe}
                    headerText={t('3dScenePage.globeView')}
                    itemIcon="Globe"
                />
            </Pivot>
        </div>
    );
};

export default SceneListModeToggle;
