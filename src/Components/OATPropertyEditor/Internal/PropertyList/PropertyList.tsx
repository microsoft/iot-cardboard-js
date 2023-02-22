import React, { useCallback, useMemo } from 'react';
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
    getModelOrParentContext,
    isDTDLModel,
    isDTDLRelationshipReference,
    movePropertyInCollection,
    validateOntology
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
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('PropertyList', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListStyleProps,
    IPropertyListStyles
>();

const PropertyList: React.FC<IPropertyListProps> = (props) => {
    const { parentModelId, properties, selectedItem, styles } = props;

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state

    // hooks
    const { t } = useTranslation();

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
                const originalPropertyIndex = getPropertyIndexOnModelByName(
                    selectedItem,
                    property.name
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
            } else if (isDTDLRelationshipReference(selectedItem)) {
                const originalPropertyIndex = getPropertyIndexOnRelationshipByName(
                    selectedItem,
                    property.name
                );
                if (originalPropertyIndex > -1) {
                    selectedItem.properties[
                        originalPropertyIndex
                    ] = propertyCopy;
                    updateReference(selectedItem);
                } else {
                    console.warn(
                        `Unable to find property with name (${property.name}) to update on the selected relationship. {selectedRelationship}`,
                        selectedItem
                    );
                }
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
    const getUpdateNameCallback = (property: DTDLProperty) => {
        const updateName: IOnUpdateNameCallback = (
            args: IOnUpdateNameCallbackArgs
        ) => {
            const showErrorDialog = (error: {
                title: string;
                message: string;
            }) => {
                oatPageDispatch({
                    type: OatPageContextActionType.SET_OAT_ERROR,
                    payload: {
                        title: error.title,
                        message: error.message
                    }
                });
            };
            if (isDTDLModel(selectedI tem)) {
                // update for model
                const updatedContents = [...selectedItem.contents];
                const index = getPropertyIndexOnModelByName(
                    selectedItem,
                    property.name
                );
                updatedContents[index].name = args.name;
                const updatedModel = {
                    ...selectedItem,
                    contents: updatedContents
                };

                // validate changes
                validateOntology({
                    existingModels: oatPageState.currentOntologyModels,
                    selectedModelId: oatPageState.selection?.modelId,
                    originalItem: selectedItem,
                    updatedItem: updatedModel
                }).then((validationResult) => {
                    if (validationResult.isValid === true) {
                        // save changes
                        updateModel(updatedModel);
                    } else {
                        // throw error
                        showErrorDialog(validationResult.error);
                    }
                });
            } else if (isDTDLRelationshipReference(selectedItem)) {
                // update for relationships
                const updatedProperties = [...selectedItem.properties];
                const index = getPropertyIndexOnRelationshipByName(
                    selectedItem,
                    property.name
                );
                updatedProperties[index].name = args.name;
                const updatedReference = {
                    ...selectedItem,
                    properties: updatedProperties
                };
                // validate changes
                validateOntology({
                    existingModels: oatPageState.currentOntologyModels,
                    selectedModelId: oatPageState.selection?.modelId,
                    originalItem: selectedItem,
                    updatedItem: updatedReference
                }).then((validationResult) => {
                    if (validationResult.isValid === true) {
                        // save changes
                        updateReference(updatedReference);
                    } else {
                        // throw error
                        showErrorDialog(validationResult.error);
                    }
                });
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
    const modelContext = useMemo(() => {
        return getModelOrParentContext(
            selectedItem,
            oatPageState.currentOntologyModels,
            oatPageState.selection
        );
    }, [
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        selectedItem
    ]);

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
                                        property
                                    )}
                                    onRemove={getRemoveCallback(property)}
                                    parentModelContext={modelContext}
                                />
                            );
                        }}
                    />
                </FocusZone>
            ) : (
                t('OATPropertyEditor.propertiesNotSupported')
            )}
        </div>
    );
};

export default styled<
    IPropertyListProps,
    IPropertyListStyleProps,
    IPropertyListStyles
>(PropertyList, getStyles);
