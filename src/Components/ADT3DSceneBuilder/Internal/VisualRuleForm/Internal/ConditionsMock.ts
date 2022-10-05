import { IContextualMenuItem } from '@fluentui/react';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';

export interface ConditionsMockData {
    id: number;
}

const mockOverflowMenuItems: IContextualMenuItem[] = [
    {
        key: '3-edit-mock',
        text: 'Edit',
        iconProps: {
            iconName: 'Edit'
        },
        onClick: () => {
            alert('Edit clicked');
        }
    },
    {
        key: '3-delete-mock',
        text: 'Delete',
        iconProps: {
            iconName: 'Delete'
        },
        onClick: () => {
            alert('Delete clicked');
        }
    }
];

export const ConditionsMockList: ICardboardListItem<ConditionsMockData>[] = [
    {
        ariaLabel: '',
        item: {
            id: 1
        },
        textPrimary: '30 Min - 70 Max',
        textSecondary: 'Badge',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 2
        },
        textPrimary: '0 Min - 80 Max',
        textSecondary: 'Color',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 3
        },
        textPrimary: 'Expression true',
        textSecondary: 'Badge, Color',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 1
        },
        textPrimary: '30 Min - 70 Max',
        textSecondary: 'Badge',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 2
        },
        textPrimary: '0 Min - 80 Max',
        textSecondary: 'Color',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 3
        },
        textPrimary: 'Expression true',
        textSecondary: 'Badge, Color',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 1
        },
        textPrimary: '30 Min - 70 Max',
        textSecondary: 'Badge',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 2
        },
        textPrimary: '0 Min - 80 Max',
        textSecondary: 'Color',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    },
    {
        ariaLabel: '',
        item: {
            id: 3
        },
        textPrimary: 'Expression true',
        textSecondary: 'Badge, Color',
        onClick: () => {
            alert('Item clicked');
        },
        overflowMenuItems: mockOverflowMenuItems
    }
];
