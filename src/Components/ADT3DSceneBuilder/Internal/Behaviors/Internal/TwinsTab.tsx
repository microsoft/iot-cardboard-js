import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    ActionButton,
    Callout,
    DirectionalHint,
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
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { ITwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import AddTwinAliasCallout from './AddTwinAliasCallout';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import produce from 'immer';

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
    const { config, sceneId, adapter, setTwinAliasFormInfo } = useContext(
        SceneBuilderContext
    );
    const [
        commonLinkedTwinProperties,
        setCommonLinkedTwinProperties
    ] = useState([]); // TODO update this part as necessary
    const commonLinkedTwinPropertiesRef = useRef([]);
    const [linkedTwinList, setLinkedTwinList] = useState([]);
    const [twinAliasList, setTwinAliasList] = useState([]);
    const [availableTwinAliases, setAvailableTwinAliases] = useState<
        Array<ITwinAliasItem>
    >([]);
    const linkedTwinPropertiesId = useId('linkedTwinProperties-callout');
    const addAliasCalloutTargetId = useId('addAlias-callout');
    const [
        isLinkedTwinPropertiesCalloutVisible,
        { toggle: toggleIsLinkedTwinPropertiesCalloutVisible }
    ] = useBoolean(false);
    const [
        isAddTwinAliasCalloutVisible,
        { toggle: toggleIsAddTwinAliasCalloutVisible }
    ] = useBoolean(false);
    const commonPanelStyles = getLeftPanelStyles(useTheme());

    useEffect(() => {
        adapter
            .getCommonTwinPropertiesForBehavior(sceneId, config, behaviorToEdit)
            .then((properties) => {
                setCommonLinkedTwinProperties(properties);
                commonLinkedTwinPropertiesRef.current = properties;
            }); // TODO change this common properties UI as necessary

        setLinkedTwinList(
            getLinkedTwinItems(
                t,
                toggleIsLinkedTwinPropertiesCalloutVisible,
                linkedTwinPropertiesId
            )
        );

        const twinAliases = getTwinAliasesFromBehavior(
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
        const twinAliases: Array<ITwinAliasItem> = [];
        const [
            behaviorsInScene
        ] = ViewerConfigUtility.getBehaviorsSegmentedByPresenceInScene(
            config,
            sceneId,
            behaviors
        );
        behaviorsInScene.forEach((behaviorInScene) => {
            // TODO: move this viewer config utils
            const twinAliasesFromBehavior = getTwinAliasesFromBehavior(
                behaviorInScene,
                selectedElements
            );
            twinAliasesFromBehavior.forEach((twinAliasFromBehavior) => {
                if (
                    !twinAliases.find(
                        (twinAlias) =>
                            twinAlias.alias === twinAliasFromBehavior.alias
                    )
                ) {
                    twinAliases.push(twinAliasFromBehavior);
                }
            });
        });
        const twinAliasesInBehavior = getTwinAliasesFromBehavior(
            behaviorToEdit,
            selectedElements
        );
        setAvailableTwinAliases(
            twinAliases.filter(
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
        (twinAliasItem: ITwinAliasItem) => {
            setTwinAliasFormInfo({
                twinAlias: twinAliasItem,
                mode: TwinAliasFormMode.EditTwinAlias
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

    return (
        <Stack tokens={sectionStackTokens}>
            <Text className={commonPanelStyles.text}>
                Twins give you access to properties which can be used in
                expressions.
            </Text>
            <div className={commonPanelStyles.section}>
                <Label>{t('3dSceneBuilder.linkedTwin')}</Label>
                <Text className={commonPanelStyles.text}>
                    The LinkedTwin contains all properties in common between the
                    target elements linked twins.
                </Text>
                {isLinkedTwinPropertiesCalloutVisible && (
                    <Callout
                        onDismiss={toggleIsLinkedTwinPropertiesCalloutVisible}
                        gapSpace={0}
                        target={`#${linkedTwinPropertiesId}`}
                        setInitialFocus
                        directionalHint={DirectionalHint.rightTopEdge}
                    >
                        <div>
                            {commonLinkedTwinPropertiesRef.current?.map(
                                (prop) => (
                                    <div>{prop}</div>
                                )
                            )}
                        </div>
                    </Callout>
                )}
                {linkedTwinList.length > 0 && (
                    <CardboardList<ITwinAliasItem>
                        items={linkedTwinList}
                        listKey={`behavior-linked-twin-list`}
                    />
                )}
            </div>
            <Label>{t('3dSceneBuilder.twinAliases')}</Label>
            {twinAliasList.length === 0 ? (
                <div className={commonPanelStyles.noDataText}>
                    {t('3dSceneBuilder.noTwinAliases')}
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
                text={t('3dSceneBuilder.addTwinAlias')}
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

const getTwinAliasesFromBehavior = (
    // TODO: move this method to viewer config utils
    behavior: IBehavior,
    selectedElements: Array<ITwinToObjectMapping>
) => {
    const twinAliases: Array<ITwinAliasItem> = [];
    behavior.twinAliases?.map((behaviorTwinAlias) => {
        twinAliases.push({
            alias: behaviorTwinAlias,
            elementToTwinMappings: []
        });
    });
    twinAliases?.forEach((twinAlias) => {
        selectedElements?.forEach((element) => {
            if (element.twinAliases?.[twinAlias.alias]) {
                const aliasedTwinId = element.twinAliases?.[twinAlias.alias];

                twinAlias.elementToTwinMappings.push({
                    twinId: aliasedTwinId,
                    elementId: element.id
                });
            }
        });
    });
    return twinAliases;
};

function getLinkedTwinItems(
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
    onTwinAliasClick: (item: ITwinAliasItem) => void,
    onTwinAliasRemove: (item: ITwinAliasItem) => void,
    t: TFunction<string>
): ICardboardListItem<ITwinAliasItem>[] {
    const getMenuItems = (item: ITwinAliasItem): IContextualMenuItem[] => {
        return [
            {
                'data-testid': 'modifyOverflow',
                key: 'modify',
                iconProps: { iconName: 'Edit' },
                text: t('3dSceneBuilder.modifyTwinAlias'),
                onClick: () => {
                    onTwinAliasClick(item);
                }
            },
            {
                'data-testid': 'removeOverflow',
                key: 'remove',
                iconProps: {
                    iconName: 'Delete'
                },
                text: t('3dSceneBuilder.removeTwinAliasFromBehavior'),
                onClick: () => {
                    onTwinAliasRemove(item);
                }
            }
        ];
    };

    return twinAliases.map((twinAlias) => {
        const listItem: ICardboardListItem<ITwinAliasItem> = {
            ariaLabel: twinAlias.alias,
            iconStart: { name: 'LinkedDatabase' },
            item: twinAlias,
            onClick: onTwinAliasClick,
            textPrimary: twinAlias.alias,
            overflowMenuItems: getMenuItems(twinAlias)
        };

        return listItem;
    });
}

const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default TwinsTab;
