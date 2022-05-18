import { IBreadcrumbItem } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderMode,
    WidgetFormMode
} from '../../Models/Constants/Enums';
import { SceneBuilderContext } from '../ADT3DSceneBuilder/ADT3DSceneBuilder';
import { WidgetFormInfo } from '../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import {
    IADT3DSceneBreadcrumbFactoryProps,
    IBaseBreadcrumbProps
} from './ADT3DSceneBreadcrumb.types';
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

const ADT3DSceneBreadcrumbFactory: React.FC<IADT3DSceneBreadcrumbFactoryProps> = ({
    sceneId,
    config,
    builderMode,
    onSceneClick
}) => {
    const sceneName =
        config.configuration.scenes.find((s) => s.id === sceneId)
            ?.displayName || '';

    const { t } = useTranslation();
    const behaviorModes = [
        ADT3DSceneBuilderMode.BehaviorIdle,
        ADT3DSceneBuilderMode.CreateBehavior,
        ADT3DSceneBuilderMode.EditBehavior
    ];
    const elementModes = [
        ADT3DSceneBuilderMode.ElementsIdle,
        ADT3DSceneBuilderMode.CreateElement,
        ADT3DSceneBuilderMode.EditElement,
        ADT3DSceneBuilderMode.TargetElements
    ];
    const extraItems: Array<IBreadcrumbItem> = [];

    const widgetsRoot: IBreadcrumbItem = {
        text: t('3dSceneBuilder.widget'),
        key: 'widgetsRoot'
    };

    const twinAliasRoot: IBreadcrumbItem = {
        text: t('3dSceneBuilder.twinAlias.title'),
        key: 'twinAliasRoot'
    };
    let breadcrumbProps: IBaseBreadcrumbProps;

    if (builderMode !== undefined && behaviorModes.includes(builderMode)) {
        // Create behavior breadcrumb
        const {
            widgetFormInfo,
            setWidgetFormInfo,
            behaviorTwinAliasFormInfo,
            setBehaviorTwinAliasFormInfo
        } = useContext(SceneBuilderContext);

        const isCreateOrEditWidget = (formMode: WidgetFormMode) => {
            return (
                formMode === WidgetFormMode.CreateWidget ||
                formMode === WidgetFormMode.EditWidget
            );
        };

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
        }

        if (isCreateOrEditWidget(widgetFormInfo.mode)) {
            extraItems.push(widgetsRoot);
        } else if (behaviorTwinAliasFormInfo) {
            extraItems.push(twinAliasRoot);
        }

        const onBehaviorRootClick = () => {
            onSceneClick();
            cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
            setBehaviorTwinAliasFormInfo(null);
        };

        const onCancelForm = () => {
            cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
            setBehaviorTwinAliasFormInfo(null);
        };

        breadcrumbProps = {
            extraItems: extraItems,
            isAtSceneRoot: builderMode === ADT3DSceneBuilderMode.BehaviorIdle,
            onSceneClick: onBehaviorRootClick,
            sceneName: sceneName,
            sceneId: sceneId,
            onCancelForm: onCancelForm,
            classNames: {
                container: 'cb-left-panel-builder-breadcrumb-container',
                breadcrumb: 'cb-left-panel-builder-breadcrumb',
                root: 'cb-left-panel-builder-breadcrumb-scene-root'
            }
        };
    } else if (
        builderMode !== undefined &&
        elementModes.includes(builderMode)
    ) {
        // Create element breadcrumb
        const {
            widgetFormInfo,
            setWidgetFormInfo,
            elementTwinAliasFormInfo,
            setBehaviorTwinAliasFormInfo,
            setElementTwinAliasFormInfo
        } = useContext(SceneBuilderContext);

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
        }

        if (elementTwinAliasFormInfo) {
            extraItems.push(twinAliasRoot);
        }

        const onElementRootClick = () => {
            onSceneClick();
            setElementTwinAliasFormInfo(null);
        };

        const onCancelForm = () => {
            cancelWidgetForm(widgetFormInfo, setWidgetFormInfo);
            setBehaviorTwinAliasFormInfo(null);
            setElementTwinAliasFormInfo(null);
        };

        breadcrumbProps = {
            extraItems: extraItems,
            isAtSceneRoot: builderMode === ADT3DSceneBuilderMode.ElementsIdle,
            onSceneClick: onElementRootClick,
            sceneName: sceneName,
            sceneId: sceneId,
            onCancelForm: onCancelForm,
            classNames: {
                container: 'cb-left-panel-builder-breadcrumb-container',
                breadcrumb: 'cb-left-panel-builder-breadcrumb',
                root: 'cb-left-panel-builder-breadcrumb-scene-root'
            }
        };
    } else {
        // Create viewer breadcrumb
        breadcrumbProps = {
            extraItems: extraItems,
            isAtSceneRoot: true,
            sceneName: sceneName,
            sceneId: sceneId,
            classNames: {
                container: 'cb-viewer-breadcrumb-container',
                breadcrumb: 'cb-viewer-breadcrumb',
                root: 'cb-viewer-breadcrumb-scene-root'
            }
        };
    }

    return <BaseBreadcrumb {...breadcrumbProps} />;
};

export default ADT3DSceneBreadcrumbFactory;
