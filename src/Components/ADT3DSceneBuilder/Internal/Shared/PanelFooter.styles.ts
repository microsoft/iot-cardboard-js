import { mergeStyleSets, IStyle } from '@fluentui/react';

const classPrefix = 'panel-footer';
const classNames = {
    root: `${classPrefix}-root`,
    content: `${classPrefix}-content`
};
export const PanelFooterStyles = mergeStyleSets({
    root: [
        classNames.root,
        {
            display: 'flex',
            flexDirection: 'column'
        } as IStyle
    ],
    content: [classNames.content, {} as IStyle]
});
