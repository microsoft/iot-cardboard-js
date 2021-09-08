import { useCallback, useEffect, useState } from 'react';

import { Viewer } from '@xeokit/xeokit-sdk/src/viewer/Viewer';
import { TreeViewPlugin } from '@xeokit/xeokit-sdk/src/plugins/TreeViewPlugin/TreeViewPlugin';
import { XKTLoaderPlugin } from '@xeokit/xeokit-sdk/src/plugins/XKTLoaderPlugin/XKTLoaderPlugin';
import { createDTDLModelId } from '../Services/Utils';
import {
    ADTModel_BIMContainerId,
    ADTModel_BimFilePath_PropertyName,
    ADTModel_MetadataFilePath_PropertyName,
    ADTModel_ViewData_PropertyName,
    AssetsFromBIMState,
    DTModel,
    DTwin,
    DTwinRelationship
} from '../Constants';

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
        mediaTwin: null,
        modelCounts: {}
    });

    const resetAssetsState = () => {
        setAssetsState({
            models: [],
            twins: [],
            relationships: [],
            mediaTwin: null,
            modelCounts: {}
        });
        onIsLoadingChange(false);
    };

    const transformModels = (typesDictionary): DTModel[] => {
        return Object.keys(typesDictionary).map((modelName) => {
            const properties = typesDictionary[modelName].properties
                ? typesDictionary[modelName].properties
                : [];
            return {
                '@id': createDTDLModelId(modelName),
                '@type': 'Interface',
                '@context': 'dtmi:dtdl:context;2',
                displayName: modelName,
                contents: [
                    ...properties,
                    ...typesDictionary[modelName].relationships
                ]
            };
        });
    };

    const getModelCounts = (typesDictionary) => {
        const countsDictionary = {};
        Object.keys(typesDictionary).forEach((modelName) => {
            countsDictionary[modelName] = typesDictionary[modelName].count;
        });
        return countsDictionary;
    };

    const viewData = {
        [ADTModel_BimFilePath_PropertyName]: bimFilePath,
        [ADTModel_MetadataFilePath_PropertyName]: metadataFilePath
    };

    const createHasMemberRelId = (targetName) => {
        return `bim_contains_${targetName}`;
    }

    const createHasMemberRelationship = (mediaTwinId, targetId): DTwinRelationship => {
        return {
            $relId: createHasMemberRelId(targetId),
            $dtId: mediaTwinId,
            $name: 'HasMember',
            $targetId: targetId
        };
    }

    const createMediaTwinId = () => {
        return 'bimFile';
    }

    const extractAssets = useCallback(
        (root) => {
            const typesDictionary = {};
            const mediaTwin: DTwin = {
                $dtId: createMediaTwinId(),
                $metadata: {
                    $model: 'dtmi:com:niusoff:mediatwin;1'
                },
                MediaSrc: bimFilePath,
            }
            // typesDictionary[ADTModel_BIMContainerId] = {`
            //     properties: [
            //         {
            //             '@type': 'Property',
            //             name: ADTModel_ViewData_PropertyName,
            //             schema: {
            //                 '@type': 'Object',
            //                 fields: [
            //                     {
            //                         name: ADTModel_BimFilePath_PropertyName,
            //                         schema: 'string'
            //                     },
            //                     {
            //                         name: ADTModel_MetadataFilePath_PropertyName,
            //                         schema: 'string'
            //                     }
            //                 ]
            //             }
            //         }
            //     ],
            //     relationships: [],
            //     count: 1
            // };

            // const bimModelID = createDTDLModelId(ADTModel_BIMContainerId);
            const twinsDictionary: Record<string, DTwin> = {};
            twinsDictionary[createMediaTwinId()] = mediaTwin;
            // twinsDictionary[ADTModel_BIMContainerId] = {
            //     $dtId: ADTModel_BIMContainerId,
            //     $metadata: {
            //         $model: bimModelID
            //     },
            //     [ADTModel_ViewData_PropertyName]: viewData
            // };
            const relationshipsDictionary: Record<
                string,
                DTwinRelationship
            > = {};
            const mediaTwinRelationships: Array<DTwinRelationship> = [];

            // recursive traversal of every asset to extract model, twin and  information
            const addAsset = (node) => {
                if (!typesDictionary[node.type]) {
                    
                    typesDictionary[node.type] = {
                        relationships: [
                            // {
                            //     '@type': 'Relationship',
                            //     name: 'inBIM',
                            //     displayName: 'in BIM',
                            //     target: bimModelID
                            // }
                        ],
                        properties: [
                            {
                                '@type': 'Property',
                                name: ADTModel_ViewData_PropertyName,
                                schema: {
                                    '@type': 'Object',
                                    fields: [
                                        {
                                            name: ADTModel_BimFilePath_PropertyName,
                                            schema: 'string'
                                        },
                                        {
                                            name: ADTModel_MetadataFilePath_PropertyName,
                                            schema: 'string'
                                        }
                                    ]
                                }
                            }
                        ],
                        count: 1
                    };
                } else {
                    typesDictionary[node.type].count += 1;
                }
                twinsDictionary[node.id] = {
                    $dtId: node.id,
                    $metadata: {
                        $model: createDTDLModelId(node.type)
                    },
                    [ADTModel_ViewData_PropertyName]: viewData
                };

                // add has member for media twin to this twin
                mediaTwinRelationships.push(createHasMemberRelationship(mediaTwin.$dtId, node.id));

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
                relationships: Object.values(relationshipsDictionary).concat(mediaTwinRelationships),
                mediaTwin: mediaTwin,
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
