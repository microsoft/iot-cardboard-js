import { DTwin } from '../..';
import {
    DtdlInterface,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';

export interface StandalonePropertyInspectorProps {
    inputData: TwinParams | RelationshipParams;
    onCommitChanges?: (patch: any) => any;
}

export type TwinParams = {
    twin: DTwin;
    expandedModel: DtdlInterface[];
    rootModel: DtdlInterface;
};

export type RelationshipParams = {
    relationship?: DtdlRelationship;
};

export const isTwin = (
    inputData: TwinParams | RelationshipParams
): inputData is TwinParams => {
    return (inputData as TwinParams).twin !== undefined;
};
