import React, { useCallback } from 'react';
import { Behaviors } from '@antv/graphin';
import { IEdge, INode } from '@antv/g6';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomLassoHandlerProps } from './CustomLassoHandler.types';
import { GraphContextActionType } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext.types';
import { useGraphContext } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext';
import { GetNodeIdsFromSelection } from '../../Utils/GraphUtils';

const { LassoSelect } = Behaviors;

const debugLogging = true;
const logDebugConsole = getDebugLogger('CustomLassoHandler', debugLogging);

const CustomLassoHandler: React.FC<ICustomLassoHandlerProps> = (_props) => {
    // contexts
    const { graphDispatch } = useGraphContext();

    // callbacks
    const setSelectedNodes = useCallback(
        (nodeData: INode[]) => {
            logDebugConsole('info', 'setSelectedNodes. {nodes}', nodeData);
            graphDispatch({
                type: GraphContextActionType.SET_SELECTED_NODES,
                payload: { nodeIds: GetNodeIdsFromSelection(nodeData) }
            });
        },
        [graphDispatch]
    );

    // side effects

    logDebugConsole('debug', 'Render');

    return (
        <>
            <LassoSelect
                includeEdges={false}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onSelect={(selectedNodes: INode[], _selectedEdges: IEdge[]) => {
                    if (selectedNodes.length > 0) {
                        setSelectedNodes(selectedNodes);
                    }
                }}
            />
        </>
    );
};

export default CustomLassoHandler;
