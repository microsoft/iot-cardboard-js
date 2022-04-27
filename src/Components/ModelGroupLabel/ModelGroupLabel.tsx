import {
    ActionButton,
    ContextualMenu,
    IContextualMenuItem,
    memoizeFunction,
    mergeStyleSets,
    Theme,
    useTheme
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { createGUID } from '../../Models/Services/Utils';

interface GroupItem {
    label: string;
    onItemClick?: () => void;
}

interface ModelGroupLabelProps {
    label: string;
    onLabelClick?: () => void;
    isGroup?: boolean;
    groupItems?: GroupItem[];
}

export const ModelGroupLabel: React.FC<ModelGroupLabelProps> = ({
    label,
    groupItems
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextItems, setContextItems] = useState<IContextualMenuItem[]>([]);
    const id = 'ID' + createGUID();

    useEffect(() => {
        const items: IContextualMenuItem[] = [];
        groupItems?.forEach((item) => {
            items.push({
                key: item.label,
                text: item.label,
                onClick: () => (item.onItemClick ? item.onItemClick() : null)
            });
        });

        setContextItems(items);
    }, [groupItems]);

    return (
        <div>
            <ActionButton
                id={id}
                onClick={() => setShowContextMenu(!showContextMenu)}
                className={styles.groupBadge}
            >
                {label}
            </ActionButton>
            <ContextualMenu
                isBeakVisible={true}
                items={contextItems}
                hidden={!showContextMenu}
                target={`#${id}`}
                onItemClick={() => setShowContextMenu(false)}
                onDismiss={() => setShowContextMenu(false)}
            />
        </div>
    );
};

const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        groupBadge: {
            borderRadius: 25,
            background: theme.semanticColors.buttonBackground,
            padding: '8px 12px',
            border: `1px solid ${theme.palette.neutralLight}`,
            color: theme.semanticColors.bodyText,
            horizontalAlignment: 'center',
            width: 'fit-content'
        }
    });
});
