import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { Asset, ITreeViewProps } from './TreeView.types';
// import { useClassNames } from './TreeView.styles';
import {
    Tree,
    TreeItem,
    TreeItemLayout
} from '@fluentui/react-components/unstable';
import { isDefined } from '../../Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TreeView', debugLogging);

const TreeView: React.FC<ITreeViewProps> = (_props) => {
    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    // const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    const constructTree = (asset: Asset): JSX.Element => {
        if (isDefined(asset)) {
            return (
                <TreeItem>
                    <TreeItemLayout>{asset.name}</TreeItemLayout>
                    {asset.childAssets.length > 0 && (
                        <Tree>
                            {asset.childAssets.map((c) => constructTree(c))}
                        </Tree>
                    )}
                </TreeItem>
            );
        }
    };

    return (
        <Tree aria-label="Tree">
            {_props.sampleData.map((x) => constructTree(x))}
        </Tree>
    );
};

export default TreeView;
