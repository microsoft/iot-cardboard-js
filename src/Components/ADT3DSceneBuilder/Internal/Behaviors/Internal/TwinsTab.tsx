import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {
    ActionButton,
    IContextualMenuItem,
    IStackTokens,
    Label,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { TFunction, useTranslation } from 'react-i18next';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import {
    getActionButtonStyles,
    getLeftPanelStyles
} from '../../Shared/LeftPanel.styles';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import {
    DTDLPropertyIconographyMap,
    primaryTwinName
} from '../../../../../Models/Constants/Constants';
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { IBehaviorTwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import AddTwinAliasCallout from '../Twins/AddTwinAliasCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import CardboardListCallout from '../../../../CardboardListCallout/CardboardListCallout';
import { useModelledProperties } from '../../../../ModelledPropertyBuilder/useModelledProperties';
import {
    defaultAllowedPropertyValueTypes,
    IModelledProperty
} from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';

interface ITwinsTabProps {
    selectedElements: Array<ITwinToObjectMapping>;
    behaviors: Array<IBehavior>;
    onValidityChange: (tabName: TabNames, state: IValidityState) => void;
}

const TwinsTab: React.FC<ITwinsTabProps> = ({
    onValidityChange,
    selectedElements,
    behaviors
}) => {
    const { t } = useTranslation();
    const {
        config,
        sceneId,
        setBehaviorTwinAliasFormInfo,
        behaviorToEdit,
        setBehaviorToEdit,
        adapter
    } = useContext(SceneBuilderContext);
    const [primaryTwinList, setPrimaryTwinList] = useState([]);
    const [twinAliasList, setTwinAliasList] = useState([]);
    const [availableTwinAliases, setAvailableTwinAliases] = useState<
        Array<IBehaviorTwinAliasItem>
    >([]);
    const primaryTwinPropertiesTargetId = useId(
        'primaryTwinProperties-callout'
    );
    const addAliasCalloutTargetId = useId('addAlias-callout');
    const [
        isPrimaryTwinPropertiesCalloutVisible,
        { toggle: toggleIsPrimaryTwinPropertiesCalloutVisible }
    ] = useBoolean(false);
    const [
        isAddTwinAliasCalloutVisible,
        { toggle: toggleIsAddTwinAliasCalloutVisible }
    ] = useBoolean(false);

    // get the property names to show the common properties in primary twins in the (selected) elements of the behavior
    const {
        isLoading: isCommonPrimaryTwinPropertiesLoading,
        modelledProperties
    } = useModelledProperties({
        adapter,
        twinIdParams: {
            selectedElements,
            behavior: behaviorToEdit,
            config,
            sceneId,
            disableAliasedTwins: true
        },
        allowedPropertyValueTypes: defaultAllowedPropertyValueTypes
    });

    // set the single item primary twin list on mount
    useEffect(() => {
        setPrimaryTwinList(
            getPrimaryTwinListItems(
                t,
                toggleIsPrimaryTwinPropertiesCalloutVisible,
                primaryTwinPropertiesTargetId
            )
        );
    }, []);

    // when behavior to edit or selected elements (to keep track of element to twin id mappings) changes in Elements tab, update the twin alias list
    useEffect(() => {
        const twinAliases = ViewerConfigUtility.getTwinAliasItemsFromBehaviorAndElements(
            behaviorToEdit,
            selectedElements
        );

        setTwinAliasList(
            getTwinAliasListItems(
                twinAliases,
                onTwinAliasClick,
                onTwinAliasRemoveFromBehavior,
                t
            )
        );

        // if any of the twin ids in the element to twin mappings in a behavior twin alias item is null,
        // set Twins Tab in the behavior as not valid to show red alert icon since user needs to set all the element twin ids for an alias
        onValidityChange('Twins', {
            isValid: ViewerConfigUtility.areTwinAliasesValidInBehavior(
                behaviorToEdit,
                selectedElements
            )
        });
    }, [behaviorToEdit, selectedElements]);

    // when any of the dependency changes, update the list of available twin aliases to sho in the add twin alias callout for behavior
    useEffect(() => {
        const availableTwinAliasesForBehavior = ViewerConfigUtility.getAvailableBehaviorTwinAliasItemsBySceneAndElements(
            config,
            sceneId,
            selectedElements
        );
        const twinAliasesInBehavior = ViewerConfigUtility.getTwinAliasItemsFromBehaviorAndElements(
            behaviorToEdit,
            selectedElements
        );

        // filter the available twin aliases for behavior to display only the ones which are not currently added/existing in behavior
        setAvailableTwinAliases(
            availableTwinAliasesForBehavior.filter(
                (availableTwinAlias) =>
                    twinAliasesInBehavior.findIndex(
                        (twinAlias) =>
                            twinAlias.alias === availableTwinAlias.alias
                    ) === -1
            )
        );
    }, [behaviors, config, sceneId, selectedElements, behaviorToEdit]);

    // when adding a twin alias from available list, just update the twinAliases field in edited behavior to be reflected in config changes
    const onAddTwinAlias = useCallback((twinAlias: IBehaviorTwinAliasItem) => {
        setBehaviorToEdit(
            produce((draft) => {
                if (draft.twinAliases) {
                    draft.twinAliases = draft.twinAliases.concat(
                        twinAlias.alias
                    );
                } else {
                    draft.twinAliases = [twinAlias.alias];
                }
            })
        );
    }, []);

    const onCreateTwinAlias = useCallback(() => {
        setBehaviorTwinAliasFormInfo({
            twinAlias: null,
            mode: TwinAliasFormMode.CreateTwinAlias
        });
    }, [setBehaviorTwinAliasFormInfo]);

    const onTwinAliasClick = useCallback(
        (twinAliasItem: IBehaviorTwinAliasItem, idx: number) => {
            setBehaviorTwinAliasFormInfo({
                twinAlias: twinAliasItem,
                mode: TwinAliasFormMode.EditTwinAlias,
                twinAliasIdx: idx
            });
        },
        [setBehaviorTwinAliasFormInfo]
    );

    // when removing a twin alias from behavior, just update the twinAliases field in edited behavior to be reflected in config changes
    const onTwinAliasRemoveFromBehavior = useCallback(
        (twinAliasItem: IBehaviorTwinAliasItem) => {
            setBehaviorToEdit(
                produce((draft) => {
                    draft.twinAliases.splice(
                        draft.twinAliases.findIndex(
                            (tA) => tA === twinAliasItem.alias
                        ),
                        1
                    );
                })
            );
        },
        []
    );

    const primaryTwinProperties: Array<
        ICardboardListItem<IModelledProperty>
    > = useMemo(() => {
        const primaryTwinProperties =
            modelledProperties?.flattenedFormat?.[primaryTwinName] ?? [];
        return primaryTwinProperties.map((lP: IModelledProperty) => {
            const iconStart = DTDLPropertyIconographyMap[lP.propertyType]?.icon;
            return {
                textPrimary: lP.localPath,
                ...(iconStart && { iconStart: { name: iconStart } }),
                item: lP,
                onClick: () => null,
                ariaLabel: lP.localPath
            };
        });
    }, [modelledProperties]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const actionButtonStyles = getActionButtonStyles(theme);
    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>
                {t('3dSceneBuilder.twinAlias.descriptions.twins')}
            </Text>
            <div>
                <Label>{t('3dSceneBuilder.primaryTwin')}</Label>
                <Text className={commonPanelStyles.text}>
                    {t('3dSceneBuilder.twinAlias.descriptions.primaryTwin')}
                </Text>
                {isPrimaryTwinPropertiesCalloutVisible && (
                    <CardboardListCallout
                        listType="Complex"
                        calloutTarget={primaryTwinPropertiesTargetId}
                        title={t('3dSceneBuilder.twinAlias.commonProperties')}
                        listKey={'common-properties-callout-list'}
                        listItems={primaryTwinProperties}
                        isListLoading={isCommonPrimaryTwinPropertiesLoading}
                        onDismiss={toggleIsPrimaryTwinPropertiesCalloutVisible}
                        filterPlaceholder={t(
                            '3dSceneBuilder.twinAlias.searchProperties'
                        )}
                        filterPredicate={(
                            property: IModelledProperty,
                            searchTerm
                        ) =>
                            property.localPath
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        }
                        noResultText={t(
                            '3dSceneBuilder.noPrimaryTwinProperties'
                        )}
                        searchBoxDataTestId="primary-twin-callout-search"
                    />
                )}
                {primaryTwinList.length > 0 && (
                    <CardboardList<IBehaviorTwinAliasItem>
                        items={primaryTwinList}
                        listKey={`behavior-primary-twin-list`}
                    />
                )}
            </div>
            <div>
                <Label>{t('3dSceneBuilder.twinAlias.titlePlural')}</Label>
                {twinAliasList.length === 0 ? (
                    <div className={commonPanelStyles.noDataText}>
                        {t('3dSceneBuilder.twinAlias.noTwinAliasesAdded')}
                    </div>
                ) : (
                    <CardboardList<IBehaviorTwinAliasItem>
                        items={twinAliasList}
                        listKey={`behavior-aliased-twin-list`}
                    />
                )}
                <ActionButton
                    id={addAliasCalloutTargetId}
                    styles={actionButtonStyles}
                    text={t('3dSceneBuilder.twinAlias.add')}
                    data-testid={'twinsTab-addTwinAlias'}
                    onClick={toggleIsAddTwinAliasCalloutVisible}
                />
            </div>
            {isAddTwinAliasCalloutVisible && (
                <AddTwinAliasCallout
                    calloutTarget={addAliasCalloutTargetId}
                    availableTwinAliases={availableTwinAliases}
                    hideCallout={toggleIsAddTwinAliasCalloutVisible}
                    onAddTwinAlias={onAddTwinAlias}
                    onCreateTwinAlias={onCreateTwinAlias}
                />
            )}
        </Stack>
    );
};

function getPrimaryTwinListItems(
    t: TFunction<string>,
    onPrimaryTwinClick: () => void,
    buttonId: string
): ICardboardListItem<string>[] {
    const listItem: ICardboardListItem<string> = {
        ariaLabel: t('3dSceneBuilder.primaryTwin'),
        iconStart: { name: 'LinkedDatabase' },
        iconEnd: { name: 'RedEye' },
        item: primaryTwinName,
        onClick: onPrimaryTwinClick,
        textPrimary: primaryTwinName,
        buttonProps: {
            id: buttonId
        }
    };

    return [listItem];
}

function getTwinAliasListItems(
    twinAliases: Array<IBehaviorTwinAliasItem>,
    onTwinAliasClick: (item: IBehaviorTwinAliasItem, idx: number) => void,
    onTwinAliasRemove: (item: IBehaviorTwinAliasItem) => void,
    t: TFunction<string>
): ICardboardListItem<IBehaviorTwinAliasItem>[] {
    const getMenuItems = (
        item: IBehaviorTwinAliasItem,
        idx: number
    ): IContextualMenuItem[] => {
        return [
            {
                'data-testid': 'behaviorTwinAlias-modifyOverflow',
                key: 'modify',
                iconProps: { iconName: 'Edit' },
                text: t('3dSceneBuilder.twinAlias.modify'),
                onClick: () => {
                    onTwinAliasClick(item, idx);
                }
            },
            {
                'data-testid': 'behaviorTwinAlias-removeOverflow',
                key: 'remove',
                iconProps: {
                    iconName: 'Delete'
                },
                text: t('3dSceneBuilder.twinAlias.removeFromBehavior'),
                onClick: () => {
                    onTwinAliasRemove(item);
                }
            }
        ];
    };

    return twinAliases.map((twinAlias, idx) => {
        const listItem: ICardboardListItem<IBehaviorTwinAliasItem> = {
            ariaLabel: twinAlias.alias,
            iconStart: { name: 'LinkedDatabase' },
            item: twinAlias,
            isValid: !twinAlias.elementToTwinMappings.some(
                (mapping) => !mapping.twinId
            ),
            onClick: () => onTwinAliasClick(twinAlias, idx),
            textPrimary: twinAlias.alias,
            overflowMenuItems: getMenuItems(twinAlias, idx)
        };

        return listItem;
    });
}

const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default TwinsTab;
