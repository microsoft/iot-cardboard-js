import { IIconStyleProps, IIconStyles } from '@fluentui/react';
import { Icon } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { dtdlPropertyTypesEnum } from '../../../../Models/Constants/Constants';
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
    } else if (node.type === DTDLType.Component) {
        iconName = 'OEM';
        iconTitle = t('propertyInspector.component');
    } else if (node.type === DTDLType.Property) {
        iconTitle = t('propertyInspector.property');
        switch (node.schema) {
            case dtdlPropertyTypesEnum.boolean:
                iconName = 'ToggleRight';
                iconTitle = t('propertyInspector.propertyTypes.boolean');
                break;
            case dtdlPropertyTypesEnum.date:
                iconName = 'Calendar';
                iconTitle = t('propertyInspector.propertyTypes.date');
                break;
            case dtdlPropertyTypesEnum.dateTime:
                iconName = 'DateTime';
                iconTitle = t('propertyInspector.propertyTypes.dateTime');
                break;
            case dtdlPropertyTypesEnum.double:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.double');
                break;
            case dtdlPropertyTypesEnum.float:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.float');
                break;
            case dtdlPropertyTypesEnum.long:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.long');
                break;
            case dtdlPropertyTypesEnum.duration:
                iconName = 'BufferTimeBefore';
                iconTitle = t('propertyInspector.propertyTypes.duration');
                break;
            case dtdlPropertyTypesEnum.integer:
                iconName = 'NumberSymbol';
                iconTitle = t('propertyInspector.propertyTypes.integer');
                break;
            case dtdlPropertyTypesEnum.string:
                iconName = 'TextField';
                iconTitle = t('propertyInspector.propertyTypes.string');
                break;
            case dtdlPropertyTypesEnum.time:
                iconName = 'Clock';
                iconTitle = t('propertyInspector.propertyTypes.time');
                break;
            case dtdlPropertyTypesEnum.Object:
                iconName = 'CubeShape';
                iconTitle = t('propertyInspector.propertyTypes.object');
                break;
            case dtdlPropertyTypesEnum.Enum:
                iconName = 'BulletedList2';
                iconTitle = t('propertyInspector.propertyTypes.enum');
                break;
            case dtdlPropertyTypesEnum.Map:
                iconName = 'Code';
                iconTitle = t('propertyInspector.propertyTypes.map');
                break;
            case dtdlPropertyTypesEnum.Array:
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
