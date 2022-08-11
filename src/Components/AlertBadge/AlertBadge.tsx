import { Icon, styled, classNamesFunction } from '@fluentui/react';
import React from 'react';
import {
    IAlertBadgeProps,
    IAlertBadgeStyleProps,
    IAlertBadgeStyles
} from './AlertBadge.types';
import { getStyles } from './Alertbadges.styles';

const getClassNames = classNamesFunction<
    IAlertBadgeStyleProps,
    IAlertBadgeStyles
>();

const AlertBadge: React.FC<IAlertBadgeProps> = ({
    badgeGroup,
    onBadgeGroupHover,
    backgroundColor,
    styles
}) => {
    const classNames = getClassNames(styles, {
        backgroundColor: backgroundColor
    });

    return (
        <div
            className={
                badgeGroup?.badges?.length > 1 && badgeGroup?.badges?.length < 5
                    ? classNames.groupContainer
                    : classNames.singleContainer
            }
            onMouseOver={(element) => {
                if (onBadgeGroupHover) {
                    const container: HTMLDivElement =
                        element.target['parentElement'];
                    onBadgeGroupHover(
                        badgeGroup,
                        container?.offsetLeft || 0,
                        container?.offsetTop || 0
                    );
                }
            }}
        >
            {badgeGroup?.badges?.length > 4 ? (
                <div className={classNames.countBadge}>
                    {badgeGroup?.badges?.length}
                </div>
            ) : (
                badgeGroup?.badges?.map((badge, index) => (
                    <div
                        key={index}
                        className={
                            badgeGroup?.badges?.length > 1 &&
                            badgeGroup?.badges?.length < 5
                                ? classNames.internalBadge
                                : classNames.badge
                        }
                        style={{ background: badge.color }}
                    >
                        <Icon
                            iconName={badge.icon}
                            style={{ fontSize: '12px' }}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default styled<
    IAlertBadgeProps,
    IAlertBadgeStyleProps,
    IAlertBadgeStyles
>(AlertBadge, getStyles);
