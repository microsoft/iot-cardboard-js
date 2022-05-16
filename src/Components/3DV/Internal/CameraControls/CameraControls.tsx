import {
    Callout,
    DirectionalHint,
    FocusZone,
    memoizeFunction,
    mergeStyleSets,
    Stack,
    Theme,
    useTheme
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { CameraInteraction } from '../../../../Models/Constants/Enums';
import { useTranslation } from 'react-i18next';
import { Selected } from './Internal/CameraControlAssets';
import HeaderControlButton from '../../../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../../../HeaderControlGroup/HeaderControlGroup';
import CameraControlsCalloutContent from './Internal/CameraControlsCalloutContent/CameraControlsCalloutContent';

export interface CameraControlProps {
    cameraInteraction?: CameraInteraction;
    onCameraInteractionChanged?: (CameraInteraction) => void;
    onCameraZoom?: (boolean) => void;
    onResetCamera?: () => void;
}

export const CameraControls: React.FC<CameraControlProps> = ({
    cameraInteraction,
    onCameraInteractionChanged,
    onCameraZoom,
    onResetCamera
}) => {
    const [cameraInteractionType, setCameraInteractionType] = useState(null);
    const [showPanCallout, setShowPanCallout] = useState(false);
    const [showOrbitCallout, setShowOrbitCallout] = useState(false);
    const theme = useTheme();
    const styles = getStyles(theme);
    const calloutAnchorPan = 'cd-camera-controls-calloutAnchor-pan';
    const calloutAnchorOrbit = 'cd-camera-controls-calloutAnchor-orbit';

    useEffect(() => {
        if (cameraInteractionType) {
            onCameraInteractionChanged(cameraInteractionType);
        }
    }, [cameraInteractionType, onCameraInteractionChanged]);

    useEffect(() => {
        if (cameraInteraction) {
            setCameraInteractionType(cameraInteraction);
        }
    }, [cameraInteraction]);

    const updateCameraInteraction = (type: CameraInteraction) => {
        setCameraInteractionType(type);
    };

    const { t } = useTranslation();

    return (
        <div className={styles.root}>
            <FocusZone style={{ zIndex: 999 }}>
                <Stack horizontal tokens={{ childrenGap: 8 }}>
                    <HeaderControlGroup>
                        <HeaderControlButton
                            iconProps={{ iconName: 'Rotate90Clockwise' }}
                            id={calloutAnchorOrbit}
                            isActive={
                                cameraInteractionType ===
                                CameraInteraction.Rotate
                            }
                            onClick={() =>
                                updateCameraInteraction(
                                    CameraInteraction.Rotate
                                )
                            }
                            onMouseEnter={() => setShowOrbitCallout(true)}
                            onMouseLeave={() => setShowOrbitCallout(false)}
                        >
                            {cameraInteractionType ===
                                CameraInteraction.Rotate && (
                                <img
                                    src={`data:image/svg+xml;base64,${Selected(
                                        theme
                                    )}`}
                                    style={{ width: 24 }}
                                    className={styles.selectedIndicator}
                                />
                            )}
                        </HeaderControlButton>
                        <HeaderControlButton
                            iconProps={{ iconName: 'Move' }}
                            id={calloutAnchorPan}
                            isActive={
                                cameraInteractionType === CameraInteraction.Pan
                            }
                            onClick={() =>
                                updateCameraInteraction(CameraInteraction.Pan)
                            }
                            onMouseEnter={() => setShowPanCallout(true)}
                            onMouseLeave={() => setShowPanCallout(false)}
                        >
                            {cameraInteractionType ===
                                CameraInteraction.Pan && (
                                <img
                                    src={`data:image/svg+xml;base64,${Selected(
                                        theme
                                    )}`}
                                    style={{ width: 24 }}
                                    className={styles.selectedIndicator}
                                />
                            )}
                        </HeaderControlButton>
                    </HeaderControlGroup>
                    <HeaderControlGroup>
                        <HeaderControlButton
                            isActive={false}
                            iconProps={{ iconName: 'Add' }}
                            onClick={() => onCameraZoom(true)}
                            title={t('cameraControls.zoomIn')}
                        />
                        <HeaderControlButton
                            isActive={false}
                            iconProps={{ iconName: 'Remove' }}
                            title={t('cameraControls.zoomOut')}
                            onClick={() => onCameraZoom(false)}
                        />
                    </HeaderControlGroup>
                    <HeaderControlGroup>
                        <HeaderControlButton
                            iconProps={{ iconName: 'CubeShape' }}
                            isActive={false}
                            onClick={onResetCamera}
                            title={t('cameraControls.reset')}
                        />
                    </HeaderControlGroup>
                </Stack>
            </FocusZone>
            {showPanCallout && (
                <Callout
                    target={`#${calloutAnchorPan}`}
                    directionalHint={DirectionalHint.bottomCenter}
                >
                    <CameraControlsCalloutContent type={'Move'} />
                </Callout>
            )}
            {showOrbitCallout && (
                <Callout
                    target={`#${calloutAnchorOrbit}`}
                    directionalHint={DirectionalHint.bottomCenter}
                >
                    <CameraControlsCalloutContent type={'Orbit'} />
                </Callout>
            )}
        </div>
    );
};

export const classPrefix = 'cb-camera-controls';
const classNames = {
    root: `${classPrefix}-root`,
    selected: `${classPrefix}-selected`
};
const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        root: [
            classNames.root,
            {
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex'
            }
        ],
        selectedIndicator: [
            classNames.selected,
            {
                position: 'absolute',
                top: 28
            }
        ]
    });
});
