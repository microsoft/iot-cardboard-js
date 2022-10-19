import React from 'react';
import {
    IGraphLegendProps,
    IGraphLegendStyleProps,
    IGraphLegendStyles
} from './GraphLegend.types';
import { getStyles } from './GraphLegend.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    Toggle
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { useOatGraphContext } from '../../../../Models/Context/OatGraphContext/OatGraphContext';
import { OatGraphContextActionType } from '../../../../Models/Context/OatGraphContext/OatGraphContext.types';

const getClassNames = classNamesFunction<
    IGraphLegendStyleProps,
    IGraphLegendStyles
>();

const GraphLegend: React.FC<IGraphLegendProps> = (props) => {
    const { styles } = props;

    // contexts
    const { oatGraphDispatch, oatGraphState } = useOatGraphContext();

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
        <Stack styles={classNames.subComponentStyles.rootStack}>
            <Stack
                horizontal
                styles={classNames.subComponentStyles.itemStack}
                tokens={{ childrenGap: 8 }}
                verticalAlign={'center'}
            >
                <Toggle
                    defaultChecked={oatGraphState.showRelationships}
                    onChange={() => {
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.SHOW_COMPONENTS_TOGGLE
                        });
                    }}
                    label={t('OATGraphViewer.relationships')}
                    inlineLabel
                    styles={classNames.subComponentStyles.itemToggle}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 23 8.86"
                    className={classNames.itemIcon}
                >
                    <g>
                        <polygon
                            fill="#ffb200"
                            points="18.57 0 17.3 1.27 19.96 3.93 0 3.93 0 4.93 19.96 4.93 17.3 7.59 18.57 8.86 23 4.43 18.57 0"
                        />
                    </g>
                </svg>
            </Stack>
            <Stack
                horizontal
                styles={classNames.subComponentStyles.itemStack}
                tokens={{ childrenGap: 8 }}
            >
                <Toggle
                    defaultChecked={oatGraphState.showInheritances}
                    label={t('OATGraphViewer.inheritances')}
                    inlineLabel
                    onChange={() => {
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.SHOW_INHERITANCES_TOGGLE
                        });
                    }}
                    styles={classNames.subComponentStyles.itemToggle}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 23.15 9.46"
                    className={classNames.itemIcon}
                >
                    <g>
                        <path
                            fill="#008945"
                            d="M15,9.46l8.19-4.73L15,0V4.23H0v1H15V9.46Zm1-7.84,5.4,3.11-5.4,3.11Z"
                        />
                    </g>
                </svg>
            </Stack>
            <Stack
                horizontal
                styles={classNames.subComponentStyles.itemStack}
                tokens={{ childrenGap: 8 }}
            >
                <Toggle
                    defaultChecked={oatGraphState.showComponents}
                    label={t('OATGraphViewer.components')}
                    inlineLabel
                    onChange={() => {
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.SHOW_COMPONENTS_TOGGLE
                        });
                    }}
                    styles={classNames.subComponentStyles.itemToggle}
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 23.06 8.12"
                    className={classNames.itemIcon}
                >
                    <g>
                        <polygon
                            fill={'#0078ce'}
                            points="23.06 3.56 7.72 3.56 4.11 0 0 4.06 4.11 8.12 7.72 4.56 23.06 4.56 23.06 3.56"
                        />
                    </g>
                </svg>
            </Stack>
        </Stack>
    );
};

export default styled<
    IGraphLegendProps,
    IGraphLegendStyleProps,
    IGraphLegendStyles
>(GraphLegend, getStyles);
