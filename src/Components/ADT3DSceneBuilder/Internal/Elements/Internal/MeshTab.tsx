import React, { useContext, useEffect, useState } from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { createCustomMeshItems } from '../../../../3DV/SceneView.Utils';
import { CustomMeshItem } from '../../../../../Models/Classes/SceneView.types';
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
            elementToEdit.objectIDs,
            setColoredMeshItems,
            state.renderMode
        );
        setListItems(listItems);
    }, [elementToEdit, setColoredMeshItems]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <>
            {elementToEdit.objectIDs.length === 0 ? (
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
    setColoredMeshItems: (selectedNames: CustomMeshItem[]) => void,
    renderMode: IADT3DViewerRenderMode
): ICardboardListItem<string>[] {
    const onMeshItemEnter = (meshId: string) => {
        const coloredMeshItems: CustomMeshItem[] = createCustomMeshItems(
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
        setColoredMeshItems(createCustomMeshItems(elementMeshIds, null));
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
                    createCustomMeshItems(currentObjects, null)
                );
            },
            textPrimary: item
        };

        return viewModel;
    });
}
export default MeshTab;
