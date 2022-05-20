import { FontSizes, IBreadcrumbStyles, Theme } from '@fluentui/react';

export function breadcrumbStyles(theme: Theme): Partial<IBreadcrumbStyles> {
    return {
        root: { marginTop: 0 },
        item: { fontSize: FontSizes.size14 },
        listItem: {
            fontSize: FontSizes.size14,
            background: theme.palette.white,
            // Added this padding to remove 1px gap between list items
            paddingRight: 1
        },
        itemLink: { fontSize: FontSizes.size14 }
    };
}
