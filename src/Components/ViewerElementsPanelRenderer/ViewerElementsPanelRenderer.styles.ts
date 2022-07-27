import {
    ELEMENTS_PANEL_BUTTON_BOTTOM_OFFSET,
    ELEMENTS_PANEL_BUTTON_HEIGHT,
    INITIAL_ELEMENTS_PANEL_LEFT_OFFSET
} from '../../Models/Constants/StyleConstants';
import {
    IViewerElementsPanelRendererStyleProps,
    IViewerElementsPanelRendererStyles
} from './ViewerElementsPanelRenderer.types';

export const classPrefix = 'cb-ViewerElementsPanelRenderer';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: IViewerElementsPanelRendererStyleProps
): IViewerElementsPanelRendererStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {
            button: {
                root: {
                    minWidth: 'unset',
                    width: 64,
                    height: ELEMENTS_PANEL_BUTTON_HEIGHT,
                    border: '1px solid var(--cb-color-modal-border)',
                    borderRadius: 4,
                    backdropFilter: 'blur(50px)',
                    color: 'var(--cb-color-text-primary)',
                    position: 'absolute',
                    zIndex: 999,
                    left: INITIAL_ELEMENTS_PANEL_LEFT_OFFSET,
                    bottom: ELEMENTS_PANEL_BUTTON_BOTTOM_OFFSET
                },
                rootChecked: {
                    background: 'var(--cb-color-glassy-modal)'
                }
            }
        }
    };
};
