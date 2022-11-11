import { mergeStyleSets, FontSizes } from '@fluentui/react';
import {
    IColorPillsTooltipStyleProps,
    IColorPillsTooltipStyles
} from './ColorPillsTooltip.types';

export const classPrefix = 'cb-colorPillsTooltip';
const classNames = {
    root: `${classPrefix}-root`,
    colorPill: `${classPrefix}-colorPill`
};
export const getColorPillsTooltipStyles = (
    _props: IColorPillsTooltipStyleProps
): IColorPillsTooltipStyles => {
    return {
        root: [
            classNames.root,
            {
                padding: 12,
                background: 'inherit'
            }
        ],
        subComponentStyles: {
            colorPill: (props) => {
                return mergeStyleSets({
                    root: {
                        boxShadow: `0px 0px 4px ${props.color}`,
                        background: props.color,
                        width: 3,
                        height: 12,
                        borderRadius: 5,
                        margin: '0px 1px'
                    }
                });
            },
            label: (props) => {
                return mergeStyleSets({
                    root: {
                        fontStyle: props.isUnlabeled ? 'italic' : 'normal',
                        fontSize: FontSizes.size14
                    }
                });
            }
        }
    };
};
