import {
    DefaultButton,
    FocusTrapCallout,
    FontIcon,
    IconButton,
    useTheme
} from '@fluentui/react';
import React, { useState } from 'react';
import { useId } from '@fluentui/react-hooks';
import { getStyles } from './FocusCalloutButton.styles';
import BaseComponent from '../BaseComponent/BaseComponent';

interface Props {
    iconName: string;
    buttonText: string;
    children: React.ReactNode;
    isInitiallyOpen?: boolean;
}

const FocusCalloutButton: React.FC<Props> = ({
    iconName,
    buttonText,
    children,
    isInitiallyOpen = false
}) => {
    const [isCalloutOpen, setIsCalloutOpen] = useState(isInitiallyOpen);
    const buttonId = useId();

    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <>
            <DefaultButton
                iconProps={{ iconName: iconName }}
                styles={{ root: { marginRight: 8 } }}
                onClick={() => setIsCalloutOpen((prev) => !prev)}
                id={buttonId}
            >
                {buttonText}
            </DefaultButton>
            {isCalloutOpen && (
                <FocusTrapCallout
                    gapSpace={12}
                    focusTrapProps={{
                        isClickableOutsideFocusTrap: true
                    }}
                    isBeakVisible={false}
                    target={`#${buttonId}`}
                    onDismiss={() => setIsCalloutOpen(false)}
                    backgroundColor={theme.semanticColors.bodyBackground}
                >
                    <BaseComponent>
                        <div className={styles.calloutContent}>
                            <div className={styles.header}>
                                <div>
                                    <FontIcon iconName={iconName} />
                                </div>
                                <div className={styles.title}>{buttonText}</div>
                                <div>
                                    <IconButton
                                        iconProps={{
                                            iconName: 'Cancel',
                                            style: {
                                                fontSize: '14',
                                                height: '32'
                                            }
                                        }}
                                        onClick={() => setIsCalloutOpen(false)}
                                    />
                                </div>
                            </div>
                            <div>{children}</div>
                        </div>
                    </BaseComponent>
                </FocusTrapCallout>
            )}
        </>
    );
};

export default FocusCalloutButton;
