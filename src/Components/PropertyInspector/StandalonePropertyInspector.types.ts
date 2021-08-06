import { DTwin, DTwinUpdateEvent } from '../..';
import {
    DtdlInterface,
    DtdlRelationship
} from '../../Models/Constants/dtdlInterfaces';

export interface TwinStandalonePropertyInspectorProps {
    twin: DTwin;
    model: DtdlInterface;
    components?: DtdlInterface[];
    relationships?: DtdlRelationship;
    onCommitChanges?: (patch: DTwinUpdateEvent) => any;
}

export interface RelationshipStandalonePropertyInspectorProps {
    relationship?: DtdlRelationship;
    onCommitChanges?: (patch: any) => any;
}

export const isTwin = (
    json:
        | TwinStandalonePropertyInspectorProps
        | RelationshipStandalonePropertyInspectorProps
): json is TwinStandalonePropertyInspectorProps => {
    return (json as TwinStandalonePropertyInspectorProps).twin !== undefined;
};
