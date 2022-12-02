import React from 'react';
import {
    IPropertyListItemObjectChildProps,
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
} from './PropertyListItemObjectChild.types';
import { getStyles } from './PropertyListItemObjectChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from '../../../../PropertyListItem';

const getClassNames = classNamesFunction<
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
>();

const PropertyListItemObjectChild: React.FC<IPropertyListItemObjectChildProps> = (
    props
) => {
    const { item, level, styles } = props;

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
            {/* {hasComplexSchemaType(item) ? ( */}
            <PropertyListItem
                parentEntity={{} as any}
                propertyIndex={1} // TODO pass this through if needed
                level={level + 1}
                propertyItem={item}
            />
            {/* ) : (
                <>
                    <PropertyIcon schema={item.schema} />
                    <span>{item.name}</span>
                </>
            )} */}
        </div>
    );
};

export default styled<
    IPropertyListItemObjectChildProps,
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
>(PropertyListItemObjectChild, getStyles);
