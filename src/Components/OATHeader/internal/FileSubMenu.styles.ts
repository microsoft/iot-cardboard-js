import { IStyle, FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants';
import {
    IFileSubMenuStyleProps,
    IFileSubMenuStyles
} from './FileSubMenu.types';

const classPrefix = `${CardboardClassNamePrefix}-file-sub-menu`;
const classNames = {
    root: `${classPrefix}-root`,
    searchComponent: `${classPrefix}-search-component`,
    logo: `${classPrefix}-logo`,
    search: `${classPrefix}-search`,
    options: `${classPrefix}-options`,
    menuComponent: `${classPrefix}-menu-component`,
    optionIcon: `${classPrefix}-option-icon`,
    listSubMenu: `${classPrefix}-list-sub-menu`,
    listSubMenuItem: `${classPrefix}-list-sub-menu-item`,
    modal: `${classPrefix}-modal`,
    modalRow: `${classPrefix}-modal-row`,
    modalRowFlexEnd: `${classPrefix}-modal-row-flex-end`,
    uploadDirectoryInput: `${classPrefix}-upload-directory-input`
};
export const getStyles = (
    props: IFileSubMenuStyleProps
): IFileSubMenuStyles => {
    const { isMenuOpen, theme } = props;
    return {
        modal: [
            classNames.modal,
            {
                border: `1px solid ${theme.semanticColors.variantBorder}`,
                borderRadius: '2px',
                padding: '15px 25px',
                minWidth: '600px'
            } as IStyle
        ],
        subComponentStyles: {
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
            subMenuCallout: {
                root: isMenuOpen
                    ? {
                          position: 'absolute',
                          backgroundColor: theme.semanticColors.listBackground,
                          boxShadow: '0px 5px 10px 1px rgba(0,0,0,0.2)',
                          zIndex: 1,
                          right: '0px',
                          top: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '4px',
                          width: '400px'
                      }
                    : {
                          root: {
                              pointerEvents: 'none',
                              opacity: 0,
                              visibility: 'hidden'
                          }
                      }
            }
        }
    };
};
