import React from 'react';

// Interfaces, enums, types
export enum PageNames {
    Home = 'Home',
    TemplatesForm = 'TemplatesForm',
    SourceMappingForm = 'SourceMappingForm',
    EventHandlerForm = 'EventHandlersForm',
    SubscriptionsForm = 'SubscriptionsForm'
}

// Context types
export interface INavigationContext {
    navigationContextState: INavigationContextState;
    navigationContextDispatch: React.Dispatch<NavigationContextAction>;
}

export interface INavigationContextState {
    currentPage: PageNames;
}

export enum NavigationContextActionType {
    NAVIGATE_TO = 'NAVIGATE_TO'
}

export type NavigationContextAction = {
    type: NavigationContextActionType.NAVIGATE_TO;
    payload: {
        pageName: PageNames;
    };
};

// Provider types
export interface INavigationContextProviderProps {
    initialState?: Partial<INavigationContextState>;
}
