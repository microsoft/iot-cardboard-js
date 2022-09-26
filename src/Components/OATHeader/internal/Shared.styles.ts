import { IStyle } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants/Constants';
import { ISubMenuStyleProps, ISubMenuStyles } from './Shared.types';

const classPrefix = `${CardboardClassNamePrefix}-file-sub-menu`;
const classNames = {
    modalRow: `${classPrefix}-modal-row`,
    modalRowFlexCenter: `${classPrefix}-modal-row-flex-center`,
    modalRowFlexEnd: `${classPrefix}-modal-row-flex-end`
};
export const getCommonModalStyles = () => ({
    modalRow: [
        classNames.modalRow,
        {
            display: 'grid',
            width: '100%',
            gridTemplateColumns: '35% 65%',
            alignItems: 'center',
            marginBottom: '15px',
            '& div:not(:last-of-type)': {
                marginRight: '10px'
            }
        } as IStyle
    ],
    modalRowFlexEnd: [
        classNames.modalRowFlexEnd,
        {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: '15px',
            width: '100%',
            '& button:not(:last-of-type)': {
                marginRight: '10px'
            }
        } as IStyle
    ],
    modalRowCenterItem: [
        classNames.modalRowFlexCenter,
        {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '25px',
            width: '100%',
            '& button:not(:last-of-type)': {
                marginRight: '10px'
            }
        } as IStyle
    ]
});

export const getSubMenuStyles = (props: ISubMenuStyleProps): ISubMenuStyles => {
    const { isMenuOpen, theme } = props;
    return {
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
    };
};
