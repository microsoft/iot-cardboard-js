import React from 'react';
import {
    IPropertyListProps,
    IPropertyListStyleProps,
    IPropertyListStyles
} from './PropertyList.types';
import { getStyles } from './PropertyList.styles';
import {
    classNamesFunction,
    FocusZone,
    FocusZoneDirection,
    List,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from './Internal/PropertyListItem/PropertyListItem';

const getClassNames = classNamesFunction<
    IPropertyListStyleProps,
    IPropertyListStyles
>();

const PropertyList: React.FC<IPropertyListProps> = (props) => {
    const { parentEntity, properties, styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <FocusZone direction={FocusZoneDirection.vertical}>
                <List
                    items={properties}
                    onRenderCell={(item, index) => {
                        return (
                            <PropertyListItem
                                propertyIndex={index}
                                propertyItem={item}
                                parentEntity={parentEntity}
                            />
                        );
                    }}
                />
            </FocusZone>
        </div>
    );
};

export default styled<
    IPropertyListProps,
    IPropertyListStyleProps,
    IPropertyListStyles
>(PropertyList, getStyles);
