import React, { useCallback, useMemo } from 'react';
import {
    IEditorPropertiesTabProps,
    IEditorPropertiesTabStyleProps,
    IEditorPropertiesTabStyles
} from './EditorPropertiesTab.types';
import { getStyles } from './EditorPropertiesTab.styles';
import { classNamesFunction, Label, Stack, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import PropertiesModelSummary from '../PropertiesModelSummary';
import { useTranslation } from 'react-i18next';
import {
    getDefaultProperty,
    isDTDLModel,
    isDTDLProperty,
    isDTDLReference,
    isDTDLRelationshipReference,
    isModelOrParentDtdlVersion3
} from '../../../../Models/Services/DtdlUtils';
import PropertyList from '../PropertyList/PropertyList';
import { DTDLProperty, DTDLSchemaTypes } from '../../../../Models/Classes/DTDL';
import PropertyTypePicker from '../PropertyTypePicker/PropertyTypePicker';
import { DtdlProperty, OAT_INTERFACE_TYPE } from '../../../../Models/Constants';
import { getModelPropertyCollectionName } from '../../Utils';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';
import { getDebugLogger, deepCopy } from '../../../../Models/Services/Utils';
import { useCommandHistoryContext } from '../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { getPropertyInspectorStyles } from '../../OATPropertyEditor.styles';
import { useTheme } from '@fluentui/react';

const debugLogging = false;
const logDebugConsole = getDebugLogger('EditorPropertiesTab', debugLogging);

const getClassNames = classNamesFunction<
    IEditorPropertiesTabStyleProps,
    IEditorPropertiesTabStyles
>();

const EditorPropertiesTab: React.FC<IEditorPropertiesTabProps> = (props) => {
    const { parentModelId, selectedItem, styles } = props;

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();
    const { execute } = useCommandHistoryContext();

    // state

    // hooks
    const { t } = useTranslation();

    // data
    const propertiesKeyName = getModelPropertyCollectionName(
        selectedItem ? selectedItem['@type'] : OAT_INTERFACE_TYPE
    );
    const propertyList = useMemo(() => {
        // Get contents excluding relationship items
        let propertyItems: DTDLProperty[] = [];
        if (
            selectedItem &&
            selectedItem[propertiesKeyName] &&
            selectedItem[propertiesKeyName].length > 0
        ) {
            // Exclude relationships from propertyList. Handle DTDL V3 where type can be an array for Semantic types
            propertyItems = selectedItem[
                propertiesKeyName
            ].filter((property: DTDLProperty) => isDTDLProperty(property));
        }
        return propertyItems;
    }, [selectedItem, propertiesKeyName]);

    const isSupportedModelType = useMemo(
        () =>
            isDTDLModel(selectedItem) ||
            isDTDLRelationshipReference(selectedItem),
        [selectedItem]
    );
    const supportsV3Properties = useMemo(() => {
        return isModelOrParentDtdlVersion3(
            selectedItem,
            oatPageState.currentOntologyModels,
            oatPageState.selection
        );
    }, [
        oatPageState.currentOntologyModels,
        oatPageState.selection,
        selectedItem
    ]);

    // callbacks
    const onAddType = useCallback(
        (data: { schema: DTDLSchemaTypes }) => {
            logDebugConsole(
                'info',
                'Updating schema with data. {selectedItem, property, data}',
                selectedItem,
                data
            );

            const selectedItemCopy = deepCopy(selectedItem);
            if (!selectedItemCopy[propertiesKeyName]) {
                selectedItemCopy[propertiesKeyName] = [];
            }
            (selectedItemCopy[propertiesKeyName] as DtdlProperty[]).push(
                getDefaultProperty(
                    data.schema,
                    selectedItemCopy[propertiesKeyName].length
                )
            );

            if (isDTDLModel(selectedItemCopy)) {
                const updateModel = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.UPDATE_MODEL,
                        payload: {
                            model: selectedItemCopy
                        }
                    });
                };

                const undoUpdate = () => {
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

                execute(updateModel, undoUpdate);
            } else if (isDTDLReference(selectedItemCopy)) {
                const updateModel = () => {
                    oatPageDispatch({
                        type: OatPageContextActionType.UPDATE_REFERENCE,
                        payload: {
                            modelId: parentModelId,
                            reference: selectedItemCopy
                        }
                    });
                };

                const undoUpdate = () => {
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

                execute(updateModel, undoUpdate);
            }
        },
        [
            execute,
            oatPageDispatch,
            oatPageState.currentOntologyModelPositions,
            oatPageState.currentOntologyModels,
            oatPageState.selection,
            parentModelId,
            propertiesKeyName,
            selectedItem
        ]
    );

    // side effects

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles(useTheme());
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <Stack className={classNames.root}>
            <Stack.Item>
                <PropertiesModelSummary
                    isSupportedModelType={isSupportedModelType}
                    selectedItem={selectedItem}
                />
            </Stack.Item>
            <Stack.Item>
                <div className={propertyInspectorStyles.propertyListHeaderWrap}>
                    <Stack className={propertyInspectorStyles.rowSpaceBetween}>
                        <Label>{`${t('OATPropertyEditor.properties')} ${
                            propertyList.length > 0
                                ? `(${propertyList.length})`
                                : ''
                        }`}</Label>
                        {isSupportedModelType && (
                            <PropertyTypePicker
                                supportsV3Properties={supportsV3Properties}
                                onSelect={onAddType}
                            />
                        )}
                    </Stack>
                </div>
            </Stack.Item>

            <Stack.Item
                grow
                styles={classNames.subComponentStyles.propertyListStack}
            >
                {(isDTDLReference(selectedItem) ||
                    isDTDLModel(selectedItem)) && (
                    <PropertyList
                        selectedItem={selectedItem}
                        properties={propertyList}
                        parentModelId={parentModelId}
                    />
                )}
            </Stack.Item>
        </Stack>
    );
};

export default styled<
    IEditorPropertiesTabProps,
    IEditorPropertiesTabStyleProps,
    IEditorPropertiesTabStyles
>(EditorPropertiesTab, getStyles);
