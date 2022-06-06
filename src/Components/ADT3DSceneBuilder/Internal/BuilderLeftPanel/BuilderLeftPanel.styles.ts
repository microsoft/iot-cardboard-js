import { IStyle } from '@fluentui/react';
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
                paddingRight: '16px',
                paddingTop: '10px',
                position: 'relative',
                width: '360px'
            } as IStyle
        ],
        subComponentStyles: {}
    };
};
