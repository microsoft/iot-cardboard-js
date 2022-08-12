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
import {
    formatTimeInRelevantUnits,
    getDebugLogger
} from '../../Models/Services/Utils';
import {
    ONE_SECOND,
    ONE_MINUTE,
    ONE_HOUR,
    DurationUnits
} from '../../Models/Constants';
import useAdapter from '../../Models/Hooks/useAdapter';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

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
    rateTooltip: `${ROOT_LOC}.rateTooltip`
};
const SceneRefreshConfigurator: React.FC<ISceneRefreshConfiguratorProps> = (
    props
) => {
    const { adapter, config, sceneId, styles } = props;

    // hooks
    const { t } = useTranslation();
    const saveConfig = useAdapter({
        adapterMethod: async (params: { config: I3DScenesConfig }) => {
            await adapter.putScenesConfig(params.config);
            return adapter.getScenesConfig();
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

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
    const onRateChange = async (
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
        await saveConfig.callAdapter({ config });
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
    const durations: number[] = [
        10 * ONE_SECOND,
        30 * ONE_SECOND,
        ONE_MINUTE,
        2 * ONE_MINUTE,
        5 * ONE_MINUTE,
        10 * ONE_MINUTE,
        30 * ONE_MINUTE,
        ONE_HOUR
    ];

    const options: IDropdownOption<number>[] = [];
    for (const duration of durations) {
        const formattedTime = formatTimeInRelevantUnits(
            duration,
            DurationUnits.seconds
        );
        options.push({
            data: duration,
            key: duration,
            text: t(formattedTime.displayStringKey, {
                value: formattedTime.value
            })
        });
    }

    return options;
};

export default styled<
    ISceneRefreshConfiguratorProps,
    ISceneRefreshConfiguratorStyleProps,
    ISceneRefreshConfiguratorStyles
>(SceneRefreshConfigurator, getStyles);
