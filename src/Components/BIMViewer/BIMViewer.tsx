import React, { useEffect } from 'react';
import { IBIMViewerProps } from '../../Models/Constants';
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
    const viewer = useXeokitRender(
        viewerGuid,
        bimFilePath,
        metadataFilePath,
        getFileType(bimFilePath)
    );

    useEffect(() => {
        if (viewer && centeredObject) {
            viewer.current?.cameraFlight?.flyTo(
                viewer.current?.scene?.objects?.[centeredObject]
            );
        }
    }, [centeredObject]);

    return (
        <div className="cb-bimviewer-container">
            <canvas id={viewerGuid}></canvas>
        </div>
    );
};

export default React.memo(BIMViewer);
