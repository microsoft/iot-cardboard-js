import { Icon, useTheme } from '@fluentui/react';
import React from 'react';
import { SceneViewBadgeGroup } from '../../Models/Classes/SceneView.types';
import { IADTBackgroundColor } from '../../Models/Constants';
import { getStyles } from './Alertbadges.styles';

export interface IAlertBadgeProps {
    badgeGroup: SceneViewBadgeGroup;
    onBadgeGroupHover?: (
        alert: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => void;
    backgroundColor: IADTBackgroundColor;
}

const AlertBadge: React.FC<IAlertBadgeProps> = ({
    badgeGroup,
    onBadgeGroupHover,
    backgroundColor
}) => {
    const theme = useTheme();
    const styles = getStyles(theme, backgroundColor);

    return (
        <div
            className={
                badgeGroup?.badges?.length > 1 && badgeGroup?.badges?.length < 5
                    ? styles.groupContainer
                    : styles.singleContainer
            }
            onMouseOver={(element) =>
                onBadgeGroupHover(badgeGroup, element.clientX, element.clientY)
            }
        >
            {badgeGroup?.badges?.length > 4 ? (
                <div className={styles.countBadge}>
                    {badgeGroup?.badges?.length}
                </div>
            ) : (
                badgeGroup?.badges?.map((badge, index) => (
                    <div
                        key={index}
                        className={
                            badgeGroup?.badges?.length > 1 &&
                            badgeGroup?.badges?.length < 5
                                ? styles.internalBadge
                                : styles.badge
                        }
                        style={{ background: badge.color }}
                    >
                        <Icon iconName={badge.icon} />
                    </div>
                ))
            )}
        </div>
    );
};

export default React.memo(AlertBadge);
