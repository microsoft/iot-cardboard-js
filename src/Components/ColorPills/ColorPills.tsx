import React, { useEffect, useState } from 'react';
import {
    IColorPillsProps,
    IColorPillsStyleProps,
    IColorPillsStyles
} from './ColorPills.types';
import {
    classNamesFunction,
    IStackTokens,
    Stack,
    styled
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';
import { getColorPillsStyles } from './ColorPills.styles';

const getClassNames = classNamesFunction<
    IColorPillsStyleProps,
    IColorPillsStyles
>();

const ColorPills: React.FC<IColorPillsProps> = (props) => {
    const { visualColorings, width, styles } = props;
    const stackTokens: IStackTokens = { childrenGap: 2 };
    const alignment = width === 'wide' ? 'center' : 'start';
    const pillId = useId('cb-visual-rule-pills');

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme(),
        width: props.width
    });

    const [trimmedVisualColorings, setTrimmedVisualColorings] = useState([]);
    const [extraVisualColoringCount, setExtraVisualColoringCount] = useState(0);

    useEffect(() => {
        setTrimmedVisualColorings(
            visualColorings?.length > 3
                ? visualColorings.slice(0, 3)
                : visualColorings
        );
        setExtraVisualColoringCount(
            visualColorings?.length > 3 ? visualColorings.length - 3 : 0
        );
    }, [visualColorings]);

    return (
        <Stack
            tokens={stackTokens}
            horizontal={true}
            horizontalAlign={alignment}
            verticalAlign={'center'}
            styles={{ root: classNames.root }}
        >
            {trimmedVisualColorings.map((vc, idx) => {
                const { color } = vc;

                return (
                    <div
                        key={`${pillId}-${idx}`}
                        className={
                            classNames.subComponentStyles.pillStyles({
                                color: color
                            }).root
                        }
                    ></div>
                );
            })}
            {extraVisualColoringCount > 0 && (
                <span
                    className={classNames.extraValues}
                >{`+${extraVisualColoringCount}`}</span>
            )}
        </Stack>
    );
};

export default styled<
    IColorPillsProps,
    IColorPillsStyleProps,
    IColorPillsStyles
>(ColorPills, getColorPillsStyles);
