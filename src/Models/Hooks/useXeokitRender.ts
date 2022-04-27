import { useEffect, useRef } from 'react';
import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';
import { BIMFileTypes } from '../Constants';
import { useTranslation } from 'react-i18next';
import { TreeViewPlugin } from '@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin';

const useXeokitRender = (
    canvasId: string,
    bimFilePath: string,
    metadataFilePath: string,
    bimFileType: BIMFileTypes = BIMFileTypes.Xkt,
    onError: (string) => void
) => {
    const viewer = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (viewer.current === null) {
            viewer.current = new Viewer({
                canvasId: canvasId
            });
            new TreeViewPlugin(viewer.current, {
                containerElement: document.getElementById('ghostTree'),
                autoExpandDepth: 1,
                hierarchy: 'types'
            });
        }
        if (bimFileType === BIMFileTypes.Xkt && bimFilePath) {
            const xktLoader = new XKTLoaderPlugin(viewer.current);
            (async () => {
                const model = await xktLoader.load({
                    id: 'model',
                    src: bimFilePath,
                    metaModelSrc: metadataFilePath, // Creates a MetaObject instances in scene.metaScene.metaObjects
                    edges: true
                });
                model.on('error', (e) => {
                    onError(e);
                });
            })();
        } else {
            onError(t('unsupportedFileType'));
        }
    }, [bimFilePath, bimFileType, canvasId, metadataFilePath, onError, t]);
    return viewer?.current;
};

export default useXeokitRender;
