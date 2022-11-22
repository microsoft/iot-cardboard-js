import React, { useContext } from 'react';
import {
    IBadgeBlockProps,
    IBadgeBlockStyleProps,
    IBadgeBlockStyles
} from './BadgeBlock.types';
import { getBadgeBlockStyles } from './BadgeBlock.styles';
import { classNamesFunction, useTheme, styled, Icon } from '@fluentui/react';
import { BehaviorModalMode } from '../../../../Models/Constants/Enums';
import {
    parseLinkedTwinExpression,
    stripTemplateStringsFromText,
    wrapTextInTemplateString
} from '../../../../Models/Services/Utils';
import { BehaviorsModalContext } from '../../BehaviorsModal';

const getClassNames = classNamesFunction<
    IBadgeBlockStyleProps,
    IBadgeBlockStyles
>();

const BadgeBlock: React.FC<IBadgeBlockProps> = ({ badgeVisual, styles }) => {
    const { color, iconName, labelExpression } = badgeVisual;
    const classNames = getClassNames(styles, {
        badgeColor: color,
        theme: useTheme()
    });

    const { twins, mode } = useContext(BehaviorsModalContext);

    return (
        <div className={classNames.infoContainer}>
            <div className={classNames.iconCircle}>
                <Icon iconName={iconName} />
            </div>
            <div className={classNames.infoTextContainer}>
                {mode === BehaviorModalMode.preview
                    ? stripTemplateStringsFromText(labelExpression)
                    : parseLinkedTwinExpression(
                          wrapTextInTemplateString(labelExpression),
                          twins
                      )}
            </div>
        </div>
    );
};

export default styled<
    IBadgeBlockProps,
    IBadgeBlockStyleProps,
    IBadgeBlockStyles
>(BadgeBlock, getBadgeBlockStyles);
