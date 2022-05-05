import React, { memo, useCallback, useState } from 'react';
import {
    IDeeplinkFlyoutProps,
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
} from './DeeplinkFlyout.types';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { getStyles } from './DeeplinkFlyout.styles';
import {
    Checkbox,
    classNamesFunction,
    FocusTrapCallout,
    FontSizes,
    Icon,
    IconButton,
    PrimaryButton,
    Stack,
    styled,
    Text,
    useTheme
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useDeeplinkContext } from '../../Models/Context/DeeplinkContext';

const getClassNames = classNamesFunction<
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
>();

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

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // callbacks
    const onCopyLinkClick = useCallback(() => {
        setShowConfirmation(true);
        const deeplink = getDeeplink({
            includeSelectedElement: includeElement,
            includeSelectedLayers: includeLayers
        });
        alert(`Copied link to clipboard. \n${deeplink}`);
    }, [includeElement, includeLayers]);

    return (
        <div className={classNames.root}>
            <IconButton
                data-testid={'deeplink-open-flyout'}
                iconProps={{ iconName: 'Share' }}
                id={flyoutButtonId}
                onClick={() => toggleFlyout()}
                title={t(LOC_KEYS.buttonTitle)}
            />
            {showFlyout && (
                <FocusTrapCallout
                    target={`#${flyoutButtonId}`}
                    styles={classNames.subComponentStyles.callout}
                >
                    <Stack tokens={{ childrenGap: 8 }}>
                        <h4 className={classNames.calloutTitle}>
                            {t(LOC_KEYS.flyoutHeader)}
                        </h4>
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
                                    className={classNames.confirmationMessage}
                                >
                                    <Icon iconName="Link" />
                                    <Text>
                                        {t(LOC_KEYS.copyConfirmationMessage)}
                                    </Text>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </FocusTrapCallout>
            )}
        </div>
    );
};

export default styled<
    IDeeplinkFlyoutProps,
    IDeeplinkFlyoutStyleProps,
    IDeeplinkFlyoutStyles
>(DeeplinkFlyout, getStyles);
