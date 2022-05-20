import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IADT3DSceneBuilderAddBehaviorCalloutProps } from '../../../ADT3DSceneBuilder.types';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import CardboardListCallout from '../../../../CardboardListCallout/CardboardListCallout';

const AddBehaviorCallout: React.FC<IADT3DSceneBuilderAddBehaviorCalloutProps> = ({
    availableBehaviors,
    calloutTarget,
    onAddBehavior,
    onCreateBehaviorWithElements,
    hideCallout,
    isCreateBehaviorDisabled = false
}) => {
    const { t } = useTranslation();

    const listItems = useMemo(
        () => getListItems(availableBehaviors, onAddBehavior),
        [availableBehaviors, onAddBehavior]
    );
    return (
        <CardboardListCallout
            listType="Complex"
            calloutTarget={calloutTarget}
            title={t('3dSceneBuilder.addBehavior')}
            listKey={'behavior-callout-list'}
            listItems={listItems}
            onDismiss={hideCallout}
            filterPlaceholder={t('3dSceneBuilder.searchBehaviors')}
            filterPredicate={(behavior: IBehavior, searchTerm) =>
                behavior.displayName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            }
            noResultText={t('3dSceneBuilder.noAvailableBehaviors')}
            primaryActionProps={{
                onPrimaryActionClick: onCreateBehaviorWithElements,
                primaryActionLabel: t('3dSceneBuilder.newBehavior'),
                disabled: isCreateBehaviorDisabled
            }}
            searchBoxDataTestId="behavior-callout-search"
        />
    );
};

function getListItems(
    behaviors: IBehavior[],
    onAddBehavior: (item: IBehavior) => void
) {
    return behaviors.map((item) => {
        const viewModel: ICardboardListItem<IBehavior> = {
            ariaLabel: '',
            iconStart: { name: 'Ringer' },
            iconEnd: { name: 'Add' },
            item: item,
            onClick: (item) => onAddBehavior(item),
            textPrimary: item.displayName
        };

        return viewModel;
    });
}

export default AddBehaviorCallout;
