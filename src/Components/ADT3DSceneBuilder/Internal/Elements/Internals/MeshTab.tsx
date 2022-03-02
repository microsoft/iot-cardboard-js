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
        <div className="cb-scene-builder-left-panel-element-objects">
            {/* <div className="cb-scene-builder-left-panel-element-objects-container"> */}
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
                // <ul className="cb-scene-builder-left-panel-element-object-list">
                //     {/* {elementToEdit.meshIDs.map((meshName) => (
                //         <li
                //             key={meshName}
                //             className="cb-scene-builder-left-panel-element-object"
                //         >
                //             <div className="cb-mesh-name-wrapper">
                //                 <FontIcon iconName={'CubeShape'} />
                //                 <span className="cb-mesh-name">
                //                     {meshName}
                //                 </span>
                //             </div>
                //             <IconButton
                //                 className="cb-remove-object-button"
                //                 iconProps={{
                //                     iconName: 'Delete'
                //                 }}
                //                 title={t('remove')}
                //                 ariaLabel={t('remove')}
                //                 onClick={() => {}}
                //             />
                //         </li>
                //     ))} */}
                // </ul>
            )}
            {/* </div> */}
        </div>
    );
};
export default MeshTab;
