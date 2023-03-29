import React, { useCallback, useContext, useEffect } from 'react';
import { IG6GraphEvent, GraphinContext } from '@antv/graphin';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomClickHandlerProps } from './CustomClickHandler.types';
import { INode } from '@antv/g6';
import { ICustomNodeConfig, ICustomNodeData } from '../../GraphTypes.types';
import { useGraphContext } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext';
import { GraphContextActionType } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext.types';

const debugLogging = true;
const logDebugConsole = getDebugLogger('CustomClickHandler', debugLogging);

const CustomClickHandler: React.FC<ICustomClickHandlerProps> = (_props) => {
    // contexts
    const { graph } = useContext(GraphinContext);
    const { graphDispatch } = useGraphContext();

    // callbacks

    // NODE CALLBACKS
    // const focusNodeById = useCallback(
    //     (nodeId: string) => {
    //         apis.focusNodeById(nodeId);
    //     },
    //     [apis]
    // );
    const setSelectedNode = useCallback(
        (nodeData: ICustomNodeData | undefined) => {
            const data = nodeData ? [nodeData.id] : [];
            graphDispatch({
                type: GraphContextActionType.SET_SELECTED_NODES,
                payload: { nodeIds: data }
            });
        },
        [graphDispatch]
    );
    // master handler
    const onNodeSelected = useCallback(
        (nodeData: ICustomNodeData | undefined) => {
            // focus node
            // focusNodeById(nodeData.id);

            // set selected node
            setSelectedNode(nodeData);
        },
        [setSelectedNode]
    );

    // EDGE CALLBACKS
    // const setSelectedEdge = useCallback(
    //     (edgeData: ICustomEdgeData) => {
    //         graphDispatch({
    //             type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
    //             payload: {
    //                 selection: getSelectionFromGraphItem(edgeData)
    //             }
    //         });
    //     },
    //     [oatPageDispatch]
    // );
    // master handler
    // const onEdgeSelected = useCallback(
    //     (nodeData: ICustomEdgeData) => {
    //         // set selected node
    //         setSelectedEdge(nodeData);
    //     },
    //     [setSelectedEdge]
    // );

    // side effects
    // register for node click events
    useEffect(() => {
        logDebugConsole('debug', 'Register NODE click handler');
        const handleClick = (evt: IG6GraphEvent) => {
            const node = evt.item as INode;
            const model = node.getModel() as ICustomNodeConfig;
            logDebugConsole('info', 'Node clicked {node}', model);
            onNodeSelected(model.data);
        };
        graph.on('node:click', handleClick);
        return () => {
            logDebugConsole('debug', 'Unregister NODE click handler');
            graph.off('node:click', handleClick);
        };
    }, [graph, onNodeSelected]);

    // register for canvas click events
    useEffect(() => {
        const handleCanvasClick = (ev: IG6GraphEvent) => {
            // logDebugConsole('info', 'Click event {event}', ev);
            const shape = ev.item;
            if (!shape || shape.get('type') !== 'node') {
                logDebugConsole('info', 'Canvas clicked {event}', ev);
                onNodeSelected(null);
            }
        };

        logDebugConsole('debug', 'Register CANVAS click handler');
        graph.on('click', handleCanvasClick);
        return () => {
            logDebugConsole('debug', 'Unregister CANVAS click handler');
            graph.off('click', handleCanvasClick);
        };
    }, [graph, onNodeSelected]);

    // register for edge click events
    // useEffect(() => {
    //     logDebugConsole('debug', 'Register EDGE click handler');
    //     const handleClick = (evt: IG6GraphEvent) => {
    //         const edge = evt.item as IEdge;
    //         const model = edge.getModel() as ICustomEdgeConfig;
    //         logDebugConsole('info', 'Edge clicked {edge}', model);
    //         onEdgeSelected(model.data);
    //     };

    //     graph.on('edge:click', handleClick);
    //     return () => {
    //         logDebugConsole('debug', 'Unregister EDGE click handler');
    //         graph.off('edge:click', handleClick);
    //     };
    // }, [apis, graph, onEdgeSelected]);

    return null;
};

export default CustomClickHandler;
