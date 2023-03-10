import React, { useEffect } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin, { EdgeStyle } from '@antv/graphin';
import { CreateEdge } from '@antv/graphin-components';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import {
    getDebugLogger,
    sortCaseInsensitive
} from '../../Models/Services/Utils';
import {
    ISampleGraphProps,
    ISampleGraphStyleProps,
    ISampleGraphStyles
} from './SampleGraph.types';
import { getStyles } from './SampleGraph.styles';
import CustomGraphNode from './Internal/CustomGraphNode/CustomGraphNode';
import {
    ICustomGraphData,
    ICustomNodeConfig,
    IDefaultEdge,
    IDefaultNode
} from './GraphTypes.types';
import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { ensureIsArray, parseModelId } from '../../Models/Services/OatUtils';
import {
    isDTDLComponentReference,
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../Models/Services/DtdlUtils';
import {
    DtdlInterface,
    OatGraphReferenceType,
    OAT_EXTEND_HANDLE_NAME
} from '../../Models/Constants';
import ONTOLOGY_DATA from './CityOntology.json';
import CustomClickHandler from './Hooks/CustomClickHandler/CustomClickHandler';
import CustomLegend from './Internal/CustomLegend/CustomLegend';
import { useOatPageContext } from '../../Models/Context/OatPageContext/OatPageContext';
import { IExtendedTheme } from '../../Theming/Theme.types';
import { DTDLType } from '../../Models/Classes/DTDL';

const debugLogging = true;
const logDebugConsole = getDebugLogger('SampleGraph', debugLogging);

const getClassNames = classNamesFunction<
    ISampleGraphStyleProps,
    ISampleGraphStyles
>();

// const ANCHOR_POINTS = [
//     [0.15, 0],
//     [0.4, 0],
//     [0.65, 0],
//     [0.85, 0]
// ];
// const ERROR_COLOR = '#F5222D';
// const getNodeConfig = (node) => {
//     if (node.nodeError) {
//         return {
//             basicColor: ERROR_COLOR,
//             fontColor: '#FFF',
//             borderColor: ERROR_COLOR,
//             bgColor: '#E66A6C'
//         };
//     }
//     let config = {
//         basicColor: '#5B8FF9',
//         fontColor: '#5B8FF9',
//         borderColor: '#5B8FF9',
//         bgColor: '#C6E5FF'
//     };
//     switch (node.type) {
//         case 'root': {
//             config = {
//                 basicColor: '#E3E6E8',
//                 fontColor: 'rgba(0,0,0,0.85)',
//                 borderColor: '#E3E6E8',
//                 bgColor: '#5b8ff9'
//             };
//             break;
//         }
//         default:
//             break;
//     }
//     return config;
// };

// const customNode = {
//     createNodeBox: (group: IGroup, config, w: number, h: number) => {
//         /* 最外面的大矩形 */
//         const container = group.addShape('rect', {
//             attrs: {
//                 x: 0,
//                 y: 0,
//                 width: w,
//                 height: h
//             },
//             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//             name: 'big-rect-shape'
//         });
//         // left dot
//         group.addShape('circle', {
//             attrs: {
//                 x: 3,
//                 y: h / 2,
//                 r: 6,
//                 fill: config.basicColor
//             },
//             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//             name: 'left-dot-shape'
//         });

//         // main body
//         group.addShape('rect', {
//             attrs: {
//                 x: 3,
//                 y: 0,
//                 width: w - 19,
//                 height: h,
//                 fill: config.bgColor,
//                 stroke: config.borderColor,
//                 radius: 2,
//                 cursor: 'pointer'
//             },
//             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//             name: 'rect-shape'
//         });

//         // left border
//         group.addShape('rect', {
//             attrs: {
//                 x: 3,
//                 y: 0,
//                 width: 3,
//                 height: h,
//                 fill: config.basicColor,
//                 radius: 1.5
//             },
//             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//             name: 'left-border-shape'
//         });
//         return container;
//     },
//     /* marker */
//     createNodeMarker: (group, collapsed, x, y) => {
//         group.addShape('circle', {
//             attrs: {
//                 x,
//                 y,
//                 r: 13,
//                 fill: 'rgba(47, 84, 235, 0.05)',
//                 opacity: 0,
//                 zIndex: -2
//             },
//             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//             name: 'collapse-icon-bg'
//         });
//     },
//     afterDraw: (cfg, group) => {
//         /* 操作 marker 的背景色显示隐藏 */
//         const icon = group.find(
//             (element) => element.get('name') === 'collapse-icon'
//         );
//         if (icon) {
//             const bg = group.find(
//                 (element) => element.get('name') === 'collapse-icon-bg'
//             );
//             icon.on('mouseenter', () => {
//                 bg.attr('opacity', 1);
//                 // graph.get("canvas").draw();
//             });
//             icon.on('mouseleave', () => {
//                 bg.attr('opacity', 0);
//                 // graph.get("canvas").draw();
//             });
//         }
//         /* ip 显示 */
//         const ipBox = group.find((element) => element.get('name') === 'ip-box');
//         if (ipBox) {
//             /* ip 复制的几个元素 */
//             const ipLine = group.find(
//                 (element) => element.get('name') === 'ip-cp-line'
//             );
//             const ipBG = group.find(
//                 (element) => element.get('name') === 'ip-cp-bg'
//             );
//             const ipIcon = group.find(
//                 (element) => element.get('name') === 'ip-cp-icon'
//             );
//             const ipCPBox = group.find(
//                 (element) => element.get('name') === 'ip-cp-box'
//             );

//             const onMouseEnter = () => {
//                 ipLine.attr('opacity', 1);
//                 ipBG.attr('opacity', 1);
//                 ipIcon.attr('opacity', 1);
//                 // graph.get("canvas").draw();
//             };
//             const onMouseLeave = () => {
//                 ipLine.attr('opacity', 0);
//                 ipBG.attr('opacity', 0);
//                 ipIcon.attr('opacity', 0);
//                 // graph.get("canvas").draw();
//             };
//             ipBox.on('mouseenter', () => {
//                 onMouseEnter();
//             });
//             ipBox.on('mouseleave', () => {
//                 onMouseLeave();
//             });
//             ipCPBox.on('mouseenter', () => {
//                 onMouseEnter();
//             });
//             ipCPBox.on('mouseleave', () => {
//                 onMouseLeave();
//             });
//             //   ipCPBox.on("click", () => {});
//         }
//     },
//     setState: (name, value, item) => {
//         const hasOpacityClass = [
//             'ip-cp-line',
//             'ip-cp-bg',
//             'ip-cp-icon',
//             'ip-cp-box',
//             'ip-box',
//             'collapse-icon-bg'
//         ];
//         const group = item.getContainer();
//         const childrens = group.get('children');
//         // graph.setAutoPaint(false);
//         if (name === 'emptiness') {
//             if (value) {
//                 childrens.forEach((shape) => {
//                     if (hasOpacityClass.indexOf(shape.get('name')) > -1) {
//                         return;
//                     }
//                     shape.attr('opacity', 0.4);
//                 });
//             } else {
//                 childrens.forEach((shape) => {
//                     if (hasOpacityClass.indexOf(shape.get('name')) > -1) {
//                         return;
//                     }
//                     shape.attr('opacity', 1);
//                 });
//             }
//         }
//         // graph.setAutoPaint(true);
//     }
// };
// Graphin.registerNode(
//     'custom-node',
//     {
//         draw: (cfg, group) => {
//             const config = getNodeConfig(cfg);
//             /* the biggest rect */
//             const container = customNode.createNodeBox(group, config, 243, 64);

//             /* the type text */
//             group.addShape('text', {
//                 attrs: {
//                     text: cfg.dataType,
//                     x: 3,
//                     y: -10,
//                     fontSize: 12,
//                     textAlign: 'left',
//                     textBaseline: 'middle',
//                     fill: 'rgba(0,0,0,0.65)'
//                 },
//                 // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//                 name: 'type-text-shape'
//             });

//             /* name */
//             group.addShape('text', {
//                 attrs: {
//                     text: cfg.name,
//                     x: 19,
//                     y: 19,
//                     fontSize: 14,
//                     fontWeight: 700,
//                     textAlign: 'left',
//                     textBaseline: 'middle',
//                     fill: config.fontColor,
//                     cursor: 'pointer'
//                 },
//                 // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//                 name: 'name-text-shape'
//             });

//             /* the description text */
//             group.addShape('text', {
//                 attrs: {
//                     text: cfg.keyInfo,
//                     x: 19,
//                     y: 45,
//                     fontSize: 14,
//                     textAlign: 'left',
//                     textBaseline: 'middle',
//                     fill: config.fontColor,
//                     cursor: 'pointer'
//                 },
//                 // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//                 name: 'bottom-text-shape'
//             });

//             return container;
//         },
//         // afterDraw: customNode.afterDraw,
//         // setState: customNode.setState,
//         // response the state changes and show/hide the link-point circles
//         // setState(name, value, item) {
//         //   if (name === "showAnchors") {
//         //     const anchorPoints = item
//         //       .getContainer()
//         //       .findAll((ele) => ele.get("name") === "anchor-point");
//         //     anchorPoints.forEach((point) => {
//         //       if (value || point.get("links") > 0) point.show();
//         //       else point.hide();
//         //     });
//         //   }
//         // }
//         // draw anchor-point circles according to the anchorPoints in afterDraw
//         // afterDraw(cfg, group) {
//         //   const bbox = group.getBBox();
//         //   const anchorPoints = this.getAnchorPoints(cfg);
//         //   anchorPoints.forEach((anchorPos, i) => {
//         //     group.addShape("circle", {
//         //       attrs: {
//         //         r: 5,
//         //         x: bbox.x + bbox.width * anchorPos[0],
//         //         y: bbox.y + bbox.height * anchorPos[1],
//         //         fill: "#fff",
//         //         stroke: "#5F95FF"
//         //       },
//         //       // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
//         //       name: `anchor-point`, // the name, for searching by group.find(ele => ele.get('name') === 'anchor-point')
//         //       anchorPointIdx: i, // flag the idx of the anchor-point circle
//         //       links: 0, // cache the number of edges connected to this shape
//         //       visible: false // invisible by default, shows up when links > 1 or the node is in showAnchors state
//         //     });
//         //   });
//         // },
//         getAnchorPoints(cfg) {
//             return cfg.anchorPoints || ANCHOR_POINTS;
//         }
//     },
//     'single-node'
// );

const CUSTOM_NODE_NAME = 'react-node';
const DEFAULT_NODE: IDefaultNode = {
    type: 'rect'
};
const DEFAULT_EDGE: IDefaultEdge = {
    type: 'graphin-line' // as any // forcing type since Graphin has an opinion for some reason
};
Graphin.registerNode(CUSTOM_NODE_NAME, createNodeFromReact(CustomGraphNode));

function getEdgeStyle(
    _type: OatGraphReferenceType,
    theme: IExtendedTheme
): Partial<EdgeStyle> {
    let edgeColor = 'black';
    switch (_type) {
        case DTDLType.Relationship:
            edgeColor = theme.palette.yellow;
            break;
        case DTDLType.Component:
            edgeColor = theme.palette.blue;
            break;
        case 'Extend':
            edgeColor = theme.palette.green;
            break;
        case 'Untargeted':
            edgeColor = theme.palette.yellow;
    }
    return {
        keyshape: {
            stroke: edgeColor
        },
        status: {
            hover: {
                halo: {
                    stroke: 'yellow',
                    fill: 'blue',
                    visible: true
                }
            },
            selected: {
                halo: {
                    stroke: 'red',
                    fill: 'green',
                    visible: true
                }
            }
        }
    };
}

function AddNodes(
    allModels: DtdlInterface[],
    currentModel: DtdlInterface,
    graphData: ICustomGraphData
) {
    const findRelatedNodeIds = (model: DtdlInterface): string[] => {
        // look for any references TO the current model
        const related = allModels
            .filter((x) => {
                if (
                    ensureIsArray(x.extends)?.find(
                        (y) => y['@id'] === model['@id']
                    )
                ) {
                    return true;
                } else if (
                    ensureIsArray(x.contents)?.find(
                        (y) => isDTDLReference(y) && y['@id'] === model['@id']
                    )
                ) {
                    return true;
                }
                return false;
            })
            .map((x) => (x ? x['@id'] : ''));

        const relatedSet = new Set<string>(related);

        // add all the relationships FROM the current model
        ensureIsArray(model.extends).forEach((x) => x && relatedSet.add(x));
        ensureIsArray(model.contents).forEach((x) => {
            isDTDLReference(x) && relatedSet.add(x['@id']);
        });

        // sort them to get consistent ordering across nodes
        const results =
            Array.from(relatedSet.values()).sort(sortCaseInsensitive()) || [];
        return results;
    };
    const relatedNodesKey = findRelatedNodeIds(currentModel).join(',') ?? '';

    // add the model node
    graphData.nodes.push({
        id: currentModel['@id'],
        label: parseModelId(currentModel['@id']).name,
        data: {
            itemType: 'Node',
            id: currentModel['@id'],
            name: parseModelId(currentModel['@id']).name,
            relatedNodesKey: relatedNodesKey
        }
    });
}

function AddEdges(
    model: DtdlInterface,
    data: ICustomGraphData,
    theme: IExtendedTheme
) {
    model.contents?.forEach((content) => {
        if (isDTDLReference(content)) {
            let source = '';
            let target = '';
            if (isDTDLRelationshipReference(content)) {
                source = model['@id'];
                target = content.target;
            } else if (isDTDLComponentReference(content)) {
                source = model['@id'];
                target =
                    typeof content.schema === 'object'
                        ? content.schema['@id']
                        : content.schema;
            }
            data.edges.push({
                source: source,
                target: target,
                label: content.name,
                data: {
                    itemType: 'Edge',
                    name: content.name,
                    source: source,
                    target: target,
                    type: content['@type']
                },
                style: getEdgeStyle(content['@type'], theme)
            });
        }
    });
    // add extends edges
    const extendsStyle = getEdgeStyle('Extend', theme);
    ensureIsArray(model.extends).forEach((content) => {
        data.edges.push({
            source: model['@id'],
            target: content,
            label: 'Extends',
            data: {
                itemType: 'Edge',
                name: 'Extends',
                source: model['@id'],
                target: content,
                type: OAT_EXTEND_HANDLE_NAME
            },
            style: extendsStyle
        });
    });
}

const SampleGraph: React.FC<ISampleGraphProps> = (props) => {
    const { styles } = props;
    console.log('[START] Render');

    // context
    const { oatPageState } = useOatPageContext();

    // hooks
    const graphContainerId = useId('graph-container');
    const theme = useExtendedTheme();

    console.log('Custom node', createNodeFromReact(CustomGraphNode));

    // const data: IGraphData = {
    //     nodes: [
    //         {
    //             id: 'node1',
    //             data: {
    //                 name: 'model1',
    //                 id: 'dtmi:folder1:folder2:model1;1'
    //             }
    //         },
    //         {
    //             id: 'node2',
    //             data: {
    //                 name: 'model2',
    //                 id: 'dtmi:folder1:model2;1'
    //             }
    //         },
    //         {
    //             id: 'node3',
    //             data: {
    //                 name: 'model3',
    //                 id: 'dtmi:folder1:folder2:model3;1'
    //             }
    //         }
    //     ],
    //     edges: [
    //         { source: 'node1', target: 'node2', label: 'has a relationship' },
    //         { source: 'node1', target: 'node3', label: 'another relationship' }
    //     ]
    // };

    const data: ICustomGraphData = {
        edges: [],
        nodes: []
    };
    const ontologyModels = (ONTOLOGY_DATA as IOATFile).data.models;
    ontologyModels.forEach((model) => {
        AddNodes(ontologyModels, model, data);
        //add the reference edges
        AddEdges(model, data, theme);
    });

    useEffect(() => {
        const selection = oatPageState.selection;
        if (!selection) {
            return;
        }
        if (selection.contentId) {
            const edge = data.edges.find(
                (x) => x.data.source === selection.contentId
            );
            if (edge) {
                console.log('Setting edge as selected', edge);
                edge.status = { ...edge.status, selected: true };
            } else {
                console.log('Could not find edge', edge);
            }
        } else {
            const node = data.nodes.find((x) => x.id === selection.modelId);
            if (node) {
                node.status = { ...node.status, selected: true };
            }
        }
    }, [data.edges, data.nodes, oatPageState.selection]);

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render', data);

    const height = document.getElementById(graphContainerId)?.scrollHeight;
    return (
        <div className={classNames.root}>
            <div className={classNames.graphContainer} id={graphContainerId}>
                <Graphin
                    data={data}
                    defaultEdge={DEFAULT_EDGE}
                    defaultNode={DEFAULT_NODE}
                    height={height}
                    layout={{
                        type: 'force2',
                        animate: true,
                        // clustering: true,
                        // nodeClusterBy: 'relatedNodesKey',
                        nodeSpacing: (node: ICustomNodeConfig) => {
                            if (node.data.name.length > 15) {
                                return 100;
                            }
                            return 20;
                        },
                        nodeSize: 20,
                        preventOverlap: true,
                        onLayoutEnd: () => {
                            console.log('layout end');
                        }
                    }}
                >
                    <CustomLegend />
                    <CustomClickHandler />
                    <CreateEdge
                        active={false}
                        onClick={() => {
                            alert('clicked');
                        }}
                    />
                </Graphin>
            </div>
        </div>
    );
};

export default styled<
    ISampleGraphProps,
    ISampleGraphStyleProps,
    ISampleGraphStyles
>(SampleGraph, getStyles);
