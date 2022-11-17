import { FontSizes, FontWeights } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants/Constants';
import {
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
} from './PropertiesModelSummary.types';

const classPrefix = `${CardboardClassNamePrefix}-properties-model-summary`;
const classNames = {
    sectionHeaderRoot: `${classPrefix}-header-root`,
    sectionHeaderContainer: `${classPrefix}-header-container`,
    sectionHeaderTitle: `${classPrefix}-header-title`,
    sectionHeaderSubTitle: `${classPrefix}-header-subtitle`,
    rowLabel: `${classPrefix}-row-label`,
    row: `${classPrefix}-row`
};
export const getStyles = (
    props: IPropertiesModelSummaryStyleProps
): IPropertiesModelSummaryStyles => {
    const { theme } = props;
    return {
        sectionTitle: [
            classNames.sectionHeaderTitle,
            {
                margin: 0,
                padding: 0,
                fontSize: FontSizes.size16,
                fontWeight: FontWeights.semibold,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        ],
        sectionSubtitle: [
            classNames.sectionHeaderSubTitle,
            {
                fontSize: FontSizes.size12,
                color: theme.semanticColors.disabledText,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        ],
        row: [
            classNames.row,
            {
                alignItems: 'center',
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                justifyContent: 'center',
                minHeight: '38px'
            }
        ],
        rowLabel: [
            classNames.rowLabel,
            {
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        ],
        subComponentStyles: {
            rootStack: {
                root: {
                    padding: '8px',
                    borderBottom: `1px solid ${theme.semanticColors.variantBorder}`
                }
            },
            separator: {
                root: {
                    padding: 0,
                    height: 1,
                    ':before': {
                        backgroundColor: theme.palette.neutralLighter
                    }
                }
            },
            stringField: {
                root: {
                    display: 'flex',
                    alignItems: 'center',
                    margin: 0,
                    padding: 0
                },
                fieldGroup: {
                    backgroundColor: 'transparent'
                }
            },
            numericField: {
                root: {
                    display: 'flex',
                    alignItems: 'center',
                    margin: 0,
                    padding: 0
                },
                input: {
                    backgroundColor: 'transparent'
                }
            }
        }
    };
};
