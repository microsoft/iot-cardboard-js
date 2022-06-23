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
    onNavigate: INavigateCallback;
    onSceneChange?: () => void;
    onRenderSceneItem?: (props?: IBreadcrumbItem) => JSX.Element;
}

export interface ISceneBreadcrumbFactoryProps {
    sceneId: string;
    sceneName: string;
    builderMode?: ADT3DSceneBuilderMode;
    onSceneClick?: () => void;
    onSceneChange?: () => void;
    onNavigate: INavigateCallback;
}

export type INavigateCallback = (
    action: BreadcrumbAction,
    navigate: VoidFunction
) => void;

export type BreadcrumbAction =
    | 'goToHome'
    | 'goToScene'
    | 'goToForm'
    | 'cancelForm';
