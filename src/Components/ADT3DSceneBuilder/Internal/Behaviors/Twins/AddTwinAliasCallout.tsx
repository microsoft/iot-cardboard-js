import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IADT3DSceneBuilderAddTwinAliasCalloutProps } from '../../../ADT3DSceneBuilder.types';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { IBehaviorTwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import CardboardListCallout from '../../../../CardboardListCallout/CardboardListCallout';

const AddTwinAliasCallout: React.FC<IADT3DSceneBuilderAddTwinAliasCalloutProps> = ({
    availableTwinAliases,
    calloutTarget,
    onAddTwinAlias,
    onCreateTwinAlias,
    hideCallout
}) => {
    const { t } = useTranslation();
    const listItems = useMemo(
        () => getListItems(availableTwinAliases, onAddTwinAlias),
        [availableTwinAliases, onAddTwinAlias]
    );

    return (
        <CardboardListCallout
            listType="Complex"
            calloutTarget={calloutTarget}
            dataButtonTestId={'create-twin-callout-button'}
            title={t('3dSceneBuilder.twinAlias.add')}
            listKey={'twin-alias-callout-list'}
            listItems={listItems}
            onDismiss={hideCallout}
            filterPlaceholder={t('3dSceneBuilder.twinAlias.search')}
            filterPredicate={(twinAlias: IBehaviorTwinAliasItem, searchTerm) =>
                twinAlias.alias.toLowerCase().includes(searchTerm.toLowerCase())
            }
            noResultText={t('3dSceneBuilder.twinAlias.noTwinAliasesToAdd')}
            primaryActionProps={{
                onPrimaryActionClick: onCreateTwinAlias,
                primaryActionLabel: t('3dSceneBuilder.twinAlias.create')
            }}
            searchBoxDataTestId="twin-alias-callout-search"
        />
    );
};

function getListItems(
    filteredTwinAlises: IBehaviorTwinAliasItem[],
    onAddTwinAlias: (item: IBehaviorTwinAliasItem) => void
) {
    return (
        filteredTwinAlises?.map((item) => {
            const viewModel: ICardboardListItem<IBehaviorTwinAliasItem> = {
                ariaLabel: '',
                iconStart: { name: 'LinkedDatabase' },
                iconEnd: { name: 'Add' },
                item: item,
                onClick: () => onAddTwinAlias(item),
                textPrimary: item.alias
            };

            return viewModel;
        }) ?? []
    );
}

export default AddTwinAliasCallout;
