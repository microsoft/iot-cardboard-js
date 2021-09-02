import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import {
    IIconStyleProps,
    IIconStyles
} from '@fluentui/react/lib/components/Icon/Icon.types';
import React, { useContext, useEffect, useState } from 'react';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';

const PickerIcon: React.FC<{
    iconName: string;
    title: string;
    onClick: () => any;
}> = ({ iconName, title, onClick }) => {
    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt
        }
    });
    return (
        <div
            className="cb-property-tree-node-datetime-picker-icon-container"
            onClick={onClick}
        >
            <Icon iconName={iconName} styles={iconStyles} title={title} />
        </div>
    );
};

export const DateTimeValue: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueChange } = useContext(PropertyTreeContext);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerDateVal, setPickerDateVal] = useState(node.value as string);

    useEffect(() => {
        setPickerDateVal(node.value as string);
    }, [node.value]);

    const nodeValueClassname = `cb-property-tree-node-value ${
        node.edited ? 'cb-property-tree-node-value-edited' : ''
    }`;

    if (isPickerOpen) {
        return (
            <div className={nodeValueClassname}>
                <input
                    type="datetime-local"
                    className="cb-property-tree-node-datetime-picker-input"
                    value={pickerDateVal}
                    onChange={(e) => setPickerDateVal(e.target.value)}
                    onBlur={() => {
                        setIsPickerOpen(false);
                        onNodeValueChange(node, pickerDateVal);
                    }}
                    step="2"
                />
                <PickerIcon
                    iconName="PlainText"
                    title="Plain text input"
                    onClick={() => setIsPickerOpen((prev) => !prev)}
                />
            </div>
        );
    }

    return (
        <div className={nodeValueClassname}>
            <input
                placeholder="yyyy-mm-ddThh:mm:ss"
                value={node.value as string}
                style={{ width: 172 }}
                onChange={(e) => onNodeValueChange(node, e.target.value)}
            ></input>
            <PickerIcon
                iconName="DateTime"
                title="Datetime picker"
                onClick={() => setIsPickerOpen((prev) => !prev)}
            />
        </div>
    );
};

export const TimeValue: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueChange } = useContext(PropertyTreeContext);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerTimeVal, setPickerTimeVal] = useState(node.value as string);

    useEffect(() => {
        setPickerTimeVal(node.value as string);
    }, [node.value]);

    const nodeValueClassname = `cb-property-tree-node-value ${
        node.edited ? 'cb-property-tree-node-value-edited' : ''
    }`;

    if (isPickerOpen) {
        return (
            <div className={nodeValueClassname}>
                <input
                    type="time"
                    className="cb-property-tree-node-datetime-picker-input"
                    value={pickerTimeVal}
                    onChange={(e) => setPickerTimeVal(e.target.value)}
                    onBlur={() => {
                        setIsPickerOpen(false);
                        onNodeValueChange(node, pickerTimeVal);
                    }}
                    step="2"
                />
                <PickerIcon
                    iconName="PlainText"
                    title="Plain text input"
                    onClick={() => setIsPickerOpen((prev) => !prev)}
                />
            </div>
        );
    }

    return (
        <div className={nodeValueClassname}>
            <div className={nodeValueClassname}>
                <input
                    placeholder="hh:mm:ss"
                    value={node.value as string}
                    style={{ width: 92 }}
                    onChange={(e) => onNodeValueChange(node, e.target.value)}
                ></input>
            </div>
            <PickerIcon
                iconName="Clock"
                title="Time picker"
                onClick={() => setIsPickerOpen((prev) => !prev)}
            />
        </div>
    );
};

export const DateValue: React.FC<NodeProps> = ({ node }) => {
    const { onNodeValueChange } = useContext(PropertyTreeContext);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerDateVal, setPickerDateVal] = useState(node.value as string);

    useEffect(() => {
        setPickerDateVal(node.value as string);
    }, [node.value]);

    const nodeValueClassname = `cb-property-tree-node-value ${
        node.edited ? 'cb-property-tree-node-value-edited' : ''
    }`;

    if (isPickerOpen) {
        return (
            <div className={nodeValueClassname}>
                <input
                    type="date"
                    className="cb-property-tree-node-datetime-picker-input"
                    value={pickerDateVal}
                    onChange={(e) => setPickerDateVal(e.target.value)}
                    onBlur={() => {
                        setIsPickerOpen(false);
                        onNodeValueChange(node, pickerDateVal);
                    }}
                />
                <PickerIcon
                    iconName="PlainText"
                    title="Plain text input"
                    onClick={() => setIsPickerOpen((prev) => !prev)}
                />
            </div>
        );
    }

    return (
        <div className={nodeValueClassname}>
            <div className={nodeValueClassname}>
                <input
                    placeholder="yyyy-mm-dd"
                    value={node.value as string}
                    style={{ width: 72 }}
                    onChange={(e) => onNodeValueChange(node, e.target.value)}
                ></input>
            </div>
            <PickerIcon
                iconName="Calendar"
                title="Date picker"
                onClick={() => setIsPickerOpen((prev) => !prev)}
            />
        </div>
    );
};
