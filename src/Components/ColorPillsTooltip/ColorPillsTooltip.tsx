import React from 'react';
import {
    IColorPillsTooltipProps,
    IColorPillsTooltipStyleProps,
    IColorPillsTooltipStyles
} from './ColorPillsTooltip.types';
import { getColorPillsTooltipStyles } from './ColorPillsTooltip.styles';
import { classNamesFunction, styled, Stack } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IColorPillsTooltipStyleProps,
    IColorPillsTooltipStyles
>();

const ColorPillsTooltip: React.FC<IColorPillsTooltipProps> = (props) => {
    const { visualColorings, styles } = props;

    // hooks
    const { t } = useTranslation();
    const coloringIdPrefix = useId('cb-visual-coloring-callout');

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    const getLabel = (label: string) => {
        if (label && label.trim().length > 0) {
            return label;
        } else {
            return t('ColorPills.unlabeled');
        }
    };

    return (
        <div className={classNames.root}>
            <Stack tokens={{ childrenGap: 12 }}>
                {visualColorings.map((coloring, idx) => {
                    return (
                        <Stack
                            key={`${coloringIdPrefix}-${idx}`}
                            horizontal={true}
                            tokens={{ childrenGap: 16 }}
                            verticalAlign={'center'}
                        >
                            <div
                                className={
                                    classNames.subComponentStyles.colorPill({
                                        color: coloring.color
                                    }).root
                                }
                            ></div>
                            <label
                                className={
                                    classNames.subComponentStyles.label({
                                        isUnlabeled: !coloring.label
                                    }).root
                                }
                            >
                                {getLabel(coloring.label)}
                            </label>
                        </Stack>
                    );
                })}
            </Stack>
        </div>
    );
};

export default styled<
    IColorPillsTooltipProps,
    IColorPillsTooltipStyleProps,
    IColorPillsTooltipStyles
>(ColorPillsTooltip, getColorPillsTooltipStyles);
