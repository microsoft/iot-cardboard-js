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
import { BehaviorFormContext } from '../BehaviorsForm';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { linkedTwinName } from '../../../../../Models/Constants/Constants';
import {
    IAliasedTwinProperty,
    TwinAliasFormMode
} from '../../../../../Models/Constants';
import { ITwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import AddTwinAliasCallout from '../Twins/AddTwinAliasCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';
import LinkedTwinPropertiesCallout from '../Twins/LinkedTwinPropertiesCallout';
import useBehaviorTwinPropertyNames from '../../../../../Models/Hooks/useBehaviorTwinPropertyNames';

interface ITwinsTabProps {
    selectedElements: Array<ITwinToObjectMapping>;
    behaviors: Array<IBehavior>;
}

const TwinsTab: React.FC<ITwinsTabProps> = ({
    selectedElements,
    behaviors
}) => {
    const { t } = useTranslation();
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const { config, sceneId, setTwinAliasFormInfo } = useContext(
        SceneBuilderContext
    );
    const [linkedTwinList, setLinkedTwinList] = useState([]);
    const [twinAliasList, setTwinAliasList] = useState([]);
    const [availableTwinAliases, setAvailableTwinAliases] = useState<
        Array<ITwinAliasItem>
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

    const {
        options: commonLinkedTwinProperties,
        isLoading: isCommonLinkedTwinPropertiesLoading
    } = useBehaviorTwinPropertyNames({
        behavior: behaviorToEdit,
        isFullName: false,
        isTwinAliasesIncluded: false
    });
    const commonPanelStyles = getLeftPanelStyles(useTheme());

    useEffect(() => {
        setLinkedTwinList(
            getLinkedTwinListItems(
                t,
                toggleIsLinkedTwinPropertiesCalloutVisible,
                linkedTwinPropertiesTargetId
            )
        );

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
    }, [behaviorToEdit, selectedElements]);

    useEffect(() => {
        const availableTwinAliasesForBehavior = ViewerConfigUtility.getAvailableTwinAliasItemsFromSceneForBehavior(
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

    const onAddTwinAlias = useCallback((twinAlias: ITwinAliasItem) => {
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
        setTwinAliasFormInfo({
            twinAlias: null,
            mode: TwinAliasFormMode.CreateTwinAlias
        });
    }, [setTwinAliasFormInfo]);

    const onTwinAliasClick = useCallback(
        (twinAliasItem: ITwinAliasItem, idx: number) => {
            setTwinAliasFormInfo({
                twinAlias: twinAliasItem,
                mode: TwinAliasFormMode.EditTwinAlias,
                twinAliasIdx: idx
            });
        },
        [setTwinAliasFormInfo]
    );

    const onTwinAliasRemoveFromBehavior = useCallback(
        (twinAliasItem: ITwinAliasItem) => {
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

    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>
                {t('3dSceneBuilder.twinAlias.descriptions.twins')}
            </Text>
            <div className={commonPanelStyles.section}>
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
                    <CardboardList<ITwinAliasItem>
                        items={linkedTwinList}
                        listKey={`behavior-linked-twin-list`}
                    />
                )}
            </div>
            <Label>{t('3dSceneBuilder.twinAlias.titlePlural')}</Label>
            {twinAliasList.length === 0 ? (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.twinAlias.noTwinAliasesAdded')}
                </div>
            ) : (
                <CardboardList<ITwinAliasItem>
                    items={twinAliasList}
                    listKey={`behavior-aliased-twin-list`}
                />
            )}
            <ActionButton
                id={addAliasCalloutTargetId}
                className={commonPanelStyles.actionButton}
                text={t('3dSceneBuilder.twinAlias.add')}
                data-testid={'widgetForm-addTwinAlias'}
                onClick={toggleIsAddTwinAliasCalloutVisible}
            />
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
    twinAliases: Array<ITwinAliasItem>,
    onTwinAliasClick: (item: ITwinAliasItem, idx: number) => void,
    onTwinAliasRemove: (item: ITwinAliasItem) => void,
    t: TFunction<string>
): ICardboardListItem<ITwinAliasItem>[] {
    const getMenuItems = (
        item: ITwinAliasItem,
        idx: number
    ): IContextualMenuItem[] => {
        return [
            {
                'data-testid': 'modifyOverflow',
                key: 'modify',
                iconProps: { iconName: 'Edit' },
                text: t('3dSceneBuilder.twinAlias.modify'),
                onClick: () => {
                    onTwinAliasClick(item, idx);
                }
            },
            {
                'data-testid': 'twinalias-removeOverflow',
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
        const listItem: ICardboardListItem<ITwinAliasItem> = {
            ariaLabel: twinAlias.alias,
            iconStart: { name: 'LinkedDatabase' },
            item: twinAlias,
            onClick: () => onTwinAliasClick(twinAlias, idx),
            textPrimary: twinAlias.alias,
            overflowMenuItems: getMenuItems(twinAlias, idx)
        };

        return listItem;
    });
}

const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default TwinsTab;
