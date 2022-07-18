import { memoizeFunction } from '@fluentui/react';

export const getWidgetLibraryDialogStyles = memoizeFunction(() => ({
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    scrollableContent: {
        '.ms-Dialog-inner': {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }
    }
}));
