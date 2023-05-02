import { memoizeFunction, mergeStyleSets } from '@fluentui/react';

export const getStyles = memoizeFunction(() => {
    const classPrefix = 'im-site';
    const classNames = {
        root: `${classPrefix}-root`,
        header: `${classPrefix}-header`,
        nav: `${classPrefix}-nav`,
        main: `${classPrefix}-main`
    };
    return mergeStyleSets({
        root: [
            classNames.root,
            {
                display: 'grid',
                gridTemplateAreas: `"header header" "nav main"`,
                gridTemplateRows: 'auto 1fr',
                gridTemplateColumns: 'auto 1fr'
            }
        ],
        header: [
            classNames.header,
            {
                gridArea: 'header'
            }
        ],
        nav: [classNames.nav, { gridArea: 'nav' }],
        main: [classNames.main, { gridArea: 'main' }]
    });
});
