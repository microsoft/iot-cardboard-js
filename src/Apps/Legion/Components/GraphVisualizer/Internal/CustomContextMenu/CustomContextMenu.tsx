import React, { useCallback } from 'react';
import { classNamesFunction } from '@fluentui/react';
import type { ContextMenuValue as ContextMenuProps } from '@antv/graphin';
import { Components } from '@antv/graphin';

import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import {
    ICustomContextMenuProps,
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
} from './CustomContextMenu.types';
import { CardboardList } from '../../../../../../Components/CardboardList';
import { ICardboardListItem } from '../../../../../../Components/CardboardList/CardboardList.types';
import { useGraphContext } from '../../../../Contexts/GraphContext/GraphContext';
import { GraphContextActionType } from '../../../../Contexts/GraphContext/GraphContext.types';
import { useTranslation } from 'react-i18next';

const { ContextMenu } = Components;

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomContextMenu', debugLogging);

const getClassNames = classNamesFunction<
    ICustomContextMenuStyleProps,
    ICustomContextMenuStyles
>();

const LOC_KEYS = {
    ContextMenu: {
        addParentLabel: 'legionApp.GraphVisualizer.ContextMenu.addParentLabel'
    }
};

const CustomMenu: React.FC<ContextMenuProps> = (props) => {
    const { onClose, item } = props;

    // hooks
    const { t } = useTranslation();

    // context
    const { graphDispatch } = useGraphContext();

    // callbacks

    const handleClick = useCallback(() => {
        const selectedNodeId = item.getModel()?.id;
        graphDispatch({
            type: GraphContextActionType.ADD_PARENT,
            payload: { nodeId: selectedNodeId }
        });
        onClose();
    }, [graphDispatch, item, onClose]);

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
            textPrimary: t(LOC_KEYS.ContextMenu.addParentLabel),
            ariaLabel: t(LOC_KEYS.ContextMenu.addParentLabel),
            onClick: handleClick
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
    logDebugConsole('debug', 'Render');
    return (
        <ContextMenu bindType="node">
            {(value) => {
                return <CustomMenu {...value} />;
            }}
        </ContextMenu>
    );
};

export default CustomContextMenu;
