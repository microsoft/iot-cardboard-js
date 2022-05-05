import React from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getPropertyInspectorStyles,
    getIconMoreSubMenuItemStyles
} from './OATPropertyEditor.styles';

type IPropertyListItem = {
    index?: number;
    subMenuActive?: boolean;
    deleteItem?: (index: number) => void;
    deleteNestedItem?: (parentIndex: number, index: number) => void;
    parentIndex?: number;
    handleDuplicate?: () => void;
    handleTemplateAddition?: () => void;
    removeItem?: boolean;
    duplicateItem?: boolean;
    addItemToTemplates?: boolean;
};

export const PropertyListItemSubMenu = ({
    index,
    parentIndex,
    subMenuActive,
    deleteItem,
    deleteNestedItem,
    handleTemplateAddition,
    handleDuplicate,
    removeItem,
    duplicateItem,
    addItemToTemplates
}: IPropertyListItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const subMenuItemStyles = getIconMoreSubMenuItemStyles();

    return (
        <>
            {subMenuActive && (
                <Stack
                    className={
                        propertyInspectorStyles.propertyItemIconMoreSubMenu
                    }
                >
                    {addItemToTemplates && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    handleTemplateAddition();
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
                    {duplicateItem && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    handleDuplicate();
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
                                onClick={() => {
                                    if (deleteNestedItem) {
                                        deleteNestedItem(parentIndex, index);
                                    } else {
                                        deleteItem(index);
                                    }
                                }}
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
                </Stack>
            )}
        </>
    );
};

export default PropertyListItemSubMenu;

PropertyListItemSubMenu.defaultProps = {
    removeItem: true,
    duplicateItem: true,
    addItemToTemplates: true
};
