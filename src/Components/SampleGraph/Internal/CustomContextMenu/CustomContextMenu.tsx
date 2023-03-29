import React from 'react';
import { classNamesFunction } from '@fluentui/react';
import type { ContextMenuValue as ContextMenuProps } from '@antv/graphin';
import { Components } from '@antv/graphin';

import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    ICustomContextMenuProps,
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
} from './CustomContextMenu.types';
import { CardboardList } from '../../../CardboardList';
import { ICardboardListItem } from '../../../CardboardList/CardboardList.types';

const { ContextMenu } = Components;

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomContextMenu', debugLogging);

const getClassNames = classNamesFunction<
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
>();

const CustomMenu = (props: ContextMenuProps) => {
    const { onClose } = props;
    const handleClick = (e: string) => {
        alert(`You clicked on ${e}`);
        onClose();
    };

    // styles
    const classNames = getClassNames(
        {},
        {
            theme: useExtendedTheme()
        }
    );

    const menuItems: ICardboardListItem<string>[] = [
        {
            item: 'test',
            textPrimary: 'test',
            ariaLabel: 'test',
            onClick: () => {
                handleClick('test');
            }
        }
    ];

    return (
        <CardboardList
            className={classNames.root}
            items={menuItems}
            listKey={'context-menu'}
        />
    );
};

const CustomContextMenu: React.FC<ICustomContextMenuProps> = () => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles

    logDebugConsole('debug', 'Render');

    return (
        <ContextMenu style={{ background: '#fff' }} bindType="node">
            {(value) => {
                return <CustomMenu {...value} />;
            }}
        </ContextMenu>
    );
};

export default CustomContextMenu;
