import React, { useEffect, useState } from 'react';
import { BIMFileTypes, IBIMViewerProps } from '../../Models/Constants';
import { useGuid } from '../../Models/Hooks';
import useXeokitRender from '../../Models/Hooks/useXeokitRender';
import { getFileType } from '../../Models/Services/Utils';
import './BIMViewer.scss';

const BIMViewer: React.FC<IBIMViewerProps> = ({
    bimFilePath,
    metadataFilePath,
    centeredObject
}) => {
    const viewerGuid = useGuid();

    const [catastrophicError, setCatastrophicError] = useState(null);
    const viewer = useXeokitRender(
        viewerGuid,
        bimFilePath,
        metadataFilePath,
        getFileType(bimFilePath) as BIMFileTypes,
        setCatastrophicError
    );

    useEffect(() => {
        if (viewer && centeredObject) {
            viewer.current?.cameraFlight?.flyTo(
                viewer.current?.scene?.objects?.[centeredObject]
            );
        }
    }, [viewer, centeredObject]);

    return (
        <div className="cb-bimviewer-container">
            {catastrophicError && (
                <div className="cb-base-catastrophic-error-wrapper">
                    <div className="cb-base-catastrophic-error-box">
                        <div className="cb-base-catastrophic-error-message">
                            {catastrophicError}
                        </div>
                    </div>
                </div>
            )}
            <canvas id={viewerGuid}></canvas>
        </div>
    );
};

export default React.memo(BIMViewer);
