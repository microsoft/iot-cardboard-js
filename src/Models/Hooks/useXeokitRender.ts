import { useEffect, useRef } from 'react';
import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';

const useXeokitRender = (
    canvasId,
    bimFilePath,
    metadataFilePath,
    bimFileType = 'xkt'
) => {
    const viewer = useRef(null);

    useEffect(() => {
        if (viewer.current === null) {
            viewer.current = new Viewer({
                canvasId: canvasId
            });
        }
        if (bimFileType === 'xkt') {
            const xktLoader = new XKTLoaderPlugin(viewer.current);
            xktLoader.load({
                id: 'myModel',
                src: bimFilePath,
                metaModelSrc: metadataFilePath, // Creates a MetaObject instances in scene.metaScene.metaObjects
                edges: true
            });
        }
    }, [bimFilePath, metadataFilePath]);
    return viewer;
};

export default useXeokitRender;
