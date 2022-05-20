import { IStyle, mergeStyleSets, useTheme, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-graph-viewer`;
const classNames = {
    container: `${classPrefix}-container`,
    node: `${classPrefix}-node`,
    handle: `${classPrefix}-handle`,
    componentHandleFocus: `${classPrefix}-component-handle-focus`,
    componentHandleHidden: `${classPrefix}-component-handle-hidden`,
    relationshipHandleFocus: `${classPrefix}-relationship-handle-focus`,
    relationshipHandleHidden: `${classPrefix}-relationship-handle-hidden`,
    extendHandleFocus: `${classPrefix}-extend-handle-focus`,
    extendHandleHidden: `${classPrefix}-extend-handle-hidden`,
    untargetRelationshipHandleFocus: `${classPrefix}-untargeted-handle-focus`,
    untargetRelationshipHandleHidden: `${classPrefix}-untargeted-handle-hidden`,
    edgePath: `${classPrefix}-edge-path`,
    widthPath: `${classPrefix}-width-path`,
    textPath: `${classPrefix}-text-path`,
    textEdit: `${classPrefix}-text-edit`,
    nodeCancel: `${classPrefix}-node-cancel`,
    edgeCancel: `${classPrefix}-edge-cancel`,
    componentPath: `${classPrefix}-component-path`,
    componentShape: `${classPrefix}-component-shape`,
    inheritancePath: `${classPrefix}-inheritance-path`,
    inheritanceShape: `${classPrefix}-inheritance-shape`,
    nodeContainer: `${classPrefix}-node-container`,
    graphViewerControls: `${classPrefix}-graph-viewer-controls`
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
                background: 'transparent !Important',
                border: '0px !Important',
                left: '60% !Important',
                top: '50% !Important'
            } as IStyle
        ],
        componentHandleFocus: [
            classNames.componentHandleFocus,
            {
                left: '20% !Important',
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        componentHandleHidden: [
            classNames.componentHandleHidden,
            {
                left: '60% !Important',
                top: '50% !Important',
                background: 'transparent !Important',
                border: '0px !Important'
            } as IStyle
        ],
        relationshipHandleFocus: [
            classNames.relationshipHandleFocus,
            {
                left: '45% !Important',
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        relationshipHandleHidden: [
            classNames.relationshipHandleHidden,
            {
                left: '60% !Important',
                top: '50% !Important',
                background: 'transparent !Important',
                border: '0px !Important'
            } as IStyle
        ],
        extendHandleFocus: [
            classNames.extendHandleFocus,
            {
                left: '100% !Important',
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        extendHandleHidden: [
            classNames.extendHandleHidden,
            {
                left: '60% !Important',
                top: '50% !Important',
                background: 'transparent !Important',
                border: '0px !Important'
            } as IStyle
        ],
        untargetRelationshipHandleFocus: [
            classNames.untargetRelationshipHandleFocus,
            {
                left: '70% !Important',
                background: theme.semanticColors.variantBorder
            } as IStyle
        ],
        untargetRelationshipHandleHidden: [
            classNames.untargetRelationshipHandleHidden,
            {
                left: '60% !Important',
                top: '50% !Important',
                background: 'transparent !Important',
                border: '0px !Important'
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
                strokeWidth: '10',
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
        ],
        nodeContainer: [
            classNames.nodeContainer,
            { display: 'grid', gridTemplateColumns: '10% 90%' } as IStyle
        ],
        graphViewerControls: [
            classNames.graphViewerControls,
            {
                '& button': {
                    background: theme.semanticColors.primaryButtonBackground,
                    borderColor: theme.semanticColors.primaryButtonTextPressed,
                    ':hover': {
                        background:
                            theme.semanticColors.primaryButtonBackgroundHovered
                    },
                    '& svg': {
                        fill: theme.semanticColors.primaryButtonTextPressed
                    }
                }
            } as IStyle
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
