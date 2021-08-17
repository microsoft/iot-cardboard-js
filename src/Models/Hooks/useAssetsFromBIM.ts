import { useCallback, useEffect, useState } from 'react';

import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { TreeViewPlugin } from '@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';
import { DTDLModel } from '../Classes/DTDL';
import { createDTDLModelId } from '../Services/Utils';
import { AssetsFromBIMState, DTwin, DTwinRelationship } from '../Constants';

const useAssetsFromBIM = (
    ghostBimId,
    ghostTreeId,
    bimFilePath,
    metadataFilePath,
    onIsLoadingChange
) => {
    const [assetsState, setAssetsState] = useState<AssetsFromBIMState>({
        models: [],
        twins: [],
        relationships: [],
        modelCounts: {}
    });

    const resetAssetsState = () => {
        setAssetsState({
            models: [],
            twins: [],
            relationships: [],
            modelCounts: {}
        });
        onIsLoadingChange(false);
    };

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

    const getModelCounts = (typesDictionary) => {
        const countsDictionary = {};
        Object.keys(typesDictionary).forEach((modelName) => {
            countsDictionary[modelName] = typesDictionary[modelName].count;
        });
        return countsDictionary;
    };

    const extractAssets = useCallback(
        (root) => {
            const typesDictionary = {};
            typesDictionary['BIMContainer'] = {
                properties: {
                    bimFilePath: bimFilePath,
                    metadataFilePath: metadataFilePath
                },
                relationships: [],
                count: 1
            };

            const twinsDictionary: Record<string, DTwin> = {};
            const relationshipsDictionary: Record<
                string,
                DTwinRelationship
            > = {};

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
                        properties: [],
                        count: 1
                    };
                } else {
                    typesDictionary[node.type].count += 1;
                }
                twinsDictionary[node.id] = {
                    $dtId: node.id,
                    $metadata: {
                        $model: createDTDLModelId(node.type)
                    }
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
                                    $relId: relationshipId,
                                    $dtId: node.id,
                                    $targetId: child.id,
                                    $name: relationshipName
                                };
                            }
                        );
                    });
                }
            };
            addAsset(root);

            setAssetsState({
                models: transformModels(typesDictionary),
                twins: Object.values(twinsDictionary),
                relationships: Object.values(relationshipsDictionary),
                modelCounts: getModelCounts(typesDictionary)
            });
            onIsLoadingChange(false);
        },
        [bimFilePath, metadataFilePath]
    );

    useEffect(() => {
        if (bimFilePath && metadataFilePath) {
            onIsLoadingChange(true);
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
                let model;
                try {
                    model = await loader.load({
                        id: 'model',
                        src: bimFilePath,
                        metaModelSrc: metadataFilePath, // Creates a MetaObject instances in scene.metaScene.metaObjects
                        edges: true
                    });
                } catch (e) {
                    resetAssetsState();
                }

                setTimeout(() => {
                    try {
                        const xeokitMetaModel =
                            model.scene.viewer.metaScene.metaModels.model
                                .rootMetaObject;
                        extractAssets(xeokitMetaModel);
                    } catch (e) {
                        resetAssetsState();
                    }
                }, 1000); //hardcoded to a one second delay to ensure xeokit model is loaded
            })();
        } else {
            resetAssetsState();
        }
    }, [bimFilePath, metadataFilePath]);
    return assetsState;
};

export default useAssetsFromBIM;
