import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
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

const ROOT_LOC = 'sceneRefreshButton';
const LOC_KEYS = {
    lastRefreshed: `${ROOT_LOC}.lastRefreshed`,
    refreshRate: `${ROOT_LOC}.refreshRate`
};
const SceneRefreshButton: React.FC<ISceneRefreshButtonProps> = (props) => {
    const { lastRefreshTimeInMs, onClick, refreshFrequency, styles } = props;
    const iconAnimationTimeout = useRef(null);
    const lastRefreshTimeout = useRef(null);

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

    const localOnClick = useCallback(() => {
        setIsRefreshInProgress(true); // apply the styling
        clearTimeout(iconAnimationTimeout.current); // clear any pending timeouts
        iconAnimationTimeout.current = setTimeout(() => {
            setIsRefreshInProgress(false);
        }, ANIMATION_DURATION_SECONDS * 1000 + 0.1); // give it enough time to finish the animation, then remove the style
        onClick();
    }, []);

    clearTimeout(lastRefreshTimeout.current);
    // to get live updating we have to trigger renders and recalculate on a regular cadence so set a timer to keep checking
    lastRefreshTimeout.current = setTimeout(() => {
        const timeSince =
            lastRefreshTimeInMs > 0 ? Date.now() - lastRefreshTimeInMs : 0;
        const timeSinceRefresh = formatTimeInRelevantUnits(
            timeSince,
            DurationUnits.seconds
        );
        setTimeSinceLastRefresh(timeSinceRefresh);
    }, 450);

    const refreshFrequencyDisplay = useMemo(
        () =>
            formatTimeInRelevantUnits(refreshFrequency, DurationUnits.seconds),
        [refreshFrequency]
    );

    // side effects
    useEffect(() => {
        // clear the timeouts on unmount
        return () => {
            clearTimeout(lastRefreshTimeout.current);
            clearTimeout(iconAnimationTimeout.current);
        };
    }, []);

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
                                    timeWithUnits: t(
                                        timeSinceLastRefresh.displayStringKey,
                                        {
                                            value: Math.round(
                                                timeSinceLastRefresh.value
                                            )
                                        }
                                    )
                                })}
                            </div>
                            <div>
                                {t(LOC_KEYS.refreshRate, {
                                    timeWithUnits: t(
                                        refreshFrequencyDisplay.displayStringKey,
                                        {
                                            value: Math.round(
                                                refreshFrequencyDisplay.value
                                            )
                                        }
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
                        onClick={localOnClick}
                        styles={
                            classNames.subComponentStyles.headerControlButton
                        }
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
