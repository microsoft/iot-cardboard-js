import { IIconStyleProps, IIconStyles } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import { EntityKind } from 'azure-iot-parser-node';
import React from 'react';
import { useTranslation } from 'react-i18next';
import '../PropertyTree.scss';
import { NodeProps } from '../PropertyTree.types';

const TreeNodeIcon: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    let iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.themePrimary
        }
    });

    let iconName = 'FieldEmpty';
    let iconTitle = t('propertyInspector.property');

    // No icon for metadata nodes
    if (node.isMetadata) return null;

    if (node.isFloating) {
        iconName = 'Warning';
        iconTitle = t('propertyInspector.unmodelledProperty');
        iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
            root: {
                color: props.theme.palette.orange
            }
        });
    } else if (node.type === EntityKind.COMPONENT) {
        iconName = 'OEM';
        iconTitle = t('propertyInspector.component');
    } else if (node.type === EntityKind.PROPERTY) {
        iconTitle = t('propertyInspector.property');
        switch (node.schema) {
            case EntityKind.BOOLEAN:
                iconName = 'ToggleRight';
                iconTitle = t('propertyInspector.propertyTypes.boolean');
                break;
            case EntityKind.DATE:
                iconName = 'Calendar';
                iconTitle = t('propertyInspector.propertyTypes.date');
                break;
            case EntityKind.DATETIME:
                iconName = 'DateTime';
                iconTitle = t('propertyInspector.propertyTypes.dateTime');
                break;
            case EntityKind.DOUBLE:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.double');
                break;
            case EntityKind.FLOAT:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.float');
                break;
            case EntityKind.LONG:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.long');
                break;
            case EntityKind.DURATION:
                iconName = 'BufferTimeBefore';
                iconTitle = t('propertyInspector.propertyTypes.duration');
                break;
            case EntityKind.INTEGER:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.integer');
                break;
            case EntityKind.STRING:
                iconName = 'TextField';
                iconTitle = t('propertyInspector.propertyTypes.string');
                break;
            case EntityKind.TIME:
                iconName = 'Clock';
                iconTitle = t('propertyInspector.propertyTypes.time');
                break;
            case EntityKind.OBJECT:
                iconName = 'CubeShape';
                iconTitle = t('propertyInspector.propertyTypes.object');
                break;
            case EntityKind.ENUM:
                iconName = 'BulletedList2';
                iconTitle = t('propertyInspector.propertyTypes.enum');
                break;
            case EntityKind.MAP:
                iconName = 'Code';
                iconTitle = t('propertyInspector.propertyTypes.map');
                break;
            case EntityKind.ARRAY:
                iconTitle = t('propertyInspector.propertyTypes.array');
                break;
        }
    } else {
        return null;
    }
    return (
        <div className="cb-property-tree-node-icon">
            <Icon
                iconName={iconName}
                styles={iconStyles}
                title={iconTitle}
                aria-label={iconTitle}
            />
        </div>
    );
};

export default TreeNodeIcon;
