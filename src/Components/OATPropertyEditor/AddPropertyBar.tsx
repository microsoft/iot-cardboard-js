import React from 'react';
import { FontIcon, ActionButton } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IAddPropertyBar = {
    onClick?: (prop: boolean) => void;
};

export const AddPropertyBar = ({ onClick }: IAddPropertyBar) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <div className={propertyInspectorStyles.addPropertyBar}>
            <ActionButton onClick={() => onClick(true)}>
                <FontIcon
                    iconName={'CirclePlus'}
                    className={propertyInspectorStyles.addPropertyBarIcon}
                />
            </ActionButton>
        </div>
    );
};

export default AddPropertyBar;
