import {
    ActionButton,
    memoizeFunction,
    mergeStyleSets,
    Theme,
    useTheme
} from '@fluentui/react';
import React from 'react';

interface ModelLabelProps {
    label: string;
    onLabelClick?: () => void;
}

export const ModelLabel: React.FC<ModelLabelProps> = ({
    label,
    onLabelClick
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const onClick = () => {
        if (onLabelClick) {
            onLabelClick();
        }
    };

    return (
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
        }
    });
});
