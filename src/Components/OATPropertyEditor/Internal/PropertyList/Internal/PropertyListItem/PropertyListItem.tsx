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
    getDefaultSchemaByType,
    hasArraySchemaType,
    hasComplexSchemaType,
    hasEnumSchemaType,
    isComplexSchemaType,
    updateEnumValueSchema
} from '../../../../../../Models/Services/DtdlUtils';
import {
    deepCopy,
    getDebugLogger
} from '../../../../../../Models/Services/Utils';
import { OverflowMenu } from '../../../../../OverflowMenu/OverflowMenu';
import PropertyIcon from './Internal/PropertyIcon/PropertyIcon';
import PropertyListItemChildHost from './Internal/PropertyListItemChildHost/PropertyListItemChildHost';
import {
    DTDLSchemaType,
    DTDLSchemaTypes
} from '../../../../../../Models/Classes/DTDL';
import { useTranslation } from 'react-i18next';
import { getSchemaTypeMenuOptions } from '../../../../../../Models/Constants/OatConstants';
import { DtdlEnumValueSchema } from '../../../../../..';

const debugLogging = true;
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
        onCopy,
        onUpdateName,
        onUpdateSchema,
        onRemove,
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
        (args: { schema: DTDLSchemaTypes }) => {
            const newSchema = getDefaultSchemaByType(args.schema);
            logDebugConsole(
                'debug',
                'Change schema to type {type, newSchema}',
                args.schema,
                newSchema
            );
            onUpdateSchema(newSchema);
        },
        [onUpdateSchema]
    );

    const onChangeName = onUpdateName
        ? useCallback(
              (_ev, value: string) => {
                  onUpdateName({ name: value });
              },
              [onUpdateName]
          )
        : undefined;

    const onMoveUp = onReorderItem
        ? useCallback(() => {
              onReorderItem('Up');
          }, [onReorderItem])
        : undefined;
    const onMoveDown = onReorderItem
        ? useCallback(() => {
              onReorderItem('Down');
          }, [onReorderItem])
        : undefined;

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        hasChildren: isNestedType,
        level: itemLevel,
        theme: useExtendedTheme()
    });

    // data
    const overflowMenuItems: IContextualMenuItem[] = useMemo(() => {
        const options: IContextualMenuItem[] = [
            {
                key: 'change-property-type',
                text: 'Edit property type',
                disabled: !onUpdateSchema,
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
            }
        ];
        if (hasArraySchemaType(item)) {
            const onChange = (args: { schema: DTDLSchemaTypes }) => {
                // early abort if the type didn't actually change
                if (args.schema === item.schema.elementSchema) {
                    return;
                }
                const schemaCopy = deepCopy(item.schema);
                schemaCopy.elementSchema = getDefaultSchemaByType(args.schema);
                onUpdateSchema(schemaCopy);
            };
            const text = 'Change array item type';
            const subItems: IContextualMenuItem[] = getSchemaTypeMenuOptions(
                onChange
            );
            options.push({
                key: 'change-child-type',
                text: text,
                iconProps: { iconName: '' }, // TODO: find the right icon
                subMenuProps: {
                    items: subItems
                }
            });
        } else if (hasEnumSchemaType(item)) {
            const onChange = (enumSchema: DtdlEnumValueSchema) => {
                // early abort if the type didn't actually change
                if (enumSchema === item.schema.valueSchema) {
                    return;
                }
                const updatedItem = updateEnumValueSchema(item, enumSchema);
                onUpdateSchema(updatedItem.schema);
            };
            const onRenderIcon = (schema: DtdlEnumValueSchema) => (
                <PropertyIcon
                    schema={schema}
                    styles={classNames.subComponentStyles.childTypeSubMenuIcon}
                />
            );
            const text = 'Change enum value type';
            const subItems: IContextualMenuItem[] = [
                {
                    key: 'integer',
                    text: 'integer',
                    iconProps: { iconName: 'anything' }, // needed to trigger icon render, but value not used
                    onRenderIcon: () => onRenderIcon('integer'),
                    onClick: () => onChange('integer')
                },
                {
                    key: 'string',
                    text: 'string',
                    iconProps: { iconName: 'anything' }, // needed to trigger icon render, but value not used
                    onRenderIcon: () => onRenderIcon('string'),
                    onClick: () => onChange('string')
                }
            ];
            options.push({
                key: 'change-child-type',
                text: text,
                iconProps: { iconName: '' }, // TODO: find the right icon
                subMenuProps: {
                    items: subItems
                }
            });
        }
        options.push(
            {
                key: 'change-metadata-type',
                text: 'Edit metadata',
                disabled: true,
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
                disabled: !onCopy,
                iconProps: { iconName: 'Copy' },
                onClick: onCopy
            },
            {
                key: 'remove',
                text: 'Remove',
                disabled: !onRemove,
                iconProps: { iconName: 'Delete' },
                onClick: onRemove
            }
        );
        return options;
    }, [
        classNames.subComponentStyles.childTypeSubMenuIcon,
        isFirstItem,
        isLastItem,
        item,
        onChangeSchemaType,
        onCopy,
        onMoveDown,
        onMoveUp,
        onRemove,
        onUpdateSchema
    ]);

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
                    isFocusable={true}
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
                    onDuplicate={onCopy}
                    onUpdateSchema={onUpdateSchema}
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
