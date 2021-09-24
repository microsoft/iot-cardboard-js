import { IIconStyleProps, IIconStyles, TooltipHost } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
    let tooltipInfo: any = t('propertyInspector.property');

    // No icon for metadata or component nodes
    if (node.isMetadata || node.type === DTDLType.Component) return null;

    // Attach info icons to specific property schemas
    switch (node.schema) {
        case dtdlPropertyTypesEnum.date:
            tooltipInfo = t('propertyInspector.schemaInfo.date');
            break;
        case dtdlPropertyTypesEnum.dateTime:
            tooltipInfo = (
                <Trans
                    t={t}
                    i18nKey="propertyInspector.schemaInfo.dateTime"
                    components={{
                        DocLink: (
                            <a
                                href={
                                    'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6'
                                }
                                target="_blank"
                            ></a>
                        )
                    }}
                />
            );
            break;
        case dtdlPropertyTypesEnum.duration:
            tooltipInfo = t('propertyInspector.schemaInfo.duration');
            break;
        case dtdlPropertyTypesEnum.integer:
            tooltipInfo = t('propertyInspector.schemaInfo.integer');
            break;
        case dtdlPropertyTypesEnum.long:
            tooltipInfo = t('propertyInspector.schemaInfo.long');
            break;
        case dtdlPropertyTypesEnum.time:
            tooltipInfo = (
                <Trans
                    t={t}
                    i18nKey="propertyInspector.schemaInfo.time"
                    components={{
                        DocLink: (
                            <a
                                href={
                                    'https://datatracker.ietf.org/doc/html/rfc3339#section-5.6'
                                }
                                target="_blank"
                            ></a>
                        )
                    }}
                />
            );
            break;
        case dtdlPropertyTypesEnum.Map:
            tooltipInfo = (
                <Trans
                    t={t}
                    i18nKey="propertyInspector.schemaInfo.map"
                    components={{
                        DocLink: (
                            <a
                                href={
                                    'https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md#mapkey'
                                }
                                target="_blank"
                            ></a>
                        )
                    }}
                />
            );
            break;
        default:
            return null;
    }

    return (
        <TooltipHost
            content={tooltipInfo}
            tooltipProps={{
                onRenderContent: () => {
                    return tooltipInfo;
                },
                styles: (props) => ({
                    content: {
                        '& a': { color: props.theme.palette.themePrimary }
                    }
                })
            }}
            styles={{
                root: {
                    alignItems: 'center',
                    display: 'flex',
                    marginLeft: '8px',
                    marginTop: '2px'
                }
            }}
        >
            <Icon iconName={iconName} styles={iconStyles} />
        </TooltipHost>
    );
};

export default TreeNodeInfo;
