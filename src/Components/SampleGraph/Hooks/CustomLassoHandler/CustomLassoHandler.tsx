import React, { useContext, useEffect } from 'react';
import { GraphinContext } from '@antv/graphin';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomLassoHandlerProps } from './CustomLassoHandler.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomLassoHandler', debugLogging);

const CustomLassoHandler: React.FC<ICustomLassoHandlerProps> = (_props) => {
    // contexts
    const { graph, apis } = useContext(GraphinContext);

    // callbacks

    // NODE CALLBACKS

    // side effects
    // register for node click events
    useEffect(() => {
        logDebugConsole('debug', 'Register NODE click handler');
        graph.setMode('dragLasso');

        // graph.on('node:click', handleClick);
        return () => {
            logDebugConsole('debug', 'Unregister NODE click handler');
            graph.setMode('default');
            // graph.off('node:click', handleClick);
        };
    }, [apis, graph]);

    return null;
};

export default CustomLassoHandler;
