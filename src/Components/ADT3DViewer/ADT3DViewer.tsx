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
    SceneViewBadgeGroup,
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
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';
import { IViewerElementsPanelItem } from '../ElementsPanel/ViewerElementsPanel.types';
import ViewerElementsPanel from '../ElementsPanel/ViewerElementsPanel';
import { DefaultViewerModeObjectColor } from '../../Models/Constants/Constants';
import { DefaultButton, IButtonStyles, memoizeFunction } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from '@fluentui/react-hooks';
import { createCustomMeshItems } from '../3DV/SceneView.Utils';
import { deepCopy } from '../../Models/Services/Utils';

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
    outlinedMeshItems: outlinedMeshItemsProp,
    zoomToMeshIds: zoomToMeshIdsProp,
    unzoomedMeshOpacity,
    hideElementsPanel,
    hideViewModePickerUI
}) => {
    const [coloredMeshItems, setColoredMeshItems] = useState<CustomMeshItem[]>(
        coloredMeshItemsProp || []
    );
    const [alertBadges, setAlertBadges] = useState<SceneViewBadgeGroup[]>();
    const [outlinedMeshItems, setOutlinedMeshItems] = useState<
        CustomMeshItem[]
    >(outlinedMeshItemsProp || []);
    // need outlined meshes ref to keep track of very recent value independent from render cycle to be used in onhover/onblur of elements in panel
    const outlinedMeshItemsRef = useRef(outlinedMeshItems);
    const [zoomToMeshIds, setZoomToMeshIds] = useState<Array<string>>(
        zoomToMeshIdsProp || []
    );
    const selectedMeshIdsRef = useRef(zoomToMeshIds);
    const [showPopUp, setShowPopUp] = useState(false);
    const [
        isElementsPanelVisible,
        { toggle: toggleIsElementsPanelVisible }
    ] = useBoolean(!hideElementsPanel);
    const [behaviorModalConfig, setBehaviorModalConfig] = useState<{
        behaviors: IBehavior[];
        twins: Record<string, DTwin>;
        title: string;
    }>(null);

    const { t } = useTranslation();
    const sceneWrapperId = useGuid();
    const selectedMesh = useRef(null);
    const sceneRef = useRef(null);

    const {
        modelUrl,
        sceneVisuals,
        sceneAlerts,
        isLoading
    } = useRuntimeSceneData(adapter, sceneId, scenesConfig, pollingInterval);

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

            setAlertBadges(sceneAlerts);
            setColoredMeshItems(newColoredMeshItems);
        }
    }, [sceneVisuals, coloredMeshItemsProp]);

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

    const showPopover = (
        sceneVisual: Partial<SceneVisual>,
        popOverToDisplay?: IPopoverVisual
    ) => {
        let popOver = popOverToDisplay;

        if (!popOverToDisplay && sceneVisual) {
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
            const meshIds = sceneVisual.element.objectIDs;
            const outlinedMeshItems = createCustomMeshItems(
                meshIds,
                DefaultViewerModeObjectColor.outlinedMeshSelectedColor
            );

            setOutlinedMeshItems(outlinedMeshItems);
            outlinedMeshItemsRef.current = outlinedMeshItems;
            selectedMeshIdsRef.current = meshIds;
        }
    };

    const meshClick = (_marker: Marker, mesh: any, scene: any) => {
        if (sceneVisuals) {
            const sceneVisual = sceneVisuals.find((sceneVisual) =>
                sceneVisual.element.objectIDs.find((id) => id === mesh?.id)
            );
            let popOver: IPopoverVisual = null;
            if (sceneVisual) {
                popOver = []
                    .concat(...sceneVisual?.behaviors.map((b) => b.visuals))
                    ?.find(
                        (visual) => visual.type === VisualType.Popover
                    ) as IPopoverVisual;
            }

            if (popOver) {
                if (selectedMesh.current === mesh) {
                    selectedMesh.current = null;
                    setShowPopUp(false);
                    setZoomToMeshIds([]);
                    setOutlinedMeshItems([]);
                    outlinedMeshItemsRef.current = [];
                    selectedMeshIdsRef.current = [];
                } else {
                    selectedMesh.current = mesh;
                    sceneRef.current = scene;
                    showPopover(sceneVisual, popOver);
                }
            } else {
                selectedMesh.current = null;
                setShowPopUp(false);
                setZoomToMeshIds([]);
                setOutlinedMeshItems([]);
                outlinedMeshItemsRef.current = [];
                selectedMeshIdsRef.current = [];
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

    const onElementPanelItemHovered = useCallback(
        (_item, panelItem, _behavior) => {
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
        (_item, panelItem, _behavior) => {
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
                    !selectedMeshIdsRef.current?.includes(meshId)
                ) {
                    newOutlinedMeshItems.splice(meshIndex, 1);
                }
            });
            setOutlinedMeshItems(newOutlinedMeshItems);
        },
        []
    );

    useEffect(() => {
        if (zoomToMeshIdsProp) {
            setZoomToMeshIds(zoomToMeshIdsProp);
        }
    }, [zoomToMeshIdsProp]);

    const elementsPanelToggleButtonStyles = toggleElementsPanelStyles();

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
                    sceneViewProps={{
                        badgeGroups: alertBadges,
                        modelUrl: modelUrl,
                        coloredMeshItems: coloredMeshItems,
                        outlinedMeshitems: outlinedMeshItems,
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
                        setOutlinedMeshItems([]);
                        outlinedMeshItemsRef.current = [];
                        selectedMeshIdsRef.current = [];
                    }}
                    twins={behaviorModalConfig.twins}
                    behaviors={behaviorModalConfig.behaviors}
                    title={behaviorModalConfig.title}
                />
            )}
        </BaseComponent>
    );
};

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

export default withErrorBoundary(ADT3DViewer);
