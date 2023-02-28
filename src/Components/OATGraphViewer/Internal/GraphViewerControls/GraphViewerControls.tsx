import React from 'react';
import { Controls, ControlButton } from 'react-flow-renderer';
import {
    classNamesFunction,
    styled,
    FocusZone,
    Icon,
    Stack
} from '@fluentui/react';
import { CONTROLS_Z_INDEX } from '../../../../Models/Constants/OatStyleConstants';
import { OatGraphContextActionType } from '../../../../Models/Context/OatGraphContext/OatGraphContext.types';
import HeaderControlButton from '../../../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../../../HeaderControlGroup/HeaderControlGroup';
import {
    IGraphViewerControlsProps,
    IGraphViewerControlsStyleProps,
    IGraphViewerControlsStyles
} from './GraphViewerControls.types';
import { getStyles } from './GraphViewerControls.styles';
import { useOatGraphContext } from '../../../../Models/Context/OatGraphContext/OatGraphContext';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IGraphViewerControlsStyleProps,
    IGraphViewerControlsStyles
>();

const LOC_KEYS = {
    modelListTitle: 'OAT.GraphControls.modelListTitle',
    legendTitle: 'OAT.GraphControls.legendTitle',
    autoLayoutTitle: 'OAT.GraphControls.autoLayoutTitle',
    miniMapTitle: 'OAT.GraphControls.miniMapTitle'
};

const GraphViewerControls: React.FC<IGraphViewerControlsProps> = (props) => {
    const {
        legendButtonId,
        miniMapButtonId,
        modelListButtonId,
        onApplyAutoLayoutClick,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatGraphDispatch, oatGraphState } = useOatGraphContext();

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <HeaderControlGroup
                id={modelListButtonId}
                styles={classNames.subComponentStyles.modelsListButtonGroup}
            >
                <HeaderControlButton
                    iconProps={{ iconName: 'Search' }}
                    onClick={() =>
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.MODEL_LIST_VISIBLE_TOGGLE
                        })
                    }
                    isActive={oatGraphState.isModelListVisible}
                    styles={classNames.subComponentStyles.controlButton}
                    title={t(LOC_KEYS.modelListTitle)}
                />
            </HeaderControlGroup>
            <FocusZone style={{ zIndex: CONTROLS_Z_INDEX }}>
                <Stack
                    horizontal
                    tokens={{ childrenGap: 16 }}
                    styles={classNames.subComponentStyles.controlsStack}
                >
                    <HeaderControlGroup id={legendButtonId}>
                        <HeaderControlButton
                            iconProps={{ iconName: 'View' }}
                            onClick={() =>
                                oatGraphDispatch({
                                    type:
                                        OatGraphContextActionType.LEGEND_VISBLE_TOGGLE
                                })
                            }
                            isActive={oatGraphState.isLegendVisible}
                            styles={classNames.subComponentStyles.controlButton}
                            title={t(LOC_KEYS.legendTitle)}
                        />
                    </HeaderControlGroup>
                    {/* built in controls for the graph */}
                    <Controls className={classNames.graphBuiltInControls}>
                        <ControlButton
                            onClick={onApplyAutoLayoutClick}
                            title={t(LOC_KEYS.autoLayoutTitle)}
                        >
                            <Icon iconName={'GridViewMedium'} />
                        </ControlButton>
                    </Controls>
                    <HeaderControlGroup id={miniMapButtonId}>
                        <HeaderControlButton
                            iconProps={{ iconName: 'Nav2DMapView' }}
                            onClick={() =>
                                oatGraphDispatch({
                                    type:
                                        OatGraphContextActionType.MINI_MAP_VISIBLE_TOGGLE
                                })
                            }
                            isActive={oatGraphState.isMiniMapVisible}
                            styles={classNames.subComponentStyles.controlButton}
                            title={t(LOC_KEYS.miniMapTitle)}
                        />
                    </HeaderControlGroup>
                </Stack>
            </FocusZone>
        </div>
    );
};

export default styled<
    IGraphViewerControlsProps,
    IGraphViewerControlsStyleProps,
    IGraphViewerControlsStyles
>(GraphViewerControls, getStyles);
