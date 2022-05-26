import { IBreadcrumbItem } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BehaviorModes, ElementModes } from '../../Models/Constants/Breadcrumb';
import {
    ADT3DSceneBuilderMode,
    WidgetFormMode
} from '../../Models/Constants/Enums';
import { SceneBuilderContext } from '../ADT3DSceneBuilder/ADT3DSceneBuilder';
import { WidgetFormInfo } from '../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import { ISceneBreadcrumbFactoryProps } from './SceneBreadcrumb.types';
import { BaseBreadcrumb } from './BaseBreadcrumb';

const cancelWidgetForm = (
    widgetFormInfo: WidgetFormInfo,
    setWidgetFormInfo: (widgetFormInfo: WidgetFormInfo) => void
) => {
    if (
        widgetFormInfo.mode === WidgetFormMode.CreateWidget ||
        WidgetFormMode.EditWidget
    ) {
        setWidgetFormInfo({ mode: WidgetFormMode.Cancelled });
    }
};

const isCreateOrEditWidget = (formMode: WidgetFormMode) => {
    return (
        formMode === WidgetFormMode.CreateWidget ||
        formMode === WidgetFormMode.EditWidget
    );
};

const SceneBreadcrumbFactory: React.FC<ISceneBreadcrumbFactoryProps> = ({
    sceneId,
    sceneName,
    builderMode,
    onSceneClick,
    onCloseBehaviorsModal
}) => {
    const { t } = useTranslation();

    const extraItems: Array<IBreadcrumbItem> = [];
    const widgetsRoot: IBreadcrumbItem = {
        text: t('3dSceneBuilder.widget'),
        key: 'widgetsRoot'
    };

    const twinAliasRoot: IBreadcrumbItem = {
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
            setBehaviorTwinAliasFormInfo
        } = useContext(SceneBuilderContext);

        let onBehaviorRootClick: VoidFunction | undefined;
        let onCancelForm: VoidFunction | undefined;

        /**
         * Add extra breadcrumb item in case behavior is in form mode
         */
        if (
            builderMode === ADT3DSceneBuilderMode.CreateBehavior ||
            builderMode === ADT3DSceneBuilderMode.EditBehavior
        ) {
            const behaviorsRoot: IBreadcrumbItem = {
                text: t('3dSceneBuilder.behavior'),
                key: 'behaviorRoot',
                ...((isCreateOrEditWidget(widgetFormInfo.mode) ||
                    behaviorTwinAliasFormInfo !== null ||
                    (builderMode !== ADT3DSceneBuilderMode.CreateBehavior &&
                        builderMode !==
                            ADT3DSceneBuilderMode.EditBehavior)) && {
                    onClick: () => {
                        cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                        setBehaviorTwinAliasFormInfo(null);
                    }
                })
            };
            extraItems.push(behaviorsRoot);

            /**
             * Callbacks required to cancel forms, both are only required when behavior is in form mode
             */
            onBehaviorRootClick = () => {
                onSceneClick();
                cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                setBehaviorTwinAliasFormInfo(null);
            };

            onCancelForm = () => {
                cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                setBehaviorTwinAliasFormInfo(null);
            };
        }

        /**
         * If widget or twin alias forms are displayed show a 4th breadcrumb item
         */
        if (isCreateOrEditWidget(widgetFormInfo.mode)) {
            extraItems.push(widgetsRoot);
        } else if (behaviorTwinAliasFormInfo) {
            extraItems.push(twinAliasRoot);
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

        /**
         * Add extra breadcrumb item in case element is in form mode
         */
        if (
            builderMode === ADT3DSceneBuilderMode.CreateElement ||
            builderMode === ADT3DSceneBuilderMode.EditElement
        ) {
            const elementsRoot: IBreadcrumbItem = {
                text: t('3dSceneBuilder.element'),
                key: 'elementRoot',
                ...((elementTwinAliasFormInfo !== null ||
                    (builderMode !== ADT3DSceneBuilderMode.CreateElement &&
                        builderMode !== ADT3DSceneBuilderMode.EditElement)) && {
                    onClick: () => {
                        setElementTwinAliasFormInfo(null);
                    }
                })
            };
            extraItems.push(elementsRoot);

            /**
             * Callbacks required to cancel forms, both are only required when element is in form mode
             */
            onElementRootClick = () => {
                onSceneClick();
                setElementTwinAliasFormInfo(null);
            };

            onCancelForm = () => {
                cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
                setBehaviorTwinAliasFormInfo(null);
                setElementTwinAliasFormInfo(null);
            };
        }

        /**
         * If twin alias form is displayed show a 4th breadcrumb item
         */
        if (elementTwinAliasFormInfo) {
            extraItems.push(twinAliasRoot);
        }

        return (
            <BaseBreadcrumb
                extraItems={extraItems}
                isAtSceneRoot={
                    builderMode === ADT3DSceneBuilderMode.ElementsIdle
                }
                onSceneClick={onElementRootClick}
                sceneName={sceneName}
                sceneId={sceneId}
                onCancelForm={onCancelForm}
                classNames={{
                    root: 'cb-left-panel-builder-breadcrumb-container',
                    breadcrumb: 'cb-left-panel-builder-breadcrumb',
                    sceneRoot: 'cb-left-panel-builder-breadcrumb-scene-root'
                }}
            />
        );
    } else {
        /**
         * Create breadcrumb for all viewer screens
         */
        return (
            <BaseBreadcrumb
                extraItems={extraItems}
                isAtSceneRoot={true}
                sceneName={sceneName}
                sceneId={sceneId}
                onCloseBehaviorsModal={onCloseBehaviorsModal}
                classNames={{
                    root: 'cb-viewer-breadcrumb-container',
                    breadcrumb: 'cb-viewer-breadcrumb',
                    sceneRoot: 'cb-viewer-breadcrumb-scene-root'
                }}
            />
        );
    }
};

export default SceneBreadcrumbFactory;
