import { FontSizes, mergeStyleSets } from '@fluentui/react';
import { StatusPillsContainerWidth } from './StatusPills.types';

export const classPrefix = 'cb-statuspills';
const classNames = {
    statusColorPill: `${classPrefix}-status-color-pill`
};

export const getStyles = (width: StatusPillsContainerWidth) => {
    let rootStyle = null;
    switch (width) {
        case 'compact':
            rootStyle = {
                margin: '0px 8px 0px 0px'
            };
            break;
        case 'wide':
            rootStyle = {
                width: 40
            };
            break;
        default:
            rootStyle = {
                margin: '0px 8px 0px 0px'
            };
    }

    return {
        root: rootStyle,
        extraValues: {
            fontSize: FontSizes.size10
        }
    };
};

export const getPillStyles = (statusColor: string) => {
    return mergeStyleSets({
        statusColorPill: [
            classNames.statusColorPill,
            {
                boxShadow: `0px 0px 4px ${statusColor}`,
                background: statusColor,
                width: 3,
                height: 12,
                borderRadius: 5,
                margin: '0px 1px'
            }
        ]
    });
};
