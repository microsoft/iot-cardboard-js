import React from 'react';
import { FontIcon, ActionButton } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IAddPropertyBar = {
    onMouseOver?: (prop: boolean) => void;
};

export const AddPropertyBar = ({ onMouseOver }: IAddPropertyBar) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <div className={propertyInspectorStyles.addPropertyBar}>
            <ActionButton onMouseOver={() => onMouseOver(true)}>
                <FontIcon
                    iconName={'CirclePlus'}
                    className={propertyInspectorStyles.addPropertyBarIcon}
                />
            </ActionButton>
        </div>
    );
};

export default AddPropertyBar;
