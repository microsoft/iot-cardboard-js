import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    SearchBox,
    mergeStyleSets,
    PrimaryButton,
    FocusTrapCallout,
    useTheme
} from '@fluentui/react';
import { IADT3DSceneBuilderAddBehaviorCalloutProps } from '../../../ADT3DSceneBuilder.types';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { IBehavior } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const AddBehaviorCallout: React.FC<IADT3DSceneBuilderAddBehaviorCalloutProps> = ({
    availableBehaviors,
    calloutTarget,
    onAddBehavior,
    onCreateBehaviorWithElements,
    hideCallout
}) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [
        filteredAvailableBehaviors,
        setFilteredAvailableBehaviors
    ] = useState<Array<IBehavior>>([]);
    const [listItems, setListItems] = useState<ICardboardListItem<IBehavior>[]>(
        []
    );

    useEffect(() => {
        setFilteredAvailableBehaviors(availableBehaviors);
    }, [availableBehaviors]);

    const searchBehaviors = (searchTerm: string) => {
        setFilteredAvailableBehaviors(
            availableBehaviors.filter((behavior) =>
                behavior.displayName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );
    };

    // generate the list of items to show
    useEffect(() => {
        const listItems = getListItems(
            filteredAvailableBehaviors,
            onAddBehavior
        );
        setListItems(listItems);
    }, [filteredAvailableBehaviors, onAddBehavior]);

    const theme = useTheme();
    return (
        <FocusTrapCallout
            focusTrapProps={{
                isClickableOutsideFocusTrap: true
            }}
            className={styles.callout}
            target={`#${calloutTarget}`}
            isBeakVisible={false}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={hideCallout}
            styles={{
                root: {
                    padding: 15,
                    width: 300,
                    backgroundColor: theme.semanticColors.bodyBackground
                    // boxShadow:
                },
                calloutMain: {
                    backgroundColor: 'unset'
                }
            }}
        >
            <div>
                <h4 className={styles.title}>
                    {t('3dSceneBuilder.addBehavior')}
                </h4>
                <div>
                    <SearchBox
                        data-testid={'behavior-callout-search'}
                        placeholder={t('3dSceneBuilder.searchBehaviors')}
                        onChange={(_event, value) => {
                            setSearchText(value);
                            searchBehaviors(value);
                        }}
                    />
                </div>
                <div className={styles.listRoot}>
                    {listItems?.length === 0 ? (
                        <div className={styles.resultText}>
                            {t('3dSceneBuilder.noAvailableBehaviors')}
                        </div>
                    ) : (
                        <CardboardList<IBehavior>
                            items={listItems}
                            listKey={`behavior-callout-list`}
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
                    onClick={onCreateBehaviorWithElements}
                >
                    {t('3dSceneBuilder.createBehavior')}
                </PrimaryButton>
            </div>
        </FocusTrapCallout>
    );
};

function getListItems(
    filteredElements: IBehavior[],
    onAddBehavior: (item: IBehavior) => void
) {
    return filteredElements.map((item) => {
        const viewModel: ICardboardListItem<IBehavior> = {
            ariaLabel: '',
            iconStart: { name: 'Ringer' },
            iconEnd: { name: 'Add' },
            item: item,
            onClick: onAddBehavior,
            textPrimary: item.displayName
        };

        return viewModel;
    });
}

const styles = mergeStyleSets({
    callout: {
        // padding: '15px',
        // width: '300px'
    },
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

export default AddBehaviorCallout;
