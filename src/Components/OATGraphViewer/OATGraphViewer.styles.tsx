import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-graph-viewer`;
const classNames = {
    container: `${classPrefix}-container`,
    button: `${classPrefix}-button`,
    node: `${classPrefix}-node`,
    handle: `${classPrefix}-handle`,
    edgePath: `${classPrefix}-edge-path`,
    textPath: `${classPrefix}-text-path`,
    nodeCancel: `${classPrefix}-node-cancel`
};

export const getGraphViewerStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                height: '80vh'
            } as IStyle
        ],
        button: [
            classNames.button,
            {
                zIndex: '100'
            } as IStyle
        ],
        node: [
            classNames.node,
            {
                background: theme.palette.neutralLight,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '5px',
                fontSize: FontSizes.size12,
                textAlign: 'center'
            } as IStyle
        ],
        handle: [
            classNames.handle,
            {
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        edgePath: [
            classNames.edgePath,
            {
                stroke: theme.palette.black,
                strokeWidth: '1',
                fill: 'none'
            } as IStyle
        ],
        textPath: [
            classNames.textPath,
            {
                fontSize: FontSizes.size12
            } as IStyle
        ],
        nodeCancel: [
            classNames.nodeCancel,
            {
                height: FontSizes.size12,
                float: 'right'
            } as IStyle
        ]
    });
};
