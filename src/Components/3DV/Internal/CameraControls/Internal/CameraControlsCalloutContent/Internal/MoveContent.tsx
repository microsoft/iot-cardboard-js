import { IProcessedStyleSet, useTheme } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    LeftMouseClick,
    LeftMouseMove,
    RightMouseMove,
    MiddleMouse
} from '../../CameraControlAssets';
import { ICameraControlsCalloutContentStyles } from '../CameraControlsCalloutContent.types';

interface IMoveContentProps {
    styles: IProcessedStyleSet<ICameraControlsCalloutContentStyles>;
}
const MoveContent: React.FC<IMoveContentProps> = (props) => {
    const { styles } = props;
    const theme = useTheme();
    const { t } = useTranslation();
    return (
        <div className={styles.root}>
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
    );
};

export default MoveContent;
