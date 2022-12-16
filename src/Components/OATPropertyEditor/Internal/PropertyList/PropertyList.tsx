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
import { DTDLProperty, DTDLSchema } from '../../../../Models/Classes/DTDL';
import { deepCopy, getDebugLogger } from '../../../../Models/Services/Utils';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';
import {
    isDTDLModel,
    isDTDLReference,
    isDTDLRelationshipReference
} from '../../../../Models/Services/DtdlUtils';
import {
    IOnUpdateNameCallback,
    IOnUpdateNameCallbackArgs
} from './Internal/PropertyListItem/PropertyListItem.types';
import { useCommandHistoryContext } from '../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

const debugLogging = true;
const logDebugConsole = getDebugLogger('PropertyList', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListStyleProps,
    IPropertyListStyles
>();

const PropertyList: React.FC<IPropertyListProps> = (props) => {
    const { parentModelId, properties, selectedItem, styles } = props;

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { execute } = useCommandHistoryContext();

    // state

    // hooks

    // callbacks

    const getSchemaUpdateCallback = (property: DTDLProperty) => {
        console.log('***Createing callback', property);
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

                    const updateModel = () => {
                        console.log('***Apply update');
                        oatPageDispatch({
                            type: OatPageContextActionType.UPDATE_MODEL,
                            payload: {
                                model: selectedItem
                            }
                        });
                    };

                    const undoAddition = () => {
                        console.log(
                            '***Undo update',
                            oatPageState.currentOntologyModels
                        );
                        oatPageDispatch({
                            type: OatPageContextActionType.GENERAL_UNDO,
                            payload: {
                                models: oatPageState.currentOntologyModels,
                                positions:
                                    oatPageState.currentOntologyModelPositions,
                                selection: oatPageState.selection
                            }
                        });
                    };

                    execute(updateModel, undoAddition);
                } else {
                    console.warn(
                        `Unable to find property with name (${property.name}) to update on the selected model. {selectedModel}`,
                        selectedItem
                    );
                }
            } else if (isDTDLReference(selectedItem)) {
                // TODO: add to Undo stack
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_REFERENCE,
                    payload: {
                        modelId: parentModelId,
                        reference: selectedItem
                    }
                });
            }
        };

        return onUpdateItem;
    };
    const getReorderItemCallback = (_property: DTDLProperty) => {
        const onReorder = () => {
            alert('not implemented');
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
                // oatPageDispatch({
                //     type: OatPageContextActionType.UPDATE_REFERENCE,
                //     payload: {
                //         modelId: parentEntity['@id'],
                //         reference: updatedProperty
                //     }
                // });
                alert(
                    'not implemented. Update relationship Name: ' + args.name
                );
            }
        };

        return updateName;
    };

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // only models and Relationship references support properties
    const arePropertiesSupported =
        isDTDLModel(selectedItem) || isDTDLRelationshipReference(selectedItem);
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
                                    onUpdateSchema={getSchemaUpdateCallback(
                                        property
                                    )}
                                    onReorderItem={getReorderItemCallback(
                                        property
                                    )}
                                    onUpdateName={getUpdateNameCallback(
                                        property,
                                        index
                                    )}
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
