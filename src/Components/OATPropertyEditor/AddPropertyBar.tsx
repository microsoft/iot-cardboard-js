import React from 'react';
import { FontIcon, ActionButton } from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';

type IAddPropertyBar = {
    onMouseOver?: (event: MouseEvent) => void;
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
            <ActionButton onClick={() => onClick && onClick()}>
                <FontIcon
                    iconName={'CirclePlus'}
                    className={
                        classNameIcon
                            ? classNameIcon
                            : propertyInspectorStyles.addPropertyBarIcon
                    }
                    onMouseOver={(e) => onMouseOver && onMouseOver(e)}
                />
            </ActionButton>
        </div>
    );
};

export default AddPropertyBar;
