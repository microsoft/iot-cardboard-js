import React, { useCallback } from 'react';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import BaseComponent from '../BaseComponent/BaseComponent';
import { AbstractMesh, Scene } from '@babylonjs/core';
import SceneViewWrapper from '../3DV/SceneViewWrapper';
import { WrapperMode } from '../3DV/SceneView.types';
import { classNamesFunction, styled, useTheme } from '@fluentui/react';
import { getDebugLogger } from '../../Models/Services/Utils';
import { getStyles } from './ADT3DBuilder.styles';
import {
    IADT3DBuilderProps,
    IADT3DBuilderStyleProps,
    IADT3DBuilderStyles
} from './ADT3DBuilder.types';

const getClassNames = classNamesFunction<
    IADT3DBuilderStyleProps,
    IADT3DBuilderStyles
>();

const debugLogging = false;
const logDebugConsole = getDebugLogger('ADT3DBuilder', debugLogging);

const ADT3DBuilder: React.FC<IADT3DBuilderProps> = (props) => {
    const {
        adapter,
        modelUrl,
        sceneViewProps,
        onMeshClicked,
        onMeshHovered,
        showMeshesOnHover,
        coloredMeshItems,
        showHoverOnSelected,
        outlinedMeshItems,
        gizmoElementItem,
        gizmoTransformItem,
        setGizmoTransformItem,
        objectColorUpdated,
        styles
    } = props;

    // styles
    const fluentTheme = useTheme();
    const classNames = getClassNames(styles, { theme: fluentTheme });

    // viewer callbacks
    const meshClick = useCallback(
        (mesh: AbstractMesh, _scene: Scene, e: PointerEvent) => {
            if (onMeshClicked) {
                onMeshClicked(mesh, e);
            }
        },
        [onMeshClicked]
    );
    const meshHover = useCallback(
        (mesh: AbstractMesh, _scene: Scene, _e: PointerEvent) => {
            if (onMeshHovered) {
                onMeshHovered(mesh);
            }
        },
        [onMeshHovered]
    );

    const svp = sceneViewProps || {};

    logDebugConsole('debug', 'Render ADT3DBuilder');
    return (
        <BaseComponent containerClassName={classNames.root}>
            <div className={classNames.wrapper}>
                <SceneViewWrapper
                    objectColorUpdated={objectColorUpdated}
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
                        gizmoElementItem: gizmoElementItem,
                        gizmoTransformItem: gizmoTransformItem,
                        setGizmoTransformItem: setGizmoTransformItem,
                        getToken: (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined,
                        allowModelDimensionErrorMessage: true
                    }}
                />
            </div>
        </BaseComponent>
    );
};

export default styled<
    IADT3DBuilderProps,
    IADT3DBuilderStyleProps,
    IADT3DBuilderStyles
>(withErrorBoundary(ADT3DBuilder), getStyles);
