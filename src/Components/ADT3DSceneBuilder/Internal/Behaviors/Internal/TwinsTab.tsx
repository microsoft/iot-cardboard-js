// TODO SCHEMA MIGRATION - update Widgets tab to new schema & types
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
    IStackTokens,
    Label,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { TFunction, useTranslation } from 'react-i18next';
import { BehaviorFormContext } from '../BehaviorsForm';
import { ITwinToObjectMapping } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { CardboardList } from '../../../../CardboardList/CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import { linkedTwinName } from '../../../../../Models/Constants/Constants';
import { TwinAliasFormMode } from '../../../../../Models/Constants';
import { ITwinAliasItem } from '../../../../../Models/Classes/3DVConfig';

interface ITwinsTabProps {
    elements: Array<ITwinToObjectMapping>;
}

const TwinsTab: React.FC<ITwinsTabProps> = ({ elements }) => {
    const { t } = useTranslation();
    const { behaviorToEdit } = useContext(BehaviorFormContext);
    const { config, sceneId, adapter, setTwinAliasFormInfo } = useContext(
        SceneBuilderContext
    );
    const [
        commonLinkedTwinProperties,
        setCommonLinkedTwinProperties
    ] = useState([]);
    const commonLinkedTwinPropertiesRef = useRef([]);
    const [linkedTwinList, setLinkedTwinList] = useState([]);
    const [twinAliasList, setTwinAliasList] = useState([]);
    const linkedTwinPropertiesId = useId('linkedTwinProperties-callout');
    const [
        isLinkedTwinPropertiesCalloutVisible,
        { toggle: toggleIsLinkedTwinPropertiesCalloutVisible }
    ] = useBoolean(false);
    const commonPanelStyles = getLeftPanelStyles(useTheme());

    useEffect(() => {
        adapter
            .getCommonTwinPropertiesForBehavior(sceneId, config, behaviorToEdit)
            .then((properties) => {
                setCommonLinkedTwinProperties(properties);
                commonLinkedTwinPropertiesRef.current = properties;
            });

        setLinkedTwinList(
            getLinkedTwinItems(
                t,
                toggleIsLinkedTwinPropertiesCalloutVisible,
                linkedTwinPropertiesId
            )
        );

        const twinAliases = getTwinAliases(elements);
        setTwinAliasList(getTwinAliasListItems(twinAliases));
    }, [behaviorToEdit, elements]);

    const onAddTwinAliasClick = useCallback(() => {
        setTwinAliasFormInfo({
            twinAlias: null,
            mode: TwinAliasFormMode.CreateTwinAlias
        });
    }, [setTwinAliasFormInfo]);

    const onEditTwinAliasClick = useCallback(
        (twinAliasItem: ITwinAliasItem) => {
            setTwinAliasFormInfo({
                twinAlias: twinAliasItem,
                mode: TwinAliasFormMode.EditTwinAlias
            });
        },
        [setTwinAliasFormInfo]
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
                    <CardboardList<string>
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
                <CardboardList<string>
                    items={twinAliasList}
                    listKey={`behavior-aliased-twin-list`}
                />
            )}
            <ActionButton
                className={commonPanelStyles.actionButton}
                text={t('3dSceneBuilder.addTwinAlias')}
                data-testid={'widgetForm-addTwinAlias'}
                onClick={onAddTwinAliasClick}
            />
        </Stack>
    );
};

const getTwinAliases = (elements: Array<ITwinToObjectMapping>) => {
    const twinAliases: Array<ITwinAliasItem> = [];
    elements.forEach((element) => {
        if (element.twinAliases) {
            Object.keys(element.twinAliases).forEach((alias) => {
                const aliasedTwinId = element.twinAliases[alias];
                const existingTwinAlias = twinAliases.find(
                    (tA) => tA.alias === alias
                );
                if (!existingTwinAlias) {
                    twinAliases.push({
                        alias,
                        elementToTwinMappings: [
                            {
                                twinId: aliasedTwinId,
                                elementId: element.id
                            }
                        ]
                    });
                } else {
                    existingTwinAlias.elementToTwinMappings.push({
                        twinId: aliasedTwinId,
                        elementId: element.id
                    });
                }
            });
        }
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
        iconStartName: 'LinkedDatabase',
        iconEndName: 'RedEye',
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
    twinAliases: Array<ITwinAliasItem>
): ICardboardListItem<ITwinAliasItem>[] {
    const onTwinAliasItemEnter = (twinAlias: ITwinAliasItem) => {
        console.log(twinAlias.alias);
    };
    return twinAliases.map((twinAlias) => {
        const listItem: ICardboardListItem<ITwinAliasItem> = {
            ariaLabel: twinAlias.alias,
            buttonProps: {
                onMouseOver: () => onTwinAliasItemEnter(twinAlias),
                onMouseLeave: () => onTwinAliasItemEnter(twinAlias),
                onFocus: () => onTwinAliasItemEnter(twinAlias),
                onBlur: () => onTwinAliasItemEnter(twinAlias)
            },
            iconStartName: 'LinkedDatabase',
            iconEndName: 'RedEye',
            item: twinAlias,
            onClick: () => {
                console.log(twinAlias.alias);
            },
            textPrimary: twinAlias.alias
        };

        return listItem;
    });
}

const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default TwinsTab;
