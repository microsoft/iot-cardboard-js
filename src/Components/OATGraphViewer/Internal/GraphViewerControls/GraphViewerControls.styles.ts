import {
    IGraphViewerControlsStyleProps,
    IGraphViewerControlsStyles
} from './GraphViewerControls.types';
import { CardboardClassNamePrefix } from '../../../../Models/Constants/Constants';
import { HEADER_BUTTON_HEIGHT } from '../../../../Models/Constants/StyleConstants';
import {
    CONTROLS_BOTTOM_OFFSET,
    CONTROLS_SIDE_OFFSET,
    CONTROLS_Z_INDEX,
    getControlBackgroundColor
} from '../../../../Models/Constants/OatStyleConstants';

export const classPrefix = `${CardboardClassNamePrefix}-graph-viewer-controls`;
const classNames = {
    root: `${classPrefix}-root`,
    builtInControls: `${classPrefix}-built-in-controls`
};
export const getStyles = (
    props: IGraphViewerControlsStyleProps
): IGraphViewerControlsStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                display: 'grid',
                gridTemplateColumns: `0.5fr 1fr 0.5fr`,
                left: CONTROLS_SIDE_OFFSET,
                bottom: CONTROLS_BOTTOM_OFFSET,
                position: 'absolute',
                width: '100%',
                zIndex: CONTROLS_Z_INDEX
            }
        ],
        graphBuiltInControls: [
            classNames.builtInControls,
            {
                alignItems: 'center',
                display: 'flex',
                backgroundColor: theme.semanticColors.buttonBackground,
                border: `1px solid ${theme.palette.neutralLight} !important`,
                borderRadius: 4,
                '.react-flow__controls-button': {
                    background: theme.semanticColors.buttonBackground,
                    border: `1px solid ${theme.semanticColors.buttonBackground}`,
                    borderRadius: 4,
                    color: theme.semanticColors.bodyText,
                    // remove border for the groups
                    height: HEADER_BUTTON_HEIGHT - 4,
                    width: HEADER_BUTTON_HEIGHT - 4,
                    padding: 0,
                    ':hover': {
                        background:
                            theme.semanticColors.buttonBackgroundHovered,
                        border: `1px solid ${theme.palette.neutralSecondary}`
                    },
                    ':focused': {
                        background:
                            theme.semanticColors.buttonBackgroundHovered,
                        border: `1px solid ${theme.palette.neutralSecondary}`
                    },
                    ':active': {
                        background: theme.semanticColors.buttonBackgroundPressed
                    },
                    '& svg': {
                        fill: theme.semanticColors.bodyText
                    }
                }
            }
        ],
        subComponentStyles: {
            controlButton: {
                subComponentStyles: {
                    button: {
                        rootChecked: {
                            backgroundColor: getControlBackgroundColor(theme)
                        }
                    }
                }
            },
            controlsStack: {
                root: {
                    justifyContent: 'center',
                    '> .react-flow__controls': {
                        position: 'unset',
                        left: 'unset'
                    }
                }
            }
        }
    };
};
