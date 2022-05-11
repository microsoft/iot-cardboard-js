import React, { useCallback, useRef, useState } from 'react';
import {
    IOptionsCalloutProps,
    IOptionsCalloutStyleProps,
    IOptionsCalloutStyles
} from './OptionsCallout.types';
import { getStyles } from './OptionsCallout.styles';
import {
    Checkbox,
    classNamesFunction,
    css,
    PrimaryButton,
    Stack,
    styled,
    Text,
    useTheme
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useDeeplinkContext } from '../../../../Models/Context/DeeplinkContext/DeeplinkContext';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DeeplinkOptionsFlyout', debugLogging);

const getClassNames = classNamesFunction<
    IOptionsCalloutStyleProps,
    IOptionsCalloutStyles
>();

const ROOT_LOC = 'deeplinkFlyout';
const LOC_KEYS = {
    copyButtonText: `${ROOT_LOC}.copyButtonText`,
    copyConfirmationMessage: `${ROOT_LOC}.copyConfirmationMessage`,
    flyoutHeader: `${ROOT_LOC}.flyoutHeader`,
    includeElementsOption: `${ROOT_LOC}.includeElementsOption`,
    includeLayersOption: `${ROOT_LOC}.includeLayersOption`
};

const FADE_DELAY = 4000;

const OptionsCallout: React.FC<IOptionsCalloutProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const { getDeeplink } = useDeeplinkContext();
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // state
    const [includeLayers, { toggle: toggleIncludeLayers }] = useBoolean(true);
    const [includeElement, { toggle: toggleIncludeElement }] = useBoolean(true);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [
        isConfirmationFadingOut,
        setIsConfirmationFadingOut
    ] = useState<boolean>(false);
    const confirmationTimeout = useRef<any>();
    const confirmationFadeoutTimeout = useRef<any>();

    // callbacks
    const onCopyLinkClick = useCallback(async () => {
        // if there's a pending timeout, clear that
        if (confirmationTimeout.current) {
            clearTimeout(confirmationTimeout.current);
        }
        if (confirmationFadeoutTimeout) {
            clearTimeout(confirmationFadeoutTimeout.current);
        }

        // hide it initally so it can fade back in if it was already showing
        setShowConfirmation(false);
        const deeplink = getDeeplink({
            includeSelectedElement: includeElement,
            includeSelectedLayers: includeLayers
        });
        try {
            await navigator.clipboard.writeText(deeplink);
            setShowConfirmation(true);
            confirmationFadeoutTimeout.current = setTimeout(() => {
                setIsConfirmationFadingOut(true);
            }, FADE_DELAY);
            confirmationTimeout.current = setTimeout(() => {
                setShowConfirmation(false);
                setIsConfirmationFadingOut(false);
            }, FADE_DELAY + 500);
            logDebugConsole('debug', 'Copied deeplink to clipboard', deeplink);
        } catch (error) {
            logDebugConsole(
                'error',
                'Failed to copy deeplink to clipboard',
                error
            );
            console.error('Failed to copy text to clipboard');
        }
    }, [getDeeplink, includeElement, includeLayers]);

    return (
        <Stack className={classNames.root} tokens={{ childrenGap: 14 }}>
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
                        className={css(
                            classNames.calloutConfirmationMessage,
                            isConfirmationFadingOut &&
                                classNames.calloutConfirmationMessageFadeOut
                        )}
                        horizontal
                        styles={classNames.subComponentStyles.confirmationStack}
                        tokens={{ childrenGap: 4 }}
                    >
                        <Text>{t(LOC_KEYS.copyConfirmationMessage)}</Text>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

export default styled<
    IOptionsCalloutProps,
    IOptionsCalloutStyleProps,
    IOptionsCalloutStyles
>(OptionsCallout, getStyles);
