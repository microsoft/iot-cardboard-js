import React from 'react';
import { Controls, ControlButton } from 'react-flow-renderer';
import {
    classNamesFunction,
    useTheme,
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

const getClassNames = classNamesFunction<
    IGraphViewerControlsStyleProps,
    IGraphViewerControlsStyles
>();

const GraphViewerControls: React.FC<IGraphViewerControlsProps> = (props) => {
    const {
        legendButtonId,
        miniMapButtonId,
        modelListButtonId,
        onApplyAutoLayoutClick,
        styles
    } = props;

    // contexts
    const { oatGraphDispatch, oatGraphState } = useOatGraphContext();

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
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
                        />
                    </HeaderControlGroup>
                    {/* built in controls for the graph */}
                    <Controls className={classNames.graphBuiltInControls}>
                        <ControlButton onClick={onApplyAutoLayoutClick}>
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
