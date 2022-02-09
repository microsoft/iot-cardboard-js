import {
    Breadcrumb,
    FontIcon,
    IBreadcrumbItem,
    IRenderFunction
} from '@fluentui/react';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADT3DSceneBuilderMode } from '../../../..';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder/ADT3DSceneBuilder';
import { ADT3DScenePageContext } from '../ADT3DScenePage';

interface Props {
    builderMode: ADT3DSceneBuilderMode;
}

const LeftPanelBuilderBreadcrumb: React.FC<Props> = ({ builderMode }) => {
    const { t } = useTranslation();

    const { handleOnHomeClick } = useContext(ADT3DScenePageContext);

    const { sceneId, config } = useContext(SceneBuilderContext);

    const items: Array<IBreadcrumbItem> = useMemo(() => {
        const sceneName =
            config.viewerConfiguration.scenes.find((s) => s.id === sceneId)
                ?.displayName || '';

        const rootItems: Array<IBreadcrumbItem> = [
            {
                text: t('3dScenePage.home'),
                key: 'Home',
                onClick: handleOnHomeClick
            },
            {
                text: sceneName,
                key: 'Scene'
            }
        ];

        return rootItems;
    }, [builderMode]);

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
