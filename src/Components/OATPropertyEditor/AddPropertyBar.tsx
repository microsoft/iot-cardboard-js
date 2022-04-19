import React from 'react';
import { FontIcon, ActionButton, Stack } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IAddPropertyBar = {
    callback?: (prop: any) => any;
};

export const AddPropertyBar = ({ callback }: IAddPropertyBar) => {
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
