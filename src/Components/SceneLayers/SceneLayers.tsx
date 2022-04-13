import { PrimaryButton, useTheme } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getStyles } from './SceneLayers.styles';
import FocusCalloutButton from '../FocusCalloutButton/FocusCalloutButton';

const SceneLayers: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FocusCalloutButton
            buttonText={t('sceneLayers.sceneLayers')}
            iconName="Stack"
        >
            <PrimaryActionCallout
                onPrimaryButtonClick={() => null}
                primaryButtonText={t('sceneLayers.createNewLayer')}
            />
        </FocusCalloutButton>
    );
};

interface PrimaryActionCalloutProps {
    children?: React.ReactNode;
    primaryButtonText: string;
    onPrimaryButtonClick: () => any;
}

const PrimaryActionCallout: React.FC<PrimaryActionCalloutProps> = ({
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

export default SceneLayers;
