import {
    IPivotStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { leftPanelPivotStyles } from '../Shared/LeftPanel.styles';

const classPrefix = 'form';
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`,
    header: `${classPrefix}-header`,
    pivot: `${classPrefix}-pivot`
};
export const getPanelFormStyles = memoizeFunction(
    (_theme: Theme, formHeaderHeight: number) => {
        const breadcrumbHeight = '40px';
        return mergeStyleSets({
            root: [
                classNames.root,
                {
                    display: 'flex',
                    flexDirection: 'column',
                    height: `calc(100% - ${breadcrumbHeight})`,
                    justifyContent: 'space-between',
                    width: '100%'
                } as IStyle
            ],
            content: [
                classNames.content,
                {
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative'
                } as IStyle
            ],
            header: [
                classNames.header,
                {
                    overflow: 'hidden',
                    padding: '0 0 4px'
                } as IStyle
            ],
            pivot: [
                classNames.pivot,
                { height: `calc(100% - ${formHeaderHeight}px)` } as IStyle
            ]
        });
    }
);
const pivotTabsHeight = 44;
export const panelFormPivotStyles: Partial<IPivotStyles> = {
    root: leftPanelPivotStyles.root,
    itemContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: `calc(100% - ${pivotTabsHeight}px)`,
        overflow: 'auto'
    }
};
