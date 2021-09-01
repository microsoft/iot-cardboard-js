import React, { useContext, useEffect, useState } from 'react';
import { dtdlPropertyTypesEnum } from '../../../..';
import { PropertyTreeContext } from '../PropertyTree';
import { NodeProps } from '../PropertyTree.types';
import '../PropertyTree.scss';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@fluentui/react/lib/components/Checkbox/Checkbox';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import {
    IIconStyleProps,
    IIconStyles
} from '@fluentui/react/lib/components/Icon/Icon.types';

const TreeNodeValue: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const { onNodeValueChange, readonly } = useContext(PropertyTreeContext);
    const propertyType = node.schema;

    const nodeValueClassname = `cb-property-tree-node-value ${
        node.edited ? 'cb-property-tree-node-value-edited' : ''
    }`;

    switch (propertyType) {
        case dtdlPropertyTypesEnum.boolean:
            if (readonly) {
                return (
                    <div className={nodeValueClassname}>
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
                    <div className={nodeValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        placeholder="yyyy-mm-dd"
                        pattern="\d{4}-\d{2}-\d{2}"
                        value={node.value as string}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.dateTime:
            if (readonly) {
                return (
                    <div className={nodeValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        placeholder="yyyy-mm-ddThh:mm:ss"
                        value={node.value as string}
                        style={{ width: 172 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.double:
        case dtdlPropertyTypesEnum.float:
        case dtdlPropertyTypesEnum.long:
            if (readonly) {
                return (
                    <div className={nodeValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 60 }}
                        onChange={(e) =>
                            onNodeValueChange(node, Number(e.target.value))
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.duration: // take ms or s and convert to standard notation
            if (readonly) {
                return (
                    <div className={nodeValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        value={node.value as string}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.integer:
            if (readonly) {
                return (
                    <div className={nodeValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        type="number"
                        value={node.value as number}
                        style={{ width: 72 }}
                        onChange={(e) =>
                            onNodeValueChange(node, Number(e.target.value))
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.string:
            if (!node.writable || readonly) {
                return (
                    <div
                        className={`${nodeValueClassname} ${
                            node.isMetadata
                                ? 'cb-property-tree-node-value-metadata'
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
                                padding: '1px 2px'
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
                    <div className={nodeValueClassname}>
                        {String(node.value)}
                    </div>
                );
            }
            return (
                <div className={nodeValueClassname}>
                    <input
                        placeholder="hh:mm:ss"
                        value={node.value as string}
                        style={{ width: 92 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                    ></input>
                </div>
            );
        case dtdlPropertyTypesEnum.Enum:
            return (
                <div className={nodeValueClassname}>
                    <select
                        value={(node.value as string | number) ?? 'enum-unset'}
                        style={{ height: 21 }}
                        onChange={(e) =>
                            onNodeValueChange(node, e.target.value)
                        }
                        disabled={readonly}
                    >
                        <option value={'enum-unset'}>--</option>
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
            return <MapProperty node={node} />;
        }
        case dtdlPropertyTypesEnum.Array:
        default:
            return null;
    }
};

const MapProperty: React.FC<NodeProps> = ({ node }) => {
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

    if (!node.isSet) return null;

    return (
        <div className={`cb-property-tree-node-value`}>
            <input
                style={{ width: 92 }}
                value={newMapKey}
                onChange={(e) => setNewMapKey(e.target.value)}
                placeholder={t('propertyInspector.mapKeyPlaceholder')}
                onKeyDown={(e) =>
                    e.key === 'Enter' ? handleAddMapValue() : null
                }
            ></input>
            <div
                className={`cb-property-tree-node-map-add-icon-container${
                    isAddMapValueDisabled ? ' cb-add-map-disabled' : ''
                }`}
                onClick={handleAddMapValue}
            >
                <Icon
                    title={t('propertyInspector.addMapIconTitle')}
                    iconName={'AddTo'}
                    styles={iconStyles}
                />
            </div>
        </div>
    );
};

export default TreeNodeValue;
