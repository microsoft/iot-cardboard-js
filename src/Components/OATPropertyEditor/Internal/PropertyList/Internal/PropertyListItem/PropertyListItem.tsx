import React, { useCallback, useMemo } from 'react';
import {
    IPropertyListItemProps,
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
} from './PropertyListItem.types';
import { getStyles } from './PropertyListItem.styles';
import {
    classNamesFunction,
    IconButton,
    Stack,
    styled,
    TextField
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { useOatPageContext } from '../../../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../../../Models/Context/OatPageContext/OatPageContext.types';
import {
    hasComplexSchemaType,
    isComplexSchemaType,
    isDTDLModel,
    isDTDLRelationshipReference
} from '../../../../../../Models/Services/DtdlUtils';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { OverflowMenu } from '../../../../../OverflowMenu/OverflowMenu';
import PropertyIcon from './Internal/PropertyIcon/PropertyIcon';
import PropertyListItemChildHost from './Internal/PropertyListItemChildHost/PropertyListItemChildHost';
import { name } from '@babylonjs/gui';

const debugLogging = true;
const logDebugConsole = getDebugLogger('PropertyListItem', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
>();

const PropertyListItem: React.FC<IPropertyListItemProps> = (props) => {
    const { propertyItem, propertyIndex, parentEntity, level, styles } = props;

    // contexts
    const { oatPageDispatch } = useOatPageContext();

    // state
    const [isExpanded, { toggle: toggleIsExpanded }] = useBoolean(true);

    // data
    const isNestedType = useMemo(
        () => isComplexSchemaType(propertyItem.schema),
        [propertyItem]
    );
    const overflowMenuItems = [];
    const itemLevel = level ?? 1; // default to level 1 (not nested)

    // hooks

    // callbacks
    const onAddChild = useCallback(() => {
        //
    }, []);
    const onChangeName = useCallback(
        (_ev, value: string) => {
            if (isDTDLModel(parentEntity)) {
                // update for model
                const updatedContents = [...parentEntity.contents];
                updatedContents[propertyIndex].name = value;
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_MODEL,
                    payload: {
                        model: {
                            ...parentEntity,
                            contents: updatedContents
                        }
                    }
                });
            } else if (isDTDLRelationshipReference(parentEntity)) {
                // update for relationships (NOTE: components don't have properties)
                const updatedProperty = parentEntity.properties[propertyIndex];
                updatedProperty.name = value;
                oatPageDispatch({
                    type: OatPageContextActionType.UPDATE_REFERENCE,
                    payload: {
                        modelId: parentEntity['@id'],
                        reference: updatedProperty
                    }
                });
            }
        },
        [oatPageDispatch, parentEntity, propertyIndex]
    );

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        level: itemLevel,
        theme: useExtendedTheme()
    });

    logDebugConsole(
        'debug',
        'Render. {property, isNested, level}',
        propertyItem,
        isNestedType,
        level
    );

    return (
        <Stack>
            <Stack
                horizontal
                className={classNames.root}
                tokens={{ childrenGap: 4 }}
            >
                {isNestedType && (
                    <IconButton
                        iconProps={{
                            iconName: isExpanded
                                ? 'ChevronDown'
                                : 'ChevronRight'
                        }}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                        onClick={toggleIsExpanded}
                        styles={classNames.subComponentStyles.expandButton?.()}
                    />
                )}
                <Stack.Item grow>
                    <TextField
                        onRenderInput={(props, defaultRenderer) => {
                            return (
                                <>
                                    <PropertyIcon
                                        schema={propertyItem.schema}
                                    />
                                    {defaultRenderer(props)}
                                </>
                            );
                        }}
                        onChange={onChangeName}
                        value={propertyItem.name}
                        styles={classNames.subComponentStyles.nameTextField}
                    />
                </Stack.Item>
                {/* show/hide on hover/focus */}
                {isNestedType && (
                    <IconButton
                        iconProps={{ iconName: 'Add' }}
                        title={'Add child property'}
                        onClick={onAddChild}
                        className={classNames.addChildButton}
                    />
                )}
                {!isNestedType && <span className={classNames.buttonSpacer} />}
                <OverflowMenu
                    index={propertyIndex}
                    menuKey={'property-list'}
                    menuProps={{
                        items: overflowMenuItems
                    }}
                />
            </Stack>
            {isExpanded && hasComplexSchemaType(propertyItem) && (
                <PropertyListItemChildHost
                    level={itemLevel}
                    propertyItem={propertyItem}
                />
            )}
        </Stack>
    );
};

export default styled<
    IPropertyListItemProps,
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
>(PropertyListItem, getStyles);
