import { PrimaryButton, useTheme } from '@fluentui/react';
import React from 'react';
import { getStyles } from '../SceneLayers.styles';

interface PrimaryActionCalloutContentsProps {
    children?: React.ReactNode;
    primaryButtonText: string;
    onPrimaryButtonClick: () => any;
}

const PrimaryActionCalloutContents: React.FC<PrimaryActionCalloutContentsProps> = ({
    children,
    onPrimaryButtonClick,
    primaryButtonText
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <div className={styles.container}>
            <div className={styles.body}>{children}</div>
            <div className={styles.footer}>
                <PrimaryButton onClick={onPrimaryButtonClick}>
                    {primaryButtonText}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default PrimaryActionCalloutContents;
