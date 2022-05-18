import { IBreadcrumbStyles, IDropdownStyles } from '@fluentui/react';

export const breadcrumbStyles: Partial<IBreadcrumbStyles> = {
    root: { marginTop: 0 },
    item: { fontSize: 14 },
    listItem: { fontSize: 14 },
    itemLink: { fontSize: 14 }
};

export const dropdownStyles: Partial<IDropdownStyles> = {
    root: {
        minWidth: 135
    },
    title: {
        border: 'none'
    }
};
