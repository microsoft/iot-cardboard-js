import React from 'react';
import {
    IColorPillsCalloutContentProps,
    IColorPillsCalloutContentStyleProps,
    IColorPillsCalloutContentStyles
} from './ColorPillsCalloutContent.types';
import { getColorPillsCalloutContentStyles } from './ColorPillsCalloutContent.styles';
import { classNamesFunction, styled, Stack, Label } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import { useExtendedTheme } from '../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IColorPillsCalloutContentStyleProps,
    IColorPillsCalloutContentStyles
>();

const ColorPillsCalloutContent: React.FC<IColorPillsCalloutContentProps> = (
    props
) => {
    const { visualColorings, styles } = props;

    // hooks
    const { t } = useTranslation();
    const coloringIdPrefix = useId('cb-visual-coloring-callout-content');

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    const getLabel = (label: string | undefined) => {
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
                                aria-hidden={true}
                            ></div>
                            <Label
                                styles={classNames.subComponentStyles.label({
                                    isUnlabeled: !coloring.label
                                })}
                            >
                                {getLabel(coloring.label)}
                            </Label>
                        </Stack>
                    );
                })}
            </Stack>
        </div>
    );
};

export default styled<
    IColorPillsCalloutContentProps,
    IColorPillsCalloutContentStyleProps,
    IColorPillsCalloutContentStyles
>(ColorPillsCalloutContent, getColorPillsCalloutContentStyles);
