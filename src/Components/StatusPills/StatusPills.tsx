import React from 'react';
import { IStatusPillsProps } from './StatusPills.types';
import { getPillStyles, getStyles } from './StatusPills.styles';
import { getSceneElementStatusColor } from '../../Models/Services/Utils';
import { BehaviorModalMode } from '../../Models/Constants/Enums';
import { IStackTokens, Stack } from '@fluentui/react';

export const StatusPills: React.FC<IStatusPillsProps> = (props) => {
    const {
        statusVisuals,
        mode = BehaviorModalMode.viewer,
        twins,
        width
    } = props;
    const stackTokens: IStackTokens = { childrenGap: 2 };
    const styles = getStyles(width);
    const alignment = width === 'wide' ? 'center' : 'start';
    return (
        <Stack
            tokens={stackTokens}
            horizontal={true}
            horizontalAlign={alignment}
            styles={{ root: styles.root }}
        >
            {statusVisuals.map((sv, idx) => {
                const { valueExpression, valueRanges } = sv;
                let statusColor;

                // In preview mode, select min value range to display
                if (mode === BehaviorModalMode.preview) {
                    const minValueRange = valueRanges
                        .slice(0)
                        .sort(
                            (a, b) => Number(a.values[0]) - Number(b.values[0])
                        )[0];

                    statusColor = minValueRange.visual.color;
                } else {
                    statusColor = getSceneElementStatusColor(
                        valueExpression,
                        valueRanges,
                        twins
                    );
                }

                const pillStyles = getPillStyles(statusColor);

                return (
                    <div
                        key={`${sv.type}-${idx}`}
                        className={pillStyles.statusColorPill}
                    ></div>
                );
            })}
        </Stack>
    );
};
