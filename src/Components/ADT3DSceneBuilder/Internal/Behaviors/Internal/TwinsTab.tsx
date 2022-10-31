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
    PRIMARY_TWIN_NAME
} from '../../../../../Models/Constants/Constants';
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { IBehaviorTwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import AddTwinAliasCallout from '../Twins/AddTwinAliasCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { IValidityState, TabNames } from '../BehaviorForm.types';
import CardboardListCallout from '../../../../CardboardListCallout/CardboardListCallout';
import { useModelledProperties } from '../../../../ModelledPropertyBuilder/useModelledProperties';
import {
    defaultAllowedPropertyValueTypes,
    IModelledProperty
} from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { useBehaviorFormContext } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';

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
    // contexts
    const {
        config,
        sceneId,
        setBehaviorTwinAliasFormInfo,
        adapter
    } = useContext(SceneBuilderContext);
    const {
        behaviorFormDispatch,
        behaviorFormState
    } = useBehaviorFormContext();

    // hooks
    const { t } = useTranslation();

    const [twinList, setTwinList] = useState([]);
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
            behavior: behaviorFormState.behaviorToEdit,
            config,
            sceneId,
            disableAliasedTwins: true
        },
        allowedPropertyValueTypes: defaultAllowedPropertyValueTypes
    });

    // ----- callbacks -----
    const onTwinAliasClick = useCallback(
        (twinAliasItem: IBehaviorTwinAliasItem) => {
            setBehaviorTwinAliasFormInfo({
                twinAlias: twinAliasItem,
                mode: TwinAliasFormMode.EditTwinAlias
            });
        },
        [setBehaviorTwinAliasFormInfo]
    );

    // when removing a twin alias from behavior, just update the twinAliases field in edited behavior to be reflected in config changes
    const onTwinAliasRemoveFromBehavior = useCallback(
        (twinAliasItem: IBehaviorTwinAliasItem) => {
            behaviorFormDispatch({
                type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_REMOVE,
                payload: {
                    alias: twinAliasItem.alias
                }
            });
        },
        [behaviorFormDispatch]
    );

    // when adding a twin alias from available list, just update the twinAliases field in edited behavior to be reflected in config changes
    const onAddTwinAlias = useCallback(
        (twinAlias: IBehaviorTwinAliasItem) => {
            behaviorFormDispatch({
                type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD,
                payload: {
                    alias: twinAlias.alias
                }
            });
        },
        [behaviorFormDispatch]
    );

    const onCreateTwinAlias = useCallback(
        (searchText: string) => {
            setBehaviorTwinAliasFormInfo({
                twinAlias: null,
                mode: TwinAliasFormMode.CreateTwinAlias,
                ...(searchText && { aliasToAutoPopulate: searchText })
            });
        },
        [setBehaviorTwinAliasFormInfo]
    );

    // when behavior to edit or selected elements (to keep track of element to twin id mappings) changes in Elements tab, update the twin alias list
    useEffect(() => {
        const twinAliases = ViewerConfigUtility.getTwinAliasItemsFromBehaviorAndElements(
            behaviorFormState.behaviorToEdit,
            selectedElements
        );

        setTwinList(
            getTwinAliasListItems(
                twinAliases,
                toggleIsPrimaryTwinPropertiesCalloutVisible,
                primaryTwinPropertiesTargetId,
                onTwinAliasClick,
                onTwinAliasRemoveFromBehavior,
                t
            )
        );

        // if any of the twin ids in the element to twin mappings in a behavior twin alias item is null,
        // set Twins Tab in the behavior as not valid to show red alert icon since user needs to set all the element twin ids for an alias
        onValidityChange('Twins', {
            isValid: ViewerConfigUtility.areTwinAliasesValidInBehavior(
                behaviorFormState.behaviorToEdit,
                selectedElements
            )
        });
    }, [
        behaviorFormState.behaviorToEdit,
        onTwinAliasClick,
        onTwinAliasRemoveFromBehavior,
        onValidityChange,
        primaryTwinPropertiesTargetId,
        selectedElements,
        t,
        toggleIsPrimaryTwinPropertiesCalloutVisible
    ]);

    // when any of the dependency changes, update the list of available twin aliases to sho in the add twin alias callout for behavior
    useEffect(() => {
        const availableTwinAliasesForBehavior = ViewerConfigUtility.getAvailableBehaviorTwinAliasItemsBySceneAndElements(
            config,
            sceneId,
            selectedElements
        );
        const twinAliasesInBehavior = ViewerConfigUtility.getTwinAliasItemsFromBehaviorAndElements(
            behaviorFormState.behaviorToEdit,
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
    }, [
        behaviors,
        config,
        sceneId,
        selectedElements,
        behaviorFormState.behaviorToEdit
    ]);

    const primaryTwinProperties: Array<
        ICardboardListItem<IModelledProperty>
    > = useMemo(() => {
        const primaryTwinProperties =
            modelledProperties?.flattenedFormat?.[PRIMARY_TWIN_NAME] ?? [];
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
        <Stack
            tokens={{ childrenGap: 12 }}
            className={commonPanelStyles.paddedLeftPanelBlock}
        >
            <Text className={commonPanelStyles.text}>
                {t('3dSceneBuilder.twinAlias.tabDescriptionPart1')}
            </Text>
            <Text className={commonPanelStyles.text}>
                {t('3dSceneBuilder.twinAlias.tabDescriptionPart2')}
            </Text>
            <div>
                <Label>
                    {t('3dSceneBuilder.twinAlias.linkedTwinListHeader', {
                        count: twinList?.length || 0
                    })}
                </Label>
                {twinList.length > 0 && (
                    <CardboardList<string>
                        items={twinList}
                        listKey={`behavior-primary-twin-list`}
                    />
                )}
            </div>
            <ActionButton
                id={addAliasCalloutTargetId}
                styles={actionButtonStyles}
                text={t('3dSceneBuilder.twinAlias.add')}
                data-testid={'twinsTab-addTwinAlias'}
                onClick={toggleIsAddTwinAliasCalloutVisible}
            />
            {isPrimaryTwinPropertiesCalloutVisible && (
                <CardboardListCallout
                    listType="Complex"
                    calloutTarget={primaryTwinPropertiesTargetId}
                    title={t('3dSceneBuilder.twinAlias.commonProperties')}
                    description={t(
                        '3dSceneBuilder.twinAlias.calloutDescription'
                    )}
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
                    noResultText={t('3dSceneBuilder.noPrimaryTwinProperties')}
                    searchBoxDataTestId="primary-twin-callout-search"
                />
            )}
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

function getTwinAliasListItems(
    twinAliases: Array<IBehaviorTwinAliasItem>,
    onPrimaryTwinClick: () => void,
    primaryTwinButtonId: string,
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

    const listItemsPrimary: ICardboardListItem<IBehaviorTwinAliasItem> = {
        ariaLabel: t('3dSceneBuilder.primaryTwin'),
        iconStart: { name: 'LinkedDatabase' },
        iconEnd: { name: 'EntryView' },
        id: primaryTwinButtonId,
        // we don't care about the item anyways so the casting is fine, it just gets fed back to the onclick
        item: (PRIMARY_TWIN_NAME as unknown) as IBehaviorTwinAliasItem,
        onClick: onPrimaryTwinClick,
        textPrimary: PRIMARY_TWIN_NAME
    };
    const listItems: ICardboardListItem<IBehaviorTwinAliasItem>[] = [
        listItemsPrimary
    ];

    twinAliases.forEach((twinAlias, idx) => {
        const listItem: ICardboardListItem<IBehaviorTwinAliasItem> = {
            ariaLabel: twinAlias.alias,
            iconStart: { name: 'LinkedDatabase' },
            item: twinAlias,
            isValid: !twinAlias.elementToTwinMappings.some(
                (mapping) => !mapping.twinId
            ),
            onClick: (item) => onTwinAliasClick(item, idx),
            textPrimary: twinAlias.alias,
            overflowMenuItems: getMenuItems(twinAlias, idx)
        };

        listItems.push(listItem);
    });

    return listItems;
}

export default TwinsTab;
