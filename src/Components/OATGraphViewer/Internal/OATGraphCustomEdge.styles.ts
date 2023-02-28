import { FontSizes } from '@fluentui/react';
import { CardboardClassNamePrefix } from '../../../Models/Constants';
import { CARDBOARD_LIST_ITEM_CLASS_NAMES } from '../../CardboardList/CardboardListItem.styles';
import {
    IOATGraphCustomEdgeStyleProps,
    IOATGraphCustomEdgeStyles
} from './OATGraphCustomEdge.types';

const classPrefix = `${CardboardClassNamePrefix}-oat-custom-edge`;
const classNames = {
    referenceList: `${classPrefix}-stacked-reference-list`,
    referenceCountLabelRoot: `${classPrefix}-stacked-count-root`,
    referenceCountLabel: `${classPrefix}-stacked-count-label`
};
export const getStyles = (
    props: IOATGraphCustomEdgeStyleProps
): IOATGraphCustomEdgeStyles => {
    const { theme } = props;
    return {
        stackedReferenceCountLabelRoot: [
            classNames.referenceCountLabelRoot,
            {
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                width: '100%'
            }
        ],
        stackedReferenceCountLabel: [
            classNames.referenceCountLabel,
            {
                alignItems: 'center',
                backgroundColor: theme.semanticColors.bodyBackground,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '50%',
                display: 'flex',
                fill: theme.semanticColors.bodyText,
                fontSize: FontSizes.size12,
                justifyContent: 'center',
                padding: '4px 8px',
                width: 'fit-content'
            }
        ],
        stackedReferencesList: [
            classNames.referenceList,
            {
                maxWidth: 200,
                [`.${CARDBOARD_LIST_ITEM_CLASS_NAMES.menuIcon}`]: {
                    right: 4,
                    '.ms-Button-menuIcon': {
                        fontSize: `${FontSizes.small} !important`
                    }
                },
                [`.${CARDBOARD_LIST_ITEM_CLASS_NAMES.menuPlaceholder}`]: {
                    minWidth: 24 // override since we moved the position of the menu icon
                },
                [`.${CARDBOARD_LIST_ITEM_CLASS_NAMES.primaryText}`]: {
                    fontSize: FontSizes.small
                }
            }
        ]
    };
};
