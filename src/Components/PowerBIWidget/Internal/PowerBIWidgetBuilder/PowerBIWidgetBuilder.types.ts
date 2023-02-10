import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { IPowerBIWidget } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IWidgetBuilderFormDataProps } from '../../../ADT3DSceneBuilder/ADT3DSceneBuilder.types';
import { IPage, IVisual } from 'powerbi-models';

export interface IPowerBIWidgetBuilderProps
    extends IWidgetBuilderFormDataProps {
    formData: IPowerBIWidget;
    updateWidgetData: (widgetData: IPowerBIWidget) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IPowerBIWidgetBuilderStyleProps,
        IPowerBIWidgetBuilderStyles
    >;
}

export interface IPowerBIWidgetBuilderStyleProps {
    theme: ITheme;
}
export interface IPowerBIWidgetBuilderStyles {
    root: IStyle;
    header?: IStyle;
    description?: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPowerBIWidgetBuilderSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPowerBIWidgetBuilderSubComponentStyles {}

export enum PowerBIWidgetBuilderActionType {
    GET_PAGES_IN_REPORT = 'GET_PAGES_IN_REPORT',
    GET_VISUALS_ON_PAGE = 'GET_VISUALS_ON_PAGE'
}

export type IPowerBIWidgetBuilderAction =
    | {
          type: PowerBIWidgetBuilderActionType.GET_PAGES_IN_REPORT;
          payload: {
              embedUrl: string;
          };
      }
    | {
          type: PowerBIWidgetBuilderActionType.GET_VISUALS_ON_PAGE;
          payload: {
              embedUrl: string;
              pageName: string;
          };
      };

export interface IPowerBIWidetBuilderState {
    pages: IPage[];
    visuals: IVisual[];
    isPagesLoaded: boolean;
    isVisualsLoaded: boolean;
}

export const defaultPowerBIWidgetBuilderState: IPowerBIWidetBuilderState = {
    pages: [],
    visuals: [],
    isPagesLoaded: false,
    isVisualsLoaded: false
};
