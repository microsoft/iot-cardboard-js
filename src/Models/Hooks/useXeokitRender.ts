import { useEffect, useRef } from 'react';
import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
// import useGuid from './useGuid';

const useXeokitRender = (canvasId) => {
    // const viewerContainerGUID = useGuid();
    const viewer = useRef(null);

    useEffect(() => {
        if (viewer.current === null) {
            viewer.current = new Viewer({
                canvasId: canvasId
            });
        }
        console.log(viewer);
    }, []);

    // return chartContainerGUID;
};

export default useXeokitRender;
