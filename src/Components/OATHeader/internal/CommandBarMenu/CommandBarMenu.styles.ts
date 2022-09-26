import {
    ICommandBarMenuStyleProps,
    ICommandBarMenuStyles
} from './CommandBarMenu.types';

export const classPrefix = 'cb-commandbarmenu';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: ICommandBarMenuStyleProps
): ICommandBarMenuStyles => {
    const { menuMinWidth, theme } = props;
    return {
        root: [classNames.root],
        subComponentStyles: {
            callout: {
                root: {
                    backgroundColor: theme.semanticColors.listBackground,
                    borderRadius: '4px',
                    boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'absolute',
                    right: '0px',
                    top: '100%',
                    minWidth: menuMinWidth,
                    width: 'fit-content',
                    zIndex: 1
                }
            },
            menuItemButton: {
                root: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    minWidth: 'max-content',
                    width: '100%',
                    padding: '8px',
                    ':hover': {
                        backgroundColor:
                            theme.semanticColors.primaryButtonTextDisabled
                    }
                }
            },
            menuItemSeparator: {
                root: {
                    padding: 0,
                    height: 0
                }
            }
        }
    };
};
