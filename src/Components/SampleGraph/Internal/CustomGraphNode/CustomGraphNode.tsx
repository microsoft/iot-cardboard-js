import React from 'react';
import { Rect, Text, Group } from '@antv/g6-react-node';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICustomGraphNodeProps } from './CustomGraphNode.types';
import { getStyles } from './CustomGraphNode.styles';

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomGraphNode', debugLogging);

const CustomGraphNode: React.FC<ICustomGraphNodeProps> = (args) => {
    const { data } = args.cfg;

    logDebugConsole('debug', 'Render. {data}', data);

    // const theme = useExtendedTheme();
    const styles = getStyles({ theme: undefined });

    if (!data) {
        logDebugConsole('warn', 'No data found for node, will not render');
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
            </Rect>
        </Group>
    );
};

export default CustomGraphNode;
