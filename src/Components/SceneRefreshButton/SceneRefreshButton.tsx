import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ISceneRefreshButtonProps,
    ISceneRefreshButtonStyleProps,
    ISceneRefreshButtonStyles
} from './SceneRefreshButton.types';
import {
    ANIMATION_DURATION_SECONDS,
    getStyles
} from './SceneRefreshButton.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    TooltipHost,
    DirectionalHint,
    Stack
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';
import { formatTimeInRelevantUnits } from '../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import { DurationUnits } from '../../Models/Constants';

const getClassNames = classNamesFunction<
    ISceneRefreshButtonStyleProps,
    ISceneRefreshButtonStyles
>();

const ROOT_LOC = 'viewerRefresh';
const LOC_KEYS = {
    lastRefreshed: `${ROOT_LOC}.lastRefreshed`,
    refreshRate: `${ROOT_LOC}.refreshRate`
};
const SceneRefreshButton: React.FC<ISceneRefreshButtonProps> = (props) => {
    const {
        isRefreshing,
        lastRefreshTimeInMs,
        onClick,
        refreshFrequency,
        styles
    } = props;
    const iconAnimationTimeout = useRef<NodeJS.Timeout>();

    // state
    const [isRefreshInProgress, setIsRefreshInProgress] = useState<boolean>(
        false
    );
    const [timeSinceLastRefresh, setTimeSinceLastRefresh] = useState<{
        value: number;
        displayStringKey: string;
    }>({
        value: 0,
        displayStringKey: 'duration.seconds'
    });

    // hooks
    const buttonId = useId();
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        isRefreshing: isRefreshInProgress,
        theme: useTheme()
    });

    // set local state when we are notified about refreshing, then give it time to animate
    useEffect(() => {
        if (isRefreshing) {
            setIsRefreshInProgress(true); // apply the styling
            clearTimeout(iconAnimationTimeout.current); // clear any pending timeouts
            setTimeout(() => {
                setIsRefreshInProgress(false);
            }, ANIMATION_DURATION_SECONDS * 1000 + 0.1); // give it enough time to finish the animation, then remove the style
        }
    }, [isRefreshing]);

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

    const refreshFrequencyDisplay = useMemo(
        () =>
            formatTimeInRelevantUnits(refreshFrequency, DurationUnits.seconds),
        [refreshFrequency]
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
                        dataTestId={'refresh-button'}
                        id={buttonId}
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
    ISceneRefreshButtonProps,
    ISceneRefreshButtonStyleProps,
    ISceneRefreshButtonStyles
>(SceneRefreshButton, getStyles);
