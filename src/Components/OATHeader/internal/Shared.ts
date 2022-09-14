import { IStyle } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants/Constants';

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
