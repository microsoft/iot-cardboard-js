import React from 'react';
import {
    IPropertyListItemChildHostProps,
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
} from './PropertyListItemChildHost.types';
import { getStyles } from './PropertyListItemChildHost.styles';
import { classNamesFunction, List, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../Models/Hooks/useExtendedTheme';
import {
    hasArraySchemaType,
    hasEnumSchemaType,
    hasMapSchemaType,
    hasObjectSchemaType
} from '../../../../../../../../Models/Services/DtdlUtils';
import PropertyListItemEnumChild from './Internal/PropertyListItemEnumChild/PropertyListItemEnumChild';
import PropertyListItemArrayChild from './Internal/PropertyListItemArrayChild/PropertyListItemArrayChild';
import PropertyListItemObjectChild from './Internal/PropertyListItemObjectChild/PropertyListItemObjectChild';

const getClassNames = classNamesFunction<
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
>();

const PropertyListItemChildHost: React.FC<IPropertyListItemChildHostProps> = (
    props
) => {
    const { level, propertyItem, styles } = props;

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
            {hasEnumSchemaType(propertyItem) ? (
                <List
                    items={propertyItem.schema.enumValues}
                    onRenderCell={(item) => (
                        <PropertyListItemEnumChild
                            item={item}
                            enumType={propertyItem.schema.valueSchema}
                        />
                    )}
                />
            ) : hasArraySchemaType(propertyItem) ? (
                typeof propertyItem.schema.elementSchema === 'object' ? (
                    <List
                        items={[]} // TODO: figure out what to loop here
                        onRenderCell={(item) => (
                            <PropertyListItemArrayChild item={item} />
                        )}
                    />
                ) : (
                    <div>Primitive: {propertyItem.schema.elementSchema}</div>
                )
            ) : hasMapSchemaType(propertyItem) ? (
                <>Map</>
            ) : hasObjectSchemaType(propertyItem) ? (
                <List
                    items={propertyItem.schema.fields}
                    onRenderCell={(item) => (
                        <PropertyListItemObjectChild
                            level={level}
                            item={item}
                        />
                    )}
                />
            ) : (
                <div>unknown schema</div>
            )}
        </div>
    );
};

export default styled<
    IPropertyListItemChildHostProps,
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
>(PropertyListItemChildHost, getStyles);
