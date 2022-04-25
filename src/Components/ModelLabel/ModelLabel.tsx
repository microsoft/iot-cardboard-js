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

interface ModelLabelProps {
    label: string;
    onLabelClick?: () => void;
    isGroup?: boolean;
    groupItems?: GroupItem[];
}

export const ModelLabel: React.FC<ModelLabelProps> = ({
    label,
    onLabelClick,
    isGroup,
    groupItems
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextItems, setContextItems] = useState<IContextualMenuItem[]>([]);
    const contextTarget = 'GL' + createGUID();

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

    const onClick = () => {
        if (onLabelClick) {
            onLabelClick();
        }
    };

    return isGroup ? (
        <div>
            <ActionButton
                id={contextTarget}
                onClick={() => setShowContextMenu(!showContextMenu)}
                className={styles.groupBadge}
            >
                {label}
            </ActionButton>
            <ContextualMenu
                isBeakVisible={true}
                items={contextItems}
                hidden={!showContextMenu}
                target={`#${contextTarget}`}
                onItemClick={() => setShowContextMenu(false)}
                onDismiss={() => setShowContextMenu(false)}
            />
        </div>
    ) : (
        <ActionButton onClick={onClick} className={styles.badge}>
            {label}
        </ActionButton>
    );
};

const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        badge: {
            borderRadius: 25,
            background: theme.semanticColors.buttonBackground,
            padding: '8px 16px',
            border: `1px solid ${theme.palette.neutralLight}`,
            color: theme.semanticColors.bodyText,
            width: 'fit-content'
        },
        groupBadge: {
            borderRadius: 25,
            background: theme.semanticColors.buttonBackground,
            padding: '8px 12px',
            border: `1px solid ${theme.palette.neutralLight}`,
            color: theme.semanticColors.bodyText,
            width: 'fit-content'
        }
    });
});
