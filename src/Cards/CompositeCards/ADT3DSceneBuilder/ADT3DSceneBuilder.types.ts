import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import {
    Behavior,
    ScenesConfig,
    TwinToObjectMapping
} from '../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderMode,
    Locale,
    Theme
} from '../../../Models/Constants/Enums';
import { IConsumeCompositeCardProps } from '../../../Models/Constants/Interfaces';

export interface IADT3DSceneBuilderCardProps
    extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
    sceneId: string;
}

export interface I3DSceneBuilderContext {
    adapter: ADTandBlobAdapter | MockAdapter;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    config: ScenesConfig;
    sceneId: string;
    selectedObjectIds: Array<string>;
    setSelectedObjectIds: (objects: Array<string>) => void;
}

export interface IADT3DSceneBuilderVisualStateRulesWizardProps {
    loadConfig: () => void;
}

export interface IADT3DSceneBuilderElementListProps {
    elements: Array<TwinToObjectMapping>;
    handleCreateElementClick: () => void;
    handleElementClick: (element: TwinToObjectMapping) => void;
}

export interface IADT3DSceneBuilderCreateElementFormProps {
    builderMode: ADT3DSceneBuilderMode;
    element: TwinToObjectMapping;
    handleSaveClick: (editedElement: TwinToObjectMapping) => void;
    handleElementBackClick: () => void;
}

export interface ADT3DSceneBuilderState {
    config: ScenesConfig;
    selectedObjectIds: Array<string>;
}

export interface ADT3DSceneBuilderVisualStateRulesWizardState {
    builderMode: ADT3DSceneBuilderMode;
    elements: Array<TwinToObjectMapping>;
    behaviors: Array<Behavior>;
    selectedElement: TwinToObjectMapping;
}
