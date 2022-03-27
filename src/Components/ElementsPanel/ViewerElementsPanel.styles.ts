import {
    IButtonStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-elements-panel`;
const classNames = {
    list: `${classPrefix}-list`,
    statusLine: `${classPrefix}-status-line`,
    alertCircle: `${classPrefix}-alert-circle`,
    listItembutton: `${classPrefix}--list-item-button`
};

export const getElementsPanelStyles = () => {
    return mergeStyleSets({
        container: {
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--cb-color-glassy-modal)',
            backdropFilter: 'blur(24px) brightness(150%)',
            borderRadius: 2,
            border: '1px solid var(--cb-color-modal-border)'
        } as IStyle,
        header: {
            display: 'flex',
            alignItems: 'center',
            padding: '20px'
        } as IStyle,
        title: {
            flexGrow: 1,
            fontSize: 14,
            lineHeight: 20,
            paddingLeft: 8,
            fontWeight: 600
        } as IStyle,
        searchBox: {
            margin: '0 20px 12px',
            minHeight: 32
        } as IStyle,
        list: [
            classNames.list,
            {
                width: '100%',
                fontSize: 14,
                flexGrow: 1,
                overflowY: 'auto'
            } as IStyle
        ],
        listItembutton: [
            classNames.listItembutton,
            {
                background: 'transparent'
            } as IStyle
        ]
    });
};

export const getElementsPanelStatusStyles = memoizeFunction(
    (statusColor: string) => {
        return mergeStyleSets({
            statusLine: [
                classNames.statusLine,
                {
                    width: 5,
                    height: 3,
                    boxShadow: `0px 0px 4px ${statusColor}`,
                    background: statusColor,
                    marginRight: 1
                } as IStyle
            ]
        });
    }
);

export const getElementsPanelAlertStyles = memoizeFunction(
    (alertColor: string, isForPopover = false) => {
        return mergeStyleSets({
            alertCircle: [
                classNames.alertCircle,
                {
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    backgroundColor: alertColor,
                    margin: `0 8px 0 ${isForPopover ? '10px' : '30px'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } as IStyle
            ]
        });
    }
);

export const getElementsPanelButtonSyles = memoizeFunction(() => ({
    elementButton: {
        root: {
            background: 'transparent',
            padding: '12px 20px 12px 10px',
            fontWeight: 500
        }
    } as IButtonStyles,
    alertButton: {
        root: {
            background: 'transparent',
            padding: '8px 20px'
        }
    } as IButtonStyles
}));
