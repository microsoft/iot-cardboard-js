import React, { useCallback, useContext, useEffect } from 'react';
import { IG6GraphEvent, GraphinContext } from '@antv/graphin';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomClickHandlerProps } from './CustomClickHandler.types';
import { IEdge, INode } from '@antv/g6';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';
import {
    ICustomEdgeConfig,
    ICustomEdgeData,
    ICustomNodeConfig,
    ICustomNodeData
} from '../../GraphTypes.types';
import { getSelectionFromGraphItem } from '../../Utils/GraphUtils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomClickHandler', debugLogging);

const CustomClickHandler: React.FC<ICustomClickHandlerProps> = (_props) => {
    // contexts
    const { graph, apis } = useContext(GraphinContext);
    const { oatPageDispatch } = useOatPageContext();

    // callbacks

    // NODE CALLBACKS
    const focusNodeById = useCallback(
        (nodeId: string) => {
            apis.focusNodeById(nodeId);
        },
        [apis]
    );
    const setSelectedNode = useCallback(
        (nodeData: ICustomNodeData) => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: { selection: getSelectionFromGraphItem(nodeData) }
            });
        },
        [oatPageDispatch]
    );
    // master handler
    const onNodeSelected = useCallback(
        (nodeData: ICustomNodeData) => {
            // focus node
            focusNodeById(nodeData.id);

            // set selected node
            setSelectedNode(nodeData);
        },
        [focusNodeById, setSelectedNode]
    );

    // EDGE CALLBACKS
    const setSelectedEdge = useCallback(
        (edgeData: ICustomEdgeData) => {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                payload: {
                    selection: getSelectionFromGraphItem(edgeData)
                }
            });
        },
        [oatPageDispatch]
    );
    // master handler
    const onEdgeSelected = useCallback(
        (nodeData: ICustomEdgeData) => {
            // set selected node
            setSelectedEdge(nodeData);
        },
        [setSelectedEdge]
    );

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
    }, [apis, graph, onNodeSelected]);

    // register for edge click events
    useEffect(() => {
        logDebugConsole('debug', 'Register EDGE click handler');
        const handleClick = (evt: IG6GraphEvent) => {
            const edge = evt.item as IEdge;
            const model = edge.getModel() as ICustomEdgeConfig;
            logDebugConsole('info', 'Edge clicked {edge}', model);
            onEdgeSelected(model.data);
        };

        graph.on('edge:click', handleClick);
        return () => {
            logDebugConsole('debug', 'Unregister EDGE click handler');
            graph.off('edge:click', handleClick);
        };
    }, [apis, graph, onEdgeSelected]);

    return null;
};

export default CustomClickHandler;
