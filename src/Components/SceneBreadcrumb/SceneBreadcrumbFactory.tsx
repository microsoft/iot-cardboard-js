import { IBreadcrumbItem } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BehaviorModes, ElementModes } from '../../Models/Constants/Breadcrumb';
import {
    ADT3DSceneBuilderMode,
    VisualRuleFormMode,
    WidgetFormMode
} from '../../Models/Constants/Enums';
import { SceneBuilderContext } from '../ADT3DSceneBuilder/ADT3DSceneBuilder';
import { WidgetFormInfo } from '../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import {
    INavigateCallback,
    ISceneBreadcrumbFactoryProps
} from './SceneBreadcrumb.types';
import { BaseBreadcrumb } from './BaseBreadcrumb';

const cancelWidgetForm = (
    widgetFormInfo: WidgetFormInfo,
    setWidgetFormInfo: (widgetFormInfo: WidgetFormInfo) => void
) => {
    if (
        widgetFormInfo.mode === WidgetFormMode.CreateWidget ||
        widgetFormInfo.mode === WidgetFormMode.EditWidget
    ) {
        setWidgetFormInfo({ mode: WidgetFormMode.Cancelled });
    }
};

const isCreateOrEditWidgetMode = (formMode: WidgetFormMode) => {
    return (
        formMode === WidgetFormMode.CreateWidget ||
        formMode === WidgetFormMode.EditWidget
    );
};

const isCreateOrEditBehaviorMode = (formMode: ADT3DSceneBuilderMode) => {
    return (
        formMode === ADT3DSceneBuilderMode.CreateBehavior ||
        formMode === ADT3DSceneBuilderMode.EditBehavior
    );
};

const isCreateOrEditElementMode = (formMode: ADT3DSceneBuilderMode) => {
    return (
        formMode === ADT3DSceneBuilderMode.CreateElement ||
        formMode === ADT3DSceneBuilderMode.EditElement
    );
};

const isCreateOrEditVisualRuleMode = (formMode: VisualRuleFormMode) => {
    return (
        formMode === VisualRuleFormMode.CreateVisualRule ||
        formMode === VisualRuleFormMode.EditVisualRule
    );
};

const SceneBreadcrumbFactory: React.FC<ISceneBreadcrumbFactoryProps> = ({
    builderMode,
    onNavigate,
    onSceneChange,
    onSceneClick,
    sceneId,
    sceneName
}) => {
    const { t } = useTranslation();

    const extraItems: Array<IBreadcrumbItem> = [];
    const widgetsFormRootLabel: IBreadcrumbItem = {
        text: t('3dSceneBuilder.widget'),
        key: 'widgetsRoot'
    };
    const visualRuleFormRootLabel: IBreadcrumbItem = {
        text: t('3dSceneBuilder.visualRule'),
        key: 'visualRulesRoot'
    };

    const twinAliasFormRootLabel: IBreadcrumbItem = {
        text: t('3dSceneBuilder.twinAlias.title'),
        key: 'twinAliasRoot'
    };

    /**
     * Build props for all behavior builder screens
     */
    if (builderMode !== undefined && BehaviorModes.includes(builderMode)) {
        const {
            widgetFormInfo,
            setWidgetFormInfo,
            behaviorTwinAliasFormInfo,
            setBehaviorTwinAliasFormInfo,
            setVisualRuleFormMode,
            visualRuleFormMode
        } = useContext(SceneBuilderContext);

        let onBehaviorRootClick: VoidFunction | undefined;
        let onCancelForm: VoidFunction | undefined;
        let onNavigateCallback: INavigateCallback | undefined;
        const isVisualFormMode = isCreateOrEditVisualRuleMode(
            visualRuleFormMode
        );
        const isWidgetFormMode = isCreateOrEditWidgetMode(widgetFormInfo.mode);
        const isTwinFormMode = behaviorTwinAliasFormInfo !== null;

        /**
         * Add extra breadcrumb item in case behavior is in form mode
         */
        if (isCreateOrEditBehaviorMode(builderMode)) {
            onNavigateCallback = onNavigate;
            const isBuilderModeNotInBehaviorForm = !isCreateOrEditBehaviorMode(
                builderMode
            );
            const isClickable =
                isWidgetFormMode ||
                isTwinFormMode ||
                isVisualFormMode ||
                isBuilderModeNotInBehaviorForm;

            const behaviorFormRoot: IBreadcrumbItem = {
                text: t('3dSceneBuilder.behavior'),
                key: 'behaviorRoot',
                ...(isClickable && {
                    onClick: () => {
                        const navigate = () => {
                            cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                            setBehaviorTwinAliasFormInfo(null);
                            setVisualRuleFormMode(VisualRuleFormMode.Inactive);
                        };
                        onNavigateCallback('goToForm', navigate);
                    }
                })
            };
            extraItems.push(behaviorFormRoot);

            /**
             * Callbacks required to cancel forms, both are only required when behavior is in form mode
             */
            onBehaviorRootClick = () => {
                const navigate = () => {
                    onSceneClick();
                    cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                    setBehaviorTwinAliasFormInfo(null);
                    setVisualRuleFormMode(VisualRuleFormMode.Inactive);
                };
                onNavigateCallback('goToScene', navigate);
            };

            onCancelForm = () => {
                const navigate = () => {
                    cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                    setBehaviorTwinAliasFormInfo(null);
                    setVisualRuleFormMode(VisualRuleFormMode.Inactive);
                };
                onNavigateCallback('cancelForm', navigate);
            };
        }

        /**
         * If widget or twin alias forms are displayed show a 4th breadcrumb item
         */
        if (isWidgetFormMode) {
            extraItems.push(widgetsFormRootLabel);
        } else if (isTwinFormMode) {
            extraItems.push(twinAliasFormRootLabel);
        } else if (isVisualFormMode) {
            extraItems.push(visualRuleFormRootLabel);
        }

        return (
            <BaseBreadcrumb
                extraItems={extraItems}
                isAtSceneRoot={
                    builderMode === ADT3DSceneBuilderMode.BehaviorIdle
                }
                onSceneClick={onBehaviorRootClick}
                sceneName={sceneName}
                sceneId={sceneId}
                onCancelForm={onCancelForm}
                onNavigate={onNavigateCallback}
                classNames={{
                    root: 'cb-left-panel-builder-breadcrumb-container',
                    breadcrumb: 'cb-left-panel-builder-breadcrumb',
                    sceneRoot: 'cb-left-panel-builder-breadcrumb-scene-root'
                }}
            />
        );
    } else if (
        builderMode !== undefined &&
        ElementModes.includes(builderMode)
    ) {
        /**
         * Build props for all element builder screens
         */
        const {
            widgetFormInfo,
            setWidgetFormInfo,
            elementTwinAliasFormInfo,
            setBehaviorTwinAliasFormInfo,
            setElementTwinAliasFormInfo
        } = useContext(SceneBuilderContext);

        let onElementRootClick: VoidFunction | undefined;
        let onCancelForm: VoidFunction | undefined;
        let onNavigateCallback: INavigateCallback | undefined;

        /**
         * Add extra breadcrumb item in case element is in form mode
         */
        if (isCreateOrEditElementMode(builderMode)) {
            onNavigateCallback = onNavigate;
            const isTwinFormMode = elementTwinAliasFormInfo !== null;
            const isBuilderModeNotInElementForm = !isCreateOrEditElementMode(
                builderMode
            );
            const isClickable = isTwinFormMode || isBuilderModeNotInElementForm;

            const elementFormRoot: IBreadcrumbItem = {
                text: t('3dSceneBuilder.element'),
                key: 'elementRoot',
                ...(isClickable && {
                    onClick: () => {
                        setElementTwinAliasFormInfo(null);
                    }
                })
            };
            extraItems.push(elementFormRoot);

            /**
             * Callbacks required to cancel forms, both are only required when element is in form mode
             */
            onElementRootClick = () => {
                const navigate = () => {
                    onSceneClick();
                    setElementTwinAliasFormInfo(null);
                };
                onNavigateCallback('goToScene', navigate);
            };

            onCancelForm = () => {
                const navigate = () => {
                    cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                    setBehaviorTwinAliasFormInfo(null);
                    setElementTwinAliasFormInfo(null);
                };
                onNavigateCallback('cancelForm', navigate);
            };
        }

        /**
         * If twin alias form is displayed show a 4th breadcrumb item
         */
        if (elementTwinAliasFormInfo) {
            extraItems.push(twinAliasFormRootLabel);
        }

        return (
            <BaseBreadcrumb
                classNames={{
                    root: 'cb-left-panel-builder-breadcrumb-container',
                    breadcrumb: 'cb-left-panel-builder-breadcrumb',
                    sceneRoot: 'cb-left-panel-builder-breadcrumb-scene-root'
                }}
                extraItems={extraItems}
                isAtSceneRoot={
                    builderMode === ADT3DSceneBuilderMode.ElementsIdle
                }
                onCancelForm={onCancelForm}
                onNavigate={onNavigateCallback}
                onSceneClick={onElementRootClick}
                sceneId={sceneId}
                sceneName={sceneName}
            />
        );
    } else {
        /**
         * Create breadcrumb for all viewer screens
         */
        return (
            <BaseBreadcrumb
                classNames={{
                    root: 'cb-viewer-breadcrumb-container',
                    breadcrumb: 'cb-viewer-breadcrumb',
                    sceneRoot: 'cb-viewer-breadcrumb-scene-root'
                }}
                extraItems={extraItems}
                isAtSceneRoot={true}
                onSceneChange={onSceneChange}
                onNavigate={undefined}
                sceneId={sceneId}
                sceneName={sceneName}
            />
        );
    }
};

export default SceneBreadcrumbFactory;
