import React from 'react';
import {
    ICameraControlsCalloutContentProps,
    ICameraControlsCalloutContentStyleProps,
    ICameraControlsCalloutContentStyles
} from './CameraControlsCalloutContent.types';
import { getStyles } from './CameraControlsCalloutContent.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import MoveContent from './Internal/MoveContent';
import OrbitContent from './Internal/OrbitContent';

const getClassNames = classNamesFunction<
    ICameraControlsCalloutContentStyleProps,
    ICameraControlsCalloutContentStyles
>();

/**
 * Control for showing the right flyout content on the camera controls
 */
const CameraControlsCalloutContent: React.FC<ICameraControlsCalloutContentProps> = (
    props
) => {
    const { type, styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    switch (type) {
        case 'Move':
            return <MoveContent styles={classNames} />;
        case 'Orbit':
            return <OrbitContent styles={classNames} />;
        default:
            return null;
    }
};

export default styled<
    ICameraControlsCalloutContentProps,
    ICameraControlsCalloutContentStyleProps,
    ICameraControlsCalloutContentStyles
>(CameraControlsCalloutContent, getStyles);
