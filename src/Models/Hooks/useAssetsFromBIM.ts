import { useCallback, useEffect, useState } from 'react';

import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { TreeViewPlugin } from '@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';
import { DTDLModel } from '../Classes/DTDL';
import { createDTDLModelId } from '../Services/Utils';

const useAssetsFromBIM = (
    ghostBimId,
    ghostTreeId,
    bimFilePath,
    metadataFilePath
) => {
    const [assetsState, setAssetsState] = useState({
        models: [],
        twins: [],
        relationships: []
    });

    const extractModels = useCallback(
        (root) => {
            const typesDictionary = {};
            typesDictionary['BIMContainer'] = {
                properties: {
                    bimFilePath: bimFilePath,
                    metadataFilePath: metadataFilePath
                },
                relationships: []
            };

            // recursive traversal of every asset to extract model information
            // could be an issue if there are conflicting locations for where models can exist
            // i.e. window can be on wall, but also door. Will need to be more careful when creating relationships
            const addModel = (node) => {
                if (!typesDictionary[node.type]) {
                    typesDictionary[node.type] = {
                        relationships: [
                            {
                                '@type': 'Relationship',
                                name: 'inBIM',
                                displayName: 'in BIM',
                                target: 'dtmi:assetGen:BIMContainer;1'
                            }
                        ],
                        properties: []
                    };
                }
                if (node.children) {
                    node.children.forEach((child) => {
                        addModel(child);
                    });
                }
            };
            addModel(root);

            return Object.keys(typesDictionary).map((modelName) => {
                return new DTDLModel(
                    createDTDLModelId(modelName),
                    modelName,
                    '',
                    '',
                    [],
                    typesDictionary[modelName].relationships,
                    []
                );
            });
        },
        [bimFilePath, metadataFilePath]
    );

    const extractTwins = (xeokitMetaModel) => {
        return [];
    };

    const extractRelationships = (xeokitMetaModel) => {
        return [];
    };

    useEffect(() => {
        if (bimFilePath && metadataFilePath) {
            const viewer = new Viewer({
                canvasId: ghostBimId
            });

            new TreeViewPlugin(viewer, {
                containerElement: document.getElementById(ghostTreeId),
                autoExpandDepth: 1,
                hierarchy: 'types'
            });

            const loader = new XKTLoaderPlugin(viewer);
            (async () => {
                const model = await loader.load({
                    id: 'model',
                    src: bimFilePath,
                    metaModelSrc: metadataFilePath, // Creates a MetaObject instances in scene.metaScene.metaObjects
                    edges: true
                });

                setTimeout(() => {
                    const xeokitMetaModel =
                        model?.scene?.viewer?.metaScene?.metaModels?.model
                            ?.rootMetaObject;
                    if (xeokitMetaModel) {
                        setAssetsState({
                            models: extractModels(xeokitMetaModel),
                            twins: extractTwins(xeokitMetaModel),
                            relationships: extractRelationships(xeokitMetaModel)
                        });
                    }
                }, 1000);
            })();
        }
    }, [bimFilePath, metadataFilePath]);
    return assetsState;
};

export default useAssetsFromBIM;
