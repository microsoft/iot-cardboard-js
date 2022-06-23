import { ActionButton, Icon, useTheme } from '@fluentui/react';
import React from 'react';
import { SceneViewBadgeGroup } from '../../Models/Classes/SceneView.types';
import { getStyles } from './Alertbadges.styles';

export interface IAlertBadgeProps {
    badgeGroup: SceneViewBadgeGroup;
    onBadgeGroupHover?: (
        alert: SceneViewBadgeGroup,
        left: number,
        top: number
    ) => void;
}

const AlertBadge: React.FC<IAlertBadgeProps> = ({
    badgeGroup,
    onBadgeGroupHover
}) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <div>
            {badgeGroup?.badges?.map((badge, index) => (
                <ActionButton
                    key={index}
                    onMouseOver={(element) =>
                        onBadgeGroupHover(
                            badgeGroup,
                            element.clientX,
                            element.clientY
                        )
                    }
                >
                    <div
                        className={styles.badge}
                        style={{ background: badge.color }}
                    >
                        <Icon iconName={badge.icon} />
                    </div>
                </ActionButton>
            ))}
        </div>
    );
};

export default React.memo(AlertBadge);
