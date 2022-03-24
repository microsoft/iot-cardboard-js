import {
    Breadcrumb,
    IBreadcrumbItem,
    IBreadcrumbStyles,
    IconButton,
    IRenderFunction,
    useTheme
} from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DSceneBuilderMode } from '../../..';
import { ADT3DScenePageContext } from '../../../Pages/ADT3DScenePage/ADT3DScenePage';
import { SceneBuilderContext } from '../ADT3DSceneBuilder';

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
    const theme = useTheme();
    const { t } = useTranslation();

    const scenePageContext = useContext(ADT3DScenePageContext);
    const { sceneId, config, widgetFormInfo, setWidgetFormInfo } = useContext(
        SceneBuilderContext
    );

    const isAtSceneRoot =
        builderMode === ADT3DSceneBuilderMode.BehaviorIdle ||
        builderMode === ADT3DSceneBuilderMode.ElementsIdle;

    const items: Array<IBreadcrumbItem> = useMemo(() => {
        const sceneName =
            config.configuration.scenes.find((s) => s.id === sceneId)
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
                ...(!isAtSceneRoot && {
                    onClick: () => {
                        if (
                            builderMode ===
                                ADT3DSceneBuilderMode.CreateElement ||
                            builderMode === ADT3DSceneBuilderMode.EditElement
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
                case ADT3DSceneBuilderMode.EditBehavior:
                    activePanelBreadcrumb = [behaviorsRoot];
                    break;
                case ADT3DSceneBuilderMode.CreateElement:
                case ADT3DSceneBuilderMode.EditElement:
                    activePanelBreadcrumb = [elementsRoot];
                    break;
                default:
                    break;
            }
        }

        return [...rootItems, ...activePanelBreadcrumb];
    }, [builderMode, widgetFormInfo, sceneId, config]);

    // const mergedStyleSets = mergeStyleSets({
    //     homeButton: [
    //         'cb-left-panel-builder-breadcrumb-home-icon-container',
    //         {
    //             ':hover': {
    //                 background: theme.palette.neutralLighter
    //             }
    //         }
    //     ]
    // });

    const onRenderItem: IRenderFunction<IBreadcrumbItem> = (
        props: IBreadcrumbItem,
        defaultRender?: (props?: IBreadcrumbItem) => JSX.Element
    ) => {
        if (props.key === 'Home') {
            return (
                <IconButton
                    iconProps={{ iconName: 'Home' }}
                    onClick={props.onClick}
                    styles={{
                        root: { color: `${theme.palette.black} !important` }
                    }}
                />
            );
        } else return defaultRender(props);
    };

    const styles: Partial<IBreadcrumbStyles> = {
        root: { marginTop: 0 },
        item: { fontSize: 14 },
        listItem: { fontSize: 14 },
        itemLink: { fontSize: 14 }
    };

    return (
        <div className="cb-left-panel-builder-breadcrumb-container">
            <Breadcrumb
                className={`cb-left-panel-builder-breadcrumb ${
                    isAtSceneRoot
                        ? 'cb-left-panel-builder-breadcrumb-scene-root'
                        : ''
                }`}
                items={items}
                overflowIndex={1}
                styles={styles}
                onRenderItem={onRenderItem}
            />
        </div>
    );
};

export default LeftPanelBuilderBreadcrumb;
