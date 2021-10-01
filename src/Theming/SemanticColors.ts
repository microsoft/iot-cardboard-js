import { ISemanticColors } from '@fluentui/react';

/*
    Semantic slots are used to style Fluent components and are auto populated
    based on the theme color palette slots. These auto populated colors can be overriden by 
    specifying the semantic slots in this file
*/

export const fluentLightThemeSemanticColors: Partial<ISemanticColors> = {};

export const fluentDarkThemeSemanticColors: Partial<ISemanticColors> = {
    menuBackground: '#2b2b2b'
};

export const fluentExplorerThemeSemanticColors: Partial<ISemanticColors> = {
    menuBackground: '#323130',
    severeWarningBackground: '#442726',
    messageText: '#ffffff'
};
