import React from 'react';
import {
    ISimpleCalloutProps,
    ISimpleCalloutStyleProps,
    ISimpleCalloutStyles
} from './SimpleCallout.types';
import { getStyles } from './SimpleCallout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    Text
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getDebugLogger } from '../../../../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DeeplinkSimpleFlyout', debugLogging);

const getClassNames = classNamesFunction<
    ISimpleCalloutStyleProps,
    ISimpleCalloutStyles
>();

const ROOT_LOC = 'deeplinkFlyout';
const LOC_KEYS = {
    copyConfirmationMessage: `${ROOT_LOC}.copyConfirmationMessage`
};

const SimpleCallout: React.FC<ISimpleCalloutProps> = (props) => {
    const { styles } = props;

    // hooks
    const { t } = useTranslation();
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    logDebugConsole('debug', 'Render simple callout. Props', props);
    return (
        <Stack className={classNames.root}>
            <Text>{t(LOC_KEYS.copyConfirmationMessage)}</Text>
        </Stack>
    );
};

export default styled<
    ISimpleCalloutProps,
    ISimpleCalloutStyleProps,
    ISimpleCalloutStyles
>(SimpleCallout, getStyles);
