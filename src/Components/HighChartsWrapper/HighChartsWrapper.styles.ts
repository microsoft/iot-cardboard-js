import { IStyle } from '@fluentui/react';
import {
    IHighChartsWrapperStyleProps,
    IHighChartsWrapperStyles
} from './HighChartsWrapper.types';

export const classPrefix = 'cb-highcharts-wrapper';
const classNames = {
    container: `${classPrefix}-container`,
    titleWithLinkContainer: `${classPrefix}-title--with-link-container`,
    shareButton: `${classPrefix}-share-button`
};
export const getStyles = ({
    theme
}: IHighChartsWrapperStyleProps): IHighChartsWrapperStyles => {
    const commonTextStyling: Partial<IStyle> = { color: theme.palette.black };
    return {
        container: [
            classNames.container,
            {
                width: '100%',
                height: '100%',
                '.highcharts-credits': { display: 'none' }
            }
        ],
        titleWithLinkContainer: [
            classNames.titleWithLinkContainer,
            {
                height: 20,
                display: 'flex',
                alignItems: 'center',
                zIndex: -1
            }
        ],
        shareButton: [
            classNames.shareButton,
            {
                color: `${theme.palette.black} !important`,
                borderRadius: 2,
                fontSize: 16,
                marginLeft: 8,
                ':hover': {
                    background: theme.palette.neutralLighter
                },
                ':active': {
                    background: theme.palette.neutralLight
                }
            }
        ],
        subComponentStyles: {
            chart: {
                root: {
                    backgroundColor: 'var(--cb-color-glassy-modal)'
                }
            },
            title: {
                root: {
                    color: theme.palette.black,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    lineHeight: '14px',
                    zIndex: 0
                }
            },
            xAxis: {
                title: {
                    ...commonTextStyling
                },
                label: {
                    ...commonTextStyling
                }
            },
            yAxis: {
                title: {
                    ...commonTextStyling
                },
                label: {
                    ...commonTextStyling
                }
            },
            legend: {
                root: {
                    fontSize: 12,
                    fontWeight: 'normal'
                }
            }
        }
    };
};
