import { FontSizes, mergeStyleSets } from '@fluentui/react';
import { IColorPillsStyleProps, IColorPillsStyles } from './ColorPills.types';

export const classPrefix = 'cb-colorpills';
const classNames = {
    root: `${classPrefix}-root`,
    extraValues: `${classPrefix}-extraValues`
};
export const getColorPillsStyles = (
    props: IColorPillsStyleProps
): IColorPillsStyles => {
    return {
        root: [
            classNames.root,
            props.width === 'compact' && {
                margin: '0px 8px 0px 0px'
            },
            props.width === 'wide' && {
                width: 40
            }
        ],
        extraValues: [
            classNames.extraValues,
            {
                fontSize: FontSizes.size10
            }
        ],
        subComponentStyles: {
            pillStyles: (props) => {
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
            }
        }
    };
};
