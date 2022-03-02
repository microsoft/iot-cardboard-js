import React from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Classes/3DVConfig';

import { useTranslation } from 'react-i18next';
import {
    CardboardList,
    CardboardListItemProps
} from '../../../../CardboardList';

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
    return (
        <>
            {elementToEdit.meshIDs.length === 0 ? (
                <div className="cb-scene-builder-left-panel-text">
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
