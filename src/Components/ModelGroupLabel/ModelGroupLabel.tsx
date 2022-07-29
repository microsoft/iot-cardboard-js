import {
    ActionButton,
    ContextualMenu,
    IContextualMenuItem,
    useTheme
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { getStyles } from './ModelGroupLabel.styles';

interface GroupItem {
    label: string;
    id: string;
    onItemClick?: (id: string) => void;
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
    const [groupId, setGroupId] = useState('id');

    useEffect(() => {
        const items: IContextualMenuItem[] = [];
        let labels = '';
        groupItems?.forEach((item) => {
            items.push({
                key: item.label,
                text: item.label,
                onClick: () =>
                    item.onItemClick ? item.onItemClick(item.id) : null
            });
            labels += item.label;
        });

        setContextItems(items);
        setGroupId('id-' + labels);
    }, [groupItems, groupItems.length]);

    return (
        <div>
            <ActionButton
                id={groupId}
                onClick={() => setShowContextMenu(!showContextMenu)}
                className={styles.groupBadge}
            >
                {label}
            </ActionButton>
            <ContextualMenu
                isBeakVisible={true}
                items={contextItems}
                hidden={!showContextMenu}
                target={`#${groupId}`}
                onItemClick={() => setShowContextMenu(false)}
                onDismiss={() => setShowContextMenu(false)}
            />
        </div>
    );
};
