import {
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

import { behaviorsModalClassPrefix } from '../../BehaviorsModal.styles';

const classNames = {
    behaviorSection: `${behaviorsModalClassPrefix}-behavior-section`
};

export const getStyles = memoizeFunction((theme: Theme) => {
    return mergeStyleSets({
        behaviorSection: [
            classNames.behaviorSection,
            {
                padding: 8
            } as IStyle
        ]
    });
});
