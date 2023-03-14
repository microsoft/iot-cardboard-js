import { IOATFile } from '../../Pages/OATEditorPage/Internal/Classes/OatTypes';
import { DtdlInterface } from '../Constants';
import {
    ActionToEventMapping,
    OatOnMountMetrics,
    OatImportExportMetrics
} from '../Constants/OatTelemetryConstants';
import { OatPageContextActionType } from '../Context/OatPageContext/OatPageContext.types';
import { getModelMetricsForTelemetry } from '../Context/OatPageContext/OatPageContextUtils';

export const getNameFromAction = (action: OatPageContextActionType) => {
    return ActionToEventMapping[action];
};

export const getOatMetricsForModels = (
    models: DtdlInterface[]
): OatImportExportMetrics => {
    const oatMetrics = getModelMetricsForTelemetry(models);
    return {
        modelCount: models.length,
        relationshipCount: oatMetrics.relationshipCount,
        inheritanceCount: oatMetrics.inheritanceCount,
        componentCount: oatMetrics.componentCount,
        v2ModelCount: oatMetrics.v2ModelCount,
        v3ModelCount: oatMetrics.v3ModelCount
    };
};

export const getOatGlobalMetrics = (files: IOATFile[]): OatOnMountMetrics => {
    if (!files.length) {
        return {
            modelCount: 0,
            relationshipCount: 0,
            projectCount: 0,
            inheritanceCount: 0,
            componentCount: 0,
            v2ModelCount: 0,
            v3ModelCount: 0
        };
    }

    let modelCount = 0;
    let relationshipCount = 0;
    let inheritanceCount = 0;
    let componentCount = 0;
    let v2ModelCount = 0;
    let v3ModelCount = 0;
    files.forEach((f) => {
        if (f.data && f.data.models) {
            const metrics = getOatMetricsForModels(f.data.models);
            modelCount = modelCount + metrics.modelCount;
            relationshipCount = relationshipCount + metrics.relationshipCount;
            inheritanceCount = inheritanceCount + metrics.inheritanceCount;
            componentCount = componentCount + metrics.componentCount;
            v2ModelCount = v2ModelCount + metrics.v2ModelCount;
            v3ModelCount = v3ModelCount + metrics.v3ModelCount;
        }
    });

    return {
        modelCount: modelCount,
        relationshipCount: relationshipCount,
        projectCount: files.length,
        inheritanceCount: inheritanceCount,
        componentCount: componentCount,
        v2ModelCount: v2ModelCount,
        v3ModelCount: v3ModelCount
    };
};
