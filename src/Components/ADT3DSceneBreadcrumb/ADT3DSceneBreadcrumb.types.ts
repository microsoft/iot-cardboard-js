import { IBreadcrumbItem } from '@fluentui/react';
import { ADT3DSceneBuilderMode } from '../../Models/Constants/Enums';

type BreadcrumbClassNames = {
    root: string;
    breadcrumb: string;
    sceneRoot: string;
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
    sceneName: string;
    builderMode?: ADT3DSceneBuilderMode;
    onSceneClick?: () => void;
}
