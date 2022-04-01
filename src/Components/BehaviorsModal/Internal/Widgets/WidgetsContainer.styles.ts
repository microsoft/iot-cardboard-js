import {
    IStyle,
    ITheme,
    memoizeFunction,
    mergeStyleSets
} from '@fluentui/react';
import { BehaviorModalMode } from '../../../../Models/Constants';
import {
    behaviorsModalClassPrefix,
    getBorderStyle
} from '../../BehaviorsModal.styles';

const classNames = {
    widgetsContainer: `${behaviorsModalClassPrefix}-widgets-container`,
    widgetContainer: `${behaviorsModalClassPrefix}-widget-container`
};

export const getStyles = memoizeFunction(
    (theme: ITheme, mode: BehaviorModalMode) => {
        const borderStyle = getBorderStyle(theme, mode, 'border');
        return mergeStyleSets({
            widgetsContainer: [
                classNames.widgetsContainer,
                {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap'
                } as IStyle
            ],
            widgetContainer: [
                classNames.widgetsContainer,
                {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '124px',
                    height: '124px',
                    margin: 8,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    wordBreak: 'break',
                    position: 'relative',
                    border: borderStyle,
                    borderRadius: '6px'
                } as IStyle
            ]
        });
    }
);
