import React, { ReactNode, useEffect, useRef } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { createNodeFromReact } from '@antv/g6-react-node';
import Graphin from '@antv/graphin';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../Models/Services/Utils';
import {
    ISampleGraphProps,
    ISampleGraphStyleProps,
    ISampleGraphStyles
} from './SampleGraph.types';
import { getStyles } from './SampleGraph.styles';
import CustomGraphNode from './Internal/CustomGraphNode/CustomGraphNode';
import { ICustomGraphData, ICustomNodeConfig } from './GraphTypes.types';
import { CustomNode } from './Internal/CustomNode';
import CustomLassoHandler from './Hooks/CustomLassoHandler/CustomLassoHandler';
import CustomContextMenu from './Internal/CustomContextMenu/CustomContextMenu';
import CustomClickHandler from './Hooks/CustomClickHandler/CustomClickHandler';
import { AddNodes } from './SampleGraph.utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('SampleGraph', debugLogging);

const getClassNames = classNamesFunction<
    ISampleGraphStyleProps,
    ISampleGraphStyles
>();

const CUSTOM_NODE_NAME = 'react-node';

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
        console.log('layout end');
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

const SampleGraph = <N extends object>(
    props: ISampleGraphProps<N> & { children?: ReactNode }
) => {
    const { nodes, styles } = props;

    // context

    // hooks
    const graphContainerId = useId('graph-container');

    const data: ICustomGraphData<N> = {
        edges: [],
        nodes: []
    };
    nodes.forEach((model) => {
        AddNodes(model, data);
    });

    // contexts

    // state
    const isMounted = useRef(false);

    // hooks

    // callbacks

    // side effects
    useEffect(() => {
        if (!isMounted.current) {
            const node = createNodeFromReact(CustomGraphNode);
            node.linkPoints = {
                top: true,
                bottom: true,
                fill: '#fff'
            };
            const nodeToRegiser = CustomNode;
            Graphin.registerNode(CUSTOM_NODE_NAME, nodeToRegiser, 'rect');
            console.log('registering node', nodeToRegiser);
            isMounted.current = true;
        }
    }, []);

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
                    // defaultEdge={DEFAULT_EDGE}
                    // defaultNode={DEFAULT_NODE}
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
                    {/* <CustomLegend />
                    <CreateEdge
                        active={false}
                        onClick={() => {
                            alert('clicked');
                        }}
                    /> */}
                </Graphin>
            </div>
        </div>
    );
};

export default styled<
    ISampleGraphProps<any>,
    ISampleGraphStyleProps,
    ISampleGraphStyles
>(SampleGraph, getStyles);
