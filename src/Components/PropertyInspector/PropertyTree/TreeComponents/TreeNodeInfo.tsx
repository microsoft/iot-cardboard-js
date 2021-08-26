import {
    ICalloutContentStyleProps,
    ICalloutContentStyles,
    IIconStyleProps,
    IIconStyles,
    TooltipHost
} from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { dtdlPropertyTypesEnum } from '../../../../Models/Constants/Constants';
import '../PropertyTree.scss';
import { NodeProps } from '../PropertyTree.types';

const TreeNodeInfo: React.FC<NodeProps> = ({ node }) => {
    const { t } = useTranslation();
    const iconStyles = (props: IIconStyleProps): Partial<IIconStyles> => ({
        root: {
            color: props.theme.palette.neutralPrimary
        }
    });

    const iconName = 'Info';
    let tooltipInfo = t('propertyInspector.property');

    // No icon for metadata or component nodes
    if (node.isMetadata || node.type === DTDLType.Component) return null;

    // Attach info icons to specific property schemas
    switch (node.schema) {
        case dtdlPropertyTypesEnum.date:
            tooltipInfo = t('propertyInspector.schemaInfo.date');
            break;
        case dtdlPropertyTypesEnum.dateTime:
            tooltipInfo = t('propertyInspector.schemaInfo.dateTime');
            break;
        case dtdlPropertyTypesEnum.duration:
            tooltipInfo = t('propertyInspector.schemaInfo.duration');
            break;
        case dtdlPropertyTypesEnum.integer:
            tooltipInfo = t('propertyInspector.schemaInfo.integer');
            break;
        case dtdlPropertyTypesEnum.time:
            tooltipInfo = t('propertyInspector.schemaInfo.time');
            break;
        default:
            return null;
    }

    const tooltipStyles = (
        props: ICalloutContentStyleProps
    ): Partial<ICalloutContentStyles> => ({
        beak: {
            backgroundColor: props.theme.palette.neutralTertiaryAlt
        },
        beakCurtain: {
            backgroundColor: props.theme.palette.neutralTertiaryAlt
        },
        calloutMain: {
            backgroundColor: props.theme.palette.neutralTertiaryAlt
        },
        root: {
            backgroundColor: props.theme.palette.neutralTertiaryAlt
        }
    });

    return (
        <TooltipHost
            content={tooltipInfo}
            styles={{
                root: {
                    alignItems: 'center',
                    display: 'flex',
                    marginLeft: '8px',
                    marginTop: '2px'
                }
            }}
            tooltipProps={{
                calloutProps: {
                    styles: tooltipStyles
                }
            }}
        >
            <Icon iconName={iconName} styles={iconStyles} />
        </TooltipHost>
    );
};

export default TreeNodeInfo;
