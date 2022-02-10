import {
    Breadcrumb,
    FontIcon,
    IBreadcrumbItem,
    IRenderFunction
} from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DSceneBuilderMode } from '../../../..';
import { SceneBuilderContext } from '../ADT3DSceneBuilder';
import { ADT3DScenePageContext } from '../../ADT3DScenePage/ADT3DScenePage';

interface Props {
    builderMode: ADT3DSceneBuilderMode;
    onBehaviorsRootClick: () => void;
    onElementsRootClick: () => void;
}

const LeftPanelBuilderBreadcrumb: React.FC<Props> = ({
    builderMode,
    onBehaviorsRootClick,
    onElementsRootClick
}) => {
    const { t } = useTranslation();

    const scenePageContext = useContext(ADT3DScenePageContext);
    const { sceneId, config, widgetFormInfo, setWidgetFormInfo } = useContext(
        SceneBuilderContext
    );

    const items: Array<IBreadcrumbItem> = useMemo(() => {
        const sceneName =
            config.viewerConfiguration.scenes.find((s) => s.id === sceneId)
                ?.displayName || '';

        const rootItems: Array<IBreadcrumbItem> = [
            {
                text: t('3dScenePage.home'),
                key: 'Home',
                ...(scenePageContext && {
                    onClick: () => {
                        scenePageContext.handleOnHomeClick();
                        setWidgetFormInfo(null);
                    }
                })
            },
            {
                text: sceneName,
                key: 'Scene',
                ...(builderMode !== ADT3DSceneBuilderMode.BehaviorIdle &&
                    builderMode !== ADT3DSceneBuilderMode.ElementsIdle && {
                        onClick: () => {
                            if (
                                builderMode ===
                                    ADT3DSceneBuilderMode.CreateElement ||
                                builderMode ===
                                    ADT3DSceneBuilderMode.EditElement
                            ) {
                                onElementsRootClick();
                            } else {
                                onBehaviorsRootClick();
                                setWidgetFormInfo(null);
                            }
                        }
                    })
            }
        ];

        const behaviorsRoot: IBreadcrumbItem = {
            text: t('3dSceneBuilder.behavior'),
            key: 'behaviorRoot',
            ...((widgetFormInfo ||
                (builderMode !== ADT3DSceneBuilderMode.CreateBehavior &&
                    builderMode !== ADT3DSceneBuilderMode.EditBehavior)) && {
                onClick: () => {
                    setWidgetFormInfo(null);
                }
            })
        };

        const elementsRoot: IBreadcrumbItem = {
            text: t('3dSceneBuilder.element'),
            key: 'elementsRoot',
            ...(builderMode !== ADT3DSceneBuilderMode.CreateElement &&
                builderMode !== ADT3DSceneBuilderMode.EditElement && {
                    onClick: () => onElementsRootClick()
                })
        };

        const widgetsRoot: IBreadcrumbItem = {
            text: t('3dSceneBuilder.widget'),
            key: 'widgetsRoot'
        };

        let activePanelBreadcrumb: Array<IBreadcrumbItem> = [];

        if (widgetFormInfo) {
            activePanelBreadcrumb = [behaviorsRoot, widgetsRoot];
        } else {
            switch (builderMode) {
                case ADT3DSceneBuilderMode.CreateBehavior:
                    activePanelBreadcrumb = [behaviorsRoot];
                    break;
                case ADT3DSceneBuilderMode.EditBehavior:
                    activePanelBreadcrumb = [behaviorsRoot];
                    break;
                case ADT3DSceneBuilderMode.CreateElement:
                    activePanelBreadcrumb = [elementsRoot];
                    break;
                case ADT3DSceneBuilderMode.EditElement:
                    activePanelBreadcrumb = [elementsRoot];
                    break;
                default:
                    break;
            }
        }

        return [...rootItems, ...activePanelBreadcrumb];
    }, [builderMode, widgetFormInfo, sceneId, config]);

    const onRenderItem: IRenderFunction<IBreadcrumbItem> = (
        props: IBreadcrumbItem,
        defaultRender?: (props?: IBreadcrumbItem) => JSX.Element
    ) => {
        if (props.key === 'Home') {
            return (
                <div
                    className="cb-left-panel-builder-breadcrumb-home-icon-container"
                    onClick={props.onClick}
                >
                    <FontIcon
                        iconName={'Home'}
                        className="cb-left-panel-builder-breadcrumb-home-icon"
                    />
                </div>
            );
        } else return defaultRender(props);
    };

    return (
        <div className="cb-left-panel-builder-breadcrumb-container">
            <Breadcrumb
                items={items}
                overflowIndex={1}
                styles={{
                    root: { marginTop: 0 },
                    item: { fontSize: 14 },
                    listItem: { fontSize: 14 },
                    itemLink: { fontSize: 14 }
                }}
                onRenderItem={onRenderItem}
            />
        </div>
    );
};

export default LeftPanelBuilderBreadcrumb;
