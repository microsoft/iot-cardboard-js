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
                alignItems: 'center',
                h3: {
                    margin: 0,
                    padding: 0,
                    fontSize: FontSizes.size14,
                    fontWeight: FontWeights.semibold
                }
            }
        ],
        row: [
            classNames.row,
            {
                alignItems: 'center',
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                justifyContent: 'center',
                minHeight: '38px',
                padding: '4px 0'
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
