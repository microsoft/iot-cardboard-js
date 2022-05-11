import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-graph-viewer`;
const classNames = {
    container: `${classPrefix}-container`,
    node: `${classPrefix}-node`,
    handle: `${classPrefix}-handle`,
    componentHandle: `${classPrefix}-component-handle`,
    relationshipHandle: `${classPrefix}-relationship-handle`,
    extendHandle: `${classPrefix}-extend-handle`,
    edgePath: `${classPrefix}-edge-path`,
    textPath: `${classPrefix}-text-path`,
    textEdit: `${classPrefix}-text-edit`,
    nodeCancel: `${classPrefix}-node-cancel`,
    componentPath: `${classPrefix}-component-path`,
    componentShape: `${classPrefix}-component-shape`,
    inheritancePath: `${classPrefix}-inheritance-path`,
    inheritanceShape: `${classPrefix}-inheritance-shape`,
    nodeContainer: `${classPrefix}-node-container`
};

export const getGraphViewerStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                background: theme.semanticColors.bodyBackground,
                height: '80vh'
            } as IStyle
        ],
        node: [
            classNames.node,
            {
                background: theme.palette.neutralLight,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '5px',
                fontSize: FontSizes.size12,
                textAlign: 'center',
                width: '120%'
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
        textPath: [
            classNames.textPath,
            {
                fontSize: FontSizes.size12,
                fill: theme.semanticColors.bodyText
            } as IStyle
        ],
        textEdit: [
            classNames.textEdit,
            {
                fontSize: FontSizes.size12,
                color: theme.semanticColors.bodyText,
                background: theme.semanticColors.bodyBackground
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
        ],
        nodeContainer: [
            classNames.nodeContainer,
            { display: 'grid', gridTemplateColumns: '10% 90%' } as IStyle
        ]
    });
};

export const getGraphViewerButtonStyles = () => {
    return {
        root: {
            zIndex: '100'
        }
    } as Partial<IStyle>;
};

export const getGraphViewerIconStyles = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size18,
            color: theme.semanticColors.actionLink
        }
    } as Partial<IStyle>;
};

export const getGraphViewerActionButtonStyles = () => {
    return {
        root: {
            height: FontSizes.size12,
            float: 'right'
        }
    } as Partial<IStyle>;
};

export const getGraphViewerWarningStyles = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size10,
            color: theme.semanticColors.severeWarningIcon
        }
    } as Partial<IStyle>;
};
