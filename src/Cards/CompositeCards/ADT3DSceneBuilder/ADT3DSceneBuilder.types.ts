import ADTandBlobAdapter from '../../../Adapters/ADTandBlobAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import { ADT3DSceneBuilderMode } from '../../../Models/Constants/Enums';
import {
    ICardBaseProps,
    IConsumeCompositeCardProps
} from '../../../Models/Constants/Interfaces';
import { ADT3DSceneElement } from '../../../Models/Constants/Types';

export interface IADT3DSceneBuilderCardProps
    extends IConsumeCompositeCardProps {
    adapter: ADTandBlobAdapter | MockAdapter;
}

export interface I3DSceneBuilderContext {
    builderMode: ADT3DSceneBuilderMode;
    setBuilderMode: (mode: ADT3DSceneBuilderMode) => void;
    selectedObjects: Array<any>;
    setSelectedObjects: (objects: any) => void;
}

export interface IADT3DSceneBuilderVIsualStateRulesWizardProps
    extends ICardBaseProps {
    adapter: ADTandBlobAdapter | MockAdapter;
}

export interface ADT3DSceneBuilderVisualStateRulesState {
    elements: Array<ADT3DSceneElement>;
}
