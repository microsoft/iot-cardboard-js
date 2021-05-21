import { useEffect, useRef } from 'react';
import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';
import { BIMFileTypes } from '../Constants';

const useXeokitRender = (
    canvasId,
    bimFilePath,
    metadataFilePath,
    bimFileType = BIMFileTypes.Xkt
) => {
    const viewer = useRef(null);

    useEffect(() => {
        if (viewer.current === null) {
            viewer.current = new Viewer({
                canvasId: canvasId
            });
        }
        if (bimFileType === BIMFileTypes.Xkt) {
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
