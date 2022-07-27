import {
    IStyle,
    mergeStyleSets,
    useTheme,
    FontSizes,
    IButtonStyles,
    IStyleFunctionOrObject,
    ILabelStyleProps,
    ILabelStyles,
    IStackProps,
    IButtonProps,
    IIconStyles,
    ITextFieldStyles
} from '@fluentui/react';
import { CSSProperties } from 'react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-oat-graph-viewer`;
const classNames = {
    container: `${classPrefix}-container`,
    loadingOverlay: `${classPrefix}-loading-overlay`,
    node: `${classPrefix}-node`,
    selectedNode: `${classPrefix}-selected-node`,
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
    selectedEdgePath: `${classPrefix}-selected-edge-path`,
    widthPath: `${classPrefix}-width-path`,
    textPath: `${classPrefix}-text-path`,
    textEdit: `${classPrefix}-text-edit`,
    nodeCancel: `${classPrefix}-node-cancel`,
    edgeCancel: `${classPrefix}-edge-cancel`,
    componentPath: `${classPrefix}-component-path`,
    selectedComponentPath: `${classPrefix}-selected-component-path`,
    componentShape: `${classPrefix}-component-shape`,
    inheritancePath: `${classPrefix}-inheritance-path`,
    selectedInheritancePath: `${classPrefix}-selected-inheritance-path`,
    inheritanceShape: `${classPrefix}-inheritance-shape`,
    nodeContainer: `${classPrefix}-node-container`,
    untargetedNodeContainer: `${classPrefix}-untargeted-node-container`,
    graphViewerControls: `${classPrefix}-graph-viewer-controls`,
    graphViewerFiltersWrap: `${classPrefix}-graph-viewer-filters-wrap`,
    graphViewerForceLayoutWrap: `${classPrefix}-graph-viewer-force-layout-wrap`,
    graphViewerFiltersKey: `${classPrefix}-graph-viewer-filters-key`,
    extendCancel: `${classPrefix}-extend-cancel`,
    relationshipCTASection: `${classPrefix}-node-container-cta-section`,
    relationshipNameEditorBody: `${classPrefix}-relationship-name-editor-body`,
    handleContentExtend: `${classPrefix}-handle-content-extend`,
    handleContentRelationship: `${classPrefix}-handle-content-relationship`,
    handleContentUntargeted: `${classPrefix}-handle-content-untargeted`,
    handleContentComponent: `${classPrefix}-handle-content-component`,
    handleContentHidden: `${classPrefix}-handle-content-hidden`,
    handleContentIcon: `${classPrefix}-handle-content-icon`,
    handleContentIconHidden: `${classPrefix}-handle-content-icon-hidden`,
    placeholderText: `${classPrefix}-placeholder-text`
};

export const getGraphViewerStyles = () => {
    const theme = useTheme();
    return mergeStyleSets({
        container: [
            classNames.container,
            {
                background: theme.semanticColors.bodyBackground,
                height: 'auto',
                position: 'relative',
                [`& .${classNames.handle}`]: {
                    background: 'transparent',
                    border: '0px',
                    left: '50%',
                    top: '50%'
                },
                [`& .${classNames.componentHandleFocus}`]: {
                    left: '80%',
                    background: theme.semanticColors.variantBorder,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '14px',
                    minHeight: '14px',
                    top: '50px',
                    ':hover': {
                        minWidth: '18px',
                        minHeight: '18px',
                        top: '49px',
                        '& svg': {
                            pointerEvents: 'none'
                        }
                    }
                },
                [`& .${classNames.componentHandleHidden}`]: {
                    left: '80%',
                    top: '50%',
                    background: 'transparent',
                    border: '0px'
                },
                [`& .${classNames.relationshipHandleFocus}`]: {
                    left: '20%',
                    background: theme.semanticColors.variantBorder,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '14px',
                    minHeight: '14px',
                    top: '50px',
                    ':hover': {
                        minWidth: '18px',
                        minHeight: '18px',
                        top: '49px',
                        '& svg': {
                            pointerEvents: 'none'
                        }
                    }
                },
                [`& .${classNames.relationshipHandleHidden}`]: {
                    left: '60%',
                    top: '50%',
                    background: 'transparent',
                    border: '0px'
                },
                [`& .${classNames.extendHandleFocus}`]: {
                    left: '60%',
                    background: theme.semanticColors.variantBorder,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '14px',
                    minHeight: '14px',
                    top: '50px',
                    ':hover': {
                        minWidth: '18px',
                        minHeight: '18px',
                        top: '49px',
                        '& svg': {
                            pointerEvents: 'none'
                        }
                    }
                },
                [`& .${classNames.extendHandleHidden}`]: {
                    left: '60%',
                    top: '50%',
                    background: 'transparent',
                    border: '0px'
                },
                [`& .${classNames.untargetRelationshipHandleFocus}`]: {
                    left: '40%',
                    background: theme.semanticColors.variantBorder,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: '14px',
                    minHeight: '14px',
                    top: '50px',
                    ':hover': {
                        minWidth: '18px',
                        minHeight: '18px',
                        top: '49px',
                        '& svg': {
                            pointerEvents: 'none'
                        }
                    }
                },
                [`& .${classNames.untargetRelationshipHandleHidden}`]: {
                    left: '40%',
                    top: '50%',
                    background: 'transparent',
                    border: '0px'
                }
            } as IStyle
        ],
        placeholderText: [
            classNames.placeholderText,
            {
                color: theme.semanticColors.inputPlaceholderText,
                opacity: '.9'
            } as IStyle
        ],
        loadingOverlay: [
            classNames.loadingOverlay,
            {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 101,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            } as IStyle
        ],
        handleContentRelationship: [
            classNames.handleContentRelationship,
            {
                background: '#FAAE00',
                width: '8px',
                height: '8px',
                borderRadius: '50%'
            } as IStyle
        ],
        handleContentUntargeted: [
            classNames.handleContentUntargeted,
            {
                background: '#FAAE00',
                width: '8px',
                height: '8px',
                borderRadius: '50%'
            } as IStyle
        ],
        handleContentExtend: [
            classNames.handleContentExtend,
            {
                background: '#1E8741',
                width: '8px',
                height: '8px',
                borderRadius: '50%'
            } as IStyle
        ],
        handleContentComponent: [
            classNames.handleContentComponent,
            {
                background: '#247CD2',
                width: '8px',
                height: '8px',
                borderRadius: '50%'
            } as IStyle
        ],
        handleContentIcon: [
            classNames.handleContentIcon,
            {
                padding: '2px'
            } as IStyle
        ],
        handleContentIconHidden: [
            classNames.handleContentIconHidden,
            {
                width: 0,
                height: 0,
                pointerEvents: 'none',
                opacity: 0,
                padding: 0
            } as IStyle
        ],
        handleContentHidden: [
            classNames.handleContentHidden,
            {
                background: 'transparent',
                opacity: 0
            } as IStyle
        ],
        node: [
            classNames.node,
            {
                background: theme.palette.neutralLight,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '5px',
                fontSize: FontSizes.size12,
                position: 'relative',
                paddingRight: '20px' // Provide space for close icon
            } as IStyle
        ],
        selectedNode: [
            classNames.selectedNode,
            {
                background: theme.palette.neutralLight,
                border: `3px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '5px',
                fontSize: FontSizes.size12,
                position: 'relative',
                paddingRight: '20px' // Provide space for close icon
            } as IStyle
        ],
        handle: [classNames.handle],
        componentHandleFocus: [classNames.componentHandleFocus],
        componentHandleHidden: [classNames.componentHandleHidden],
        relationshipHandleFocus: [classNames.relationshipHandleFocus],
        relationshipHandleHidden: [classNames.relationshipHandleHidden],
        extendHandleFocus: [classNames.extendHandleFocus],
        extendHandleHidden: [classNames.extendHandleHidden],
        untargetRelationshipHandleFocus: [
            classNames.untargetRelationshipHandleFocus
        ],
        untargetRelationshipHandleHidden: [
            classNames.untargetRelationshipHandleHidden
        ],
        edgePath: [
            classNames.edgePath,
            {
                stroke: theme.palette.yellow,
                strokeWidth: '1',
                fill: 'none'
            } as IStyle
        ],
        selectedEdgePath: [
            classNames.selectedEdgePath,
            {
                stroke: theme.palette.yellow,
                strokeWidth: '3',
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
        edgeCancel: [
            classNames.edgeCancel,
            {
                height: FontSizes.size12,
                float: 'right',
                padding: 0
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
        selectedComponentPath: [
            classNames.selectedComponentPath,
            {
                stroke: theme.palette.blue,
                strokeWidth: '3',
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
        selectedInheritancePath: [
            classNames.selectedInheritancePath,
            {
                stroke: theme.palette.green,
                strokeWidth: '3',
                fill: 'none'
            } as IStyle
        ],
        nodeContainer: [
            classNames.nodeContainer,
            {
                alignItems: 'center',
                display: 'grid',
                gridTemplateColumns: '50px auto',
                span: {
                    padding: '5px 0px'
                },
                padding: '0 5px'
            } as IStyle
        ],
        relationshipCTASection: [
            classNames.relationshipCTASection,
            {
                position: 'absolute',
                top: '2px',
                right: '2px'
            } as IStyle
        ],
        relationshipNameEditorBody: [
            classNames.relationshipNameEditorBody,
            { position: 'relative' } as IStyle
        ],
        untargetedNodeContainer: [
            classNames.untargetedNodeContainer,
            {
                label: {
                    overflowWrap: 'normal'
                }
            } as IStyle
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
        ],
        graphViewerFiltersWrap: [
            classNames.graphViewerFiltersWrap,
            {
                display: 'flex',
                flexDirection: 'column',
                background: theme.palette.neutralLight,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '5px',
                fontSize: FontSizes.size12,
                textAlign: 'center',
                width: '180px',
                padding: '10px',
                zIndex: '100',
                height: 'fit-content'
            } as IStyle
        ],
        graphViewerForceLayoutWrap: [
            classNames.graphViewerForceLayoutWrap,
            {
                display: 'flex',
                flexDirection: 'column',
                background: theme.palette.neutralLight,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '5px',
                fontSize: FontSizes.size12,
                textAlign: 'center',
                width: '34px',
                zIndex: '100',
                height: 'fit-content'
            } as IStyle
        ],
        graphViewerFiltersKey: [
            classNames.graphViewerFiltersKey,
            {
                zIndex: '100',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                '& svg': {
                    minWidth: '28px',
                    width: '28px',
                    marginRight: '10px'
                },
                '& span.rel-title': {
                    marginRight: '10px',
                    minWidth: '70px'
                },
                '& div.ms-Toggle': {
                    marginBottom: '0'
                }
            } as IStyle
        ],
        extendCancel: [
            classNames.extendCancel,
            {
                height: FontSizes.size12,
                padding: 0
            } as IStyle
        ]
    });
};

export const getGraphViewerButtonStyles = () => {
    return {
        root: {
            zIndex: '100',
            marginBottom: '8px'
        }
    } as Partial<IButtonStyles>;
};

export const getGraphViewerIconStyles = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size10,
            color: theme.semanticColors.actionLink
        }
    } as Partial<IIconStyles>;
};

export const getGraphViewerActionButtonStyles = () => {
    return {
        root: {
            height: FontSizes.size12,
            float: 'right',
            position: 'absolute',
            top: '8px',
            right: '0'
        }
    } as IButtonProps;
};

export const getGraphViewerWarningStyles = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size10,
            color: theme.semanticColors.severeWarningIcon
        }
    } as IStyleFunctionOrObject<ILabelStyleProps, ILabelStyles>;
};

export const getGraphViewerMinimapStyles = () => {
    const theme = useTheme();
    return {
        background: theme.semanticColors.bodyBackground
    } as CSSProperties;
};

export const getGraphViewerFiltersStyles = () => {
    return {
        root: {
            position: 'absolute',
            top: '10px',
            right: '10px'
        }
    } as IStackProps;
};

export const getGraphForceLayoutStyles = () => {
    return {
        root: {
            position: 'absolute',
            top: '110px',
            right: '10px'
        }
    } as IStackProps;
};

export const getRelationshipTextFieldStyles = () => {
    const theme = useTheme();
    return {
        root: {
            fontSize: FontSizes.size12,
            color: theme.semanticColors.bodyText,
            background: theme.semanticColors.bodyBackground
        }
    } as Partial<ITextFieldStyles>;
};
