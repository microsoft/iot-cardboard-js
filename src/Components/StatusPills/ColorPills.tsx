import React, { useEffect, useState } from 'react';
import { IColorPillsProps } from './StatusPills.types';
import { getPillStyles, getStyles } from './StatusPills.styles';
import { IStackTokens, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';

export const ColorPills: React.FC<IColorPillsProps> = (props) => {
    const { visualColorings, width } = props;
    const stackTokens: IStackTokens = { childrenGap: 2 };
    const styles = getStyles(width);
    const alignment = width === 'wide' ? 'center' : 'start';
    const pillId = useId('cb-visual-rule-pills');
    const [trimmedVisualColorings, setTrimmedVisualColorings] = useState(
        visualColorings && visualColorings.length > 3
            ? visualColorings.slice(0, 3)
            : visualColorings
    );
    const [extraVisualColoringCount, setExtraVisualColoringCount] = useState(
        visualColorings && visualColorings.length > 3
            ? visualColorings.length - 3
            : 0
    );

    useEffect(() => {
        setTrimmedVisualColorings(
            visualColorings && visualColorings.length > 3
                ? visualColorings.slice(0, 3)
                : visualColorings
        );
        setExtraVisualColoringCount(
            visualColorings && visualColorings.length > 3
                ? visualColorings.length - 3
                : 0
        );
    }, [visualColorings]);

    return (
        <Stack
            tokens={stackTokens}
            horizontal={true}
            horizontalAlign={alignment}
            verticalAlign={'center'}
            styles={{ root: styles.root }}
        >
            {trimmedVisualColorings.map((vc, idx) => {
                const { color } = vc;
                const pillStyles = getPillStyles(color);

                return (
                    <div
                        key={`${pillId}-${idx}`}
                        className={pillStyles.statusColorPill}
                    ></div>
                );
            })}
            {extraVisualColoringCount > 0 && (
                <span
                    style={styles.extraValues}
                >{`+${extraVisualColoringCount}`}</span>
            )}
        </Stack>
    );
};
