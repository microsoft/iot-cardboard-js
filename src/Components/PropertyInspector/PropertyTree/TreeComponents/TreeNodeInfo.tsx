import { IIconStyleProps, IIconStyles, TooltipHost } from '@fluentui/react';
import { Icon } from '@fluentui/react';
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
    let ariaLabel = t('propertyInspector.property');

    // No icon for metadata or component nodes
    if (node.isMetadata || node.isFloating || node.type === DTDLType.Component)
        return null;

    // Attach info icons to specific property schemas
    switch (node.schema) {
        case dtdlPropertyTypesEnum.date:
            tooltipInfo = t('propertyInspector.schemaInfo.date.text');
            ariaLabel = t('propertyInspector.schemaInfo.date.ariaLabel');
            break;
        case dtdlPropertyTypesEnum.dateTime:
            tooltipInfo = (
                <Trans
                    t={t}
                    i18nKey="propertyInspector.schemaInfo.dateTime.text"
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
            ariaLabel = t('propertyInspector.schemaInfo.dateTime.ariaLabel');
            break;
        case dtdlPropertyTypesEnum.duration:
            tooltipInfo = t('propertyInspector.schemaInfo.duration.text');
            ariaLabel = t('propertyInspector.schemaInfo.duration.ariaLabel');
            break;
        case dtdlPropertyTypesEnum.integer:
            tooltipInfo = t('propertyInspector.schemaInfo.integer.text');
            ariaLabel = t('propertyInspector.schemaInfo.integer.ariaLabel');
            break;
        case dtdlPropertyTypesEnum.long:
            tooltipInfo = t('propertyInspector.schemaInfo.long.text');
            ariaLabel = t('propertyInspector.schemaInfo.long.ariaLabel');
            break;
        case dtdlPropertyTypesEnum.time:
            tooltipInfo = (
                <Trans
                    t={t}
                    i18nKey="propertyInspector.schemaInfo.time.text"
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
            ariaLabel = t('propertyInspector.schemaInfo.time.ariaLabel');
            break;
        case dtdlPropertyTypesEnum.Map:
            tooltipInfo = (
                <Trans
                    t={t}
                    i18nKey="propertyInspector.schemaInfo.map.text"
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
            ariaLabel = t('propertyInspector.schemaInfo.map.ariaLabel');
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
            <Icon
                iconName={iconName}
                styles={iconStyles}
                aria-label={ariaLabel}
            />
        </TooltipHost>
    );
};

export default TreeNodeInfo;
