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
import { linkedTwinName } from '../../../../../Models/Constants/Constants';
import {
    IAliasedTwinProperty,
    TwinAliasFormMode
} from '../../../../../Models/Constants';
import { IBehaviorTwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import AddTwinAliasCallout from '../Twins/AddTwinAliasCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import LinkedTwinPropertiesCallout from '../Twins/LinkedTwinPropertiesCallout';
import useBehaviorAliasedTwinProperties from '../../../../../Models/Hooks/useBehaviorAliasedTwinProperties';
import { IValidityState, TabNames } from '../BehaviorForm.types';

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
        setBehaviorToEdit
    } = useContext(SceneBuilderContext);
    const [linkedTwinList, setLinkedTwinList] = useState([]);
    const [twinAliasList, setTwinAliasList] = useState([]);
    const [availableTwinAliases, setAvailableTwinAliases] = useState<
        Array<IBehaviorTwinAliasItem>
    >([]);
    const linkedTwinPropertiesTargetId = useId('linkedTwinProperties-callout');
    const addAliasCalloutTargetId = useId('addAlias-callout');
    const [
        isLinkedTwinPropertiesCalloutVisible,
        { toggle: toggleIsLinkedTwinPropertiesCalloutVisible }
    ] = useBoolean(false);
    const [
        isAddTwinAliasCalloutVisible,
        { toggle: toggleIsAddTwinAliasCalloutVisible }
    ] = useBoolean(false);

    // get the property names to show the common properties in linked twins in the (selected) elements of the behavior
    const {
        options: commonLinkedTwinProperties,
        isLoading: isCommonLinkedTwinPropertiesLoading
    } = useBehaviorAliasedTwinProperties({
        behavior: behaviorToEdit,
        isTwinAliasesIncluded: false,
        selectedElements
    });

    // set the single item linked twin list on mount
    useEffect(() => {
        setLinkedTwinList(
            getLinkedTwinListItems(
                t,
                toggleIsLinkedTwinPropertiesCalloutVisible,
                linkedTwinPropertiesTargetId
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

    const linkedTwinProperties = useMemo(
        () =>
            commonLinkedTwinProperties.map(
                (lP: IAliasedTwinProperty) => lP.property
            ),
        [commonLinkedTwinProperties]
    );

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    const actionButtonStyles = getActionButtonStyles(theme);
    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>
                {t('3dSceneBuilder.twinAlias.descriptions.twins')}
            </Text>
            <div>
                <Label>{t('3dSceneBuilder.linkedTwin')}</Label>
                <Text className={commonPanelStyles.text}>
                    {t('3dSceneBuilder.twinAlias.descriptions.linkedTwin')}
                </Text>
                {isLinkedTwinPropertiesCalloutVisible && (
                    <LinkedTwinPropertiesCallout
                        calloutTarget={linkedTwinPropertiesTargetId}
                        commonLinkedTwinProperties={linkedTwinProperties}
                        isLoading={isCommonLinkedTwinPropertiesLoading}
                        hideCallout={toggleIsLinkedTwinPropertiesCalloutVisible}
                    />
                )}
                {linkedTwinList.length > 0 && (
                    <CardboardList<IBehaviorTwinAliasItem>
                        items={linkedTwinList}
                        listKey={`behavior-linked-twin-list`}
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

function getLinkedTwinListItems(
    t: TFunction<string>,
    onLinkedTwinClick: () => void,
    buttonId: string
): ICardboardListItem<string>[] {
    const listItem: ICardboardListItem<string> = {
        ariaLabel: t('3dSceneBuilder.linkedTwin'),
        iconStart: { name: 'LinkedDatabase' },
        iconEnd: { name: 'RedEye' },
        item: linkedTwinName,
        onClick: onLinkedTwinClick,
        textPrimary: linkedTwinName,
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
