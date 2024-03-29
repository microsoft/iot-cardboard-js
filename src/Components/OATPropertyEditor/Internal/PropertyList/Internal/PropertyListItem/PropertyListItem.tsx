import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
    contextHasVersion3,
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

const debugLogging = false;
const logDebugConsole = getDebugLogger('PropertyListItem', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListItemStyleProps,
    IPropertyListItemStyles
>();

const PropertyListItem: React.FC<IPropertyListItemProps> = (props) => {
    const {
        parentModelContext,
        optionDisableInput,
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
        optionHideMenu,
        optionRenderCustomMenuIcon,
        styles
    } = props;

    // state
    const [localName, setLocalName] = useState(item.name);

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
    const supportsV3Properties = useMemo(() => {
        return contextHasVersion3(parentModelContext);
    }, [parentModelContext]);

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onAddChild = useCallback(() => {
        logDebugConsole('debug', 'Adding child. {parentSchema}', item.schema);
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

    const onChangeName = useCallback(
        (_ev, value: string) => {
            setLocalName(value);
        },
        [setLocalName]
    );

    const onSaveName = onUpdateName
        ? useCallback(
              (_ev) => {
                  if (localName !== item.name) {
                      onUpdateName({ name: localName });
                  }
              },
              [item.name, localName, onUpdateName]
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
    useEffect(() => {
        setLocalName(item.name);
    }, [item.name, setLocalName]);

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
                text: t(
                    'OATPropertyEditor.PropertyListItem.ContextMenu.changePropertyTypeLabel'
                ),
                id: 'change-property-type-button',
                disabled: !onUpdateSchema,
                iconProps: { iconName: 'Edit' },
                subMenuProps: {
                    items: getSchemaTypeMenuOptions(
                        onChangeSchemaType,
                        supportsV3Properties
                    ),
                    styles: classNames.subComponentStyles.menuItems
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
            const text = t(
                'OATPropertyEditor.PropertyListItem.ContextMenu.changeChildTypeLabelForArray'
            );
            const subItems: IContextualMenuItem[] = getSchemaTypeMenuOptions(
                onChange,
                supportsV3Properties
            );
            options.push({
                key: 'change-child-type',
                text: text,
                iconProps: { iconName: 'Switch' },
                id: 'change-child-type',
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
            const text = t(
                'OATPropertyEditor.PropertyListItem.ContextMenu.changeChildTypeLabelForEnum'
            );
            const subItems: IContextualMenuItem[] = [
                {
                    key: 'integer',
                    text: t('OATPropertyEditor.integer'),
                    'data-testid': 'property-item-menu-child-type-integer',
                    iconProps: { iconName: 'anything' }, // needed to trigger icon render, but value not used
                    onRenderIcon: () => onRenderIcon('integer'),
                    onClick: () => onChange('integer')
                },
                {
                    key: 'string',
                    text: t('OATPropertyEditor.string'),
                    'data-testid': 'property-item-menu-child-type-string',
                    iconProps: { iconName: 'anything' }, // needed to trigger icon render, but value not used
                    onRenderIcon: () => onRenderIcon('string'),
                    onClick: () => onChange('string')
                }
            ];
            options.push({
                key: 'change-child-type',
                'data-testid': 'property-item-menu-change-child-type',
                text: text,
                id: 'change-child-type-button',
                iconProps: { iconName: 'Switch' },
                subMenuProps: {
                    items: subItems
                }
            });
        }
        options.push(
            {
                key: 'change-metadata-type',
                text: t(
                    'OATPropertyEditor.PropertyListItem.ContextMenu.editMetadataLabel'
                ),
                id: 'change-metadata-button',
                'data-testid': 'property-item-menu-edit-metadata',
                disabled: true,
                iconProps: { iconName: 'DocumentManagement' },
                onClick: () => {
                    //
                }
            },
            {
                key: 'move-up',
                text: t('moveUp'),
                id: 'move-up-button',
                'data-testid': 'property-item-menu-move-up',
                disabled: isFirstItem,
                iconProps: { iconName: 'Up' },
                onClick: onMoveUp
            },
            {
                key: 'move-down',
                text: t('moveDown'),
                id: 'move-down-button',
                'data-testid': 'property-item-menu-move-down',
                disabled: isLastItem,
                iconProps: { iconName: 'Down' },
                onClick: onMoveDown
            },
            {
                key: 'duplicate',
                text: t('duplicate'),
                id: 'duplicate-button',
                'data-testid': 'property-item-menu-duplicate',
                disabled: !onCopy,
                iconProps: { iconName: 'Copy' },
                onClick: onCopy
            },
            {
                key: 'remove',
                text: t('remove'),
                id: 'remove-button',
                'data-testid': 'property-item-menu-remove',
                disabled: !onRemove,
                iconProps: { iconName: 'Delete' },
                onClick: onRemove
            }
        );
        return options;
    }, [
        classNames.subComponentStyles.childTypeSubMenuIcon,
        classNames.subComponentStyles.menuItems,
        isFirstItem,
        isLastItem,
        item,
        onChangeSchemaType,
        onCopy,
        onMoveDown,
        onMoveUp,
        onRemove,
        onUpdateSchema,
        supportsV3Properties,
        t
    ]);

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
                        disabled={optionDisableInput}
                        readOnly={!onSaveName}
                        onRenderInput={(props, defaultRenderer) => {
                            return (
                                <>
                                    {optionRenderCustomMenuIcon ? (
                                        optionRenderCustomMenuIcon(item)
                                    ) : (
                                        <PropertyIcon
                                            schema={item.schema}
                                            styles={
                                                classNames.subComponentStyles
                                                    .inputIcon
                                            }
                                        />
                                    )}
                                    {defaultRenderer(props)}
                                </>
                            );
                        }}
                        onChange={onChangeName}
                        onBlur={onSaveName}
                        value={localName}
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
                {optionHideMenu ? (
                    <span className={classNames.buttonSpacer} />
                ) : (
                    <OverflowMenu
                        index={indexKey}
                        isFocusable={true}
                        menuKey={'property-list'}
                        menuProps={{
                            items: overflowMenuItems
                        }}
                    />
                )}
            </Stack>
            {isExpanded && hasComplexSchemaType(item) && (
                <PropertyListItemChildHost
                    parentModelContext={parentModelContext}
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
