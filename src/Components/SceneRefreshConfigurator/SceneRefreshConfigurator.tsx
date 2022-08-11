import React, { useEffect, useState } from 'react';
import {
    ISceneRefreshConfiguratorProps,
    ISceneRefreshConfiguratorStyleProps,
    ISceneRefreshConfiguratorStyles
} from './SceneRefreshConfigurator.types';
import { getStyles } from './SceneRefreshConfigurator.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    Dropdown,
    IDropdownOption,
    IDropdownProps
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import HeaderControlButtonWithCallout from '../HeaderControlButtonWithCallout/HeaderControlButtonWithCallout';
import TooltipCallout from '../TooltipCallout/TooltipCallout';
import { TFunction } from 'i18next';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { getDebugLogger } from '../../Models/Services/Utils';
import { ONE_SECOND, ONE_MINUTE, ONE_HOUR } from '../../Models/Constants';

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'SceneRefreshConfigurator',
    debugLogging
);

const getClassNames = classNamesFunction<
    ISceneRefreshConfiguratorStyleProps,
    ISceneRefreshConfiguratorStyles
>();

const ROOT_LOC = 'sceneRefreshConfigurator';
const LOC_KEYS = {
    headerButtonTitle: `${ROOT_LOC}.headerButtonTitle`,
    calloutTitle: `${ROOT_LOC}.calloutTitle`,
    calloutDescription: `${ROOT_LOC}.calloutDescription`,
    rateDropdownLabel: `${ROOT_LOC}.rateDropdownLabel`,
    rateTooltip: `${ROOT_LOC}.rateTooltip`,
    rateOptions: {
        sec2: `${ROOT_LOC}.rateOptions.2sec`,
        sec5: `${ROOT_LOC}.rateOptions.5sec`,
        sec10: `${ROOT_LOC}.rateOptions.10sec`,
        sec30: `${ROOT_LOC}.rateOptions.30sec`,
        min1: `${ROOT_LOC}.rateOptions.1min`,
        min2: `${ROOT_LOC}.rateOptions.2min`,
        min5: `${ROOT_LOC}.rateOptions.5min`,
        min10: `${ROOT_LOC}.rateOptions.10min`,
        min30: `${ROOT_LOC}.rateOptions.30min`,
        hour1: `${ROOT_LOC}.rateOptions.1hour`,
        hour2: `${ROOT_LOC}.rateOptions.2hour`,
        hour5: `${ROOT_LOC}.rateOptions.5hour`
    }
};
const SceneRefreshConfigurator: React.FC<ISceneRefreshConfiguratorProps> = (
    props
) => {
    const { config, sceneId, styles } = props;

    // hooks
    const { t } = useTranslation();

    // data
    const rateOptions = getRateOptions(t);
    const pollingConfig = ViewerConfigUtility.getPollingConfig(config, sceneId);

    // state
    // need local state to trigger renders on selection changes
    const [selectedPollingRate, setSelectedPollingRate] = useState<number>(
        pollingConfig.minimumPollingFrequency
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // callbacks
    const onRateChange = (
        _event: React.FormEvent<HTMLDivElement>,
        option: IDropdownOption<number>
    ) => {
        logDebugConsole(
            'info',
            `Updating selected polling rate to ${option.data} {config, sceneId}`,
            config,
            sceneId
        );
        setSelectedPollingRate(option.data);
        ViewerConfigUtility.setPollingRate(config, sceneId, option.data);
    };

    const getLabelRenderFunction = (tooltipText: string) => {
        return (
            props?: IDropdownProps,
            defaultRender?: (props?: IDropdownProps) => JSX.Element | null
        ) => {
            return (
                <Stack horizontal verticalAlign={'center'}>
                    {defaultRender(props)}
                    <TooltipCallout
                        content={{
                            calloutContent: tooltipText,
                            buttonAriaLabel: tooltipText
                        }}
                    />
                </Stack>
            );
        };
    };

    // side effects
    useEffect(() => {
        // ensure that state never gets out of sync with the config
        setSelectedPollingRate(pollingConfig.minimumPollingFrequency);
    }, [pollingConfig.minimumPollingFrequency]);

    logDebugConsole('debug', 'Render {pollingConfig}', pollingConfig);
    return (
        <HeaderControlButtonWithCallout
            buttonProps={{
                iconName: 'DeveloperTools',
                testId: 'scene-configure-scene-button',
                title: t(LOC_KEYS.headerButtonTitle)
            }}
            calloutProps={{
                iconName: 'DeveloperTools',
                title: t(LOC_KEYS.calloutTitle)
            }}
            styles={classNames.subComponentStyles.headerControlWithCallout}
        >
            <Stack tokens={{ childrenGap: 8 }}>
                <span className={classNames.calloutDescription}>
                    {t(LOC_KEYS.calloutDescription)}
                </span>

                <Dropdown
                    ariaLabel={t(LOC_KEYS.rateDropdownLabel)}
                    label={t(LOC_KEYS.rateDropdownLabel)}
                    selectedKey={selectedPollingRate}
                    options={rateOptions}
                    onChange={onRateChange}
                    onRenderLabel={getLabelRenderFunction(
                        t(LOC_KEYS.rateTooltip)
                    )}
                />
            </Stack>
        </HeaderControlButtonWithCallout>
    );
};

// NOTE: key and data must match, using data to get type safety, but uses key when setting the selected key so they have to match
const getRateOptions = (t: TFunction): IDropdownOption<number>[] => {
    return [
        {
            data: 2 * ONE_SECOND,
            key: 2 * ONE_SECOND,
            text: t(LOC_KEYS.rateOptions.sec2)
        },
        {
            data: 5 * ONE_SECOND,
            key: 5 * ONE_SECOND,
            text: t(LOC_KEYS.rateOptions.sec5)
        },
        {
            data: 10 * ONE_SECOND,
            key: 10 * ONE_SECOND,
            text: t(LOC_KEYS.rateOptions.sec10)
        },
        {
            data: 30 * ONE_SECOND,
            key: 30 * ONE_SECOND,
            text: t(LOC_KEYS.rateOptions.sec30)
        },
        {
            data: ONE_MINUTE,
            key: ONE_MINUTE,
            text: t(LOC_KEYS.rateOptions.min1)
        },
        {
            data: 2 * ONE_MINUTE,
            key: 2 * ONE_MINUTE,
            text: t(LOC_KEYS.rateOptions.min2)
        },
        {
            data: 5 * ONE_MINUTE,
            key: 5 * ONE_MINUTE,
            text: t(LOC_KEYS.rateOptions.min5)
        },
        {
            data: 10 * ONE_MINUTE,
            key: 10 * ONE_MINUTE,
            text: t(LOC_KEYS.rateOptions.min10)
        },
        {
            data: 30 * ONE_MINUTE,
            key: 30 * ONE_MINUTE,
            text: t(LOC_KEYS.rateOptions.min30)
        },
        {
            data: ONE_HOUR,
            key: ONE_HOUR,
            text: t(LOC_KEYS.rateOptions.hour1)
        },
        {
            data: 2 * ONE_HOUR,
            key: 2 * ONE_HOUR,
            text: t(LOC_KEYS.rateOptions.hour2)
        },
        {
            data: 5 * ONE_HOUR,
            key: 5 * ONE_HOUR,
            text: t(LOC_KEYS.rateOptions.hour5)
        }
    ];
};

export default styled<
    ISceneRefreshConfiguratorProps,
    ISceneRefreshConfiguratorStyleProps,
    ISceneRefreshConfiguratorStyles
>(SceneRefreshConfigurator, getStyles);
