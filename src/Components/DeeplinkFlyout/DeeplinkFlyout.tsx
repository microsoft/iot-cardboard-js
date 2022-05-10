import React, { useCallback, useRef, useState } from 'react';
import {
    IDeeplinkFlyoutProps,
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
} from './DeeplinkFlyout.types';
import { useId } from '@fluentui/react-hooks';
import { getStyles } from './DeeplinkFlyout.styles';
import {
    Callout,
    classNamesFunction,
    DirectionalHint,
    IconButton,
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getDebugLogger } from '../../Models/Services/Utils';
import OptionsCallout from './Internal/OptionsCallout/OptionsCallout';
import SimpleCallout from './Internal/SimpleCallout/SimpleCallout';
import { useDeeplinkContext } from '../../Models/Context/DeeplinkContext/DeeplinkContext';

const debugLogging = true;
const logDebugConsole = getDebugLogger('DeeplinkSimpleFlyout', debugLogging);

const getClassNames = classNamesFunction<
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
>();

const ROOT_LOC = 'deeplinkFlyout';
const LOC_KEYS = {
    buttonTitle: `${ROOT_LOC}.buttonTitle`
};

const ICON_REVERT_DELAY = 3000;

const DeeplinkFlyout: React.FC<IDeeplinkFlyoutProps> = (props) => {
    const { mode, styles } = props;

    // hooks
    const { t } = useTranslation();
    const flyoutButtonId = useId();
    const { getDeeplink } = useDeeplinkContext();
    const deeplink = getDeeplink({
        includeSelectedElement: false,
        includeSelectedLayers: false
    });

    // state
    const [showFlyout, setShowFlyout] = useState(false);
    const [iconName, setIconName] = useState('Share');
    const confirmationFadeoutTimeout = useRef<any>();

    // styles
    const classNames = getClassNames(styles, {
        isCalloutOpen: showFlyout,
        theme: useTheme()
    });

    const copyText = useCallback(
        async (deeplink: string) => {
            try {
                await navigator.clipboard.writeText(deeplink);
                if (mode === 'Simple') {
                    setIconName('Accept');
                }
                logDebugConsole(
                    'debug',
                    'Copied deeplink to clipboard',
                    deeplink
                );
            } catch (error) {
                logDebugConsole(
                    'error',
                    'Failed to copy deeplink to clipboard',
                    error
                );
                console.error('Failed to copy text to clipboard');
            } finally {
                if (mode === 'Simple') {
                    confirmationFadeoutTimeout.current = setTimeout(() => {
                        setIconName('Share');
                        setShowFlyout(false);
                    }, ICON_REVERT_DELAY);
                }
            }
        },
        [mode, showFlyout]
    );

    const onButtonClick = useCallback(() => {
        if (mode === 'Simple') {
            copyText(deeplink);
        }
        setShowFlyout(true);
    }, []);
    const onDismiss = useCallback(() => {
        setIconName('Share');
        setShowFlyout(false);
    }, []);

    logDebugConsole('debug', 'render deeplink flyout');
    return (
        <div className={classNames.root}>
            <IconButton
                className={classNames.button}
                data-testid={'deeplink-open-flyout'}
                iconProps={{ iconName: iconName }}
                id={flyoutButtonId}
                onClick={onButtonClick}
                styles={classNames.subComponentStyles.button?.()}
                title={t(LOC_KEYS.buttonTitle)}
            />
            {showFlyout && (
                <Callout
                    onDismiss={onDismiss}
                    setInitialFocus={true}
                    styles={classNames.subComponentStyles.callout}
                    target={`#${flyoutButtonId}`}
                    directionalHint={DirectionalHint.bottomCenter}
                >
                    {mode === 'Options' && <OptionsCallout />}
                    {mode === 'Simple' && <SimpleCallout />}
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
