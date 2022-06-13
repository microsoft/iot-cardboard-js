import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import {
    IContextualMenuItem,
    IStackTokens,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { IElementTwinAliasItem } from '../../../../../Models/Classes/3DVConfig';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import { CardboardList } from '../../../../CardboardList/CardboardList';
import { ElementFormContext } from '../ElementForm';
import produce from 'immer';
import { TwinAliasFormMode } from '../../../../../Models/Constants/Enums';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';

const AliasedTwinsTab: React.FC = () => {
    const { t } = useTranslation();
    const { elementToEdit, setElementToEdit } = useContext(ElementFormContext);
    const { setElementTwinAliasFormInfo } = useContext(SceneBuilderContext);
    const [twinAliasList, setTwinAliasList] = useState([]);

    const onTwinAliasClick = useCallback(
        (twinAliasItem: IElementTwinAliasItem) => {
            setElementTwinAliasFormInfo({
                twinAlias: twinAliasItem,
                mode: TwinAliasFormMode.EditTwinAlias
            });
        },
        [setElementTwinAliasFormInfo]
    );

    // When removing a twin alias from an element, remove that alias from element's twinAliases object.
    // If the result is length 0, remove the whole twinAliases key from element
    const onTwinAliasRemoveFromElement = useCallback(
        (twinAliasItem: IElementTwinAliasItem) => {
            setElementToEdit(
                produce((draft) => {
                    delete draft.twinAliases[twinAliasItem.alias];
                    if (Object.keys(draft.twinAliases).length === 0) {
                        delete draft.twinAliases;
                    }
                })
            );
        },
        [setElementToEdit]
    );

    useEffect(() => {
        const twinAliases = ViewerConfigUtility.getTwinAliasItemsFromElement(
            elementToEdit
        );
        setTwinAliasList(
            getTwinAliasListItems(
                twinAliases,
                onTwinAliasClick,
                onTwinAliasRemoveFromElement,
                t
            )
        );
    }, [elementToEdit]);

    const commonPanelStyles = getLeftPanelStyles(useTheme());
    return (
        <Stack
            tokens={sectionStackTokens}
            className={commonPanelStyles.paddedLeftPanelBlock}
        >
            <div>
                {twinAliasList.length === 0 ? (
                    <div className={commonPanelStyles.noDataText}>
                        {t('3dSceneBuilder.elementFormTwinTab.noDataMessage')}
                    </div>
                ) : (
                    <>
                        <Text className={commonPanelStyles.text}>
                            {t(
                                '3dSceneBuilder.elementFormTwinTab.tabDescription'
                            )}
                        </Text>
                        <CardboardList<IElementTwinAliasItem>
                            items={twinAliasList}
                            listKey={`element-aliased-twin-list`}
                        />
                    </>
                )}
            </div>
        </Stack>
    );
};

const getTwinAliasListItems = (
    twinAliases: Array<IElementTwinAliasItem>,
    onTwinAliasClick: (item: IElementTwinAliasItem) => void,
    onTwinAliasRemove: (item: IElementTwinAliasItem) => void,
    t: TFunction<string>
): ICardboardListItem<IElementTwinAliasItem>[] => {
    const getMenuItems = (
        item: IElementTwinAliasItem
    ): IContextualMenuItem[] => {
        return [
            {
                'data-testid': 'elementTwinAlias-modifyOverflow',
                key: 'modify',
                iconProps: { iconName: 'Edit' },
                text: t('3dSceneBuilder.twinAlias.modify'),
                onClick: () => {
                    onTwinAliasClick(item);
                }
            },
            {
                'data-testid': 'elementTwinAlias-removeOverflow',
                key: 'remove',
                iconProps: {
                    iconName: 'Delete'
                },
                text: t('3dSceneBuilder.twinAlias.removeFromElement'),
                onClick: () => {
                    onTwinAliasRemove(item);
                }
            }
        ];
    };

    return twinAliases.map((twinAlias) => {
        const listItem: ICardboardListItem<IElementTwinAliasItem> = {
            ariaLabel: twinAlias.alias,
            iconStart: { name: 'LinkedDatabase' },
            item: twinAlias,
            onClick: () => onTwinAliasClick(twinAlias),
            textPrimary: twinAlias.alias,
            overflowMenuItems: getMenuItems(twinAlias)
        };

        return listItem;
    });
};

const sectionStackTokens: IStackTokens = { childrenGap: 12 };

export default AliasedTwinsTab;
