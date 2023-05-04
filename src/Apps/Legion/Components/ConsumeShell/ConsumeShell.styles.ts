import { makeStyles, shorthands } from '@fluentui/react-components';
import { TConsumeShellClassNames } from './ConsumeShell.types';

export const gridBorderVar = '--legion-consume-shell-border';

export const useClassNames = makeStyles<TConsumeShellClassNames>({
    root: {
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '300px auto',
        gridTemplateRows: '64px auto',
        gridTemplateAreas: `
                "header header"
                "left content"
            `
    },
    header: {
        ...shorthands.borderBottom('1px', 'solid', `var(${gridBorderVar})`),
        ...shorthands.gridArea('header'),
        display: 'flex',
        columnGap: '8px',
        alignItems: 'center',
        paddingLeft: '16px'
    },
    headerText: {
        fontWeight: 600,
        ...shorthands.margin('0px')
    },
    content: {
        ...shorthands.gridArea('content'),
        ...shorthands.padding('16px'),
        height: '504px' // Temporary: need to find better way to take parent height and fill it
    },
    leftNav: {
        ...shorthands.borderRight('1px', 'solid', `var(${gridBorderVar})`),
        ...shorthands.gridArea('left')
    }
});
