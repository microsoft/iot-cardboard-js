import {
    DTwin,
    AdtPatch,
    IADTRelationship,
    PropertyInspectorPatchMode
} from '../..';
import {
    DtdlInterface,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';

export interface OnCommitPatchParams {
    patchMode: PropertyInspectorPatchMode;
    id: string;
    sourceTwinId?: string;
    patches: Array<AdtPatch>;
}

export interface StandalonePropertyInspectorProps {
    inputData: TwinParams | RelationshipParams;
    onCommitChanges?: (patchData: OnCommitPatchParams) => any;
    readonly?: boolean;
}

export type TwinParams = {
    twin: DTwin;
    expandedModel: DtdlInterface[];
    rootModel: DtdlInterface;
};

export type RelationshipParams = {
    relationship: IADTRelationship;
    relationshipModel: DtdlRelationship;
};

export const isTwin = (
    inputData: TwinParams | RelationshipParams
): inputData is TwinParams => {
    return (inputData as TwinParams).twin !== undefined;
};
