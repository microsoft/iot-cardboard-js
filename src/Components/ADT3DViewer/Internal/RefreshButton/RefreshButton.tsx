import React, { useState } from 'react';
import {
    IRefreshButtonProps,
    IRefreshButtonStyleProps,
    IRefreshButtonStyles
} from './RefreshButton.types';
import { getStyles } from './RefreshButton.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    TooltipHost,
    DirectionalHint,
    Stack
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import HeaderControlButton from '../../../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../../../HeaderControlGroup/HeaderControlGroup';
import { formatTimeInRelevantUnits } from '../../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import { DurationUnits } from '../../../../Models/Constants';

const getClassNames = classNamesFunction<
    IRefreshButtonStyleProps,
    IRefreshButtonStyles
>();

const ROOT_LOC = 'viewerRefresh';
const LOC_KEYS = {
    lastRefreshed: `${ROOT_LOC}.lastRefreshed`,
    refreshRate: `${ROOT_LOC}.refreshRate`
};
const RefreshButton: React.FC<IRefreshButtonProps> = (props) => {
    const { lastRefreshTimeInMs, onClick, refreshFrequency, styles } = props;

    // state
    const [timeSinceLastRefresh, setTimeSinceLastRefresh] = useState<{
        value: number;
        displayStringKey: string;
    }>({
        value: 0,
        displayStringKey: 'duration.seconds'
    });

    // hooks
    const flyoutButtonId = useId();
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // to get live updating we have to trigger renders and recalculate on a regular cadence so set a timer to keep checking
    setTimeout(() => {
        const timeSince =
            lastRefreshTimeInMs > 0 ? Date.now() - lastRefreshTimeInMs : 0;
        const timeSinceRefresh = formatTimeInRelevantUnits(
            timeSince,
            DurationUnits.seconds
        );
        setTimeSinceLastRefresh(timeSinceRefresh);
    }, 1000);

    const refreshFrequencyDisplay = formatTimeInRelevantUnits(
        refreshFrequency,
        DurationUnits.seconds
    );

    return (
        <div className={classNames.root}>
            <HeaderControlGroup
                styles={classNames.subComponentStyles.headerControlGroup}
            >
                <TooltipHost
                    directionalHint={DirectionalHint.bottomCenter}
                    styles={classNames.subComponentStyles.callout}
                    content={
                        <Stack>
                            <div>
                                {t(LOC_KEYS.lastRefreshed, {
                                    value: Math.round(
                                        timeSinceLastRefresh.value
                                    ),
                                    units: t(
                                        timeSinceLastRefresh.displayStringKey
                                    )
                                })}
                            </div>
                            <div>
                                {t(LOC_KEYS.refreshRate, {
                                    value: Math.round(
                                        refreshFrequencyDisplay.value
                                    ),
                                    units: t(
                                        refreshFrequencyDisplay.displayStringKey
                                    )
                                })}
                            </div>
                        </Stack>
                    }
                >
                    <HeaderControlButton
                        className={classNames.button}
                        dataTestId={'deeplink-open-flyout'}
                        id={flyoutButtonId}
                        iconProps={{ iconName: 'Refresh' }}
                        isActive={false}
                        onClick={onClick}
                        styles={
                            classNames.subComponentStyles.headerControlButton
                        }
                        // title={t(LOC_KEYS.buttonTitle)}
                    />
                </TooltipHost>
            </HeaderControlGroup>
        </div>
    );
};

export default styled<
    IRefreshButtonProps,
    IRefreshButtonStyleProps,
    IRefreshButtonStyles
>(RefreshButton, getStyles);
