import React, { useCallback } from 'react';
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
import { useGraphContext } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext';
import { GraphContextActionType } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext.types';

const { ContextMenu } = Components;

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomContextMenu', debugLogging);

const getClassNames = classNamesFunction<
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
>();

const CustomMenu = (props: ContextMenuProps) => {
    const { onClose } = props;

    // context
    const { graphDispatch } = useGraphContext();

    // callbacks

    const handleClick = useCallback(() => {
        graphDispatch({ type: GraphContextActionType.ADD_PARENT });
        onClose();
    }, [graphDispatch, onClose]);

    // styles
    const classNames = getClassNames(
        {},
        {
            theme: useExtendedTheme()
        }
    );

    const menuItems: ICardboardListItem<string>[] = [
        {
            item: '',
            textPrimary: 'Add parent',
            ariaLabel: 'Add parent',
            onClick: () => {
                handleClick();
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
