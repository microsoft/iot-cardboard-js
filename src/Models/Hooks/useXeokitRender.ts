import { useEffect, useRef } from 'react';
import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';
import { BIMFileTypes } from '../Constants';
import { useTranslation } from 'react-i18next';

const useXeokitRender = (
    canvasId,
    bimFilePath,
    metadataFilePath,
    bimFileType = BIMFileTypes.Xkt,
    onError
) => {
    const viewer = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (viewer.current === null) {
            viewer.current = new Viewer({
                canvasId: canvasId
            });
        }
        if (bimFileType === BIMFileTypes.Xkt) {
            const xktLoader = new XKTLoaderPlugin(viewer.current);
            const model = xktLoader.load({
                id: 'myModel',
                src: bimFilePath,
                metaModelSrc: metadataFilePath, // Creates a MetaObject instances in scene.metaScene.metaObjects
                edges: true
            });
            model.on('error', (e) => {
                onError(e);
            });
        } else {
            onError(t('unsupportedFileType'));
        }
    }, [bimFilePath, metadataFilePath]);
    return viewer;
};

export default useXeokitRender;
