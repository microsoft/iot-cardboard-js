import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react';
import React from 'react';

const SceneBuilderFormBreadcrumb: React.FC<{
    items: Array<IBreadcrumbItem>;
}> = ({ items }) => {
    return (
        <Breadcrumb
            items={items}
            styles={{
                root: { marginTop: 0 },
                item: { fontSize: 14 },
                listItem: { fontSize: 14 },
                itemLink: { fontSize: 14 }
            }}
        />
    );
};

export default SceneBuilderFormBreadcrumb;
