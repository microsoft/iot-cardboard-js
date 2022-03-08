import React, { useEffect, useState } from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Classes/3DVConfig';

import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { createColoredMeshItems } from '../../../../3DV/SceneView.Utils';
import { ColoredMeshItem } from '../../../../../Models/Classes/SceneView.types';

interface MeshTabProps {
    elementToEdit: ITwinToObjectMapping;
    // updateColoredMeshItems: (name?: string) => void;
    setColoredMeshItems: (selectedNames: ColoredMeshItem[]) => void;
}
const MeshTab: React.FC<MeshTabProps> = ({
    elementToEdit,
    // updateColoredMeshItems,
    setColoredMeshItems
}) => {
    const { t } = useTranslation();
    const [listItems, setListItems] = useState<ICardboardListItem<string>[]>(
        []
    );

    // generate the list of items to show
    useEffect(() => {
        const listItems = getListItems(
            elementToEdit.meshIDs,
            // updateColoredMeshItems,
            // updateColoredMeshItems,
            setColoredMeshItems
        );
        setListItems(listItems);
    }, [
        elementToEdit,
        // updateColoredMeshItems,
        // updateColoredMeshItems,
        setColoredMeshItems
    ]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            {elementToEdit.meshIDs.length === 0 ? (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.noMeshAddedText')}
                </div>
            ) : (
                <CardboardList<string>
                    items={listItems}
                    listKey={`mesh-list`}
                />
            )}
        </>
    );
};
function getListItems(
    filteredElements: string[],
    // onElementEnter: (element: string) => void,
    // onElementLeave: () => void,
    setColoredMeshItems: (selectedNames: ColoredMeshItem[]) => void
): ICardboardListItem<string>[] {
    return filteredElements.map((item) => {
        const viewModel: ICardboardListItem<string> = {
            ariaLabel: '',
            // buttonProps: {
            //     onMouseOver: () => onElementEnter(item),
            //     onMouseLeave: () => onElementLeave(),
            //     onFocus: () => onElementEnter(item),
            //     onBlur: () => onElementLeave()
            // },
            iconStartName: 'CubeShape',
            iconEndName: 'Delete',
            item: item,
            onClick: () => {
                const currentObjects = [...filteredElements];
                currentObjects.splice(currentObjects.indexOf(item), 1);
                setColoredMeshItems(
                    createColoredMeshItems(currentObjects, null)
                );
            },
            textPrimary: item
        };

        return viewModel;
    });
}
export default MeshTab;
