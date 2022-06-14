import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import { useTheme } from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { createCustomMeshItems } from '../../../../3DV/SceneView.Utils';
import { CustomMeshItem } from '../../../../../Models/Classes/SceneView.types';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { IADTObjectColor } from '../../../../../Models/Constants';

interface MeshTabProps {
    elementToEdit: ITwinToObjectMapping;
}
const MeshTab: React.FC<MeshTabProps> = ({ elementToEdit }) => {
    const { t } = useTranslation();
    const [listItems, setListItems] = useState<ICardboardListItem<string>[]>(
        []
    );

    const { setColoredMeshItems, objectColor } = useContext(
        SceneBuilderContext
    );

    const compareListItems = useCallback(() => {
        if (elementToEdit.objectIDs.length === listItems.length) {
            return false;
        } else {
            return true;
        }
    }, [elementToEdit.objectIDs.length, listItems.length]);

    // generate the list of items to show
    useEffect(() => {
        if (compareListItems()) {
            const listItems = getListItems(
                elementToEdit.objectIDs,
                setColoredMeshItems,
                objectColor
            );
            setListItems(listItems);
        }
    }, [
        elementToEdit.objectIDs,
        setColoredMeshItems,
        objectColor,
        compareListItems
    ]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <div className={commonPanelStyles.paddedLeftPanelBlock}>
            {elementToEdit.objectIDs.length === 0 ? (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.elementFormMeshTab.noDataMessage')}
                </div>
            ) : (
                <CardboardList<string>
                    items={listItems}
                    listKey={`mesh-list`}
                />
            )}
        </div>
    );
};
function getListItems(
    elementMeshIds: string[],
    setColoredMeshItems: (selectedNames: CustomMeshItem[]) => void,
    objectColor: IADTObjectColor
): ICardboardListItem<string>[] {
    const onMeshItemEnter = (meshId: string) => {
        const coloredMeshItems: CustomMeshItem[] = createCustomMeshItems(
            elementMeshIds.filter((id) => id !== meshId),
            null
        );
        coloredMeshItems.push({
            meshId: meshId,
            color: objectColor.coloredMeshHoverColor
        });
        setColoredMeshItems(coloredMeshItems);
    };

    const onMeshItemLeave = () => {
        setColoredMeshItems(createCustomMeshItems(elementMeshIds, null));
    };

    const onLeave = () => onMeshItemLeave();
    return elementMeshIds.sort().map((item) => {
        const viewModel: ICardboardListItem<string> = {
            ariaLabel: '',
            buttonProps: {
                onMouseEnter: () => onMeshItemEnter(item),
                onMouseLeave: onLeave,
                onFocus: () => onMeshItemEnter(item),
                onBlur: onLeave
            },
            iconStart: { name: 'CubeShape' },
            iconEnd: {
                name: 'Delete',
                onClick: () => {
                    const currentObjects = [...elementMeshIds];
                    currentObjects.splice(currentObjects.indexOf(item), 1);
                    setColoredMeshItems(
                        createCustomMeshItems(currentObjects, null)
                    );
                }
            },
            item: item,
            onClick: () => undefined,
            textPrimary: item
        };

        return viewModel;
    });
}
export default MeshTab;
