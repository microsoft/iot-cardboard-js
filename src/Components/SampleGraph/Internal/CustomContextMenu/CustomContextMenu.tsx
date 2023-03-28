import React from 'react';
import {
    classNamesFunction,
    ContextualMenu,
    IContextualMenuItem,
    styled
} from '@fluentui/react';
import type { ContextMenuValue as ContextMenuProps } from '@antv/graphin';
import { Components } from '@antv/graphin';

import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    ICustomContextMenuProps,
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
} from './CustomContextMenu.types';
import { getStyles } from './CustomContextMenu.styles';

const { ContextMenu } = Components;

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomContextMenu', debugLogging);

const getClassNames = classNamesFunction<
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
>();

const CustomMenu = (props: ContextMenuProps) => {
    const { onClose, id } = props;
    const handleClick = (e: IContextualMenuItem) => {
        alert(`${e.key}:${id}`);
        onClose();
    };

    // styles
    const classNames = getClassNames(
        {},
        {
            theme: useExtendedTheme()
        }
    );

    const menuItems: IContextualMenuItem[] = [];

    return (
        <ContextualMenu
            items={menuItems}
            hidden={false}
            // target={linkRef}
            onItemClick={(_ev, item) => handleClick(item)}
            onDismiss={onClose}
        />
        // <ul>
        //     <li
        //         onClick={() => {
        //             handleClick({ key: '1' });
        //         }}
        //     >
        //         Add parent
        //     </li>
        //     <li
        //         onClick={() => {
        //             handleClick({ key: '2' });
        //         }}
        //     >
        //         menu item 2
        //     </li>
        //     <li
        //         onClick={() => {
        //             handleClick({ key: '3' });
        //         }}
        //     >
        //         menu item 3
        //     </li>
        // </ul>
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
