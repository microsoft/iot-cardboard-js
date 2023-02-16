import React, { useCallback, useEffect, useMemo, useState } from 'react';
import produce from 'immer';
import {
    IPowerBIWidgetBuilderProps,
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
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

const getClassNames = classNamesFunction<
    IPowerBIWidgetBuilderStyleProps,
    IPowerBIWidgetBuilderStyles
>();

const PowerBIWidgetBuilder: React.FC<IPowerBIWidgetBuilderProps> = ({
    styles,
    formData,
    adapter,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    // contexts

    // state
    const [selectedType, setSelectedType] = useState(
        formData?.widgetConfiguration?.type || 'visual'
    );
    const [reportUrl, setReportUrl] = useState(
        formData?.widgetConfiguration?.embedUrl || ''
    );
    const [pageName, setPageName] = useState(
        formData?.widgetConfiguration?.pageName || ''
    );
    const [, setVisualName] = useState(
        formData?.widgetConfiguration?.visualName || ''
    );

    const [reportPages, setReportPages] = useState([]);
    const disableReportPages = useMemo(() => {
        return reportPages?.length < 1;
    }, [reportPages]);
    useEffect(() => {
        if (!reportUrl) {
            setReportPages([]);
        }
        adapter?.getPagesInReport(reportUrl).then((pages) => {
            setReportPages(
                pages?.map((page) => {
                    return {
                        key: page.name,
                        text: page.displayName || page.name
                    };
                }) || []
            );
        });
    }, [reportUrl, selectedType]);

    const [reportVisuals, setVisuals] = useState([]);
    const disableReportVisuals = useMemo(() => {
        return reportVisuals?.length < 1;
    }, [reportVisuals]);
    useEffect(() => {
        if (!reportUrl || !pageName) {
            setVisuals([]);
        }
        adapter?.getVisualsOnPage(reportUrl, pageName).then((visuals) => {
            setVisuals(
                visuals?.map((visual) => {
                    return {
                        key: visual.name,
                        text: visual.title || visual.name
                    };
                }) || []
            );
        });
    }, [reportUrl, selectedType, pageName]);

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onLabelChange = useCallback(
        (_ev, newVal) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.label = newVal;
                })
            );
        },
        [updateWidgetData, formData]
    );
    const onTypeChange = useCallback(
        (_ev, type) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.type = type.key;
                })
            );
            setSelectedType(type.key);
        },
        [formData?.widgetConfiguration?.type]
    );
    const onReportUrlChange = useCallback(
        (_ev, value) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.embedUrl = value;
                })
            );
            setReportUrl(value);
        },
        [formData?.widgetConfiguration?.embedUrl]
    );
    const onPageNameChange = useCallback(
        (_ev, value) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.pageName = value;
                })
            );
            setPageName(value.key);
        },
        [formData?.widgetConfiguration?.pageName]
    );
    const onVisualNameChange = useCallback(
        (_ev, value) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.visualName = value;
                })
            );
            setVisualName(value.key);
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
                    formData?.widgetConfiguration?.pageName &&
                    formData?.widgetConfiguration?.visualName
                );
                break;
            case 'visual':
                hasRequiredSubConfiguration = !!(
                    formData?.widgetConfiguration?.pageName &&
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
                    formData?.widgetConfiguration.embedUrl &&
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

    if (!adapter) {
        return <div>{t('widgets.powerBI.errors.missingAdapter')}</div>;
    }
    if (formData?.widgetConfiguration === undefined) {
        return <div>{t('widgets.powerBI.errors.missingConfiguration')}</div>;
    }

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
                    onChange={onLabelChange}
                    required={true}
                />
                {/** Type */}
                <ComboBox
                    label={t('widgets.powerBI.type.label')}
                    allowFreeform={false}
                    autoComplete="on"
                    key="widget_powerBIBuilder_type"
                    options={[
                        // {
                        //     key: 'report',
                        //     text: t('widgets.powerBI.type.options.report')
                        // },
                        // {
                        //     key: 'dashboard',
                        //     text: t('widgets.powerBI.type.options.dashboard')
                        // },
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
                    options={reportPages}
                    disabled={disableReportPages}
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
                        options={reportVisuals}
                        disabled={disableReportVisuals}
                        useComboBoxAsMenuWidth={true}
                    />
                )}
                {/** Data Filters */}
                {/* <div>I am not sure what to show here yet</div> */}
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
