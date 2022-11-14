import {
    FontSizes,
    ICalloutContentStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';

import { behaviorsModalClassPrefix } from '../../BehaviorsModal.styles';

const classNames = {
    behaviorSection: `${behaviorsModalClassPrefix}-behavior-section`,
    behaviorHeader: `${behaviorsModalClassPrefix}-behavior-header`,
    infoContainer: `${behaviorsModalClassPrefix}-info-container`,
    infoIconContainer: `${behaviorsModalClassPrefix}-info-icon-container`,
    infoTextContainer: `${behaviorsModalClassPrefix}-info-text-container`,
    statusColorLine: `${behaviorsModalClassPrefix}-status-color-line`
};

export const getStyles = memoizeFunction(() => {
    return mergeStyleSets({
        behaviorSection: [
            classNames.behaviorSection,
            {
                padding: '12px 20px'
            } as IStyle
        ],
        behaviorHeader: [
            classNames.behaviorHeader,
            {
                marginBottom: 8
            }
        ],
        infoContainer: [
            classNames.infoContainer,
            {
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 8
            } as IStyle
        ],
        infoIconContainer: [
            classNames.infoIconContainer,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 24,
                height: 24,
                margin: '0 8px'
            } as IStyle
        ],
        infoTextContainer: [
            classNames.infoTextContainer,
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: FontSizes.size12
            } as IStyle
        ]
    });
});

export const getCalloutStyles = (
    theme: IExtendedTheme
): Partial<ICalloutContentStyles> => {
    return {
        root: {
            background: theme.palette.glassyBackground75
        },
        calloutMain: {
            background: 'unset',
            paddingRight: 24
        }
    };
};
