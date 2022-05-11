import {
    Callout,
    DirectionalHint,
    memoizeFunction,
    mergeStyleSets,
    Stack,
    Theme,
    useTheme
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { CameraInteraction } from '../../Models/Constants/Enums';
import { useTranslation } from 'react-i18next';
import {
    LeftMouseClick,
    LeftMouseMove,
    MiddleMouse,
    RightMouseMove,
    Selected
} from './CameraControlAssets';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';

interface CameraControlProps {
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
    }, [cameraInteractionType]);

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
        <div className={styles.panelContents}>
            <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                styles={{ root: { zIndex: 999 } }}
            >
                <HeaderControlGroup>
                    <HeaderControlButton
                        iconProps={{ iconName: 'Rotate90Clockwise' }}
                        id={calloutAnchorOrbit}
                        isActive={
                            cameraInteractionType === CameraInteraction.Rotate
                        }
                        onClick={() =>
                            updateCameraInteraction(CameraInteraction.Rotate)
                        }
                        onMouseEnter={() => setShowOrbitCallout(true)}
                        onMouseLeave={() => setShowOrbitCallout(false)}
                    >
                        {cameraInteractionType === CameraInteraction.Rotate && (
                            <img
                                src={`data:image/svg+xml;base64,${Selected(
                                    theme
                                )}`}
                                style={{ width: 24 }}
                                className={styles.selected}
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
                        {cameraInteractionType === CameraInteraction.Pan && (
                            <img
                                src={`data:image/svg+xml;base64,${Selected(
                                    theme
                                )}`}
                                style={{ width: 24 }}
                                className={styles.selected}
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
            {showPanCallout && (
                <Callout
                    target={`#${calloutAnchorPan}`}
                    directionalHint={DirectionalHint.bottomCenter}
                >
                    <div className={styles.callout}>
                        <div>{t('cameraControls.mouseControls')}</div>
                        <div className={styles.modes}>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.select')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${LeftMouseClick(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.pan')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${LeftMouseMove(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.orbit')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${RightMouseMove(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.zoom')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${MiddleMouse(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Callout>
            )}
            {showOrbitCallout && (
                <Callout
                    target={`#${calloutAnchorOrbit}`}
                    directionalHint={DirectionalHint.bottomCenter}
                >
                    <div className={styles.callout}>
                        <div>{t('cameraControls.mouseControls')}</div>
                        <div className={styles.modes}>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.select')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${LeftMouseClick(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.orbit')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${LeftMouseMove(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.pan')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${RightMouseMove(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                            <div className={styles.mode}>
                                <div>{t('cameraControls.zoom')}</div>
                                <div>
                                    <img
                                        src={`data:image/svg+xml;base64,${MiddleMouse(
                                            theme
                                        )}`}
                                        style={{ height: 28, width: 28 }}
                                        className={styles.modeIcon}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Callout>
            )}
        </div>
    );
};

const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        panelContents: {
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex'
        },
        buttonIcon: {
            fill: theme.semanticColors.bodyText
        },
        selected: {
            position: 'absolute',
            top: 28
        },
        callout: {
            width: 200,
            borderRadius: 2,
            background: theme.semanticColors.buttonBackground,
            padding: '16px 16px',
            border: `1px solid ${theme.palette.neutralLight}`
        },
        modes: {
            display: 'flex',
            fontSize: 12,
            marginTop: 16
        },
        mode: {
            flex: 1,
            textAlign: 'center'
        },
        modeIcon: {
            marginTop: 12,
            marginBottom: 4
        }
    });
});
