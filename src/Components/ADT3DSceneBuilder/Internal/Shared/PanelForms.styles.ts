import {
    IPivotStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';
import { leftPanelPivotStyles } from '../Shared/LeftPanel.styles';

export const getFormStyles = memoizeFunction(
    (_theme: Theme, formHeaderHeight: number) => {
        const breadcrumbHeight = '40px';
        return mergeStyleSets({
            root: [
                'formRoot',
                {
                    display: 'flex',
                    flexDirection: 'column',
                    height: `calc(100% - ${breadcrumbHeight})`,
                    justifyContent: 'space-between',
                    width: '100%'
                } as IStyle
            ],
            content: [
                'formContent',
                {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden'
                } as IStyle
            ],
            formHeader: [
                'formHeader',
                {
                    padding: '0 0 4px',
                    overflow: 'hidden'
                } as IStyle
            ],
            pivot: { height: `calc(100% - ${formHeaderHeight}px)` } as IStyle
        });
    }
);
const pivotTabsHeight = 36;
export const formPivotStyles: Partial<IPivotStyles> = {
    root: leftPanelPivotStyles.root,
    itemContainer: {
        height: `calc(100% - ${pivotTabsHeight}px)`,
        overflow: 'auto'
    }
};
