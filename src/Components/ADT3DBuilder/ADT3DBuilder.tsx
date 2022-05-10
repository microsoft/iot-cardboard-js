import React from 'react';
import './ADT3DBuilder.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import {
    CustomMeshItem,
    ISceneViewProps
} from '../../Models/Classes/SceneView.types';
import {
    IADTAdapter,
    IADTObjectColor
} from '../../Models/Constants/Interfaces';
import BaseComponent from '../BaseComponent/BaseComponent';
import { AbstractMesh, Scene } from '@babylonjs/core';
import SceneViewWrapper from '../3DV/SceneViewWrapper';
import { WrapperMode } from '../3DV/SceneView.types';

interface ADT3DBuilderProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshClicked?: (clickedMesh: AbstractMesh, e: PointerEvent) => void;
    onMeshHovered?: (clickedMesh: AbstractMesh) => void;
    showMeshesOnHover?: boolean;
    coloredMeshItems?: CustomMeshItem[];
    showHoverOnSelected?: boolean;
    outlinedMeshItems?: CustomMeshItem[];
    objectColorUpdated?: (objectColor: IADTObjectColor) => void;
    hideViewModePickerUI?: boolean;
    sceneViewProps?: ISceneViewProps;
}

const ADT3DBuilder: React.FC<ADT3DBuilderProps> = ({
    adapter,
    modelUrl,
    sceneViewProps,
    onMeshClicked,
    onMeshHovered,
    showMeshesOnHover,
    coloredMeshItems,
    showHoverOnSelected,
    outlinedMeshItems,
    objectColorUpdated,
    hideViewModePickerUI
}) => {
    const meshClick = (mesh: AbstractMesh, _scene: Scene, e: PointerEvent) => {
        if (onMeshClicked) {
            onMeshClicked(mesh, e);
        }
    };

    const meshHover = (mesh: AbstractMesh, _scene: Scene, _e: PointerEvent) => {
        if (onMeshHovered) {
            onMeshHovered(mesh);
        }
    };

    const svp = sceneViewProps || {};

    return (
        <BaseComponent>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneViewWrapper
                    objectColorUpdated={objectColorUpdated}
                    hideViewModePickerUI={hideViewModePickerUI}
                    wrapperMode={WrapperMode.Builder}
                    sceneViewProps={{
                        ...svp,
                        modelUrl: modelUrl,
                        onMeshClick: meshClick,
                        onMeshHover: meshHover,
                        coloredMeshItems: coloredMeshItems,
                        showMeshesOnHover: showMeshesOnHover ?? true,
                        showHoverOnSelected: showHoverOnSelected,
                        outlinedMeshitems: outlinedMeshItems,
                        getToken: (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined
                    }}
                />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DBuilder);
