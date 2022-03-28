import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { DTwin, IADT3DViewerProps } from '../../Models/Constants/Interfaces';
import { useGuid } from '../../Models/Hooks';
import './ADT3DViewer.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import {
    CustomMeshItem,
    Marker,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import { VisualType } from '../../Models/Classes/3DVConfig';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { SceneViewWrapper } from '../../Components/3DV/SceneViewWrapper';
import {
    IBehavior,
    IPopoverVisual
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import BehaviorsModal from '../BehaviorsModal/BehaviorsModal';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import ElementsPanelModal from './Internal/ElementsPanelModal';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';
import { ViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';

const ADT3DViewer: React.FC<IADT3DViewerProps & BaseComponentProps> = ({
    theme,
    locale,
    adapter,
    sceneId,
    scenesConfig,
    pollingInterval,
    addInProps,
    refetchConfig,
    showMeshesOnHover,
    enableMeshSelection,
    showHoverOnSelected,
    coloredMeshItems: coloredMeshItemsProp,
    zoomToMeshIds: zoomToMeshIdsProp,
    unzoomedMeshOpacity,
    hideElementsPanel,
    hideViewModePickerUI
}) => {
    const [coloredMeshItems, setColoredMeshItems] = useState<CustomMeshItem[]>(
        coloredMeshItemsProp || []
    );
    const [zoomToMeshIds, setZoomToMeshIds] = useState<Array<string>>(
        zoomToMeshIdsProp || []
    );
    const [showPopUp, setShowPopUp] = useState(false);
    const [behaviorModalConfig, setBehaviorModalConfig] = useState<{
        behaviors: IBehavior[];
        twins: Record<string, DTwin>;
        title: string;
    }>(null);

    const sceneWrapperId = useGuid();

    const selectedMesh = useRef(null);
    const sceneRef = useRef(null);

    const { modelUrl, sceneVisuals, isLoading } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        pollingInterval
    );

    useEffect(() => {
        refetchConfig && refetchConfig();
    }, []);

    useEffect(() => {
        if (coloredMeshItemsProp) {
            setColoredMeshItems(coloredMeshItemsProp);
        } else {
            const newColoredMeshItems = [...coloredMeshItems];
            sceneVisuals.forEach((sceneVisual) => {
                sceneVisual.coloredMeshItems.forEach((sceneColoredMeshItem) => {
                    const existingColoredMeshItem = newColoredMeshItems.find(
                        (nC) => nC.meshId === sceneColoredMeshItem.meshId
                    );
                    if (existingColoredMeshItem) {
                        existingColoredMeshItem.color =
                            sceneColoredMeshItem.color;
                    } else {
                        newColoredMeshItems.push(sceneColoredMeshItem);
                    }
                });
            });
            setColoredMeshItems(newColoredMeshItems);
        }
    }, [sceneVisuals, coloredMeshItemsProp]);

    // panel items includes partial SceneVisual object with filtered properties needed to render elements panel overlay
    const panelItems: Array<ViewerElementsPanelItem> = useMemo(
        () =>
            sceneVisuals.map((sceneVisual) => ({
                element: sceneVisual.element,
                behaviors: sceneVisual.behaviors,
                twins: sceneVisual.twins
            })),
        [sceneVisuals]
    );

    const showPopover = (
        sceneVisual: Partial<SceneVisual>,
        popOverToDisplay?: IPopoverVisual
    ) => {
        let popOver = popOverToDisplay;

        if (!popOverToDisplay) {
            popOver = []
                .concat(...sceneVisual?.behaviors.map((b) => b.visuals))
                ?.find(
                    (visual) => visual.type === VisualType.Popover
                ) as IPopoverVisual;
        }

        if (popOver) {
            setBehaviorModalConfig({
                behaviors: sceneVisual?.behaviors || [],
                twins: sceneVisual?.twins || {},
                title: sceneVisual?.element?.displayName || ''
            });
            setShowPopUp(true);
        }
    };

    const meshClick = (_marker: Marker, mesh: any, scene: any) => {
        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
            );
            const popOver = []
                .concat(...sceneVisual?.behaviors.map((b) => b.visuals))
                ?.find(
                    (visual) => visual.type === VisualType.Popover
                ) as IPopoverVisual;

            if (popOver) {
                if (selectedMesh.current === mesh) {
                    selectedMesh.current = null;
                    setShowPopUp(false);
                } else {
                    selectedMesh.current = mesh;
                    sceneRef.current = scene;
                    showPopover(sceneVisual, popOver);
                }
            } else {
                selectedMesh.current = null;
                setShowPopUp(false);
            }
        }

        if (enableMeshSelection) {
            let coloredMeshes = [...coloredMeshItems];
            if (mesh) {
                const coloredMesh = coloredMeshItems.find(
                    (item) => item.meshId === mesh.id
                );
                if (coloredMesh) {
                    coloredMeshes = coloredMeshes.filter(
                        (item) => item.meshId !== coloredMesh.meshId
                    );
                    setColoredMeshItems(coloredMeshes);
                } else {
                    coloredMeshes.push({ meshId: mesh.id });
                    setColoredMeshItems(coloredMeshes);
                }
            } else {
                setColoredMeshItems([]);
            }
        }
    };

    const meshHover = (marker: Marker, mesh: any) => {
        if (mesh && sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
            );
            if (
                sceneVisual &&
                []
                    .concat(...sceneVisual?.behaviors.map((b) => b.visuals))
                    .find((visual) => visual.type === VisualType.Popover)
            ) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = '';
            }
        }
    };

    const onElementPanelItemClicked = useCallback(
        (_item, panelItem, _behavior) => {
            setShowPopUp(false);
            setZoomToMeshIds(panelItem.element.objectIDs);
            showPopover(panelItem);
        },
        []
    );

    useEffect(() => {
        if (zoomToMeshIdsProp) {
            setZoomToMeshIds(zoomToMeshIdsProp);
        }
    }, [zoomToMeshIdsProp]);

    return (
        <BaseComponent
            isLoading={isLoading && !sceneVisuals}
            theme={theme}
            locale={locale}
        >
            <div id={sceneWrapperId} className="cb-adt-3dviewer-wrapper">
                {!hideElementsPanel && (
                    <ElementsPanelModal
                        theme={theme}
                        locale={locale}
                        panelItems={panelItems}
                        isLoading={isLoading}
                        onItemClick={onElementPanelItemClicked}
                        onItemHover={(item) => item.type}
                    />
                )}
                <SceneViewWrapper
                    adapter={adapter}
                    config={scenesConfig}
                    sceneId={sceneId}
                    sceneVisuals={sceneVisuals}
                    addInProps={addInProps}
                    hideViewModePickerUI={hideViewModePickerUI}
                    sceneViewProps={{
                        modelUrl: modelUrl,
                        coloredMeshItems: coloredMeshItems,
                        showHoverOnSelected: showHoverOnSelected,
                        showMeshesOnHover: showMeshesOnHover,
                        zoomToMeshIds: zoomToMeshIds,
                        unzoomedMeshOpacity: unzoomedMeshOpacity,
                        onMeshClick: (marker, mesh, scene) =>
                            meshClick(marker, mesh, scene),
                        onMeshHover: (marker, mesh) => meshHover(marker, mesh),
                        getToken: (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined
                    }}
                />
            </div>
            {showPopUp && (
                <BehaviorsModal
                    onClose={() => {
                        setShowPopUp(false);
                        setZoomToMeshIds([]);
                    }}
                    twins={behaviorModalConfig.twins}
                    behaviors={behaviorModalConfig.behaviors}
                    title={behaviorModalConfig.title}
                />
            )}
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DViewer);
