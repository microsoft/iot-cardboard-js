import {
    DefaultButton,
    FontSizes,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    PrimaryButton,
    Theme,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    WidgetType,
    defaultGaugeWidget,
    defaultLinkWidget,
    VisualType
} from '../../../../../Models/Classes/3DVConfig';
import { WidgetFormMode } from '../../../../../Models/Constants/Enums';
import {
    IPopoverVisual,
    IWidget
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import PanelFooter from '../../Shared/PanelFooter';
import { getFormStyles } from '../../Shared/PanelForms.styles';
import { BehaviorFormContext } from '../BehaviorsForm';
// TODO SCHEMA MIGRATION -- update widget builders to new schema / types
// import GaugeWidgetBuilder from './WidgetBuilders/GaugeWidgetBuilder';
// import LinkWidgetBuilder from './WidgetBuilders/LinkWidgetBuilder';

// Note, this widget form does not currently support panels
const WidgetForm: React.FC<any> = () => {
    const { widgetFormInfo, setWidgetFormInfo } = useContext(
        SceneBuilderContext
    );

    // TODO SCHEMA MIGRATION -- remove no-unused-vars flag once widget builders are supported
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { behaviorToEdit, setBehaviorToEdit } = useContext(
        BehaviorFormContext
    );
    const { t } = useTranslation();

    const getDefaultFormData = () => {
        switch (widgetFormInfo.widget.data.type) {
            case WidgetType.Gauge:
                return defaultGaugeWidget;
            case WidgetType.Link:
                return defaultLinkWidget;
            default:
                return null;
        }
    };

    const [formData, setFormData] = useState<IWidget>(
        widgetFormInfo.mode === WidgetFormMode.CreateWidget
            ? getDefaultFormData()
            : widgetFormInfo.widget.data
    );

    const getWidgetBuilder = () => {
        switch (widgetFormInfo.widget.data.type) {
            // TODO SCHEMA MIGRATION -- update widget builders to new schema / types
            // case WidgetType.Gauge:
            //     return (
            //         <GaugeWidgetBuilder
            //             formData={formData}
            //             setFormData={setFormData}
            //             behaviorToEdit={behaviorToEdit}
            //         />
            //     );
            // case WidgetType.Link:
            //     return (
            //         <LinkWidgetBuilder
            //             formData={formData}
            //             setFormData={setFormData}
            //         />
            //     );
            default:
                return (
                    <div className="cb-widget-not-supported">
                        {t('widgets.notSupported') + ' :('}
                    </div>
                );
        }
    };

    const onSaveWidgetForm = () => {
        if (widgetFormInfo.mode === WidgetFormMode.CreateWidget) {
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft.visuals?.find(
                        (visual) => visual.type === VisualType.Popover
                    ) as IPopoverVisual;

                    if (popOver) {
                        const widgets = popOver?.widgets;
                        widgets
                            ? popOver.widgets.push(formData)
                            : (popOver.widgets = [formData]);
                    }
                })
            );
        }
        if (widgetFormInfo.mode === WidgetFormMode.EditWidget) {
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft.visuals?.find(
                        (visual) => visual.type === VisualType.Popover
                    ) as IPopoverVisual;

                    if (
                        popOver &&
                        typeof widgetFormInfo.widgetIdx === 'number'
                    ) {
                        const widgets = popOver?.widgets;
                        widgets[widgetFormInfo.widgetIdx] = formData;
                    }
                })
            );
        }

        setWidgetFormInfo(null);
        setFormData(null);
    };

    const theme = useTheme();
    const customStyles = getStyles(theme);
    const commonFormStyles = getFormStyles(theme, 0);
    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.formHeader}>
                    <div className={customStyles.descrption}>
                        {widgetFormInfo.widget.description}
                    </div>
                    {getWidgetBuilder()}
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    onClick={onSaveWidgetForm}
                    text={
                        widgetFormInfo.mode === WidgetFormMode.CreateWidget
                            ? t('3dSceneBuilder.createWidget')
                            : t('3dSceneBuilder.updateWidget')
                    }
                    disabled={false}
                />
                <DefaultButton
                    text={t('cancel')}
                    onClick={() => {
                        setWidgetFormInfo(null);
                        setFormData(null);
                    }}
                />
            </PanelFooter>
        </>
    );
};

const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        descrption: {
            fontSize: FontSizes.size14,
            color: theme.palette.neutralSecondary
        } as IStyle
    });
});

export default WidgetForm;
