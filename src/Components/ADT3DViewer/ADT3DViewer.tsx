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
import { SceneViewWrapper } from '../../Components/3DV/SceneViewWrapper';
import BehaviorsModal from '../BehaviorsModal/BehaviorsModal';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import ViewerElementsPanel from '../ElementsPanel/ViewerElementsPanel';
import { DefaultViewerModeObjectColor } from '../../Models/Constants/Constants';
import { DefaultButton, IButtonStyles, memoizeFunction } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from '@fluentui/react-hooks';
import { createCustomMeshItems } from '../3DV/SceneView.Utils';
import { deepCopy, getDebugLogger } from '../../Models/Services/Utils';
import AlertModal from '../AlertModal/AlertModal';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import LayerDropdown, {
    unlayeredBehaviorKey
} from '../LayerDropdown/LayerDropdown';
import { WrapperMode } from '../3DV/SceneView.types';
import {
    ITwinToObjectMapping,
    IVisual,
    IBehavior
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    useDeeplinkContext,
    DeeplinkContextActionType,
    DeeplinkContextProvider
} from '../../Models/Context/DeeplinkContext';

const debug = true;
const logDebugConsole = getDebugLogger('ADT3DViewer', debug);

const ADT3DViewerBase: React.FC<IADT3DViewerProps & BaseComponentProps> = ({
    theme,
    locale,
    adapter,
    sceneId,
    scenesConfig,
    pollingInterval,
    addInProps,
    sceneViewProps,
    refetchConfig,
    showMeshesOnHover,
    enableMeshSelection,
    showHoverOnSelected,
    coloredMeshItems: coloredMeshItemsProp,
    outlinedMeshItems: outlinedMeshItemsProp,
    zoomToElementIds: zoomToElementIdsProp,
    unzoomedMeshOpacity,
    hideElementsPanel,
    hideViewModePickerUI
}) => {
    // hooks
    const { t } = useTranslation();
    const { deeplinkState, deeplinkDispatch } = useDeeplinkContext();
    const {
        modelUrl,
        sceneVisuals,
        sceneAlerts,
        isLoading,
        triggerRuntimeRefetch
    } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        pollingInterval,
        deeplinkState.selectedLayerIds
    );
    const sceneWrapperId = useGuid();
    const selectedMesh = useRef(null);
    const sceneRef = useRef(null);
    const isDeeplinkContextLoaded = useRef(false);

    // --- State setup ---
    const [coloredMeshItems, setColoredMeshItems] = useState<CustomMeshItem[]>(
        coloredMeshItemsProp || []
    );
    const [alertBadges, setAlertBadges] = useState<SceneViewBadgeGroup[]>();
    const [outlinedMeshItems, setOutlinedMeshItems] = useState<
        CustomMeshItem[]
    >(outlinedMeshItemsProp || []);
    // need outlined meshes ref to keep track of very recent value independent from render cycle to be used in onhover/onblur of elements in panel
    const outlinedMeshItemsRef = useRef(outlinedMeshItems);
    const [zoomToMeshIds, setZoomToMeshIds] = useState<Array<string>>([]);
    const [showPopUp, setShowPopUp] = useState(false);
    const [
        isElementsPanelVisible,
        { toggle: toggleIsElementsPanelVisible }
    ] = useBoolean(!hideElementsPanel);

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

    // --- Data fetches ---

    const layersInScene = useMemo(
        () => ViewerConfigUtility.getLayersInScene(scenesConfig, sceneId),
        [scenesConfig, sceneId]
    );

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
        (ids: string[]) => {
            deeplinkDispatch?.({
                type: DeeplinkContextActionType.SET_LAYER_IDS,
                payload: {
                    ids: ids
                }
            });
        },
        [deeplinkDispatch]
    );

    // initialize the layers list
    useEffect(() => {
        // if we don't have any layer id from the context, set initial values
        if (!deeplinkState?.selectedLayerIds) {
            setSelectedLayerIds([
                // Add unlayered behavior option if unlayered behaviors present
                ...(unlayeredBehaviorsPresent ? [unlayeredBehaviorKey] : []),
                ...layersInScene.map((lis) => lis.id)
            ]);
        }
        // run only on first mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setSelectedElementId = useCallback(
        (elementId: string) => {
            logDebugConsole('Selected Element Id: ', elementId);
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
            logDebugConsole('Zooming to Element Id: ', elementId);
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
            deeplinkState.selectedElementId &&
            scenesConfig &&
            panelItems?.length &&
            !isDeeplinkContextLoaded.current
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scenesConfig, panelItems]);

    useEffect(() => {
        // if we don't have any layer id from the context, set initial values
        if (zoomToElementIdsProp) {
            // take the first one since we only support a single element id today
            setZoomMeshesByElement(zoomToElementIdsProp[0]);
            setSelectedElementId(zoomToElementIdsProp[0]);
        }
    }, [setSelectedElementId, setZoomMeshesByElement, zoomToElementIdsProp]);

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
            setOutlinedMeshItems(outlinedMeshItems);
            outlinedMeshItemsRef.current = outlinedMeshItems;
            setSelectedElementId(getElementByMeshId(meshIds[0])?.id);
        },
        [getElementByMeshId, setSelectedElementId]
    );

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
            const newOutlinedMeshItems = deepCopy(outlinedMeshItemsRef.current);
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
            setOutlinedMeshItems(newOutlinedMeshItems);
        },
        []
    );
    const onElementPanelItemBlured = useCallback(
        (
            _item: ITwinToObjectMapping | IVisual,
            panelItem: IViewerElementsPanelItem,
            _behavior?: IBehavior
        ) => {
            const newOutlinedMeshItems = deepCopy(outlinedMeshItemsRef.current);
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
            setOutlinedMeshItems(newOutlinedMeshItems);
        },
        [deeplinkState.selectedElementId, getElementByMeshId]
    );

    useEffect(() => {
        refetchConfig && refetchConfig();
        // only run on first mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setAlertBadges(sceneAlerts);
            setColoredMeshItems(coloredMeshes);
        }
    }, [sceneVisuals, coloredMeshItemsProp, sceneAlerts]);

    const meshClick = (_marker: Marker, mesh: { id: string }, scene: any) => {
        // update the selected element on the context
        setSelectedElementId(getElementByMeshId(mesh.id)?.id);

        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
            );

            const clearSelections = () => {
                selectedMesh.current = null;
                setShowPopUp(false);
                setZoomMeshesByElement(undefined);
                setSelectedElementId(undefined);
                setOutlinedMeshItems([]);
                setSelectedVisual(null);
                outlinedMeshItemsRef.current = [];
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

    const meshHover = (_marker: Marker, mesh: { id: string }) => {
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

    const onBadgeGroupHover = (
        badgeGroup: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => {
        if (!isAlertPopoverVisible) {
            setAlertPanelItems({
                element: badgeGroup.element,
                behaviors: badgeGroup.behaviors,
                twins: badgeGroup.twins
            });
            // Adding offsets to ensure the popover covers the alerts badges as per the designs
            setAlertPopoverPosition({ left: left - 50, top: top - 30 });
            setIsAlertPopoverVisible(true);
        }
    };

    const elementsPanelToggleButtonStyles = toggleElementsPanelStyles();

    const behaviorModalSceneVisual = useMemo(
        () =>
            sceneVisuals.find(
                (sv) => sv.element.id === behaviorModalSceneVisualElementId
            ),
        [behaviorModalSceneVisualElementId, sceneVisuals]
    );

    const svp = sceneViewProps || {};
    return (
        <BaseComponent
            isLoading={isLoading && !sceneVisuals}
            theme={theme}
            locale={locale}
        >
            <div id={sceneWrapperId} className="cb-adt-3dviewer-wrapper">
                <DefaultButton
                    toggle
                    checked={isElementsPanelVisible}
                    styles={elementsPanelToggleButtonStyles}
                    iconProps={{
                        iconName: 'BulletedTreeList',
                        styles: { root: { fontSize: 20 } }
                    }}
                    ariaLabel={
                        hideElementsPanel
                            ? t('elementsPanel.showPanel')
                            : t('elementsPanel.hidePanel')
                    }
                    onClick={toggleIsElementsPanelVisible}
                />
                {isElementsPanelVisible && (
                    <ViewerElementsPanel
                        isLoading={isLoading}
                        panelItems={panelItems}
                        onItemClick={onElementPanelItemClicked}
                        onItemHover={onElementPanelItemHovered}
                        onItemBlur={onElementPanelItemBlured}
                    />
                )}
                <SceneViewWrapper
                    adapter={adapter}
                    config={scenesConfig}
                    sceneId={sceneId}
                    sceneVisuals={sceneVisuals}
                    addInProps={addInProps}
                    hideViewModePickerUI={hideViewModePickerUI}
                    wrapperMode={WrapperMode.Viewer}
                    selectedVisual={selectedVisual}
                    sceneViewProps={{
                        badgeGroups: alertBadges,
                        coloredMeshItems: coloredMeshItems,
                        modelUrl: modelUrl,
                        onBadgeGroupHover: onBadgeGroupHover,
                        onMeshClick: (marker, mesh, scene) =>
                            meshClick(marker, mesh, scene),
                        onMeshHover: (marker, mesh) => meshHover(marker, mesh),
                        outlinedMeshitems: outlinedMeshItems,
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
                <div className="cb-layer-dropdown-container">
                    <LayerDropdown
                        layers={layersInScene}
                        selectedLayerIds={deeplinkState.selectedLayerIds}
                        setSelectedLayerIds={setSelectedLayerIds}
                        showUnlayeredOption={unlayeredBehaviorsPresent}
                    />
                </div>
            </div>
            {showPopUp && (
                <BehaviorsModal
                    onClose={() => {
                        setShowPopUp(false);
                        setZoomMeshesByElement(undefined);
                        setSelectedElementId(undefined);
                        setOutlinedMeshItems([]);
                        outlinedMeshItemsRef.current = [];
                    }}
                    twins={behaviorModalSceneVisual?.twins}
                    behaviors={behaviorModalSceneVisual?.behaviors}
                    title={behaviorModalSceneVisual?.element?.displayName}
                    adapter={
                        hasPropertyInspectorAdapter(adapter) ? adapter : null
                    }
                    onPropertyInspectorPatch={() => triggerRuntimeRefetch()}
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

const toggleElementsPanelStyles = memoizeFunction(
    () =>
        ({
            root: {
                minWidth: 'unset',
                width: 64,
                height: 54,
                border: '1px solid var(--cb-color-modal-border)',
                borderRadius: 4,
                backdropFilter: 'blur(50px)',
                color: 'var(--cb-color-text-primary)',
                position: 'absolute',
                zIndex: 999,
                left: 20,
                bottom: 20
            },
            rootChecked: {
                background: 'var(--cb-color-glassy-modal)'
            }
        } as Partial<IButtonStyles>)
);

const ADT3DViewer: React.FC<IADT3DViewerProps & BaseComponentProps> = (
    props
) => {
    return (
        <DeeplinkContextProvider>
            <ADT3DViewerBase {...props} />
        </DeeplinkContextProvider>
    );
};

export default withErrorBoundary(ADT3DViewer);
