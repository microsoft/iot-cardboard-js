import React, { useContext, useEffect, useState } from 'react';
import { dtdlPropertyTypesEnum } from '../../../..';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps, PropertyTreeNode } from '../PropertyTree.types';
import '../PropertyTree.scss';
import { useTranslation } from 'react-i18next';
import {
    Checkbox,
    IconButton,
    IIconStyleProps,
    IIconStyles
} from '@fluentui/react';
import { DateTimeValue } from './TreeNodeDateTimeValue';

const TreeNodeValue: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const {
        onNodeValueChange,
        onNodeValueUnset,
        readonly,
        isTreeEdited
    } = useContext(PropertyTreeContext);
    const propertyType = node.schema;

    const nodeValueClassname = `cb-property-tree-node-value ${
        node.edited ? 'cb-property-tree-node-value-edited' : ''
    }`;

    const readOnlyValueClassname =
        'cb-property-tree-node-value cb-property-tree-node-value-readonly';

    switch (propertyType) {
        case dtdlPropertyTypesEnum.boolean:
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <Checkbox
                        label={node.value ? t('true') : t('false')}
                        checked={(node.value as boolean) || false}
                        onChange={(_e, checked) =>
                            onNodeValueChange(node, checked)
                        }
                        styles={{
                            checkbox: {
                                width: 16,
                                height: 16,
                                border: '1px solid var(--cb-color-card-border)'
                            },
                            label: {
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }}
                    />
                </div>
            );
        case dtdlPropertyTypesEnum.date:
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <DateTimeValue
                    iconName="Calendar"
                    node={node}
                    pickerTitle={t(
                        'propertyInspector.dateTimePicker.datePickerTitle'
                    )}
                    inputProps={{
                        placeholder: 'yyyy-mm-dd',
                        value: node.value as string,
                        style: { width: 72 }
                    }}
                    type="date"
                />
            );
        case dtdlPropertyTypesEnum.dateTime:
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <DateTimeValue
                    iconName="DateTime"
                    node={node}
                    pickerTitle={t(
                        'propertyInspector.dateTimePicker.dateTimePickerTitle'
                    )}
                    step={'1'}
                    inputProps={{
                        placeholder: 'yyyy-mm-ddThh:mm:ss',
                        value: node.value as string,
                        style: { width: 172 }
                    }}
                    type="datetime-local"
                />
            );
        case dtdlPropertyTypesEnum.integer:
        case dtdlPropertyTypesEnum.long:
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 88 }}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '.'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.double:
        case dtdlPropertyTypesEnum.float:
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 88 }}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+'].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.duration: // take ms or s and convert to standard notation
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        placeholder="PnYnMnDTnHnMnS"
                        value={node.value as string}
                        style={{ width: 136 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.string:
            if (node.readonly || readonly) {
                return (
                    <div
                        className={`${readOnlyValueClassname}${
                            node.isMetadata
                                ? ' cb-property-tree-node-value-metadata'
                                : ''
                        }${
                            node.isFloating
                                ? ' cb-property-tree-node-value-floating'
                                : ''
                        }${
                            isTreeEdited
                                ? ' cb-property-tree-node-floating-strikethrough'
                                : ''
                        }`}
                    >
                        {node.value}
                    </div>
                );
            } else {
                return (
                    <div className={nodeValueClassname}>
                        <textarea
                            value={node.value as string}
                            style={{
                                width: 72,
                                height: 17,
                                padding: '1px 4px',
                                ...((node.value as string).length > 0 && {
                                    minWidth: 120,
                                    minHeight: 24
                                })
                            }}
                            onChange={(e) =>
                                onNodeValueChange(node, e.target.value)
                            }
                        ></textarea>
                    </div>
                );
            }

        case dtdlPropertyTypesEnum.time:
            if (readonly) {
                return (
                    <div className={readOnlyValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <DateTimeValue
                    iconName="Clock"
                    node={node}
                    pickerTitle={t(
                        'propertyInspector.dateTimePicker.timePickerTitle'
                    )}
                    step={'1'}
                    inputProps={{
                        placeholder: 'hh:mm:ss',
                        value: node.value as string,
                        style: { width: 92 }
                    }}
                    type="time"
                />
            );
        case dtdlPropertyTypesEnum.Enum:
            return (
                <div className={nodeValueClassname}>
                    <select
                        value={
                            (node.value as string | number) ??
                            'cb-property-tree-enum-unset'
                        }
                        style={{ height: 21 }}
                        onChange={(e) => {
                            if (
                                e.target.value === 'cb-property-tree-enum-unset'
                            ) {
                                onNodeValueUnset(node);
                            } else {
                                onNodeValueChange(node, e.target.value);
                            }
                        }}
                        disabled={readonly}
                    >
                        <option value={'cb-property-tree-enum-unset'}>
                            --
                        </option>
                        {node.complexPropertyData.options.map((ev, idx) => {
                            return (
                                <option value={ev.enumValue} key={idx}>
                                    {ev.displayName ?? ev.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            );
        case dtdlPropertyTypesEnum.Map: {
            return <MapProperty readonly={readonly} node={node} />;
        }
        case dtdlPropertyTypesEnum.Array:
        default:
            return null;
    }
};

const MapProperty: React.FC<{ node: PropertyTreeNode; readonly: boolean }> = ({
    node,
    readonly
}) => {
    const { t } = useTranslation();
    const { onAddMapValue } = useContext(PropertyTreeContext);
    const [newMapKey, setNewMapKey] = useState('');

    useEffect(() => {
        setNewMapKey('');
    }, [node.isSet]);

    const isAddMapValueDisabled =
        newMapKey === '' ||
        (node.children &&
            node.children.findIndex((c) => c.name === newMapKey) !== -1);

    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimaryAlt,
            opacity: isAddMapValueDisabled ? 0.5 : 1
        }
    });

    const handleAddMapValue = () => {
        if (!isAddMapValueDisabled) {
            onAddMapValue(node, newMapKey);
            setNewMapKey('');
        }
    };

    const handleChangeMapKey = (e) => {
        let newVal = e.target.value;
        // Strip invalid map key characters
        newVal = newVal.replace(/[^a-zA-Z0-9_]/g, '');
        setNewMapKey(newVal);
    };

    if (readonly) return null;

    return (
        <div className={`cb-property-tree-node-value`}>
            <input
                style={{ width: 120 }}
                value={newMapKey}
                onChange={(e) => handleChangeMapKey(e)}
                placeholder={t('propertyInspector.mapKeyPlaceholder')}
                onKeyDown={(e) =>
                    e.key === 'Enter' ? handleAddMapValue() : null
                }
            ></input>
            <IconButton
                ariaLabel={t('propertyInspector.addMapIconTitle')}
                className={`cb-property-tree-node-map-add-icon-container${
                    isAddMapValueDisabled ? ' cb-add-map-disabled' : ''
                }`}
                onClick={handleAddMapValue}
                iconProps={{
                    iconName: 'AddTo',
                    styles: iconStyles
                }}
            />
        </div>
    );
};

export default TreeNodeValue;
