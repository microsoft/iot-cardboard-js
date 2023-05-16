import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { Asset, ITreeViewProps } from './TreeView.types';
import {
    Tree,
    TreeItem,
    TreeItemLayout
} from '@fluentui/react-components/unstable';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TreeView', debugLogging);

const TreeView: React.FC<ITreeViewProps> = (_props) => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles

    logDebugConsole('debug', 'Render');

    const generateTree = (data: Asset[]) => (
        <Tree aria-label="Tree">
            {data.map((asset, idx) => (
                <TreeItem key={`${asset.name}_${idx}`}>
                    <TreeItemLayout>{asset.name}</TreeItemLayout>
                    {asset.childAssets.length > 0 &&
                        generateTree(asset.childAssets)}
                </TreeItem>
            ))}
        </Tree>
    );

    return generateTree(_props.sampleData);
};

export default TreeView;
