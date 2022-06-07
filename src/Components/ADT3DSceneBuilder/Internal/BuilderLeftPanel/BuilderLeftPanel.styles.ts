import { IStyle } from '@fluentui/react';
import { SCENE_PAGE_OUTER_OFFSET } from '../../../../Models/Constants/StyleConstants';
import { leftPanelBuilderBlock } from '../../../../Resources/Styles/BaseStyles';
import {
    IBuilderLeftPanelStyleProps,
    IBuilderLeftPanelStyles
} from './BuilderLeftPanel.types';

export const classPrefix = 'cb-builder-left-panel';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    props: IBuilderLeftPanelStyleProps
): IBuilderLeftPanelStyles => {
    return {
        root: [
            classNames.root,
            {
                backgroundColor: 'var(--cb-color-bg-canvas)',
                boxSizing: 'border-box',
                borderRight: `1px solid ${props.theme.semanticColors.bodyFrameDivider}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                padding: `${SCENE_PAGE_OUTER_OFFSET}px 0px ${SCENE_PAGE_OUTER_OFFSET}px 0px`,
                position: 'relative',
                width: '392px'
            } as IStyle
        ],
        subComponentStyles: {
            pivot: { root: { marginBottom: 16, ...leftPanelBuilderBlock } }
        }
    };
};
