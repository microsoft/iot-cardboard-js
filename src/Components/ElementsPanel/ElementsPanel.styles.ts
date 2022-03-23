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
            background: 'transparent',
            height: '100%'
        } as IStyle,
        containerBackdrop: {
            position: 'absolute',
            zIndex: -1,
            background: 'var(--cb-color-overlay-modal-bg)',
            backdropFilter: 'blur(24px) brightness(150%)',
            width: '100%',
            height: '100%'
        } as IStyle,
        header: {
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px 0px'
        } as IStyle,
        title: {
            flexGrow: 1,
            fontSize: 14,
            lineHeight: 20,
            paddingLeft: 6,
            fontWeight: 600
        } as IStyle,
        separator: {
            padding: 0
        } as IStyle,
        searchBox: {
            flex: 1,
            margin: '0 20px 12px'
        } as IStyle,
        list: [
            classNames.list,
            {
                width: '100%',
                fontSize: 14
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
                    background: statusColor
                } as IStyle
            ]
        });
    }
);

export const getElementsPanelAlertStyles = memoizeFunction(
    (alertColor: string) => {
        return mergeStyleSets({
            alertCircle: [
                classNames.alertCircle,
                {
                    width: 24,
                    height: 24,
                    borderRadius: 30,
                    backgroundColor: alertColor,
                    margin: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } as IStyle
            ]
        });
    }
);

export const getElementsPanelButtonSyles = memoizeFunction(
    () =>
        ({
            root: {
                background: 'transparent',
                fontWeight: 600,
                padding: '8px 20px'
            }
        } as IButtonStyles)
);
