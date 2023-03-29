import React, { useCallback } from 'react';
import { Behaviors } from '@antv/graphin';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomLassoHandlerProps } from './CustomLassoHandler.types';
import { ICustomNodeConfig, ICustomEdgeConfig } from '../../GraphTypes.types';
import { GraphContextActionType } from '../../../../Apps/Legion/Contexts/GraphContext/GraphContext.types';
import { useGraphContext } from '../../../../Apps/Legion/Contexts/GraphContext/GarphContext';

const { LassoSelect } = Behaviors;

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomLassoHandler', debugLogging);

const CustomLassoHandler: React.FC<ICustomLassoHandlerProps> = (_props) => {
    // contexts
    const { graphDispatch } = useGraphContext();

    // callbacks
    const setSelectedNodes = useCallback(
        (nodeData: ICustomNodeConfig[]) => {
            graphDispatch({
                type: GraphContextActionType.SET_SELECTED_NODES,
                payload: { nodes: nodeData }
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
                onSelect={(
                    nodes: ICustomNodeConfig[],
                    _edges: ICustomEdgeConfig[]
                ) => {
                    if (nodes.length > 0) {
                        setSelectedNodes(nodes);
                    }
                }}
            />
        </>
    );
};

export default CustomLassoHandler;
