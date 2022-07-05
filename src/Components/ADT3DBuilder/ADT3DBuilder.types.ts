import { AbstractMesh } from '@babylonjs/core';
import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import {
    CustomMeshItem,
    ISceneViewProps,
    TransformedElementItem,
    TransformInfo
} from '../../Models/Classes/SceneView.types';
import { IADTAdapter, IADTObjectColor } from '../../Models/Constants';

export interface IADT3DBuilderProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshClicked?: (clickedMesh: AbstractMesh, e: PointerEvent) => void;
    onMeshHovered?: (clickedMesh: AbstractMesh) => void;
    showMeshesOnHover?: boolean;
    coloredMeshItems?: CustomMeshItem[];
    showHoverOnSelected?: boolean;
    outlinedMeshItems?: CustomMeshItem[];
    gizmoElementItem?: TransformedElementItem;
    gizmoTransformItem?: TransformInfo;
    setGizmoTransformItem?: (gizmoTransformItem: TransformInfo) => void;
    objectColorUpdated?: (objectColor: IADTObjectColor) => void;
    hideViewModePickerUI?: boolean;
    sceneViewProps?: ISceneViewProps;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IADT3DBuilderStyleProps,
        IADT3DBuilderStyles
    >;
}

export interface IADT3DBuilderStyleProps {
    theme: ITheme;
}
export interface IADT3DBuilderStyles {
    root: IStyle;
    wrapper: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IADT3DBuilderSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IADT3DBuilderSubComponentStyles {}
