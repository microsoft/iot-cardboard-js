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
import { ITwinAliasItem } from '../../../../../Models/Classes/3DVConfig';

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
        Array<ITwinAliasItem>
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
        <FocusTrapCallout // TODO: make this callout reusable component since many subcomponents are using it
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
                    {t('3dSceneBuilder.addTwinAlias')}
                </h4>
                <div>
                    <SearchBox
                        data-testid={'twin-alias-callout-search'}
                        placeholder={t('3dSceneBuilder.searchTwinAliases')}
                        onChange={(_event, value) => {
                            setSearchText(value);
                            searchTwinAliases(value);
                        }}
                    />
                </div>
                <div className={styles.listRoot}>
                    {listItems?.length === 0 ? (
                        <div className={styles.resultText}>
                            {t('3dSceneBuilder.noAvailableTwinAliases')}
                        </div>
                    ) : (
                        <CardboardList<ITwinAliasItem>
                            items={listItems}
                            listKey={`twin-aslias-callout-list`}
                            textToHighlight={searchText}
                        />
                    )}
                </div>
                <PrimaryButton
                    styles={{
                        root: {
                            marginTop: '16px'
                        }
                    }}
                    onClick={onCreateTwinAlias}
                >
                    {t('3dSceneBuilder.createTwinAlias')}
                </PrimaryButton>
            </div>
        </FocusTrapCallout>
    );
};

function getListItems(
    filteredTwinAlises: ITwinAliasItem[],
    onAddTwinAlias: (item: ITwinAliasItem) => void
) {
    return (
        filteredTwinAlises?.map((item) => {
            const viewModel: ICardboardListItem<ITwinAliasItem> = {
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
    resultText: {
        fontSize: '12px',
        marginTop: '5px',
        opacity: '0.6'
    },
    item: {
        alignItems: 'center',
        display: 'flex',
        marginTop: '15px',
        width: '100%',
        height: 'auto'
    },
    icon: {
        display: 'inline-block',
        fontSize: '16px'
    },
    name: {
        flex: '1',
        fontSize: '14px',
        paddingLeft: '8px',
        textAlign: 'start'
    }
});

export default AddTwinAliasCallout;
