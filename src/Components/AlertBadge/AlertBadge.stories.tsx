import React from 'react';
import AlertBadge from './AlertBadge';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { ViewerModeBackgroundColors } from '../../Models/Constants';
import { SceneViewBadgeGroup } from '../../Models/Classes/SceneView.types';

const wrapperStyle = { width: 'auto', height: '100px' };

export default {
    title: 'Components/AlertBadge',
    component: AlertBadge,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

export const SingleAlert = () => {
    const badgeGroup: SceneViewBadgeGroup = {
        id: null,
        meshId: null,
        badges: [
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            }
        ],
        element: null,
        behaviors: null,
        twins: null
    };

    return (
        <div style={wrapperStyle}>
            <AlertBadge
                badgeGroup={badgeGroup}
                backgroundColor={ViewerModeBackgroundColors[0]}
            />
        </div>
    );
};

export const TwoAlerts = () => {
    const badgeGroup: SceneViewBadgeGroup = {
        id: null,
        meshId: null,
        badges: [
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            }
        ],
        element: null,
        behaviors: null,
        twins: null
    };

    return (
        <div style={wrapperStyle}>
            <AlertBadge
                badgeGroup={badgeGroup}
                backgroundColor={ViewerModeBackgroundColors[0]}
            />
        </div>
    );
};

export const ThreeAlerts = () => {
    const badgeGroup: SceneViewBadgeGroup = {
        id: null,
        meshId: null,
        badges: [
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            }
        ],
        element: null,
        behaviors: null,
        twins: null
    };

    return (
        <div style={wrapperStyle}>
            <AlertBadge
                badgeGroup={badgeGroup}
                backgroundColor={ViewerModeBackgroundColors[0]}
            />
        </div>
    );
};

export const FourAlerts = () => {
    const badgeGroup: SceneViewBadgeGroup = {
        id: null,
        meshId: null,
        badges: [
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            }
        ],
        element: null,
        behaviors: null,
        twins: null
    };

    return (
        <div style={wrapperStyle}>
            <AlertBadge
                badgeGroup={badgeGroup}
                backgroundColor={ViewerModeBackgroundColors[0]}
            />
        </div>
    );
};

export const FiveAlerts = () => {
    const badgeGroup: SceneViewBadgeGroup = {
        id: null,
        meshId: null,
        badges: [
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            },
            {
                id: null,
                meshId: null,
                color: '#ff0000',
                icon: 'Frigid'
            }
        ],
        element: null,
        behaviors: null,
        twins: null
    };

    return (
        <div style={wrapperStyle}>
            <AlertBadge
                badgeGroup={badgeGroup}
                backgroundColor={ViewerModeBackgroundColors[0]}
            />
        </div>
    );
};
