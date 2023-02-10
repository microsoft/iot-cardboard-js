import React, { useCallback, useEffect, useReducer, useState } from 'react';
import produce from 'immer';
import {
    defaultPowerBIWidgetBuilderState,
    IPowerBIWidgetBuilderProps,
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles,
    PowerBIWidgetBuilderActionType
} from './PowerBIWidgetBuilder.types';
import { getStyles } from './PowerBIWidgetBuilder.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    TextField,
    ComboBox
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getWidgetFormStyles } from '../../../ADT3DSceneBuilder/Internal/Behaviors/Widgets/WidgetForm/WidgetForm.styles';
import { PowerBIWidgetBuilderReducer } from './PowerBIWidgetBuilder.state';

const getClassNames = classNamesFunction<
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
>();

const PowerBIWidgetBuilder: React.FC<IPowerBIWidgetBuilderProps> = ({
    styles,
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    // contexts

    // state
    const [selectedType, setSelectedType] = useState(
        formData?.widgetConfiguration?.type || 'visual'
    );
    const [reportUrl, setReportUrl] = useState(
        formData?.widgetConfiguration?.reportId || ''
    );
    const [, setPageName] = useState(
        formData?.widgetConfiguration?.pageName || ''
    );
    const [, setVisualName] = useState(
        formData?.widgetConfiguration?.visualName || ''
    );

    const [state, dispatch] = useReducer(
        PowerBIWidgetBuilderReducer,
        defaultPowerBIWidgetBuilderState
    );

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onTypeChange = useCallback(
        (_ev, type) => {
            setSelectedType(type.key);
        },
        [formData?.widgetConfiguration?.type]
    );
    const onReportUrlChange = useCallback(
        (_ev, value) => {
            dispatch({
                type: PowerBIWidgetBuilderActionType.GET_PAGES_IN_REPORT,
                payload: { embedUrl: value }
            });
            setReportUrl(value);
        },
        [formData?.widgetConfiguration?.reportId]
    );
    const onPageNameChange = useCallback(
        (_ev, value) => {
            dispatch({
                type: PowerBIWidgetBuilderActionType.GET_VISUALS_ON_PAGE,
                payload: {
                    embedUrl: reportUrl,
                    pageName: value
                }
            });
            setPageName(value);
        },
        [formData?.widgetConfiguration?.pageName]
    );
    const onVisualNameChange = useCallback(
        (_ev, value) => {
            setVisualName(value);
        },
        [formData?.widgetConfiguration?.visualName]
    );

    // side effects
    useEffect(() => {
        let hasRequiredSubConfiguration = false;
        switch (formData?.widgetConfiguration?.type) {
            // Not yet supported
            // case 'report':
            //     hasRequiredSubConfiguration = !!formData?.widgetConfiguration
            //         ?.reportId;
            //     break;
            // case 'dashboard':
            //     hasRequiredSubConfiguration = !!formData?.widgetConfiguration
            //         ?.reportId;
            //     break;
            case 'tile':
                hasRequiredSubConfiguration = !!(
                    formData?.widgetConfiguration?.reportId &&
                    formData?.widgetConfiguration?.visualName
                );
                break;
            case 'visual':
                hasRequiredSubConfiguration = !!(
                    formData?.widgetConfiguration?.reportId &&
                    formData?.widgetConfiguration?.visualName
                );
                break;
            default:
                hasRequiredSubConfiguration = false;
                break;
        }
        if (setIsWidgetConfigValid) {
            setIsWidgetConfigValid(
                formData?.widgetConfiguration?.label &&
                    formData?.widgetConfiguration.reportId &&
                    hasRequiredSubConfiguration
            );
        }
    }, [formData, setIsWidgetConfigValid]);

    // styles
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme
    });
    const customStyles = getWidgetFormStyles(theme);

    return (
        <div
            className={`${classNames.root} ${customStyles.widgetFormContents}`}
        >
            <Stack tokens={{ childrenGap: 8 }}>
                {/** Label */}
                <TextField
                    label={t('label')}
                    placeholder={t('labelPlaceholder')}
                    value={formData?.widgetConfiguration?.label}
                    onChange={(_ev, newVal) =>
                        updateWidgetData(
                            produce(formData, (draft) => {
                                draft.widgetConfiguration.label = newVal;
                            })
                        )
                    }
                    required={true}
                />
                {/** Type */}
                <ComboBox
                    label={t('widgets.powerBI.type.label')}
                    allowFreeform={false}
                    autoComplete="on"
                    key="widget_powerBIBuilder_type"
                    options={[
                        {
                            key: 'report',
                            text: t('widgets.powerBI.type.options.report')
                        },
                        {
                            key: 'dashboard',
                            text: t('widgets.powerBI.type.options.dashboard')
                        },
                        {
                            key: 'tile',
                            text: t('widgets.powerBI.type.options.tile')
                        },
                        {
                            key: 'visual',
                            text: t('widgets.powerBI.type.options.visual')
                        }
                    ]}
                    onChange={onTypeChange}
                    defaultSelectedKey={selectedType}
                    useComboBoxAsMenuWidth={true}
                />
                {/** Report Url */}
                <TextField
                    label={t('widgets.powerBI.reportUrl.label')}
                    placeholder={t('widgets.powerBI.reportUrl.placeholder')}
                    value={reportUrl}
                    onChange={onReportUrlChange}
                    required={true}
                    description={t('widgets.powerBI.reportUrl.description')}
                />
                {/** Page Name */}
                <ComboBox
                    allowFreeform={true}
                    label={t('widgets.powerBI.pageName.label')}
                    placeholder={t('widgets.powerBI.pageName.placeholder')}
                    onChange={onPageNameChange}
                    required={true}
                    options={state.isPagesLoaded ? reportPages : []}
                    disabled={!state.isPagesLoaded}
                    useComboBoxAsMenuWidth={true}
                />
                {/** Visual Name */}
                {(selectedType === 'tile' || selectedType === 'visual') && (
                    <ComboBox
                        allowFreeform={true}
                        label={t('widgets.powerBI.visualName.label')}
                        placeholder={t(
                            'widgets.powerBI.visualName.placeholder'
                        )}
                        onChange={onVisualNameChange}
                        required={true}
                        options={state.isVisualsLoaded ? reportVisuals : []}
                        disabled={!state.isVisualsLoaded}
                        useComboBoxAsMenuWidth={true}
                    />
                )}
                {/** Data Filters */}
                <div>I am not sure what to show here yet</div>
            </Stack>
        </div>
    );
};

export default React.memo(
    styled<
        IPowerBIWidgetBuilderProps,
        IPowerBIWidgetBuilderStyleProps,
        IPowerBIWidgetBuilderStyles
    >(PowerBIWidgetBuilder, getStyles)
);
