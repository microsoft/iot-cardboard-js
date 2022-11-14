import { mergeStyleSets, FontSizes } from '@fluentui/react';
import {
    IColorPillsCalloutContentStyleProps,
    IColorPillsCalloutContentStyles
} from './ColorPillsCalloutContent.types';

export const classPrefix = 'cb-ColorPillsCalloutContent';
const classNames = {
    root: `${classPrefix}-root`,
    colorPill: `${classPrefix}-colorPill`
};
export const getColorPillsCalloutContentStyles = (
    _props: IColorPillsCalloutContentStyleProps
): IColorPillsCalloutContentStyles => {
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
