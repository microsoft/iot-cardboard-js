import React from 'react';
import {
    IGraphAutoLayoutProps,
    IGraphAutoLayoutStyleProps,
    IGraphAutoLayoutStyles
} from './GraphAutoLayout.types';
import { getStyles } from './GraphAutoLayout.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    IconButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IGraphAutoLayoutStyleProps,
    IGraphAutoLayoutStyles
>();

const GraphAutoLayout: React.FC<IGraphAutoLayoutProps> = (props) => {
    const { onForceLayout, styles } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <IconButton
                iconProps={{
                    iconName: 'GridViewMedium'
                }}
                title={t('OATGraphViewer.runLayout')}
                ariaLabel={t('OATGraphViewer.runLayout')}
                onClick={() => {
                    onForceLayout();
                }}
            />
        </div>
    );
};

export default styled<
    IGraphAutoLayoutProps,
    IGraphAutoLayoutStyleProps,
    IGraphAutoLayoutStyles
>(GraphAutoLayout, getStyles);
