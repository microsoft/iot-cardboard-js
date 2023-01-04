import React, { useCallback } from 'react';
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
import { DTDLProperty, DTDLSchema } from '../../../../Models/Classes/DTDL';
import { deepCopy, getDebugLogger } from '../../../../Models/Services/Utils';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';
import {
    copyDTDLProperty,
    isDTDLModel,
    isDTDLReference,
    isDTDLRelationshipReference,
    movePropertyInCollection
} from '../../../../Models/Services/DtdlUtils';
import {
    IOnUpdateNameCallback,
    IOnUpdateNameCallbackArgs
} from './Internal/PropertyListItem/PropertyListItem.types';
import { DtdlInterface, DtdlReference } from '../../../../Models/Constants';
import {
    getPropertyIndexOnModelByName,
    getPropertyIndexOnRelationshipByName
} from '../../../../Models/Context/OatPageContext/OatPageContextUtils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('PropertyList', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListStyleProps,
    IPropertyListStyles
>();

const PropertyList: React.FC<IPropertyListProps> = (props) => {
    const { parentModelId, properties, selectedItem, styles } = props;

    // contexts
    const { oatPageDispatch } = useOatPageContext();
    // const { execute } = useCommandHistoryContext();

    // state

    // hooks

    // callbacks

    const updateModel = useCallback(
        (model: DtdlInterface) => {
            // TODO: Add history tracking
            oatPageDispatch({
                type: OatPageContextActionType.UPDATE_MODEL,
                payload: {
                    model: model
                }
            });
        },
        [oatPageDispatch]
    );
    const updateReference = useCallback(
        (reference: DtdlReference) => {
            // TODO: Add history tracking
            oatPageDispatch({
                type: OatPageContextActionType.UPDATE_REFERENCE,
                payload: {
                    modelId: parentModelId,
                    reference: reference
                }
            });
        },
        [oatPageDispatch, parentModelId]
    );

    const getSchemaUpdateCallback = (property: DTDLProperty) => {
        const onUpdateItem = (schema: DTDLSchema) => {
            logDebugConsole(
                'info',
                'Updating schema with data. {selectedItem, property, data}',
                selectedItem,
                property,
                schema
            );

            const propertyCopy = deepCopy(property);
            propertyCopy.schema = deepCopy(schema);

            if (isDTDLModel(selectedItem)) {
                const originalPropertyIndex = selectedItem.contents.findIndex(
                    (x) => x.name === property.name
                );
                if (originalPropertyIndex > -1) {
                    selectedItem.contents[originalPropertyIndex] = propertyCopy;

                    updateModel(selectedItem);
                } else {
                    console.warn(
                        `Unable to find property with name (${property.name}) to update on the selected model. {selectedModel}`,
                        selectedItem
                    );
                }
            } else if (isDTDLReference(selectedItem)) {
                alert('not implemented. Update relationship Name: ' + schema);
                // updateRelationship(selectedItem);
            }
        };

        return onUpdateItem;
    };
    const getReorderItemCallback = (
        property: DTDLProperty,
        propertyIndex: number
    ) => {
        const onReorder = (direction: 'Up' | 'Down') => {
            const selectedItemCopy = deepCopy(selectedItem);
            if (isDTDLModel(selectedItemCopy)) {
                movePropertyInCollection(
                    direction,
                    property,
                    propertyIndex,
                    selectedItemCopy.contents
                );
                updateModel(selectedItemCopy);
            } else if (isDTDLRelationshipReference(selectedItemCopy)) {
                movePropertyInCollection(
                    direction,
                    property,
                    propertyIndex,
                    selectedItemCopy.properties
                );
                updateReference(selectedItemCopy);
            }
        };

        return onReorder;
    };
    const getUpdateNameCallback = (
        _property: DTDLProperty,
        propertyIndex: number
    ) => {
        const updateName: IOnUpdateNameCallback = (
            args: IOnUpdateNameCallbackArgs
        ) => {
            if (isDTDLModel(selectedItem)) {
                // update for model
                const updatedContents = [...selectedItem.contents];
                updatedContents[propertyIndex].name = args.name;
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_MODEL,
                    payload: {
                        model: {
                            ...selectedItem,
                            contents: updatedContents
                        }
                    }
                });
            } else if (isDTDLRelationshipReference(selectedItem)) {
                // // update for relationships (NOTE: components don't have properties)
                // const updatedProperty = parentEntity.properties[propertyIndex];
                // updatedProperty.name = value;
                // updateRelationship(updatedProperty);
                alert(
                    'not implemented. Update relationship Name: ' + args.name
                );
            }
        };

        return updateName;
    };
    const getRemoveCallback = (property: DTDLProperty) => {
        const onRemove = () => {
            logDebugConsole(
                'info',
                '[START] Removing item. {selectedItem, property}',
                selectedItem,
                property
            );
            if (isDTDLModel(selectedItem)) {
                const selectedItemCopy = deepCopy(selectedItem);
                const index = getPropertyIndexOnModelByName(
                    selectedItemCopy,
                    property.name
                );
                selectedItemCopy.contents.splice(index, 1);
                logDebugConsole(
                    'info',
                    '[END] Removing item. {selectedItem, property}',
                    selectedItemCopy,
                    property
                );
                updateModel(selectedItemCopy);
            } else if (isDTDLRelationshipReference(selectedItem)) {
                const selectedItemCopy = deepCopy(selectedItem);
                const index = getPropertyIndexOnRelationshipByName(
                    selectedItemCopy,
                    property.name
                );
                selectedItemCopy.properties.splice(index, 1);
                logDebugConsole(
                    'info',
                    '[END] Removing item. {selectedItem, property}',
                    selectedItemCopy,
                    property
                );
                // TODO: add to Undo stack
                updateReference(selectedItem);
            }
        };

        return onRemove;
    };
    const getCopyCallback = (property: DTDLProperty) => {
        const onUpdateItem = () => {
            logDebugConsole(
                'info',
                '[START] Duplicate item. {selectedItem, property}',
                selectedItem,
                property
            );
            if (isDTDLModel(selectedItem)) {
                const selectedItemCopy = deepCopy(selectedItem);
                const propertyCopy = copyDTDLProperty(
                    property,
                    selectedItem.contents
                );
                selectedItemCopy.contents.push(propertyCopy);
                logDebugConsole(
                    'info',
                    '[END] Duplicate item. {selectedItem, property}',
                    selectedItemCopy,
                    property
                );
                updateModel(selectedItemCopy);
            } else if (isDTDLRelationshipReference(selectedItem)) {
                const selectedItemCopy = deepCopy(selectedItem);
                const propertyCopy = copyDTDLProperty(
                    property,
                    selectedItem.properties
                );
                selectedItemCopy.properties.push(propertyCopy);
                logDebugConsole(
                    'info',
                    '[END] Duplicate item. {selectedItem, property}',
                    selectedItemCopy,
                    property
                );
                // TODO: add to Undo stack
                updateReference(selectedItem);
            }
        };

        return onUpdateItem;
    };

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // only models and Relationship references support properties
    const arePropertiesSupported =
        isDTDLModel(selectedItem) || isDTDLRelationshipReference(selectedItem);

    logDebugConsole('debug', 'Render property list. {properties}', properties);
    return (
        <div className={classNames.root}>
            {arePropertiesSupported ? (
                <FocusZone direction={FocusZoneDirection.vertical}>
                    <List
                        items={properties}
                        onRenderCell={(property, index) => {
                            return (
                                <PropertyListItem
                                    isFirstItem={index === 0}
                                    isLastItem={index === properties.length - 1}
                                    indexKey={String(index)}
                                    item={property}
                                    onCopy={getCopyCallback(property)}
                                    onUpdateSchema={getSchemaUpdateCallback(
                                        property
                                    )}
                                    onReorderItem={getReorderItemCallback(
                                        property,
                                        index
                                    )}
                                    onUpdateName={getUpdateNameCallback(
                                        property,
                                        index
                                    )}
                                    onRemove={getRemoveCallback(property)}
                                />
                            );
                        }}
                    />
                </FocusZone>
            ) : (
                'Properties not supported'
            )}
        </div>
    );
};

export default styled<
    IPropertyListProps,
    IPropertyListStyleProps,
    IPropertyListStyles
>(PropertyList, getStyles);
