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
import PropertyListItemMapChild from './Internal/PropertyListItemMapChild/PropertyListItemMapChild';
import { deepCopy } from '../../../../../../../../Models/Services/Utils';

const getClassNames = classNamesFunction<
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
>();

const PropertyListItemChildHost: React.FC<IPropertyListItemChildHostProps> = (
    props
) => {
    const {
        indexKey,
        level,
        onUpdateSchema,
        onReorderItem,
        onUpdateName,
        propertyItem,
        styles
    } = props;

    // contexts

    // state

    // hooks

    // callbacks
    // const localUpdate = useCallback(
    //     (schema: DTDLSchema) => {
    //         console.log('***Local update, {item, schema}', item, schema);
    //         // find the item
    //         // propogate the update
    //         debugger;
    //         const itemCopy = deepCopy(item);
    //         itemCopy.schema = deepCopy(schema);
    //         onUpdateItem();
    //     },
    //     [item, onUpdateItem]
    // );

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
                    onRenderCell={(item, index) => (
                        <PropertyListItemEnumChild
                            indexKey={`${indexKey}.${index}`}
                            item={item}
                            enumType={propertyItem.schema.valueSchema}
                            level={level}
                            onUpdateKey={(key) => {
                                // update the schema for the item
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                schemaCopy.enumValues[index].name = key;
                                // send updated schema to parent
                                onUpdateSchema(schemaCopy);
                            }}
                            onUpdateValue={(value) => {
                                // update the schema for the item
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                schemaCopy.enumValues[index].enumValue = value;
                                // send updated schema to parent
                                onUpdateSchema(schemaCopy);
                            }}
                            onReorderItem={onReorderItem}
                        />
                    )}
                />
            ) : hasArraySchemaType(propertyItem) ? (
                <PropertyListItemArrayChild
                    indexKey={`${indexKey}.0`}
                    item={propertyItem.schema.elementSchema}
                    level={level}
                    onUpdateSchema={onUpdateSchema}
                    onUpdateName={onUpdateName}
                    onReorderItem={onReorderItem}
                />
            ) : hasMapSchemaType(propertyItem) ? (
                <PropertyListItemMapChild
                    indexKey={`${indexKey}.0`}
                    item={propertyItem.schema}
                    level={level}
                    onUpdateSchema={onUpdateSchema}
                    onUpdateName={onUpdateName}
                    onReorderItem={onReorderItem}
                />
            ) : hasObjectSchemaType(propertyItem) ? (
                <List
                    items={propertyItem.schema.fields}
                    onRenderCell={(item, index) => (
                        <PropertyListItemObjectChild
                            indexKey={`${indexKey}.${index}`}
                            isFirstItem={index === 0}
                            isLastItem={
                                index === propertyItem.schema.fields.length - 1
                            }
                            item={item}
                            level={level}
                            onUpdateSchema={(schema) => {
                                // update the schema for the field
                                const itemCopy = deepCopy(item);
                                itemCopy.schema = schema;
                                // update the field on the parent
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                schemaCopy.fields[index] = itemCopy;
                                // send updated schema to parent
                                onUpdateSchema(schemaCopy);
                            }}
                            onUpdateName={onUpdateName}
                            onReorderItem={onReorderItem}
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
