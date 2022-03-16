import React, { useEffect, useState } from 'react';
import { BIMFileTypes, IBIMViewerProps } from '../../Models/Constants';
import { useGuid } from '../../Models/Hooks';
import useXeokitRender from '../../Models/Hooks/useXeokitRender';
import { getFileType } from '../../Models/Services/Utils';
import Error from '../Error/Error';
import './BIMViewer.scss';

const BIMViewer: React.FC<IBIMViewerProps> = ({
    bimFilePath,
    metadataFilePath,
    centeredObject,
}) => {
    const viewerGuid = useGuid();

    const [errorText, setErrorText] = useState<string>(null);
    const viewer = useXeokitRender(
        viewerGuid,
        bimFilePath,
        metadataFilePath,
        getFileType(bimFilePath) as BIMFileTypes,
        setErrorText,
    );

    useEffect(() => {
        if (viewer && centeredObject) {
            viewer.current?.cameraFlight?.flyTo(
                viewer.current?.scene?.objects?.[centeredObject],
            );
        }
    }, [viewer, centeredObject]);

    return (
        <div className={'cb-bimviewer-container'}>
            {errorText && <Error errorTitle={errorText} />}
            <canvas id={viewerGuid}></canvas>
        </div>
    );
};

export default React.memo(BIMViewer);
