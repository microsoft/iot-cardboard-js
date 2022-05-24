import React from 'react';
import { FontIcon, ActionButton } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IAddPropertyBar = {
    onMouseOver?: () => void;
    onClick?: () => void;
    classNameIcon?: string;
};

export const AddPropertyBar = ({
    onClick,
    onMouseOver,
    classNameIcon
}: IAddPropertyBar) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();

    return (
        <div className={propertyInspectorStyles.addPropertyBar}>
            <ActionButton
                onMouseOver={() => onMouseOver && onMouseOver()}
                onClick={() => onClick && onClick()}
            >
                <FontIcon
                    iconName={'CirclePlus'}
                    className={
                        classNameIcon
                            ? classNameIcon
                            : propertyInspectorStyles.addPropertyBarIcon
                    }
                />
            </ActionButton>
        </div>
    );
};

export default AddPropertyBar;
