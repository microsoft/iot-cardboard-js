import {
    memoizeFunction,
    mergeStyleSets,
    Theme,
    useTheme
} from '@fluentui/react';
import React from 'react';

interface LocationBadgeProps {
    label: string;
}

export const LocationBadge: React.FC<LocationBadgeProps> = ({ label }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return <div className={styles.badge}>{label}</div>;
};

const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        badge: {
            borderRadius: 25,
            background: theme.semanticColors.buttonBackground,
            padding: '8px',
            border: `1px solid ${theme.palette.neutralLight}`,
            color: theme.semanticColors.bodyText
        }
    });
});
