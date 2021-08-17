import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import React from 'react';
import '../PropertyTree.scss';

const TreeNodeIcon = () => {
    // TODO update with actual property type icons
    return (
        <div className="cb-property-tree-node-icon">
            <Icon iconName={'CircleFill'} />
        </div>
    );
};

export default TreeNodeIcon;
