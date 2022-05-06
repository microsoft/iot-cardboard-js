import React, { memo, useCallback, useEffect, useState } from 'react';
import {
    IDeeplinkFlyoutProps,
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
} from './DeeplinkFlyout.types';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { getStyles } from './DeeplinkFlyout.styles';
import {
    Callout,
    Checkbox,
    classNamesFunction,
    FocusTrapCallout,
    FontSizes,
    Icon,
    IconButton,
    IIconProps,
    PrimaryButton,
    Stack,
    styled,
    Text,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useDeeplinkContext } from '../../Models/Context/DeeplinkContext';
import { getDebugLogger } from '../../Models/Services/Utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('DeeplinkFlyout', debugLogging);

const getClassNames = classNamesFunction<
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
>();
const iconProps: IIconProps = {
    iconName: 'Share'
};

const ROOT_LOC = 'deeplinkFlyout';
const LOC_KEYS = {
    buttonTitle: `${ROOT_LOC}.buttonTitle`,
    copyButtonText: `${ROOT_LOC}.copyButtonText`,
    copyConfirmationMessage: `${ROOT_LOC}.copyConfirmationMessage`,
    flyoutHeader: `${ROOT_LOC}.flyoutHeader`,
    includeElementsOption: `${ROOT_LOC}.includeElementsOption`,
    includeLayersOption: `${ROOT_LOC}.includeLayersOption`
};

const DeeplinkFlyout: React.FC<IDeeplinkFlyoutProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const flyoutButtonId = useId();
    const { getDeeplink } = useDeeplinkContext();

    // state
    const [showFlyout, { toggle: toggleFlyout }] = useBoolean(false);
    const [includeLayers, { toggle: toggleIncludeLayers }] = useBoolean(true);
    const [includeElement, { toggle: toggleIncludeElement }] = useBoolean(true);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    // effects
    useEffect(() => {
        // reset the state whenever the flyout shows up so we don't persist when it closes and opens again
        setShowConfirmation(false);
        if (!includeLayers) toggleIncludeLayers();
        if (!includeElement) toggleIncludeElement();
    }, [showFlyout]);

    // styles
    const classNames = getClassNames(styles, {
        isCalloutOpen: showFlyout,
        theme: useTheme()
    });

    // callbacks
    const onCopyLinkClick = useCallback(() => {
        const deeplink = getDeeplink({
            includeSelectedElement: includeElement,
            includeSelectedLayers: includeLayers
        });
        navigator.clipboard
            .writeText(deeplink)
            .then(() => {
                setShowConfirmation(true);
                logDebugConsole(
                    'debug',
                    'Copied deeplink to clipboard',
                    deeplink
                );
            })
            .catch((error) => {
                logDebugConsole(
                    'error',
                    'Failed to copy deeplink to clipboard',
                    error
                );
                console.error('Failed to copy text to clipboard');
            });
    }, [includeElement, includeLayers]);

    return (
        <div className={classNames.root}>
            <IconButton
                className={classNames.button}
                data-testid={'deeplink-open-flyout'}
                iconProps={iconProps}
                id={flyoutButtonId}
                onClick={toggleFlyout}
                styles={classNames.subComponentStyles.button?.()}
                title={t(LOC_KEYS.buttonTitle)}
            />
            {showFlyout && (
                <Callout
                    onDismiss={toggleFlyout}
                    setInitialFocus={true}
                    styles={classNames.subComponentStyles.callout}
                    target={`#${flyoutButtonId}`}
                >
                    <Stack tokens={{ childrenGap: 14 }}>
                        <h4 className={classNames.calloutTitle}>
                            {t(LOC_KEYS.flyoutHeader)}
                        </h4>
                        <Stack tokens={{ childrenGap: 8 }}>
                            <Checkbox
                                checked={includeLayers}
                                label={t(LOC_KEYS.includeLayersOption)}
                                onChange={toggleIncludeLayers}
                                styles={classNames.subComponentStyles.checkbox}
                            />
                            <Checkbox
                                checked={includeElement}
                                label={t(LOC_KEYS.includeElementsOption)}
                                onChange={toggleIncludeElement}
                                styles={classNames.subComponentStyles.checkbox}
                            />
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 8 }}>
                            <PrimaryButton
                                data-testid={'deeplink-copy-link'}
                                text={t(LOC_KEYS.copyButtonText)}
                                onClick={onCopyLinkClick}
                            />
                            {showConfirmation && (
                                <Stack
                                    horizontal
                                    tokens={{ childrenGap: 4 }}
                                    className={
                                        classNames.calloutConfirmationMessage
                                    }
                                >
                                    <Icon iconName="Link" />
                                    <Text>
                                        {t(LOC_KEYS.copyConfirmationMessage)}
                                    </Text>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </Callout>
            )}
        </div>
    );
};

export default styled<
    IDeeplinkFlyoutProps,
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
>(DeeplinkFlyout, getStyles);
