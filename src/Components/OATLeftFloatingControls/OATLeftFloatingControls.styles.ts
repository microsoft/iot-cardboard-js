import {
    IOATLeftFloatingControlsStyleProps,
    IOATLeftFloatingControlsStyles
} from './OATLeftFloatingControls.types';
import { CardboardClassNamePrefix } from '../../Models/Constants/Constants';
import {
    CONTROLS_BOTTOM_OFFSET,
    CONTROLS_Z_INDEX,
    OAT_FLOATING_CONTROL_BUTTON_SIZE,
    OAT_FLOATING_CONTROL_LEFT_OFFSET
} from '../../Models/Constants/OatStyleConstants';

export const classPrefix = `${CardboardClassNamePrefix}-oatleftfloatingcontrols`;
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IOATLeftFloatingControlsStyleProps
): IOATLeftFloatingControlsStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            modelsListButton: {
                root: {
                    minWidth: 'unset',
                    width: OAT_FLOATING_CONTROL_BUTTON_SIZE,
                    height: OAT_FLOATING_CONTROL_BUTTON_SIZE,
                    border: '1px solid var(--cb-color-modal-border)',
                    borderRadius: 4,
                    backdropFilter: 'blur(50px)',
                    color: 'var(--cb-color-text-primary)',
                    position: 'absolute',
                    zIndex: CONTROLS_Z_INDEX,
                    left: OAT_FLOATING_CONTROL_LEFT_OFFSET,
                    bottom: CONTROLS_BOTTOM_OFFSET
                },
                rootChecked: {
                    background: 'var(--cb-color-glassy-modal)'
                }
            },
            modelsListCallout: {}
        }
    };
};
