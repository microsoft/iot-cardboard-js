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
import {
    deepCopy,
    moveItemInCollection
} from '../../../../../../../../Models/Services/Utils';

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
        onDuplicate,
        onUpdateSchema,
        parentModelContext,
        propertyItem,
        styles
    } = props;

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
                    onRenderCell={(item, index) => (
                        <PropertyListItemEnumChild
                            indexKey={`${indexKey}.${index}`}
                            isFirstItem={index === 0}
                            isLastItem={
                                index ===
                                propertyItem.schema.enumValues.length - 1
                            }
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
                            onReorderItem={(direction) => {
                                // decouple the schema object
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                // move the field
                                moveItemInCollection(
                                    direction,
                                    index,
                                    schemaCopy.enumValues
                                );
                                // dispatch the child update
                                onUpdateSchema(schemaCopy);
                            }}
                            onRemove={() => {
                                // decouple the schema object
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                // remove the field
                                schemaCopy.enumValues.splice(index, 1);
                                // dispatch the child update
                                onUpdateSchema(schemaCopy);
                            }}
                        />
                    )}
                />
            ) : hasArraySchemaType(propertyItem) ? (
                <PropertyListItemArrayChild
                    indexKey={`${indexKey}.0`}
                    item={propertyItem.schema.elementSchema}
                    level={level}
                    onUpdateSchema={onUpdateSchema}
                    parentModelContext={parentModelContext}
                />
            ) : hasMapSchemaType(propertyItem) ? (
                <PropertyListItemMapChild
                    indexKey={`${indexKey}.0`}
                    item={propertyItem.schema}
                    level={level}
                    onUpdateKey={(key) => {
                        // update the schema for the item
                        const schemaCopy = deepCopy(propertyItem.schema);
                        schemaCopy.mapKey = key;
                        // send updated schema to parent
                        onUpdateSchema(schemaCopy);
                    }}
                    onUpdateValue={(value) => {
                        // update the schema for the item
                        const schemaCopy = deepCopy(propertyItem.schema);
                        schemaCopy.mapValue = value;
                        // send updated schema to parent
                        onUpdateSchema(schemaCopy);
                    }}
                    parentModelContext={parentModelContext}
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
                            onDuplicate={onDuplicate}
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
                            onUpdateName={(args) => {
                                // decouple the schema object
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                // grab the field
                                const fieldCopy = deepCopy(
                                    schemaCopy.fields[index]
                                );
                                // update the field
                                fieldCopy.name = args.name;
                                schemaCopy.fields[index] = fieldCopy;
                                // dispatch the child update
                                onUpdateSchema(schemaCopy);
                            }}
                            onRemove={() => {
                                // decouple the schema object
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                // remove the field
                                schemaCopy.fields.splice(index, 1);
                                // dispatch the child update
                                onUpdateSchema(schemaCopy);
                            }}
                            onReorderItem={(direction) => {
                                // decouple the schema object
                                const schemaCopy = deepCopy(
                                    propertyItem.schema
                                );
                                // move the field
                                moveItemInCollection(
                                    direction,
                                    index,
                                    schemaCopy.fields
                                );
                                // dispatch the child update
                                onUpdateSchema(schemaCopy);
                            }}
                            parentModelContext={parentModelContext}
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
