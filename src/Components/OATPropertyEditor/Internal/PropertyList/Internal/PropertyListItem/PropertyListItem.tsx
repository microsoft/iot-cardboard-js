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
    IContextualMenuItem,
    Stack,
    styled,
    TextField
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import {
    addChildToSchema,
    hasComplexSchemaType,
    hasEnumSchemaType,
    isComplexSchemaType
} from '../../../../../../Models/Services/DtdlUtils';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { OverflowMenu } from '../../../../../OverflowMenu/OverflowMenu';
import PropertyIcon from './Internal/PropertyIcon/PropertyIcon';
import PropertyListItemChildHost from './Internal/PropertyListItemChildHost/PropertyListItemChildHost';
import {
    DTDLSchemaType,
    DTDLSchemaTypes
} from '../../../../../../Models/Classes/DTDL';
import { useTranslation } from 'react-i18next';
import { getSchemaTypeMenuOptions } from '../../../../../../Models/Constants/OatConstants';

const debugLogging = true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logDebugConsole = getDebugLogger('PropertyListItem', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
>();

const PropertyListItem: React.FC<IPropertyListItemProps> = (props) => {
    const {
        disableInput,
        indexKey,
        item,
        isFirstItem,
        isLastItem,
        level,
        onUpdateName,
        onUpdateSchema,
        onReorderItem,
        styles
    } = props;

    // contexts

    // state
    const [
        isExpanded,
        { toggle: toggleIsExpanded, setTrue: setExpandedTrue }
    ] = useBoolean(true);

    // data
    const isNestedType = useMemo(() => isComplexSchemaType(item.schema), [
        item
    ]);
    const supportsAddingChildren = useMemo(
        () =>
            typeof item.schema === 'object' &&
            [DTDLSchemaType.Enum, DTDLSchemaType.Object].includes(
                item.schema['@type']
            ),
        [item]
    );
    const itemLevel = level ?? 1; // default to level 1 (not nested)

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onAddChild = useCallback(() => {
        setExpandedTrue();
        onUpdateSchema(addChildToSchema({ parentSchema: item.schema }));
    }, [item.schema, onUpdateSchema, setExpandedTrue]);
    const onChangeSchemaType = useCallback(
        (args: { type: DTDLSchemaTypes }) => {
            alert(`Not implemented. Change to type ${args.type}`);
            // TODO: initialize schema and then send to parent
            // onUpdateSchema(item.schema);
        },
        []
    );

    const onChangeName = useCallback(
        (_ev, value: string) => {
            onUpdateName({ name: value });
            // item.name = value;
            // onUpdateSchema();
            // if (isDTDLModel(parentEntity)) {
            //     // update for model
            //     const updatedContents = [...parentEntity.contents];
            //     updatedContents[propertyIndex].name = value;
            //     oatPageDispatch({
            //         type: OatPageContextActionType.UPDATE_MODEL,
            //         payload: {
            //             model: {
            //                 ...parentEntity,
            //                 contents: updatedContents
            //             }
            //         }
            //     });
            // } else if (isDTDLRelationshipReference(parentEntity)) {
            //     // update for relationships (NOTE: components don't have properties)
            //     const updatedProperty = parentEntity.properties[propertyIndex];
            //     updatedProperty.name = value;
            //     oatPageDispatch({
            //         type: OatPageContextActionType.UPDATE_REFERENCE,
            //         payload: {
            //             modelId: parentEntity['@id'],
            //             reference: updatedProperty
            //         }
            //     });
            // }
        },
        [onUpdateName]
    );

    const onMoveUp = useCallback(() => {
        onReorderItem('Up');
    }, [onReorderItem]);
    const onMoveDown = useCallback(() => {
        onReorderItem('Down');
    }, [onReorderItem]);

    const onCopy = useCallback(() => {
        alert('Not implemented');
    }, []);
    const onDelete = useCallback(() => {
        alert('Not implemented');
    }, []);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        hasChildren: isNestedType,
        level: itemLevel,
        theme: useExtendedTheme()
    });

    // data
    const overflowMenuItems: IContextualMenuItem[] = [
        {
            key: 'change-property-type',
            text: 'Edit property type',
            iconProps: { iconName: 'Edit' },
            subMenuProps: {
                items: getSchemaTypeMenuOptions(onChangeSchemaType),
                styles: {
                    subComponentStyles: {
                        menuItem: {
                            '.ms-ContextualMenu-link': {
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }
                    }
                }
            }
        },
        {
            key: 'change-metadata-type',
            text: 'Edit metadata',
            iconProps: { iconName: 'DocumentManagement' },
            onClick: () => {
                //
            }
        },
        {
            key: 'move-up',
            text: 'Move up',
            disabled: isFirstItem,
            iconProps: { iconName: 'Up' },
            onClick: onMoveUp
        },
        {
            key: 'move-down',
            text: 'Move down',
            disabled: isLastItem,
            iconProps: { iconName: 'Down' },
            onClick: onMoveDown
        },
        {
            key: 'duplicate',
            text: 'Duplicate',
            iconProps: { iconName: 'Copy' },
            onClick: onCopy
        },
        {
            key: 'remove',
            text: 'Remove',
            iconProps: { iconName: 'Delete' },
            onClick: onDelete
        }
    ];

    // logDebugConsole(
    //     'debug',
    //     'Render. {property, level, isNested, canAddChildren}',
    //     item,
    //     level,
    //     isNestedType,
    //     supportsAddingChildren
    // );

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
                        title={
                            isExpanded
                                ? t('OATPropertyEditor.collapse')
                                : t('OATPropertyEditor.expand')
                        }
                        onClick={toggleIsExpanded}
                        styles={classNames.subComponentStyles.expandButton?.()}
                    />
                )}
                <Stack.Item grow>
                    <TextField
                        disabled={disableInput}
                        onRenderInput={(props, defaultRenderer) => {
                            return (
                                <>
                                    <PropertyIcon
                                        schema={item.schema}
                                        styles={
                                            classNames.subComponentStyles
                                                .inputIcon
                                        }
                                    />
                                    {defaultRenderer(props)}
                                </>
                            );
                        }}
                        onChange={onChangeName}
                        value={item.name}
                        styles={classNames.subComponentStyles.nameTextField}
                    />
                </Stack.Item>
                {supportsAddingChildren && (
                    <IconButton
                        iconProps={{ iconName: 'Add' }}
                        title={
                            hasEnumSchemaType(item)
                                ? t('OATPropertyEditor.addEnumValue')
                                : t('OATPropertyEditor.addProperty')
                        }
                        onClick={onAddChild}
                        className={classNames.addChildButton}
                    />
                )}
                {!supportsAddingChildren && (
                    <span className={classNames.buttonSpacer} />
                )}
                <OverflowMenu
                    index={indexKey}
                    menuKey={'property-list'}
                    menuProps={{
                        items: overflowMenuItems
                    }}
                />
            </Stack>
            {isExpanded && hasComplexSchemaType(item) && (
                <PropertyListItemChildHost
                    indexKey={indexKey}
                    level={itemLevel}
                    propertyItem={item}
                    onUpdateName={onUpdateName}
                    onUpdateSchema={onUpdateSchema}
                    onReorderItem={onReorderItem}
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
