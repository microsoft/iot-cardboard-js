import { IconButton, IIconStyleProps, IIconStyles } from '@fluentui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyTreeContext } from '../PropertyTree';
import { PropertyTreeNode } from '../PropertyTree.types';

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
        <IconButton
            ariaLabel={title}
            className="cb-property-tree-node-datetime-picker-icon-container"
            onClick={onClick}
            iconProps={{
                iconName: iconName,
                styles: iconStyles
            }}
        />
    );
};

export const DateTimeValue: React.FC<{
    node: PropertyTreeNode;
    type: 'datetime-local' | 'date' | 'time';
    iconName: string;
    pickerTitle: string;
    inputProps: React.HTMLProps<HTMLInputElement>;
    step?: string;
}> = ({ node, type, iconName, pickerTitle, inputProps, step }) => {
    const { t } = useTranslation();
    const { onNodeValueChange } = useContext(PropertyTreeContext);

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerVal, setPickerVal] = useState(node.value as string);
    const pickerRef = useRef(null);
    const plainTextInputRef = useRef(null);

    useEffect(() => {
        setPickerVal(node.value as string);
    }, [node.value]);

    useEffect(() => {
        if (isPickerOpen && pickerRef.current) {
            pickerRef.current.focus();
        }
        if (!isPickerOpen && plainTextInputRef.current) {
            plainTextInputRef.current.blur();
        }
    }, [isPickerOpen]);

    const nodeValueClassname = `cb-property-tree-node-value ${
        node.edited ? 'cb-property-tree-node-value-edited' : ''
    }`;

    const onSubmitPicker = () => {
        let valToSubmit = pickerVal;

        if (type === 'datetime-local') {
            // If seconds set to :00 in datetime-local picker, value truncates
            // Replace :00 in output value
            if (valToSubmit.slice(valToSubmit.indexOf('T')).length === 6) {
                valToSubmit += ':00';
            }
        }
        setIsPickerOpen(false);

        if (valToSubmit.length > 0) {
            onNodeValueChange(node, valToSubmit);
        }
    };

    if (isPickerOpen) {
        return (
            <div className={nodeValueClassname}>
                <input
                    ref={pickerRef}
                    type={type}
                    className="cb-property-tree-node-datetime-picker-input"
                    value={pickerVal}
                    onChange={(e) => setPickerVal(e.target.value)}
                    onBlur={() => {
                        onSubmitPicker();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSubmitPicker();
                        }
                    }}
                    step={step}
                />
                <PickerIcon
                    iconName="PlainText"
                    title={t('propertyInspector.dateTimePicker.plainTextInput')}
                    onClick={() => setIsPickerOpen((prev) => !prev)}
                />
            </div>
        );
    }

    return (
        <div className={nodeValueClassname}>
            <input
                ref={plainTextInputRef}
                {...inputProps}
                onChange={(e) => onNodeValueChange(node, e.target.value)}
            />
            <PickerIcon
                iconName={iconName}
                title={pickerTitle}
                onClick={() => setIsPickerOpen((prev) => !prev)}
            />
        </div>
    );
};
