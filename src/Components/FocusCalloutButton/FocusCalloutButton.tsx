import {
    DefaultButton,
    FocusTrapCallout,
    FontIcon,
    IconButton,
    IFocusTrapZone,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useId } from '@fluentui/react-hooks';
import { getStyles } from './FocusCalloutButton.styles';
import BaseComponent from '../BaseComponent/BaseComponent';

interface Props {
    iconName: string;
    buttonText: string;
    calloutTitle: string;
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onBackIconClick?: () => void;
    onFocusLayerMounted?: () => void;
    onFocusDismiss?: () => void;
    componentRef?: React.MutableRefObject<IFocusTrapZone>;
}

const FocusCalloutButton: React.FC<Props> = ({
    iconName,
    buttonText,
    calloutTitle,
    children,
    isOpen,
    setIsOpen,
    onBackIconClick,
    onFocusLayerMounted,
    onFocusDismiss,
    componentRef
}) => {
    const buttonId = useId();

    const theme = useTheme();
    const styles = getStyles();

    return (
        <>
            <DefaultButton
                iconProps={{ iconName: iconName }}
                styles={{ root: { marginRight: 8 } }}
                onClick={() => setIsOpen(!isOpen)}
                id={buttonId}
            >
                {buttonText}
            </DefaultButton>
            {isOpen && (
                <FocusTrapCallout
                    gapSpace={12}
                    focusTrapProps={{
                        isClickableOutsideFocusTrap: true,
                        ...(componentRef && { componentRef })
                    }}
                    calloutWidth={312}
                    isBeakVisible={false}
                    target={`#${buttonId}`}
                    onDismiss={() => setIsOpen(false)}
                    backgroundColor={theme.semanticColors.bodyBackground}
                    onLayerMounted={onFocusLayerMounted}
                    onRestoreFocus={(params) => {
                        if (onFocusDismiss) {
                            onFocusDismiss();
                        } else {
                            params.originalElement.focus();
                        }
                    }}
                >
                    <BaseComponent>
                        <div className={styles.calloutContent}>
                            <div className={styles.header}>
                                <div>
                                    {onBackIconClick ? (
                                        <IconButton
                                            iconProps={{
                                                iconName: 'ChevronLeft',
                                                style: {
                                                    fontSize: '14',
                                                    height: '32',
                                                    color: theme.palette.black
                                                }
                                            }}
                                            onClick={onBackIconClick}
                                        />
                                    ) : (
                                        <FontIcon
                                            iconName={iconName}
                                            className={styles.titleIcon}
                                        />
                                    )}
                                </div>
                                <div className={styles.title}>
                                    {calloutTitle}
                                </div>
                                <div>
                                    <IconButton
                                        iconProps={{
                                            iconName: 'Cancel',
                                            style: {
                                                fontSize: '14',
                                                height: '32',
                                                color: theme.palette.black
                                            }
                                        }}
                                        onClick={() => setIsOpen(false)}
                                    />
                                </div>
                            </div>
                            {children}
                        </div>
                    </BaseComponent>
                </FocusTrapCallout>
            )}
        </>
    );
};

export default FocusCalloutButton;
