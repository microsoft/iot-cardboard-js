import React from 'react';
import { FontIcon, ActionButton, Stack, Text, Callout } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getIconMoreSubMenuItemStyles
} from './OATPropertyEditor.styles';
import { PropertyListItemSubMenuProps } from './PropertyListItemSubMenu.types';

export const PropertyListItemSubMenu = ({
    index,
    parentIndex,
    subMenuActive,
    deleteItem,
    deleteNestedItem,
    onPropertyListAddition,
    onTemplateAddition,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    removeItem,
    duplicateItem,
    addItemToPropertyList,
    addItemToTemplates,
    targetId,
    setSubMenuActive
}: PropertyListItemSubMenuProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const subMenuItemStyles = getIconMoreSubMenuItemStyles();

    const onDelete = () => {
        if (deleteNestedItem) {
            deleteNestedItem(parentIndex, index);
            setSubMenuActive(false);
        } else {
            deleteItem(index);
            setSubMenuActive(false);
        }
    };

    return (
        <>
            {subMenuActive && (
                <Callout
                    className={
                        propertyInspectorStyles.propertyItemIconMoreSubMenu
                    }
                    role="dialog"
                    gapSpace={0}
                    target={`#${targetId}`}
                    isBeakVisible={false}
                    setInitialFocus
                    onDismiss={() => setSubMenuActive(false)}
                >
                    {addItemToTemplates && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    onTemplateAddition();
                                    setSubMenuActive(false);
                                }}
                            >
                                <FontIcon
                                    iconName={'Add'}
                                    className={
                                        propertyInspectorStyles.propertySubMenuItemIcon
                                    }
                                />
                                <Text>
                                    {t('OATPropertyEditor.addToTemplate')}
                                </Text>
                            </ActionButton>
                        </Stack>
                    )}
                    {onMoveUp && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    onMoveUp(index, true);
                                    setSubMenuActive(false);
                                }}
                            >
                                <FontIcon
                                    iconName={'Up'}
                                    className={
                                        propertyInspectorStyles.propertySubMenuItemIcon
                                    }
                                />
                                <Text>{t('OATPropertyEditor.moveUp')}</Text>
                            </ActionButton>
                        </Stack>
                    )}
                    {onMoveDown && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    onMoveDown(index, false);
                                    setSubMenuActive(false);
                                }}
                            >
                                <FontIcon
                                    iconName={'Down'}
                                    className={
                                        propertyInspectorStyles.propertySubMenuItemIcon
                                    }
                                />
                                <Text>{t('OATPropertyEditor.moveDown')}</Text>
                            </ActionButton>
                        </Stack>
                    )}
                    {addItemToPropertyList && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    onPropertyListAddition();
                                    setSubMenuActive(false);
                                }}
                            >
                                <FontIcon
                                    iconName={'Add'}
                                    className={
                                        propertyInspectorStyles.propertySubMenuItemIcon
                                    }
                                />
                                <Text>
                                    {t('OATPropertyEditor.addToPropertyList')}
                                </Text>
                            </ActionButton>
                        </Stack>
                    )}
                    {duplicateItem && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    onDuplicate();
                                    setSubMenuActive(false);
                                }}
                            >
                                <FontIcon
                                    iconName={'Copy'}
                                    className={
                                        propertyInspectorStyles.propertySubMenuItemIcon
                                    }
                                />
                                <Text>{t('OATPropertyEditor.duplicate')}</Text>
                            </ActionButton>
                        </Stack>
                    )}
                    {removeItem && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={onDelete}
                            >
                                <FontIcon
                                    iconName={'Delete'}
                                    className={
                                        propertyInspectorStyles.propertySubMenuItemIconRemove
                                    }
                                />
                                <Text>{t('OATPropertyEditor.remove')}</Text>
                            </ActionButton>
                        </Stack>
                    )}
                </Callout>
            )}
        </>
    );
};

export default PropertyListItemSubMenu;

PropertyListItemSubMenu.defaultProps = {
    addItemToPropertyList: false,
    addItemToTemplates: true,
    duplicateItem: true,
    removeItem: true
};
