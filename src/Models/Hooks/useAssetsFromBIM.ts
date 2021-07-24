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

    const transformModels = (typesDictionary) => {
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
    };

    const transformTwins = (twinsDictionary) => {
        return Object.keys(twinsDictionary).map((twinId) => {
            return {
                $dtId: twinId,
                $metadata: {
                    $model: twinsDictionary[twinId].model
                }
            };
        });
    };

    const extractAssets = useCallback(
        (root) => {
            const typesDictionary = {};
            typesDictionary['BIMContainer'] = {
                properties: {
                    bimFilePath: bimFilePath,
                    metadataFilePath: metadataFilePath
                },
                relationships: []
            };

            const twinsDictionary = {};
            const relationshipsDictionary = {};

            // recursive traversal of every asset to extract model, twin and  information
            const addAsset = (node) => {
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
                twinsDictionary[node.id] = {
                    model: createDTDLModelId(node.type)
                };
                if (node.children) {
                    const relationshipsMap = {};

                    node.children.forEach((child) => {
                        if (!relationshipsMap[child.type]) {
                            relationshipsMap[child.type] = [];
                        }
                        relationshipsMap[child.type].push(child);
                        addAsset(child);
                    });
                    Object.keys(relationshipsMap).forEach((childType) => {
                        const targetModelId = createDTDLModelId(childType);
                        const relationshipName = `contains_${childType}`;

                        typesDictionary[node.type].relationships.push({
                            '@type': 'Relationship',
                            name: relationshipName,
                            displayName: relationshipName,
                            target: targetModelId
                        });

                        relationshipsMap[childType].forEach(
                            (child, childIndex) => {
                                const relationshipId = `${node.type}_contains_${childType}_${childIndex}`;
                                relationshipsDictionary[relationshipId] = {
                                    relationshipId: relationshipId,
                                    sourceId: node.id,
                                    $targetId: child.id,
                                    $relationshipName: relationshipName
                                };
                            }
                        );
                    });
                }
            };
            addAsset(root);

            setAssetsState({
                models: transformModels(typesDictionary),
                twins: transformTwins(twinsDictionary),
                relationships: Object.values(relationshipsDictionary)
            });
        },
        [bimFilePath, metadataFilePath]
    );

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
                        extractAssets(xeokitMetaModel);
                    }
                }, 1000);
            })();
        }
    }, [bimFilePath, metadataFilePath]);
    return assetsState;
};

export default useAssetsFromBIM;
