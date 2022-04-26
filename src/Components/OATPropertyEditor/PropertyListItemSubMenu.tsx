import React from 'react';
import { FontIcon, ActionButton, Stack, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { deepCopy } from '../../Models/Services/Utils';

type IPropertyListItem = {
    index?: number;
    subMenuActive: boolean;
    deleteItem?: (index: number) => any;
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    parentIndex?: number;
    handleDuplicate: () => any;
    handleTemplateAddition: () => any;
};

export const PropertyListItemSubMenu = ({
    index,
    parentIndex,
    subMenuActive,
    deleteItem,
    deleteNestedItem,
    handleTemplateAddition,
    handleDuplicate
}: IPropertyListItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <>
            {' '}
            {subMenuActive && (
                <Stack
                    className={
                        propertyInspectorStyles.propertyItemIconMoreSubMenu
                    }
                >
                    <Stack>
                        <ActionButton
                            className={
                                propertyInspectorStyles.propertyItemIconMoreSubMenuItem
                            }
                            onClick={() => {
                                console.log('clicked add');
                                handleTemplateAddition();
                            }}
                        >
                            <FontIcon
                                iconName={'Add'}
                                className={
                                    propertyInspectorStyles.propertySubMenuItemIcon
                                }
                            />
                            <Text>{t('OATPropertyEditor.addToTemplate')}</Text>
                        </ActionButton>
                    </Stack>
                    <Stack>
                        <ActionButton
                            className={
                                propertyInspectorStyles.propertyItemIconMoreSubMenuItem
                            }
                            onClick={() => {
                                handleDuplicate();
                                console.log('clicked duplicate');
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
                    <Stack>
                        <ActionButton
                            className={
                                propertyInspectorStyles.propertyItemIconMoreSubMenuItem
                            }
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
                </Stack>
            )}
        </>
    );
};

export default PropertyListItemSubMenu;
