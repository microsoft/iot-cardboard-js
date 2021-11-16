import { IIconStyleProps, IIconStyles, TooltipHost } from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/components/Icon/Icon';
import { EntityKind } from 'azure-iot-parser-node';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
    if (
        node.isMetadata ||
        node.isFloating ||
        node.type === EntityKind.COMPONENT
    )
        return null;

    // Attach info icons to specific property schemas
    switch (node.schema) {
        case EntityKind.DATE:
            tooltipInfo = t('propertyInspector.schemaInfo.date.text');
            ariaLabel = t('propertyInspector.schemaInfo.date.ariaLabel');
            break;
        case EntityKind.DATETIME:
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
        case EntityKind.DURATION:
            tooltipInfo = t('propertyInspector.schemaInfo.duration.text');
            ariaLabel = t('propertyInspector.schemaInfo.duration.ariaLabel');
            break;
        case EntityKind.INTEGER:
            tooltipInfo = t('propertyInspector.schemaInfo.integer.text');
            ariaLabel = t('propertyInspector.schemaInfo.integer.ariaLabel');
            break;
        case EntityKind.LONG:
            tooltipInfo = t('propertyInspector.schemaInfo.long.text');
            ariaLabel = t('propertyInspector.schemaInfo.long.ariaLabel');
            break;
        case EntityKind.TIME:
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
        case EntityKind.MAP:
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
