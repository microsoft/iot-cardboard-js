import React from 'react';
import { FontIcon, ActionButton, Stack } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

// type IPropertyListItem = {};

export const AddPropertyBar = ({ callback }) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <Stack className={propertyInspectorStyles.addPropertyBar}>
            <ActionButton onClick={() => callback(true)}>
                <FontIcon
                    iconName={'CirclePlus'}
                    className={propertyInspectorStyles.addPropertyBarIcon}
                />
            </ActionButton>
        </Stack>
    );
};

export default AddPropertyBar;
