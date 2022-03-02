import React from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Classes/3DVConfig';

import { useTranslation } from 'react-i18next';
import {
    CardboardList,
    CardboardListItemProps
} from '../../../../CardboardList';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';

interface MeshTabProps {
    elementToEdit: ITwinToObjectMapping;
    updateColoredMeshItems: (name?: string) => void;
    setSelectedMeshIds: (selectedNames: string[]) => void;
}
const MeshTab: React.FC<MeshTabProps> = ({
    elementToEdit,
    // updateColoredMeshItems,
    setSelectedMeshIds
}) => {
    const { t } = useTranslation();

    const getListItemProps = (item: string): CardboardListItemProps<string> => {
        return {
            ariaLabel: '',
            iconStartName: 'CubeShape',
            iconEndName: 'Delete',
            onClick: () => {
                const currentObjects = [...elementToEdit.meshIDs];
                currentObjects.splice(currentObjects.indexOf(item), 1);
                setSelectedMeshIds(currentObjects);
            },
            // onMouseEnter={() =>
            //     updateColoredMeshItems(meshName)
            // }
            // onMouseLeave={() => updateColoredMeshItems()}
            textPrimary: item
            // title: t('delete')
        };
    };
    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            {elementToEdit.meshIDs.length === 0 ? (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.noMeshAddedText')}
                </div>
            ) : (
                <CardboardList<string>
                    items={elementToEdit.meshIDs}
                    getListItemProps={getListItemProps}
                    listKey={`mesh-list`}
                />
            )}
        </>
    );
};
export default MeshTab;
