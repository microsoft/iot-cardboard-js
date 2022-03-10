import React, { useContext, useEffect, useState } from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Classes/3DVConfig';

import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { createColoredMeshItems } from '../../../../3DV/SceneView.Utils';
import { ColoredMeshItem } from '../../../../../Models/Classes/SceneView.types';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { IADT3DViewerRenderMode } from '../../../../../Models/Constants';

interface MeshTabProps {
    elementToEdit: ITwinToObjectMapping;
}
const MeshTab: React.FC<MeshTabProps> = ({ elementToEdit }) => {
    const { t } = useTranslation();
    const [listItems, setListItems] = useState<ICardboardListItem<string>[]>(
        []
    );

    const { setColoredMeshItems, state } = useContext(SceneBuilderContext);

    // generate the list of items to show
    useEffect(() => {
        const listItems = getListItems(
            elementToEdit.meshIDs,
            setColoredMeshItems,
            state.renderMode
        );
        setListItems(listItems);
    }, [elementToEdit, setColoredMeshItems]);

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
    elementMeshIds: string[],
    setColoredMeshItems: (selectedNames: ColoredMeshItem[]) => void,
    renderMode: IADT3DViewerRenderMode
): ICardboardListItem<string>[] {
    const onMeshItemEnter = (meshId: string) => {
        const coloredMeshItems: ColoredMeshItem[] = createColoredMeshItems(
            elementMeshIds.filter((id) => id !== meshId),
            null
        );
        coloredMeshItems.push({
            meshId: meshId,
            color: renderMode.coloredMeshHoverColor
        });
        setColoredMeshItems(coloredMeshItems);
    };

    const onMeshItemLeave = () => {
        setColoredMeshItems(createColoredMeshItems(elementMeshIds, null));
    };

    return elementMeshIds.sort().map((item) => {
        const viewModel: ICardboardListItem<string> = {
            ariaLabel: '',
            buttonProps: {
                onMouseOver: () => onMeshItemEnter(item),
                onMouseLeave: () => onMeshItemLeave(),
                onFocus: () => onMeshItemEnter(item),
                onBlur: () => onMeshItemLeave()
            },
            iconStartName: 'CubeShape',
            iconEndName: 'Delete',
            item: item,
            onClick: () => {
                const currentObjects = [...elementMeshIds];
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
