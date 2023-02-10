import produce from 'immer';
import {
    defaultPowerBIWidgetBuilderState,
    IPowerBIWidetBuilderState,
    IPowerBIWidgetBuilderAction,
    PowerBIWidgetBuilderActionType
} from './PowerBIWidgetBuilder.types';

export const PowerBIWidgetBuilderReducer = produce(
    (draft: IPowerBIWidetBuilderState, action: IPowerBIWidgetBuilderAction) => {
        switch (action.type) {
            case PowerBIWidgetBuilderActionType.GET_PAGES_IN_REPORT: {
                const { pages } = action.result;
                draft.pages = pages;
                draft.isPagesLoaded = true;
                break;
            }
            case PowerBIWidgetBuilderActionType.GET_VISUALS_ON_PAGE: {
                const { visuals } = action.result;
                draft.visuals = visuals;
                draft.isVisualsLoaded = true;
                break;
            }
        }
    },
    defaultPowerBIWidgetBuilderState
);
