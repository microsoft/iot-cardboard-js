import {
    FontWeights,
    IButtonStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../Models/Constants';
import {
    ELEMENTS_PANEL_BUTTON_BOTTOM_OFFSET,
    ELEMENTS_PANEL_BUTTON_HEIGHT,
    INITIAL_ELEMENTS_PANEL_LEFT_OFFSET
} from '../../Models/Constants/StyleConstants';

const classPrefix = `${CardboardClassNamePrefix}-elements-panel`;
const classNames = {
    boundaryLayer: `${classPrefix}-boundary-layer`,
    draggable: `${classPrefix}-draggable`,
    container: `${classPrefix}-container`,
    list: `${classPrefix}-list`,
    header: `${classPrefix}-header`,
    title: `${classPrefix}-title`,
    filterBox: `${classPrefix}-filterBox`,
    statusLine: `${classPrefix}-status-line`,
    alertCircle: `${classPrefix}-alert-circle`,
    listItembutton: `${classPrefix}--list-item-button`
};

const INITIAL_ELEMENTS_PANEL_TOP_OFFSET = 64;
const PANEL_BOTTOM_OFFSET =
    ELEMENTS_PANEL_BUTTON_HEIGHT + ELEMENTS_PANEL_BUTTON_BOTTOM_OFFSET + 8;

export const getElementsPanelStyles = () => {
    return mergeStyleSets({
        boundaryLayer: [
            classNames.boundaryLayer,
            {
                height: `calc(100% - ${INITIAL_ELEMENTS_PANEL_TOP_OFFSET}px)`,
                left: 0,
                pointerEvents: 'none',
                position: 'absolute',
                top: INITIAL_ELEMENTS_PANEL_TOP_OFFSET,
                width: '100%',
                zIndex: 1000
            } as IStyle
        ],
        draggable: [
            classNames.draggable,
            {
                bottom: PANEL_BOTTOM_OFFSET,
                left: INITIAL_ELEMENTS_PANEL_LEFT_OFFSET
            } as IStyle
        ],
        modalContainer: [
            classNames.container,
            {
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'stretch',
                width: 340,
                height: 'calc(100% - 80px)',
                backgroundColor: 'var(--cb-color-glassy-modal)',
                backdropFilter: 'blur(24px) brightness(150%)',
                borderRadius: 2,
                border: `1px solid var(--cb-color-modal-border)`,
                cursor: 'move',
                position: 'absolute',
                pointerEvents: 'auto'
            } as IStyle
        ],
        header: [
            classNames.header,
            {
                display: 'flex',
                alignItems: 'center',
                padding: '20px'
            } as IStyle
        ],
        title: [
            classNames.title,
            {
                flexGrow: 1,
                fontSize: 14,
                lineHeight: 20,
                paddingLeft: 8,
                fontWeight: 600
            } as IStyle
        ],
        filterBox: [
            classNames.filterBox,
            {
                margin: '0 20px 12px',
                minHeight: 32
            } as IStyle
        ],
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
                    width: 3,
                    height: 12,
                    borderRadius: 5,
                    boxShadow: `0px 0px 4px ${statusColor}`,
                    background: statusColor,
                    marginRight: 1
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
                    width: 20,
                    height: 20,
                    borderRadius: 30,
                    backgroundColor: alertColor,
                    flexShrink: 0,
                    margin: `0 8px 0 10px`,
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
            fontWeight: FontWeights.semibold
        }
    } as IButtonStyles,
    alertButton: {
        root: {
            background: 'transparent'
        }
    } as IButtonStyles
}));
