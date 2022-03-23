import {
    FontWeights,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

import { behaviorsModalClassPrefix } from '../../BehaviorsModal.styles';

const classNames = {
    behaviorSection: `${behaviorsModalClassPrefix}-behavior-section`,
    behaviorHeader: `${behaviorsModalClassPrefix}-behavior-header`,
    infoContainer: `${behaviorsModalClassPrefix}-info-container`,
    infoIconContainer: `${behaviorsModalClassPrefix}-info-icon-container`,
    infoTextContainer: `${behaviorsModalClassPrefix}-info-text-container`,
    statusColorLine: `${behaviorsModalClassPrefix}-status-color-line`
};

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        behaviorSection: [
            classNames.behaviorSection,
            {
                padding: 8
            } as IStyle
        ],
        behaviorHeader: [
            classNames.behaviorHeader,
            {
                fontSize: '12px',
                fontWeight: FontWeights.bold,
                marginBottom: 16
            } as IStyle
        ],
        infoContainer: [
            classNames.infoContainer,
            {
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '16px'
            } as IStyle
        ],
        infoIconContainer: [
            classNames.infoIconContainer,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 32
            } as IStyle
        ],
        infoTextContainer: [
            classNames.infoTextContainer,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '12px'
            } as IStyle
        ]
    });
});

export const getStatusBlockStyles = memoizeFunction((statusColor: string) =>
    mergeStyleSets({
        statusColorLine: [
            classNames.statusColorLine,
            {
                width: 12,
                height: 3,
                boxShadow: `0px 0px 4px ${statusColor}`,
                background: statusColor
            } as IStyle
        ]
    })
);
