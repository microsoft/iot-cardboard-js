import { ActionButton, useTheme } from '@fluentui/react';
import React from 'react';
import { getStyles } from './ModelLabel.styles';

interface ModelLabelProps {
    label: string;
    id?: string;
    onLabelClick?: (id: string) => void;
}

export const ModelLabel: React.FC<ModelLabelProps> = ({
    label,
    id,
    onLabelClick
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const onClick = () => {
        if (onLabelClick && id) {
            onLabelClick(id);
        }
    };

    return (
        <ActionButton onClick={onClick} className={styles.badge}>
            {label}
        </ActionButton>
    );
};
