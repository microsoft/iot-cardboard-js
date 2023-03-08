import React from 'react';
import { Rect, Text, Group } from '@antv/g6-react-node';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomGraphNodeProps } from './CustomGraphNode.types';
import { getStyles } from './CustomGraphNode.styles';

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomGraphNode', debugLogging);

const CustomGraphNode: React.FC<ICustomGraphNodeProps> = (args) => {
    const { data } = args.cfg;

    logDebugConsole('debug', 'Render. {args}', args);

    // const theme = useExtendedTheme();
    const styles = getStyles({ theme: undefined });

    if (!data) {
        return null;
    }

    return (
        <Group draggable>
            <Rect style={styles.rootRect} draggable>
                <Text style={styles.nameText} draggable>
                    {data.name}
                </Text>
                <Text style={styles.idText} draggable>
                    {data.id}
                </Text>
                {/* <DefaultButton
                    text={collapsed ? '-' : '+'}
                    styles={{
                        root: {
                            background: collapsed ? 'blue' : 'red'
                        }
                    }}
                    onClick={(evt, node, shape, graph) => {
                        graph.updateItem(node, {
                            collapsed: !collapsed
                        });
                    }}
                /> */}
                {/* <Circle
                    style={{
                        position: 'absolute',
                        x: 380,
                        y: 20,
                        r: 5,
                        fill: collapsed ? 'blue' : 'green'
                    }}
                >
                    <Text
                        style={{
                            fill: '#fff',
                            fontSize: 10,
                            margin: [-6, -3, 0],
                            cursor: 'pointer'
                        }}
                        onClick={(evt, node, shape, graph) => {
                            graph.updateItem(node, {
                                collapsed: !collapsed
                            });
                        }}
                    >
                        {}
                    </Text>
                </Circle> */}
            </Rect>
        </Group>
    );
};

export default CustomGraphNode;
