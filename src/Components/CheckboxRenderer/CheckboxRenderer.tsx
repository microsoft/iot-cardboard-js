import React from 'react';
import { FontIcon, useTheme } from '@fluentui/react';
import { getStyles } from './CheckboxRenderer.styles';

export interface CheckboxRendererProps {
    isChecked: boolean;
    className?: string;
}
const CheckboxRenderer: React.FC<CheckboxRendererProps> = ({
    isChecked,
    className
}) => {
    const theme = useTheme();
    const checkboxStyles = getStyles(theme);
    return (
        <div
            className={`${checkboxStyles.root} ${
                isChecked && checkboxStyles.isChecked
            } ${className}`}
        >
            {isChecked && (
                <FontIcon
                    iconName={'CheckMark'}
                    className={`${checkboxStyles.checkmark}`}
                />
            )}
        </div>
    );
};

export default CheckboxRenderer;
