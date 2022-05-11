import {
    ICameraControlsCalloutContentStyleProps,
    ICameraControlsCalloutContentStyles
} from './CameraControlsCalloutContent.types';

export const classPrefix = 'cb-cameracontrolscalloutcontent';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: ICameraControlsCalloutContentStyleProps
): ICameraControlsCalloutContentStyles => {
    const { theme } = props;
    return {
        root: [
            classNames.root,
            {
                width: 200,
                borderRadius: 2,
                background: theme.semanticColors.buttonBackground,
                padding: '16px 16px',
                border: `1px solid ${theme.palette.neutralLight}`
            }
        ],
        buttonIcon: {
            fill: theme.semanticColors.bodyText
        },
        modes: {
            display: 'flex',
            fontSize: 12,
            marginTop: 16
        },
        mode: {
            flex: 1,
            textAlign: 'center'
        },
        modeIcon: {
            marginTop: 12,
            marginBottom: 4
        },
        subComponentStyles: {}
    };
};
