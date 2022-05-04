import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-graph-viewer`;
const classNames = {
    container: `${classPrefix}-container`,
    button: `${classPrefix}-button`,
    node: `${classPrefix}-node`,
    handle: `${classPrefix}-handle`,
    componentHandle: `${classPrefix}-component-handle`,
    relationshipHandle: `${classPrefix}-relationship-handle`,
    extendHandle: `${classPrefix}-extend-handle`,
    edgePath: `${classPrefix}-edge-path`,
    widthPath: `${classPrefix}-width-path`,
    textPath: `${classPrefix}-text-path`,
    nodeCancel: `${classPrefix}-node-cancel`,
    edgeCancel: `${classPrefix}-edge-cancel`,
    componentPath: `${classPrefix}-component-path`,
    componentShape: `${classPrefix}-component-shape`,
    inheritancePath: `${classPrefix}-inheritance-path`,
    inheritanceShape: `${classPrefix}-inheritance-shape`
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
        componentHandle: [
            classNames.componentHandle,
            {
                left: '16.5% !Important',
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        relationshipHandle: [
            classNames.relationshipHandle,
            {
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        extendHandle: [
            classNames.extendHandle,
            {
                left: '83.5% !Important',
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        edgePath: [
            classNames.edgePath,
            {
                stroke: theme.palette.yellow,
                strokeWidth: '1',
                fill: 'none'
            } as IStyle
        ],
        widthPath: [
            classNames.widthPath,
            {
                stroke: theme.semanticColors.bodyBackground,
                strokeWidth: '5',
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
        ],
        edgeCancel: [
            classNames.edgeCancel,
            {
                height: FontSizes.size12,
                float: 'right'
            } as IStyle
        ],
        componentPath: [
            classNames.componentPath,
            {
                stroke: theme.palette.blue,
                strokeWidth: '1',
                fill: 'none'
            } as IStyle
        ],
        componentShape: [
            classNames.componentShape,
            {
                stroke: theme.palette.blue,
                strokeWidth: '1',
                fill: theme.palette.blue
            } as IStyle
        ],
        inheritanceShape: [
            classNames.inheritanceShape,
            {
                stroke: theme.palette.green,
                strokeWidth: '1',
                fill: theme.semanticColors.bodyBackground
            } as IStyle
        ],
        inheritancePath: [
            classNames.inheritancePath,
            {
                stroke: theme.palette.green,
                strokeWidth: '1',
                fill: 'none'
            } as IStyle
        ]
    });
};
