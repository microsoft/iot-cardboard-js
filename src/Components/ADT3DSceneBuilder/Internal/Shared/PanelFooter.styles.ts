import { mergeStyleSets, IStyle, IStackStyles } from '@fluentui/react';

const classPrefix = 'panel-footer';
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`,
};
export const PanelFooterStyles = mergeStyleSets({
    root: [
        classNames.root,
        {
            display: 'flex',
            flexDirection: 'column',
        } as IStyle,
    ],
    content: [classNames.content, {} as IStyle],
});
export const PanelFooterStackStyles: IStackStyles = {
    root: {
        display: 'flex',
        padding: '12px 4px 24px 4px', // separator has weird built in padding on top
    },
};
