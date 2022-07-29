import React from 'react';
import {
    classNamesFunction,
    useTheme,
    styled,
    DefaultButton
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import {
    IViewerElementsPanelRendererProps,
    IViewerElementsPanelRendererStyleProps,
    IViewerElementsPanelRendererStyles
} from './ViewerElementsPanelRenderer.types';
import { getStyles } from './ViewerElementsPanelRenderer.styles';
import ViewerElementsPanel from '../ElementsPanel/ViewerElementsPanel';

const getClassNames = classNamesFunction<
    IViewerElementsPanelRendererStyleProps,
    IViewerElementsPanelRendererStyles
>();

const ViewerElementsPanelRenderer: React.FC<IViewerElementsPanelRendererProps> = (
    props
) => {
    const {
        initialPanelOpen = true,
        items,
        isLoading,
        onItemBlur,
        onItemClick,
        onItemHover,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // state
    const [
        isElementsPanelVisible,
        { toggle: toggleIsElementsPanelVisible }
    ] = useBoolean(initialPanelOpen);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <DefaultButton
                toggle
                checked={isElementsPanelVisible}
                styles={classNames.subComponentStyles.button()}
                iconProps={{
                    iconName: 'BulletedTreeList',
                    styles: { root: { fontSize: 20 } }
                }}
                ariaLabel={
                    isElementsPanelVisible
                        ? t('elementsPanel.hidePanel')
                        : t('elementsPanel.showPanel')
                }
                onClick={toggleIsElementsPanelVisible}
            />
            {isElementsPanelVisible && (
                <ViewerElementsPanel
                    isLoading={isLoading}
                    panelItems={items}
                    onItemClick={onItemClick}
                    onItemHover={onItemHover}
                    onItemBlur={onItemBlur}
                />
            )}
        </div>
    );
};

export default styled<
    IViewerElementsPanelRendererProps,
    IViewerElementsPanelRendererStyleProps,
    IViewerElementsPanelRendererStyles
>(ViewerElementsPanelRenderer, getStyles);
