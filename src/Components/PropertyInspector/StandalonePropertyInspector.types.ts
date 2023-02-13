import {
    DTwin,
    ADTPatch,
    IADTRelationship,
    PropertyInspectorPatchMode,
    Theme,
    Locale
} from '../..';
import { DtdlInterface } from '../../Models/Constants/dtdlInterfaces';
import { IDataHistoryExplorerModalControlProps } from '../DataHistoryExplorerModal/DataHistoryExplorerModalControl/DataHistoryExplorerModalControl.types';

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
    onRefresh?: () => any;
    readonly?: boolean;
    parentHandlesScroll?: boolean;
    customCommandBarTitleSpan?: React.ReactNode;
    dataHistoryControlProps?: IDataHistoryExplorerModalControlProps;
}

export type TwinParams = {
    twin: DTwin;
    expandedModels: DtdlInterface[];
    rootModel: DtdlInterface;
};

export type RelationshipParams = {
    relationship: IADTRelationship;
    relationshipModel: DtdlInterface;
};

export const isTwin = (
    inputData: TwinParams | RelationshipParams
): inputData is TwinParams => {
    return (inputData as TwinParams).twin !== undefined;
};
