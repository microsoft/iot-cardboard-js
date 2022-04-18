import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    SearchBox,
    mergeStyleSets,
    PrimaryButton,
    FocusTrapCallout,
    useTheme
} from '@fluentui/react';
import { IADT3DSceneBuilderAddTwinAliasCalloutProps } from '../../../ADT3DSceneBuilder.types';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { IBehaviorTwinAliasItem } from '../../../../../Models/Classes/3DVConfig';

const AddTwinAliasCallout: React.FC<IADT3DSceneBuilderAddTwinAliasCalloutProps> = ({
    availableTwinAliases,
    calloutTarget,
    onAddTwinAlias,
    onCreateTwinAlias,
    hideCallout
}) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [filteredTwinAlises, setFilteredTwinAlises] = useState<
        Array<IBehaviorTwinAliasItem>
    >(availableTwinAliases);

    const searchTwinAliases = useCallback(
        (searchTerm: string) => {
            setFilteredTwinAlises(
                availableTwinAliases.filter((twinAlias) =>
                    twinAlias.alias
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            );
        },
        [availableTwinAliases]
    );

    const listItems = useMemo(
        () => getListItems(filteredTwinAlises, onAddTwinAlias),
        [filteredTwinAlises, onAddTwinAlias]
    );

    useEffect(() => {
        setFilteredTwinAlises(availableTwinAliases);
    }, [availableTwinAliases]);

    const theme = useTheme();
    return (
        <FocusTrapCallout
            focusTrapProps={{
                isClickableOutsideFocusTrap: true
            }}
            target={`#${calloutTarget}`}
            isBeakVisible={false}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={hideCallout}
            styles={{
                root: {
                    padding: 15,
                    width: 300,
                    backgroundColor: theme.semanticColors.bodyBackground
                },
                calloutMain: {
                    backgroundColor: 'unset'
                }
            }}
        >
            <div>
                <h4 className={styles.title}>
                    {t('3dSceneBuilder.twinAlias.add')}
                </h4>
                {availableTwinAliases.length > 0 && (
                    <SearchBox
                        data-testid={'twin-alias-callout-search'}
                        placeholder={t('3dSceneBuilder.twinAlias.search')}
                        onChange={(_event, value) => {
                            setSearchText(value);
                            searchTwinAliases(value);
                        }}
                    />
                )}

                {listItems?.length === 0 ? (
                    <div className={styles.resultText}>
                        {t('3dSceneBuilder.twinAlias.noTwinAliasesToAdd')}
                    </div>
                ) : (
                    <div className={styles.listRoot}>
                        <CardboardList<IBehaviorTwinAliasItem>
                            listProps={{ className: styles.list }}
                            items={listItems}
                            listKey={`twin-alias-callout-list`}
                            textToHighlight={searchText}
                        />
                    </div>
                )}

                <PrimaryButton
                    styles={{
                        root: {
                            marginTop: 16
                        }
                    }}
                    onClick={onCreateTwinAlias}
                >
                    {t('3dSceneBuilder.twinAlias.create')}
                </PrimaryButton>
            </div>
        </FocusTrapCallout>
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

const styles = mergeStyleSets({
    title: {
        marginTop: '0px'
    },
    listRoot: {
        paddingTop: 8
    },
    list: {
        '.ms-List-surface': {
            maxHeight: 200,
            overflowX: 'hidden',
            overflowY: 'auto'
        }
    },
    resultText: {
        fontSize: '12px',
        marginTop: '5px',
        opacity: '0.6'
    }
});

export default AddTwinAliasCallout;
