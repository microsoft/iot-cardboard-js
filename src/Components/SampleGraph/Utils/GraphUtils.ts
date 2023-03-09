import { OAT_EXTEND_HANDLE_NAME } from '../../..';
import { IOATSelection } from '../../../Pages/OATEditorPage/OATEditorPage.types';
import { ICustomEdgeData, ICustomNodeData } from '../GraphTypes.types';

const getSelectionIdentifier = (data: ICustomEdgeData) => {
    switch (data.type) {
        case OAT_EXTEND_HANDLE_NAME:
            return data.source;
        default:
            return data.name;
    }
};
export const getSelectionFromGraphItem = (
    selectedItem: ICustomEdgeData | ICustomNodeData
): IOATSelection => {
    // handle edge selection
    if (selectedItem.itemType === 'Edge') {
        const edge = selectedItem;
        const payload = {
            modelId: edge.source,
            contentId: getSelectionIdentifier(selectedItem)
        };
        return payload;
    }

    // node selected
    return { modelId: selectedItem.id };
};
