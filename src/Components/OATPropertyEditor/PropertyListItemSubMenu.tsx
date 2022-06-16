import React from 'react';
import { FontIcon, ActionButton, Stack, Text, Callout } from '@fluentui/react';
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
    targetId?: string;
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
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
    addItemToTemplates,
    targetId,
    setSubMenuActive
}: IPropertyListItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const subMenuItemStyles = getIconMoreSubMenuItemStyles();

    const handleDelete = () => {
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
                                    handleTemplateAddition();
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
                    {duplicateItem && (
                        <Stack>
                            <ActionButton
                                styles={subMenuItemStyles}
                                onClick={() => {
                                    handleDuplicate();
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
                                onClick={handleDelete}
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
    removeItem: true,
    duplicateItem: true,
    addItemToTemplates: true
};
