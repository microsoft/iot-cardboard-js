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

    const onChangeName = useCallback(
        (_ev, value: string) => {
            onUpdateName({ name: value });
        },
        [onUpdateName]
    );

    const onMoveUp = useCallback(() => {
        onReorderItem('Up');
    }, [onReorderItem]);
    const onMoveDown = useCallback(() => {
        onReorderItem('Down');
    }, [onReorderItem]);

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
        },
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
                    onDuplicate={onCopy}
                    onRemove={onRemove}
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
