import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    IADT3DViewerAdapter,
    IADT3DViewerProps,
    IPropertyInspectorAdapter
} from '../../Models/Constants/Interfaces';
import { useGuid } from '../../Models/Hooks';
import './ADT3DViewer.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import {
    CustomMeshItem,
    Marker,
    SceneViewBadgeGroup,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import { VisualType } from '../../Models/Classes/3DVConfig';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import SceneViewWrapper from '../../Components/3DV/SceneViewWrapper';
import BehaviorsModal from '../BehaviorsModal/BehaviorsModal';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import { DefaultViewerModeObjectColor } from '../../Models/Constants/Constants';
import { createCustomMeshItems } from '../3DV/SceneView.Utils';
import { deepCopy, getDebugLogger } from '../../Models/Services/Utils';
import AlertModal from '../AlertModal/AlertModal';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import LayerDropdown, {
    DEFAULT_LAYER_ID
} from '../LayerDropdown/LayerDropdown';
import { WrapperMode } from '../3DV/SceneView.types';
import {
    ITwinToObjectMapping,
    IVisual,
    IBehavior
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    useDeeplinkContext,
    DeeplinkContextProvider
} from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import { DeeplinkContextActionType } from '../../Models/Context/DeeplinkContext/DeeplinkContext.types';
import ViewerElementsPanelRenderer from '../ViewerElementsPanelRenderer/ViewerElementsPanelRenderer';
import { classNamesFunction, Stack, styled, useTheme } from '@fluentui/react';
import { getStyles } from './ADT3DViewer.styles';
import {
    IADT3DViewerStyleProps,
    IADT3DViewerStyles
} from './ADT3DViewer.types';
import {
    ADT3DScenePageModes,
    BehaviorModalMode,
    IADTBackgroundColor
} from '../../Models/Constants';
import FloatingScenePageModeToggle from '../../Pages/ADT3DScenePage/Internal/FloatingScenePageModeToggle';
import DeeplinkFlyout from '../DeeplinkFlyout/DeeplinkFlyout';
import { SceneThemeContextProvider } from '../../Models/Context';
import SceneBreadcrumbFactory from '../SceneBreadcrumb/SceneBreadcrumbFactory';
import {
    SceneViewContextProvider,
    useSceneViewContext
} from '../../Models/Context/SceneViewContext/SceneViewContext';
import AlertBadge from '../AlertBadge/AlertBadge';
import { useSceneThemeContext } from '../../Models/Context/SceneThemeContext/SceneThemeContext';
import { SceneViewContextActionType } from '../../Models/Context/SceneViewContext/SceneViewContext.types';
import SceneThemePicker from '../ModelViewerModePicker/SceneThemePicker';
import SceneRefreshButton from '../SceneRefreshButton/SceneRefreshButton';

const getClassNames = classNamesFunction<
    IADT3DViewerStyleProps,
    IADT3DViewerStyles
>();

const createBadge = (
    badgeGroup: SceneViewBadgeGroup,
    backgroundColor: IADTBackgroundColor,
    onBadgeGroupHover: (
        alert: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => void
) => {
    const id = 'cb-badge-' + badgeGroup.id;
    const marker: Marker = {
        id: id,
        attachedMeshIds: [badgeGroup.meshId],
        showIfOccluded: true,
        name: 'badge',
        UIElement: (
            <AlertBadge
                badgeGroup={badgeGroup}
                onBadgeGroupHover={onBadgeGroupHover}
                backgroundColor={backgroundColor}
            />
        )
    };

    return marker;
};

const debugLogging = false;
const logDebugConsole = getDebugLogger('ADT3DViewer', debugLogging);

const ADT3DViewerBase: React.FC<IADT3DViewerProps> = ({
    theme,
    locale,
    adapter,
    sceneId,
    scenesConfig,
    addInProps,
    sceneViewProps,
    refetchConfig,
    showMeshesOnHover,
    enableMeshSelection,
    showHoverOnSelected,
    coloredMeshItems: coloredMeshItemsProp,
    zoomToElementId: zoomToElementIdProp,
    unzoomedMeshOpacity,
    hideElementsPanel,
    hideViewModePickerUI,
    selectedLayerIds,
    showModeToggle = false,
    styles
}) => {
    // hooks
    const { deeplinkState, deeplinkDispatch } = useDeeplinkContext();
    const { sceneViewState, sceneViewDispatch } = useSceneViewContext();
    const {
        isLoading,
        lastRefreshTime,
        nextRefreshTime,
        modelUrl,
        sceneVisuals,
        sceneAlerts,
        triggerRuntimeRefetch
    } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        deeplinkState.selectedLayerIds
    );
    const sceneWrapperId = useGuid();
    const selectedMesh = useRef(null);
    const sceneRef = useRef(null);
    const isDeeplinkContextLoaded = useRef(false);
    const prevLayerCount = useRef<number>(-1); // track the count of layers so we know to refresh the selections if the count changes
    const hasUserChangedLayers = useRef<boolean>(false); // need to know once a user makes a selection so we stop auto selecting items
    const prevSceneId = useRef<string>(sceneId); // need to know if user swaps scenes (using scene dropdown) since we won't get remounted
    const initialDeeplinkLayers = useRef<string[]>(
        deeplinkState.selectedLayerIds
    ); // grab the initial layers on mount

    // reset the refs when the scene changes
    if (prevSceneId.current !== sceneId) {
        hasUserChangedLayers.current = false;
        prevLayerCount.current = -1;
        prevSceneId.current = sceneId;
        initialDeeplinkLayers.current = deeplinkState.selectedLayerIds;
    }

    const behaviorIdsInScene = useMemo(
        () => ViewerConfigUtility.getBehaviorIdsInScene(scenesConfig, sceneId),
        [scenesConfig, sceneId]
    );

    // styles
    const fluentTheme = useTheme();
    const classNames = getClassNames(styles, { theme: fluentTheme });

    // --- State setup ---
    const [coloredMeshItems, setColoredMeshItems] = useState<CustomMeshItem[]>(
        coloredMeshItemsProp || []
    );
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [zoomToMeshIds, setZoomToMeshIds] = useState<Array<string>>([]);
    const [showPopUp, setShowPopUp] = useState(false);

    const [
        behaviorModalSceneVisualElementId,
        setBehaviorModalSceneVisuaElementlId
    ] = useState<string>(null);

    const [isAlertPopoverVisible, setIsAlertPopoverVisible] = useState(false);
    const [alertPopoverPosition, setAlertPopoverPosition] = useState({
        left: 0,
        top: 0
    });

    const [
        alertPanelItems,
        setAlertPanelItems
    ] = useState<IViewerElementsPanelItem>(null);

    const [selectedVisual, setSelectedVisual] = useState<Partial<SceneVisual>>(
        null
    );

    const { sceneThemeState } = useSceneThemeContext();

    // --- Data fetches ---

    const layersInScene = useMemo(() => {
        logDebugConsole(
            'debug',
            'Getting layers from config',
            scenesConfig?.configuration?.layers
        );
        return ViewerConfigUtility.getLayersInScene(scenesConfig, sceneId);
    }, [scenesConfig, sceneId]);

    const unlayeredBehaviorsPresent = useMemo(
        () =>
            ViewerConfigUtility.getUnlayeredBehaviorIdsInScene(
                scenesConfig,
                sceneId
            ).length > 0,

        [scenesConfig, sceneId]
    );

    // panel items includes partial SceneVisual object with filtered properties needed to render elements panel overlay
    const panelItems: Array<IViewerElementsPanelItem> = useMemo(
        () =>
            sceneVisuals.map((sceneVisual) => ({
                element: sceneVisual.element,
                behaviors: sceneVisual.behaviors,
                twins: sceneVisual.twins
            })),
        [sceneVisuals]
    );

    // --- helpers ---
    const getElementByMeshId = useCallback(
        (meshId: string) =>
            ViewerConfigUtility.getElementsInScene(
                scenesConfig,
                sceneId
            ).find((x) => x.objectIDs.includes(meshId)),
        [sceneId, scenesConfig]
    );

    // --- handle deep links ---

    // update SceneId on the deeplink context if the prop changes
    // needed for embed cases
    useEffect(() => {
        deeplinkDispatch({
            type: DeeplinkContextActionType.SET_SCENE_ID,
            payload: {
                sceneId: sceneId
            }
        });
    }, [deeplinkDispatch, sceneId]);

    const setSelectedLayerIds = useCallback(
        (ids: string[], isUserUpdate: boolean) => {
            logDebugConsole(
                'debug',
                'Selected layer ids changed (ids, isUserUpdate)',
                ids,
                isUserUpdate
            );
            if (isUserUpdate) {
                hasUserChangedLayers.current = true; // track when the user does it so we know when to stop allowing auto updates to the selections
            }
            deeplinkDispatch?.({
                type: DeeplinkContextActionType.SET_LAYER_IDS,
                payload: {
                    ids: ids
                }
            });
        },
        [deeplinkDispatch]
    );
    const userSetSelectedLayerIds = useCallback(
        (ids: string[]) => {
            setSelectedLayerIds(ids, true);
        },
        [setSelectedLayerIds]
    );

    // initialize the layers list
    useEffect(() => {
        if (behaviorIdsInScene.length === 0) {
            logDebugConsole('debug', 'No behaviors, not setting layers');
            return;
        }

        // if we don't have any layer id from the context, set initial values
        // we have to refresh the list if the adapter call finishes and updates the number of layers
        // we have to not set the layers if the change came from a user
        const layerCountChanged =
            prevLayerCount.current !== layersInScene.length;
        const noUserUpdate = !hasUserChangedLayers.current;
        const noSelectedLayers = !deeplinkState?.selectedLayerIds?.length;
        prevLayerCount.current = layersInScene.length;
        const layersSetOnDeeplink = initialDeeplinkLayers.current.length;
        const shouldAutoSetLayers =
            noUserUpdate &&
            !layersSetOnDeeplink &&
            (noSelectedLayers || layerCountChanged);
        if (shouldAutoSetLayers) {
            // Add unlayered behavior option if unlayered behaviors present
            const layers = [
                ...(unlayeredBehaviorsPresent ? [DEFAULT_LAYER_ID] : []),
                ...layersInScene.map((lis) => lis.id)
            ];
            logDebugConsole(
                'debug',
                'No layers found in state. Setting default layers {new layers, layersInScene}',
                layers,
                layersInScene
            );
            setSelectedLayerIds(layers, false);
        } else {
            logDebugConsole(
                'debug',
                'Not auto selecting layers. {noUserUpdate, layersSetOnDeeplink, didLayerCountChange, noSelectedLayers, behaviorIdsInScene}',
                noUserUpdate,
                layersSetOnDeeplink,
                layerCountChanged,
                noSelectedLayers,
                behaviorIdsInScene
            );
        }
    }, [
        behaviorIdsInScene,
        deeplinkState?.selectedLayerIds,
        deeplinkState?.selectedLayerIds?.length,
        layersInScene,
        setSelectedLayerIds,
        unlayeredBehaviorsPresent
    ]);

    // this needs to run when sceneId is changed to ensure the correct layers are displayed
    useEffect(() => {
        // only set layers if selectedLayerIds has been passed as a prop
        if (selectedLayerIds !== undefined) {
            if (selectedLayerIds) {
                setSelectedLayerIds(selectedLayerIds, true);
            } else {
                // if layers are null set all layers as selected
                const layers = [
                    ...(unlayeredBehaviorsPresent ? [DEFAULT_LAYER_ID] : []),
                    ...layersInScene.map((lis) => lis.id)
                ];

                setSelectedLayerIds(layers, true);
            }
        }
    }, [selectedLayerIds, sceneId]);

    const setSelectedElementId = useCallback(
        (elementId: string) => {
            logDebugConsole('debug', 'Selected Element Id: ', elementId);
            deeplinkDispatch?.({
                type: DeeplinkContextActionType.SET_ELEMENT_ID,
                payload: {
                    id: elementId
                }
            });
        },
        [deeplinkDispatch]
    );
    const setZoomMeshesByElement = useCallback(
        (elementId: string) => {
            logDebugConsole('debug', 'Zooming to Element Id: ', elementId);
            if (elementId) {
                const elements = ViewerConfigUtility.getElementsInScene(
                    scenesConfig,
                    sceneId
                );
                if (elements?.length) {
                    const element = elements.find((x) => x.id === elementId);
                    setZoomToMeshIds(element?.objectIDs);
                } else {
                    // clear the zooming if we can't find the element
                    setZoomToMeshIds([]);
                }
            } else {
                // clear the zooming if we can't find the element
                setZoomToMeshIds([]);
            }
        },
        [sceneId, scenesConfig]
    );

    // initialize the zoomed elements
    // Zoom to elements if it's on the context, but only on first mount/when data is present
    useEffect(() => {
        if (
            !isDeeplinkContextLoaded.current &&
            scenesConfig &&
            deeplinkState.selectedElementId &&
            panelItems?.length
        ) {
            isDeeplinkContextLoaded.current = true;
            const panelItem = panelItems.find(
                (x) => x.element.id === deeplinkState.selectedElementId
            );
            if (panelItem) {
                onElementPanelItemClicked(undefined, panelItem, undefined);
            }
        }
        // first mount only when data is present
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scenesConfig, panelItems]);

    useEffect(() => {
        // if the zoom prop is provided, use that over the deeplink values
        if (zoomToElementIdProp) {
            // take the first one since we only support a single element id today
            setZoomMeshesByElement(zoomToElementIdProp);
            setSelectedElementId(zoomToElementIdProp);
        }
    }, [setSelectedElementId, setZoomMeshesByElement, zoomToElementIdProp]);

    const showPopover = useCallback(
        (sceneVisual: Partial<SceneVisual>) => {
            setBehaviorModalSceneVisuaElementlId(sceneVisual.element.id);
            setShowPopUp(true);
            const meshIds = sceneVisual.element.objectIDs;
            const outlinedMeshItems = createCustomMeshItems(
                meshIds,
                DefaultViewerModeObjectColor.outlinedMeshSelectedColor
            );

            setSelectedVisual(sceneVisual);
            sceneViewDispatch({
                type: SceneViewContextActionType.RESET_OUTLINED_MESHES,
                payload: {
                    outlinedMeshItems: outlinedMeshItems
                }
            });
            setSelectedElementId(getElementByMeshId(meshIds[0])?.id);
        },
        [getElementByMeshId, setSelectedElementId]
    );

    // elements panel callbacks
    const onElementPanelItemClicked = useCallback(
        (
            _item: ITwinToObjectMapping | IVisual,
            panelItem: IViewerElementsPanelItem,
            _behavior?: IBehavior
        ) => {
            setShowPopUp(false);
            setZoomMeshesByElement(panelItem.element.id);
            setSelectedElementId(panelItem.element.id);
            showPopover(panelItem);
            setIsAlertPopoverVisible(false);
        },
        [setSelectedElementId, setZoomMeshesByElement, showPopover]
    );
    const onElementPanelItemHovered = useCallback(
        (
            _item: ITwinToObjectMapping | IVisual,
            panelItem: IViewerElementsPanelItem,
            _behavior?: IBehavior
        ) => {
            const newOutlinedMeshItems = deepCopy(
                sceneViewState.outlinedMeshItems
            );
            const currentlyOutlinedMeshIds = newOutlinedMeshItems.map(
                (meshItem) => meshItem.meshId
            );
            panelItem.element.objectIDs?.forEach((meshId) => {
                if (!currentlyOutlinedMeshIds.includes(meshId)) {
                    newOutlinedMeshItems.push({
                        meshId,
                        color:
                            DefaultViewerModeObjectColor.outlinedMeshHoverColor
                    });
                }
            });

            sceneViewDispatch({
                type: SceneViewContextActionType.RESET_OUTLINED_MESHES,
                payload: {
                    outlinedMeshItems: newOutlinedMeshItems
                }
            });
        },
        []
    );
    const onElementPanelItemBlured = useCallback(
        (
            _item: ITwinToObjectMapping | IVisual,
            panelItem: IViewerElementsPanelItem,
            _behavior?: IBehavior
        ) => {
            const newOutlinedMeshItems = deepCopy(
                sceneViewState.outlinedMeshItems
            );
            const currentlyOutlinedMeshIds = newOutlinedMeshItems.map(
                (meshItem) => meshItem.meshId
            );
            panelItem.element.objectIDs?.forEach((meshId) => {
                const meshIndex = currentlyOutlinedMeshIds.findIndex(
                    (outlinedMeshId) => outlinedMeshId === meshId
                );
                if (
                    meshIndex !== -1 &&
                    deeplinkState.selectedElementId !==
                        getElementByMeshId(meshId)?.id
                ) {
                    newOutlinedMeshItems.splice(meshIndex, 1);
                }
            });

            sceneViewDispatch({
                type: SceneViewContextActionType.RESET_OUTLINED_MESHES,
                payload: {
                    outlinedMeshItems: newOutlinedMeshItems
                }
            });
        },
        [deeplinkState.selectedElementId, getElementByMeshId]
    );

    useEffect(() => {
        logDebugConsole('debug', 'Refetch config');
        refetchConfig && refetchConfig();
        // only run on first mount
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (coloredMeshItemsProp) {
            setColoredMeshItems(coloredMeshItemsProp);
        } else {
            const coloredMeshes = [];
            sceneVisuals.forEach((sceneVisual) => {
                sceneVisual.coloredMeshItems.forEach((sceneColoredMeshItem) => {
                    coloredMeshes.push(sceneColoredMeshItem);
                });
            });
            setColoredMeshItems(coloredMeshes);
        }
    }, [sceneVisuals, coloredMeshItemsProp]);

    useEffect(() => {
        if (sceneAlerts) {
            const markers: Marker[] = [];
            sceneAlerts.forEach((alert) => {
                const badge = createBadge(
                    alert,
                    sceneThemeState.sceneBackground,
                    onBadgeGroupHover
                );
                markers.push(badge);
            });

            setMarkers(markers);
        }
        // sceneThemeState.sceneBackground is a dependancy as we need to rerun this useEffect when
        // the background color changes to ensure we update the badge colors
    }, [sceneAlerts, sceneThemeState.sceneBackground]);

    // mesh callbacks
    const meshClick = (mesh: { id: string }, scene: any) => {
        // update the selected element on the context
        setSelectedElementId(getElementByMeshId(mesh?.id)?.id);

        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
            );

            const clearSelections = () => {
                selectedMesh.current = null;
                setShowPopUp(false);
                setZoomMeshesByElement(undefined);
                setSelectedElementId(undefined);
                sceneViewDispatch({
                    type: SceneViewContextActionType.RESET_OUTLINED_MESHES
                });
                setSelectedVisual(null);
            };

            if (sceneVisual) {
                if (selectedMesh.current === mesh) {
                    // if it's the same mesh that's already selected, then unselect
                    clearSelections();
                } else {
                    selectedMesh.current = mesh;
                    sceneRef.current = scene;
                    showPopover(sceneVisual);
                }
            } else {
                // if there's no visual, then clear the selection
                clearSelections();
            }
        }

        if (enableMeshSelection) {
            let coloredMeshes = [...coloredMeshItems];
            if (mesh) {
                // see if the item is already selected
                const coloredMesh = coloredMeshItems.find(
                    (item) => item.meshId === mesh.id
                );
                if (coloredMesh) {
                    // unselect
                    coloredMeshes = coloredMeshes.filter(
                        (item) => item.meshId !== coloredMesh.meshId
                    );
                    setColoredMeshItems(coloredMeshes);
                } else {
                    // select
                    coloredMeshes.push({ meshId: mesh.id });
                    setColoredMeshItems(coloredMeshes);
                }
            } else {
                setColoredMeshItems([]);
            }
        }
    };
    const meshHover = (mesh: { id: string }) => {
        if (mesh && sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
            );
            if (
                sceneVisual &&
                []
                    .concat(
                        ...(sceneVisual?.behaviors.map((b) => b.visuals) || [])
                    )
                    .find((visual) => visual.type === VisualType.Popover)
            ) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = '';
            }
        }
    };
    const onBadgeGroupHover = (
        badgeGroup: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => {
        setAlertPanelItems({
            element: badgeGroup.element,
            behaviors: badgeGroup.behaviors,
            twins: badgeGroup.twins
        });
        // Adding offsets to ensure the popover covers the alerts badges as per the designs
        setAlertPopoverPosition({ left: left - 50, top: top - 30 });
        setIsAlertPopoverVisible(true);
    };

    // header callbacks
    const handleScenePageModeChange = useCallback(
        (newScenePageMode: ADT3DScenePageModes) => {
            deeplinkDispatch({
                type: DeeplinkContextActionType.SET_MODE,
                payload: {
                    mode: newScenePageMode
                }
            });
        },
        [deeplinkDispatch]
    );

    const behaviorModalSceneVisual = useMemo(
        () =>
            sceneVisuals.find(
                (sv) => sv.element.id === behaviorModalSceneVisualElementId
            ),
        [behaviorModalSceneVisualElementId, sceneVisuals]
    );

    const onCloseBehaviorsModal = useCallback(() => {
        setShowPopUp(false);
        setZoomMeshesByElement(undefined);
        setSelectedElementId(undefined);
        sceneViewDispatch({
            type: SceneViewContextActionType.RESET_OUTLINED_MESHES
        });
        setSelectedVisual(null);
    }, [setSelectedElementId, setZoomMeshesByElement]);

    const onPropertyInspectorPatch = useCallback(
        () => triggerRuntimeRefetch(),
        [triggerRuntimeRefetch]
    );

    const svp = sceneViewProps || {};
    const sceneName = ViewerConfigUtility.getSceneById(scenesConfig, sceneId)
        ?.displayName;
    logDebugConsole('debug', 'Render');
    return (
        <BaseComponent
            isLoading={isLoading && !sceneVisuals}
            theme={theme}
            locale={locale}
            containerClassName={classNames.root}
        >
            <div id={sceneWrapperId} className={classNames.wrapper}>
                <SceneBreadcrumbFactory
                    sceneId={sceneId}
                    sceneName={sceneName}
                    onSceneChange={onCloseBehaviorsModal}
                    onNavigate={(_action, navigate) => navigate()}
                />
                {/* Left panel */}
                <ViewerElementsPanelRenderer
                    isLoading={isLoading}
                    initialPanelOpen={!hideElementsPanel}
                    items={panelItems}
                    onItemBlur={onElementPanelItemBlured}
                    onItemClick={onElementPanelItemClicked}
                    onItemHover={onElementPanelItemHovered}
                />
                {/* Viewer */}
                <SceneViewWrapper
                    adapter={adapter}
                    config={scenesConfig}
                    sceneId={sceneId}
                    sceneVisuals={sceneVisuals}
                    addInProps={addInProps}
                    wrapperMode={WrapperMode.Viewer}
                    selectedVisual={selectedVisual}
                    sceneViewProps={{
                        coloredMeshItems: coloredMeshItems,
                        markers: markers,
                        modelUrl: modelUrl,
                        onMeshClick: meshClick,
                        onMeshHover: meshHover,
                        showHoverOnSelected: showHoverOnSelected,
                        showMeshesOnHover: showMeshesOnHover,
                        unzoomedMeshOpacity: unzoomedMeshOpacity,
                        zoomToMeshIds: zoomToMeshIds,
                        ...svp,
                        getToken: (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined
                    }}
                />
                {/* Header controls */}
                <Stack
                    horizontal
                    styles={classNames.subComponentStyles.headerStack}
                    tokens={{ childrenGap: 8 }}
                >
                    <SceneRefreshButton
                        lastRefreshTimeInMs={lastRefreshTime}
                        refreshFrequency={nextRefreshTime - lastRefreshTime}
                        onClick={triggerRuntimeRefetch}
                    />
                    <DeeplinkFlyout mode="Options" />
                    {!hideViewModePickerUI && <SceneThemePicker />}
                    <div className={classNames.layersPicker}>
                        <LayerDropdown
                            layers={layersInScene}
                            selectedLayerIds={deeplinkState.selectedLayerIds}
                            setSelectedLayerIds={userSetSelectedLayerIds}
                            showUnlayeredOption={unlayeredBehaviorsPresent}
                        />
                    </div>
                    {showModeToggle && (
                        <FloatingScenePageModeToggle
                            sceneId={sceneId}
                            handleScenePageModeChange={
                                handleScenePageModeChange
                            }
                            selectedMode={deeplinkState.mode}
                        />
                    )}
                </Stack>
            </div>
            {showPopUp && (
                <BehaviorsModal
                    adapter={
                        hasPropertyInspectorAdapter(adapter) ? adapter : null
                    }
                    behaviors={behaviorModalSceneVisual?.behaviors || []}
                    element={behaviorModalSceneVisual?.element}
                    mode={BehaviorModalMode.viewer}
                    onClose={onCloseBehaviorsModal}
                    onPropertyInspectorPatch={onPropertyInspectorPatch}
                    title={behaviorModalSceneVisual?.element?.displayName}
                    twins={behaviorModalSceneVisual?.twins || {}}
                />
            )}
            {isAlertPopoverVisible && (
                <AlertModal
                    alerts={alertPanelItems}
                    position={alertPopoverPosition}
                    onClose={() => {
                        setIsAlertPopoverVisible(false);
                    }}
                    onItemClick={onElementPanelItemClicked}
                    onItemHover={onElementPanelItemHovered}
                    onItemBlur={onElementPanelItemBlured}
                />
            )}
        </BaseComponent>
    );
};

const hasPropertyInspectorAdapter = (
    adapter:
        | IADT3DViewerAdapter
        | (IADT3DViewerAdapter & IPropertyInspectorAdapter)
): adapter is IADT3DViewerAdapter & IPropertyInspectorAdapter =>
    !!(adapter as IPropertyInspectorAdapter).getADTTwin &&
    !!(adapter as IADT3DViewerAdapter).getSceneData;

const ADT3DViewer: React.FC<IADT3DViewerProps> = (props) => {
    return (
        <DeeplinkContextProvider>
            <SceneThemeContextProvider>
                <SceneViewContextProvider
                    outlinedMeshItems={props.outlinedMeshItems}
                >
                    <ADT3DViewerBase {...props} />
                </SceneViewContextProvider>
            </SceneThemeContextProvider>
        </DeeplinkContextProvider>
    );
};

export default styled<
    IADT3DViewerProps,
    IADT3DViewerStyleProps,
    IADT3DViewerStyles
>(withErrorBoundary(ADT3DViewer), getStyles);
