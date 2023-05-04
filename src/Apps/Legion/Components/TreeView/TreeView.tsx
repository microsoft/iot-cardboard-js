import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { Asset, ITreeViewProps } from './TreeView.types';
import { useClassNames } from './TreeView.styles';
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
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    console.log('AAAAAAAA prop data', _props.sampleData);

    return (
        <Tree aria-label="Tree">
            <TreeItem>
                <TreeItemLayout>level 1, item 1</TreeItemLayout>
                <Tree>
                    <TreeItem>
                        <TreeItemLayout>level 2, item 1</TreeItemLayout>
                    </TreeItem>
                    <TreeItem>
                        <TreeItemLayout>level 2, item 2</TreeItemLayout>
                    </TreeItem>
                    <TreeItem>
                        <TreeItemLayout>level 2, item 3</TreeItemLayout>
                    </TreeItem>
                </Tree>
            </TreeItem>
            <TreeItem>
                <TreeItemLayout>level 1, item 2</TreeItemLayout>
                <Tree>
                    <TreeItem>
                        <TreeItemLayout>level 2, item 1</TreeItemLayout>
                        <Tree>
                            <TreeItem>
                                <TreeItemLayout>level 3, item 1</TreeItemLayout>
                            </TreeItem>
                        </Tree>
                    </TreeItem>
                </Tree>
            </TreeItem>
        </Tree>
    );
};

export default TreeView;
