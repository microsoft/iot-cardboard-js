import {
    classNamesFunction,
    DefaultButton,
    FocusTrapCallout,
    FontIcon,
    FontSizes,
    IconButton,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useId } from '@fluentui/react-hooks';
import { getStyles } from './FocusCalloutButton.styles';
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    IFocusCalloutButtonStyleProps,
    IFocusCalloutButtonStyles,
    IFocusCalloutButtonProps
} from './FocusCalloutButton.types';

const getClassNames = classNamesFunction<
    IFocusCalloutButtonStyleProps,
    IFocusCalloutButtonStyles
>();

const FocusCalloutButton: React.FC<IFocusCalloutButtonProps> = ({
    iconName,
    buttonText,
    calloutTitle,
    children,
    isOpen,
    setIsOpen,
    onBackIconClick,
    onFocusDismiss,
    componentRef,
    styles
}) => {
    const buttonId = useId();

    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });

    return (
        <div className={classNames.root}>
            <DefaultButton
                className={classNames.button}
                iconProps={{ iconName: iconName }}
                styles={classNames.subComponentStyles.button()}
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
                    onRestoreFocus={(params) => {
                        if (onFocusDismiss) {
                            onFocusDismiss();
                        } else {
                            params.originalElement.focus();
                        }
                    }}
                >
                    <BaseComponent>
                        <div className={classNames.calloutContent}>
                            <div className={classNames.header}>
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
                                            className={classNames.titleIcon}
                                        />
                                    )}
                                </div>
                                <div className={classNames.title}>
                                    {calloutTitle}
                                </div>
                                <div>
                                    <IconButton
                                        iconProps={{
                                            iconName: 'Cancel',
                                            styles: {
                                                root: {
                                                    fontSize: FontSizes.size14,
                                                    color: theme.palette.black
                                                }
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
        </div>
    );
};

export default styled<
    IFocusCalloutButtonProps,
    IFocusCalloutButtonStyleProps,
    IFocusCalloutButtonStyles
>(FocusCalloutButton, getStyles);
