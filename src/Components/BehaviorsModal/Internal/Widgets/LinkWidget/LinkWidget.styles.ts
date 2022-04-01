import {
    FontSizes,
    FontWeights,
    IStyle,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { behaviorsModalClassPrefix } from '../../../BehaviorsModal.styles';

const classNames = {
    linkContainer: `${behaviorsModalClassPrefix}-link-widget-container`,
    linkLabel: `${behaviorsModalClassPrefix}-link-widget-label`,
    linkButton: `${behaviorsModalClassPrefix}-link-widget-button`,
    linkIcon: `${behaviorsModalClassPrefix}-link-widget-icon`
};

export const getStyles = memoizeFunction(() =>
    mergeStyleSets({
        linkContainer: [
            classNames.linkContainer,
            {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: 8
            } as IStyle
        ],
        linkLabel: [
            classNames.linkLabel,
            {
                fontSize: FontSizes.size12,
                fontWeight: FontWeights.semibold,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                overflow: 'hidden',
                marginBottom: 8
            } as IStyle
        ],
        linkButton: [classNames.linkButton, { marginBottom: 'auto' } as IStyle],
        linkIcon: [classNames.linkIcon, {} as IStyle]
    })
);
