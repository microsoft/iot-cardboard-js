import React, { useEffect } from 'react';
import { IBIMViewerProps } from '../../Models/Constants';
import useXeokitRender from '../../Models/Hooks/useXeokitRender';
import './BIMViewer.scss';

const BIMViewer: React.FC<IBIMViewerProps> = ({
    bimFilePath,
    bimFileType,
    metadataFilePath,
    centeredObject
}) => {
    console.log(metadataFilePath);
    const viewer = useXeokitRender(
        'TBDID',
        bimFilePath,
        metadataFilePath,
        bimFileType
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
            <canvas id="TBDID"></canvas>
        </div>
    );
};

export default React.memo(BIMViewer);
