import {
    DTwin,
    ADTPatch,
    IADTRelationship,
    PropertyInspectorPatchMode,
    Theme,
    Locale
} from '../..';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';

export interface OnCommitPatchParams {
    patchMode: PropertyInspectorPatchMode;
    id: string;
    sourceTwinId?: string;
    patches: Array<ADTPatch>;
}

export interface StandalonePropertyInspectorProps {
    inputData: TwinParams | RelationshipParams;
    missingModelIds?: Array<string>;
    theme?: Theme;
    locale?: Locale;
    localeStrings?: Record<string, any>;
    onCommitChanges?: (patchData: OnCommitPatchParams) => any;
    readonly?: boolean;
}

export type TwinParams = {
    twin: DTwin;
    expandedModels: DtdlInterface[];
};

export type RelationshipParams = {
    relationship: IADTRelationship;
    expandedModels: DtdlInterface[];
};

export const isTwin = (
    inputData: TwinParams | RelationshipParams
): inputData is TwinParams => {
    return (inputData as TwinParams).twin !== undefined;
};
