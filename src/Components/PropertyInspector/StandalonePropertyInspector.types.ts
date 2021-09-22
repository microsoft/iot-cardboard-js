import {
    DTwin,
    ADTPatch,
    IADTRelationship,
    PropertyInspectorPatchMode,
    Theme,
    Locale
} from '../..';
import {
    DtdlInterface,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';

export interface OnCommitPatchParams {
    patchMode: PropertyInspectorPatchMode;
    id: string;
    sourceTwinId?: string;
    patches: Array<ADTPatch>;
}

export interface StandalonePropertyInspectorProps {
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    inputData: TwinParams | RelationshipParams;
    missingModelIds?: Array<string>;
    onCommitChanges?: (patchData: OnCommitPatchParams) => any;
    readonly?: boolean;
}

export type TwinParams = {
    twin: DTwin;
    expandedModels: DtdlInterface[];
    rootModel: DtdlInterface;
};

export type RelationshipParams = {
    relationship: IADTRelationship;
    relationshipDefinition: DtdlRelationship;
};

export const isTwin = (
    inputData: TwinParams | RelationshipParams
): inputData is TwinParams => {
    return (inputData as TwinParams).twin !== undefined;
};
