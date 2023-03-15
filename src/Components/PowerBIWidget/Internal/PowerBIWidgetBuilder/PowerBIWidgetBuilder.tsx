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
    ComboBox,
    IComboBoxOption,
    ITextFieldProps,
    Icon,
    Label
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
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
        formData?.widgetConfiguration?.type || 'Visual'
    );
    const [reportUrl, setReportUrl] = useState(
        formData?.widgetConfiguration?.embedUrl || ''
    );
    const [pageName, setPageName] = useState(
        formData?.widgetConfiguration?.pageName || ''
    );

    const [reportPages, setReportPages] = useState<IComboBoxOption[]>([]);
    const disableReportPages = useMemo(() => {
        // since we allow freeform entry, don't disable based on pages returned.
        return !selectedType || !reportUrl;
    }, [reportUrl, selectedType]);
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
    }, [adapter, reportUrl, selectedType]);

    const [reportVisuals, setVisuals] = useState<IComboBoxOption[]>([]);
    const disableReportVisuals = useMemo(() => {
        // since we allow freeform entry, don't disable based on visuals returned.
        return disableReportPages || !pageName;
    }, [disableReportPages, pageName]);
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
    }, [reportUrl, selectedType, pageName, adapter]);

    // hooks
    const { t } = useTranslation();
    const iconButtonId = useId('iconButton');
    const reportUrlId = useId('reportUrl');

    // callbacks
    const onLabelChange = useCallback(
        (_ev, newVal) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.displayName = newVal;
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
        [formData, updateWidgetData]
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
        [formData, updateWidgetData]
    );
    const onPageNameChange = useCallback(
        (_ev, option, _i, freeText) => {
            if (!option && freeText) {
                // Add the freeText item to the options array
                setReportPages([
                    ...reportPages,
                    { key: freeText, text: freeText, selected: true }
                ]);
            }
            setPageName(option?.key || freeText);
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.pageName =
                        option?.key || freeText;
                })
            );
        },
        [formData, reportPages, updateWidgetData]
    );
    const onVisualNameChange = useCallback(
        (_ev, option, _i, freeText) => {
            if (!option && freeText) {
                // Add the freeText item to the options array
                setVisuals([
                    ...reportVisuals,
                    { key: freeText, text: freeText, selected: true }
                ]);
            }
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.visualName =
                        option?.key || freeText;
                })
            );
        },
        [formData, reportVisuals, updateWidgetData]
    );

    const renderReportUrlLabel = (props: ITextFieldProps) => {
        return (
            <Stack
                horizontal
                verticalAlign="center"
                tokens={{
                    childrenGap: 4
                }}
            >
                <Label id={props.id} htmlFor={reportUrlId}>
                    {props.label}
                </Label>
                <Icon
                    id={iconButtonId}
                    iconName="Info"
                    title={t('widgets.powerBI.embedUrl.tooltip')}
                    style={{ cursor: 'default' }}
                />
            </Stack>
        );
    };

    // side effects
    useEffect(() => {
        let hasRequiredSubConfiguration = false;
        switch (formData?.widgetConfiguration?.type) {
            // Not yet supported
            // case 'Report':
            //     hasRequiredSubConfiguration = !!formData?.widgetConfiguration
            //         ?.reportId;
            //     break;
            // case 'Dashboard':
            //     hasRequiredSubConfiguration = !!formData?.widgetConfiguration
            //         ?.reportId;
            //     break;
            case 'Tile':
                hasRequiredSubConfiguration = !!(
                    formData?.widgetConfiguration?.pageName &&
                    formData?.widgetConfiguration?.visualName
                );
                break;
            case 'Visual':
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
                formData?.widgetConfiguration?.displayName &&
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
                    label={t('displayName')}
                    placeholder={t('displayNamePlaceholder')}
                    value={formData?.widgetConfiguration?.displayName}
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
                            key: 'Tile',
                            text: t('widgets.powerBI.type.options.tile')
                        },
                        {
                            key: 'Visual',
                            text: t('widgets.powerBI.type.options.visual')
                        }
                    ]}
                    onChange={onTypeChange}
                    defaultSelectedKey={selectedType}
                    useComboBoxAsMenuWidth={true}
                />
                {/** Report Url */}
                <TextField
                    id={reportUrlId}
                    label={t('widgets.powerBI.embedUrl.label')}
                    placeholder={t('widgets.powerBI.embedUrl.placeholder')}
                    value={reportUrl}
                    onChange={onReportUrlChange}
                    required={true}
                    description={t('widgets.powerBI.embedUrl.description')}
                    onRenderLabel={renderReportUrlLabel}
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
                {(selectedType === 'Tile' || selectedType === 'Visual') && (
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
