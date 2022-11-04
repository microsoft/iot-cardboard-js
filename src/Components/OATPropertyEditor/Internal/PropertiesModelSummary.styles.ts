import { FontSizes, FontWeights } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants/Constants';
import {
    IPropertiesModelSummaryStyleProps,
    IPropertiesModelSummaryStyles
} from './PropertiesModelSummary.types';

const classPrefix = `${CardboardClassNamePrefix}-properties-model-summary`;
const classNames = {
    headerContainer: `${classPrefix}-header-container`,
    rowLabel: `${classPrefix}-row-label`,
    row: `${classPrefix}-row`
};
export const getStyles = (
    props: IPropertiesModelSummaryStyleProps
): IPropertiesModelSummaryStyles => {
    const { theme } = props;
    return {
        sectionHeaderContainer: [
            classNames.headerContainer,
            {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        ],
        sectionTitle: [
            {
                margin: 0,
                padding: 0,
                fontSize: FontSizes.size16,
                fontWeight: FontWeights.semibold
            }
        ],
        sectionSubtitle: [
            {
                fontSize: FontSizes.size12,
                color: theme.semanticColors.disabledText
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
            modalIconButton: {
                root: {
                    color: theme.semanticColors.menuIcon,
                    width: 'fit-content'
                }
            },
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
