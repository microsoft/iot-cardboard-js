import {
    DefaultButton,
    memoizeFunction,
    mergeStyleSets,
    Theme,
    useTheme
} from '@fluentui/react';
import React, { useState } from 'react';
import { CameraInteraction } from '../../Models/Constants/Enums';

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
    const [cameraInteractionType, setCameraInteractionType] = useState(
        cameraInteraction ? cameraInteraction : CameraInteraction.Free
    );
    const theme = useTheme();
    const styles = getStyles(theme);

    const updateCameraInteraction = (type: CameraInteraction) => {
        setCameraInteractionType(type);
        onCameraInteractionChanged(type);
    };

    return (
        <div className={styles.container}>
            <div className={styles.contents}>
                <DefaultButton
                    className={styles.button}
                    text="Free"
                    onClick={() =>
                        updateCameraInteraction(CameraInteraction.Free)
                    }
                />
                <DefaultButton
                    className={styles.button}
                    text="Pan"
                    onClick={() =>
                        updateCameraInteraction(CameraInteraction.Pan)
                    }
                />
                <DefaultButton
                    className={styles.button}
                    text="Rotate"
                    onClick={() =>
                        updateCameraInteraction(CameraInteraction.Rotate)
                    }
                />
                <DefaultButton
                    className={styles.button}
                    text="In"
                    onClick={() => onCameraZoom(true)}
                />
                <DefaultButton
                    className={styles.button}
                    text="Out"
                    onClick={() => onCameraZoom(false)}
                />
                <DefaultButton
                    className={styles.button}
                    text="Reset"
                    onClick={onResetCamera}
                />
            </div>
        </div>
    );
};

const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        container: {
            position: 'absolute',
            display: 'flex',
            width: '100%'
        },
        contents: {
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        button: {
            marginLeft: 'auto',
            marginRight: 'auto',
            zIndex: 999
        }
    });
});
