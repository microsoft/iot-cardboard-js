import { DTwin, DTwinPatch, IADTRelationship } from '../..';
import {
    DtdlInterface,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';

export interface OnCommitTwinPatchParams {
    twinId: string;
    patches: Array<DTwinPatch>;
}

export interface StandalonePropertyInspectorProps {
    inputData: TwinParams | RelationshipParams;
    onCommitChanges?: (patchData: OnCommitTwinPatchParams) => any;
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
