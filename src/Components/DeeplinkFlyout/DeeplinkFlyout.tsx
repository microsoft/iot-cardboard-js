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
    styled,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getDebugLogger } from '../../Models/Services/Utils';
import OptionsCallout from './Internal/OptionsCallout/OptionsCallout';
import SimpleCallout from './Internal/SimpleCallout/SimpleCallout';
import { useDeeplinkContext } from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';

const debugLogging = false;
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
        [mode]
    );

    const onButtonClick = useCallback(() => {
        if (mode === 'Simple') {
            copyText(deeplink);
        }
        setShowFlyout((current) => !current);
    }, [copyText, deeplink, mode]);
    const onDismiss = useCallback(() => {
        setIconName('Share');
        setShowFlyout(false);
    }, []);

    logDebugConsole('debug', 'render deeplink flyout');
    return (
        <div className={classNames.root}>
            <HeaderControlGroup
                styles={classNames.subComponentStyles.headerControlGroup}
            >
                <HeaderControlButton
                    className={classNames.button}
                    dataTestId={'deeplink-open-flyout'}
                    id={flyoutButtonId}
                    iconProps={{ iconName: iconName }}
                    isActive={showFlyout}
                    onClick={onButtonClick}
                    styles={classNames.subComponentStyles.headerControlButton}
                    title={t(LOC_KEYS.buttonTitle)}
                />
            </HeaderControlGroup>
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
