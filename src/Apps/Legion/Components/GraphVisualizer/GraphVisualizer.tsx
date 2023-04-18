import React from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import Graphin from '@antv/graphin';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import CustomLassoHandler from './Hooks/CustomLassoHandler/CustomLassoHandler';
import CustomContextMenu from './Internal/CustomContextMenu/CustomContextMenu';
import CustomClickHandler from './Hooks/CustomClickHandler/CustomClickHandler';
import {
    ICustomNodeConfig,
    IDefaultEdge,
    IDefaultNode
} from './GraphTypes.types';
import {
    IGraphVisualizerProps,
    IGraphVisualizerStyleProps,
    IGraphVisualizerStyles
} from './GraphVisualizer.types';
import { getStyles } from './GraphVisualizer.styles';
import { useGraphContext } from '../../Contexts/GraphContext/GraphContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('GraphVisualizer', debugLogging);

const getClassNames = classNamesFunction<
    IGraphVisualizerStyleProps,
    IGraphVisualizerStyles
>();

const DEFAULT_NODE: IDefaultNode = {
    type: 'graphin-circle', // CUSTOM_NODE_NAME // 'rect'
    style: {
        badges: [],
        halo: {},
        icon: {},
        keyshape: {
            fillOpacity: 0.2
        },
        label: {
            offset: [10, 5],
            position: 'right'
        }
    }
};
const DEFAULT_EDGE: IDefaultEdge = {
    type: 'graphin-line' // as any // forcing type since Graphin has an opinion for some reason
};

const FORCE_LAYOUT = {
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
        // console.log('layout end');
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RADIAL_LAYOUT = {
    type: 'radial',
    animate: true,
    workerEnabled: true,
    linkDistance: 100,
    unitRadius: 200,
    nodeSize: 40,
    preventOverlap: true
};

const GraphVisualizer: React.FC<IGraphVisualizerProps> = (props) => {
    const { styles } = props;

    // context
    const { graphState } = useGraphContext();

    // hooks
    const graphContainerId = useId('graph-container');

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render', graphState.graphData);

    const height = document.getElementById(graphContainerId)?.scrollHeight;
    return (
        <div className={classNames.root}>
            <div className={classNames.graphContainer} id={graphContainerId}>
                <Graphin
                    data={graphState.graphData}
                    defaultEdge={DEFAULT_EDGE}
                    defaultNode={DEFAULT_NODE}
                    height={height}
                    layout={
                        // { type: 'preset' }
                        FORCE_LAYOUT
                        // RADIAL_LAYOUT
                    }
                >
                    <CustomLassoHandler />
                    <CustomContextMenu />
                    <CustomClickHandler />
                </Graphin>
            </div>
        </div>
    );
};

export default styled<
    IGraphVisualizerProps,
    IGraphVisualizerStyleProps,
    IGraphVisualizerStyles
>(GraphVisualizer, getStyles);
