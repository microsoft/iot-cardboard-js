import { IBreadcrumbItem } from '@fluentui/react';
import { ADT3DSceneBuilderMode } from '../../Models/Constants/Enums';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

type BreadcrumbClassNames = {
    container: string;
    breadcrumb: string;
    root: string;
};

export interface IBaseBreadcrumbProps {
    extraItems: IBreadcrumbItem[];
    isAtSceneRoot: boolean;
    sceneName: string;
    sceneId: string;
    classNames: BreadcrumbClassNames;
    onSceneClick?: () => void;
    onCancelForm?: () => void;
    onRenderSceneItem?: (props?: IBreadcrumbItem) => JSX.Element;
}

export interface IADT3DSceneBreadcrumbFactoryProps {
    sceneId: string;
    config: I3DScenesConfig;
    builderMode?: ADT3DSceneBuilderMode;
    onSceneClick?: () => void;
}

export interface SceneDropdownProps {
    sceneId: string;
}
