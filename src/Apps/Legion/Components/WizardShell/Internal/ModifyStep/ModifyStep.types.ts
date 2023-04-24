import { IStyle } from '@fluentui/react';

export interface IModifyStepProps {
    showDiagram: boolean;
}

export interface IModifyStepStyles {
    root: IStyle;
}

export enum ModifyPivotKeys {
    Diagram = 'Diagram',
    Entities = 'Entities',
    Types = 'Types',
    Graph = 'Graph'
}
