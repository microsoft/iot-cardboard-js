import { FontSizes } from '@fluentui/react';
import {
    ITimeSeriesBuilderStyleProps,
    ITimeSeriesBuilderStyles
} from './TimeSeriesBuilder.types';

export const classPrefix = 'cb-time-series-builder';
const classNames = {
    root: `${classPrefix}-root`,
    description: `${classPrefix}-description`,
    twinPropertyList: `${classPrefix}-twin-property-list`
};
export const getStyles = (
    props: ITimeSeriesBuilderStyleProps
): ITimeSeriesBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                borderRight: `1px solid ${props.theme.palette.neutralLight}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }
        ],
        description: [
            classNames.description,
            {
                color: props.theme.palette.neutralSecondary,
                fontSize: FontSizes.medium,
                marginTop: '0 !important',
                paddingRight: 0
            }
        ],
        twinPropertyList: [classNames.twinPropertyList, { flexGrow: 1 }],
        subComponentStyles: {
            addNewButton: { root: { padding: '8px 0px' } }
        }
    };
};
