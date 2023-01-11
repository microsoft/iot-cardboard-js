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
    referenceCountLabel: `${classPrefix}-stacked-count-label`
};
export const getStyles = (
    props: IOATGraphCustomEdgeStyleProps
): IOATGraphCustomEdgeStyles => {
    const { theme } = props;
    return {
        stackedReferenceCountLabel: [
            classNames.referenceCountLabel,
            {
                fontSize: FontSizes.size12,
                fill: theme.semanticColors.bodyText
            }
        ],
        stackedReferencesList: [
            classNames.referenceList,
            {
                maxWidth: 200,
                [`.${CARDBOARD_LIST_ITEM_CLASS_NAMES.menuIcon}`]: {
                    right: 4
                }
            }
        ]
    };
};
