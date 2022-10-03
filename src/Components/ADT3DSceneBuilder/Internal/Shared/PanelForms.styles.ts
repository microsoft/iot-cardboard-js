import {
    IPivotStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { leftPanelBuilderBlock } from '../../../../Resources/Styles/BaseStyles';
import { leftPanelPivotStyles } from '../Shared/LeftPanel.styles';

const classPrefix = 'form';
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`,
    header: `${classPrefix}-header`,
    expandedSection: `${classPrefix}-expandedSection`
};
export const getPanelFormStyles = memoizeFunction(
    (_theme: Theme, formHeaderHeight: number, shouldPadContent = false) => {
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
                ...(shouldPadContent ? [leftPanelBuilderBlock] : []),
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
                    padding: '0 16px 4px'
                } as IStyle
            ],
            expandedSection: [
                classNames.expandedSection,
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
