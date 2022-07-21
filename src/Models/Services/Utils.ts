import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import React from 'react';
import {
    IADTTwin,
    ADTModel_ViewData_PropertyName,
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName,
    ADTModel_InBIM_RelationshipName,
    ComponentErrorType,
    DTwin
} from '../Constants';
import {
    DtdlInterface,
    DtdlInterfaceContent,
    DtdlProperty,
    DtdlRelationship
} from '../Constants/dtdlInterfaces';
import {
    CharacterWidths,
    OATDataStorageKey,
    OATFilesStorageKey,
    OATRelationshipHandleName,
    OATUntargetedRelationshipName
} from '../Constants/Constants';
import { Parser } from 'expr-eval';
import Ajv from 'ajv/dist/2020';
import schema from '../../../schemas/3DScenesConfiguration/v1.0.0/3DScenesConfiguration.schema.json';
import { ComponentError } from '../Classes/Errors';
import {
    I3DScenesConfig,
    IValueRange
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { IDropdownOption } from '@fluentui/react';
import { createParser, ModelParsingOption } from 'azure-iot-dtdl-parser';
import { ProjectData } from '../../Pages/OATEditorPage/Internal/Classes';
import { IOATModelPosition } from '../../Pages/OATEditorPage/OATEditorPage.types';
let ajv: Ajv = null;

/** Validates input data with JSON schema */
export const validate3DConfigWithSchema = (
    data: I3DScenesConfig
): I3DScenesConfig => {
    if (!ajv) ajv = new Ajv();
    const validate = ajv.compile(schema); // This is cached if schema doesn't change
    const valid = validate(data);
    if (valid) {
        return data;
    } else {
        // TODO remove error printing
        console.log('Schema validation errors: ', validate.errors);
        throw new ComponentError({
            type: ComponentErrorType.JsonSchemaError,
            jsonSchemaErrors: validate.errors
        });
    }
};

export const createGUID = (isWithDashes = false) => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return isWithDashes
        ? `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
        : `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`;
};

export const getFileType = (fileName: string, defaultType = '') => {
    const fileSegments = fileName.split('.');
    return fileSegments.length > 1
        ? fileSegments[fileSegments.length - 1]
        : defaultType;
};

export const createNodeFilterFromRootForBIM = (parentNodeModelName: string) => {
    return (nodes: any) => {
        const filteredNodes = {};
        Object.keys(nodes).forEach((nodeKey) => {
            const modelContents = nodes[nodeKey].nodeData?.model?.contents;
            const filteredContents = modelContents.filter((content) => {
                return (
                    content['@type'] === 'Relationship' &&
                    content.name === ADTModel_InBIM_RelationshipName && // currently hardcoded - a sort of reserved relationship for twin creation from a BIM file
                    content.target === parentNodeModelName
                );
            });
            if (filteredContents.length === 1) {
                filteredNodes[nodeKey] = nodes[nodeKey];
            }
        });

        return filteredNodes;
    };
};

export const createSeededGUID = (seededRandomNumGen: () => number) => {
    const s4 = () => {
        return Math.floor((1 + seededRandomNumGen()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const getMarkedHtmlBySearch = (
    str,
    searchTerm,
    isCaseSensitive = false
) => {
    try {
        const regexp = new RegExp(searchTerm, isCaseSensitive ? 'g' : 'gi');
        const matches = str.match(regexp);
        return str
            .split(regexp)
            .map((s, i) =>
                React.createElement('span', { key: i }, [
                    s,
                    i < matches?.length
                        ? React.createElement(
                              'mark',
                              { key: `marked_${i}` },
                              matches[i]
                          )
                        : null
                ])
            );
    } catch (e) {
        return str;
    }
};

export const objectHasOwnProperty = (obj, propertyName) =>
    Object.prototype.hasOwnProperty.call(obj, propertyName);

export const parseViewProperties = (data: Record<string, any>) => {
    return Object.keys(data).filter((key) => {
        return (
            !key.startsWith('$') &&
            key !== ADTModel_ImgSrc_PropertyName &&
            key !== ADTModel_ImgPropertyPositions_PropertyName
        );
    });
};

export const hasAllProcessGraphicsCardProperties = (
    dtTwin: IADTTwin
): boolean => {
    return (
        objectHasOwnProperty(dtTwin, ADTModel_ViewData_PropertyName) &&
        objectHasOwnProperty(
            dtTwin[ADTModel_ViewData_PropertyName],
            ADTModel_ImgSrc_PropertyName
        ) &&
        objectHasOwnProperty(
            dtTwin[ADTModel_ViewData_PropertyName],
            ADTModel_ImgPropertyPositions_PropertyName
        )
    );
};

export const downloadText = (text: string, fileName?: string) => {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const blobURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', blobURL);
    link.setAttribute('download', fileName ? fileName : 'Instances.json');
    link.innerHTML = '';
    document.body.appendChild(link);
    link.click();
};

/** Remove the suffix or any other text after the numbers, or return undefined if not a number */
export const getNumericPart = (value: string): number | undefined => {
    const valueRegex = /^(-?\d+(\.\d+)?).*/;
    if (valueRegex.test(value)) {
        const numericValue = Number(value.replace(valueRegex, '$1'));
        return isNaN(numericValue) ? undefined : numericValue;
    }
    return undefined;
};

export const getModelContentType = (type: string | string[]) => {
    return Array.isArray(type) ? type[0] : type;
};

export const getModelContentUnit = (
    type: string | string[],
    property: DtdlProperty
) => {
    return Array.isArray(type) && type[1] ? property?.unit : null;
};

export const createDTDLModelId = (name) => {
    return `dtmi:assetGen:${name};1`;
};

export const applyMixins = (derivedCtor: any, constructors: any[]) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
            );
        });
    });
};

export function measureText(str: string, fontSize: number) {
    const avg = 0.5279276315789471;
    return (
        Array.from(str).reduce(
            (acc, cur) => acc + (CharacterWidths[cur.charCodeAt(0)] ?? avg),
            0
        ) * fontSize
    );
}

export function getTimeStamp() {
    const d = new Date();
    const seconds = d.getSeconds();
    const minutes = d.getMinutes();
    const hours = d.getHours();
    const date = encodeURIComponent(d.toLocaleDateString().replace(/\//g, '-'));
    const timeStamp = `${date}_${hours - 12}:${minutes}:${seconds}`;
    return timeStamp;
}

export function parseExpression(expression: string, twins: any) {
    let result: any = '';
    try {
        result = Parser.evaluate(expression, twins) as any;
    } catch {
        console.log(`Unable to parse expression: ${expression}`);
    }

    return result;
}

export function deepCopy<T>(object: T): T {
    return JSON.parse(JSON.stringify(object)) as T;
}

export function getSceneElementStatusColor(
    statusValueExpression: string,
    valueRanges: IValueRange[],
    twins: Record<string, DTwin>
) {
    const value = parseExpression(statusValueExpression, twins);
    return ViewerConfigUtility.getColorOrNullFromStatusValueRange(
        valueRanges,
        value
    );
}

export function buildDropdownOptionsFromStrings(
    properties: string[]
): IDropdownOption[] {
    const entries = properties.map((x) => ({
        key: x,
        text: x
    }));
    return entries;
}

/**
 * Takes in a hex string and splits off the # and gives back an object with the RGB values
 * @param hex hex value string with the # at the front
 * @returns an object for the rgb values
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null;
}

/** gives back the RGBA string for css */
export function hexToRgbCss(hex: string): string {
    const { r, g, b } = hexToRgb(hex);
    return `${r}, ${g}, ${b}`;
}
/**
 * Gives back the css string to use for making a give hex color into a transparent RGBA
 * @param hex Hex value of the color. e
 * @param transparency amount of transparency
 * @example `getTransparentColor(theme.palette.black,'0.1')`
 * @returns string to be plugged into a style
 */
export function getTransparentColor(
    hex: string,
    transparency:
        | '0.1'
        | '0.2'
        | '0.3'
        | '0.4'
        | '0.5'
        | '0.6'
        | '0.7'
        | '0.8'
        | '0.9'
): string {
    return `rgba(${hexToRgbCss(hex)}, ${transparency})`;
}

export function performSubstitutions(
    expression: string,
    twins: Record<string, DTwin>
) {
    while (expression) {
        const n = expression.indexOf('${');
        if (n < 0) {
            break;
        }

        const m = expression.indexOf('}', n + 1);
        if (m < 0) {
            break;
        }

        const sub = expression.substring(n + 2, m);
        const target = parseExpression(sub, twins);
        expression =
            expression.substring(0, n) + target + expression.substring(m + 1);
    }

    return expression;
}

export function hexToColor4(hex: string): BABYLON.Color4 {
    if (!hex) {
        return undefined;
    }

    // remove invalid characters
    hex = hex.replace(/[^0-9a-fA-F]/g, '');
    if (hex.length < 5) {
        // 3, 4 characters double-up
        hex = hex
            .split('')
            .map((s) => s + s)
            .join('');
    }

    // parse pairs of two
    const rgba = hex
        .match(/.{1,2}/g)
        .map((s) => parseFloat((parseInt(s, 16) / 255).toString()));
    // alpha code between 0 & 1 / default 1
    rgba[3] = rgba.length > 3 ? rgba[3] : 1;
    const color = new BABYLON.Color4(rgba[0], rgba[1], rgba[2], rgba[3]);
    return color;
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export async function parseModel(modelJson: string) {
    const modelParser = createParser(
        ModelParsingOption.PermitAnyTopLevelElement
    );
    try {
        await modelParser.parse([modelJson]);
    } catch (err) {
        if (err.name === 'ParsingException') {
            return err._parsingErrors
                .map((e) => `${e.action} ${e.cause}`)
                .join('\n');
        }

        return err.message;
    }
}

// Store OAT-data
export const storeEditorData = (oatEditorData: ProjectData) => {
    localStorage.setItem(OATDataStorageKey, JSON.stringify(oatEditorData));
};

// Get stored OAT-data
export const getStoredEditorData = () => {
    return JSON.parse(localStorage.getItem(OATDataStorageKey));
};

// Get stored template OAT-data
export const getStoredEditorTemplateData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.templates ? oatData.templates : [];
};

// Get stored models OAT-data
export const getStoredEditorModelsData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.models ? oatData.models : [];
};

// Get stored models' positions OAT-data
export const getStoredEditorModelPositionsData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.modelsData && oatData.modelsData.modelPositions
        ? oatData.modelsData.modelPositions
        : [];
};

export const getStoredEditorModelMetadata = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.modelsData && oatData.modelsData.modelsMetadata
        ? oatData.modelsData.modelsMetadata
        : [];
};

// Get stored models' namespace OAT-data
export const getStoredEditorNamespaceData = () => {
    const oatData = getStoredEditorData();
    return oatData && oatData.namespace ? oatData.namespace : null;
};

export const updateModelId = (
    oldId: string,
    newId: string,
    models: DtdlInterface[],
    modelPositions: IOATModelPosition[]
) => {
    // Update the modelPositions
    const modelsPositionsCopy = deepCopy(modelPositions);

    // Find the model position with the same id
    const modelPosition = modelsPositionsCopy.find((x) => x['@id'] === oldId);
    if (modelPosition) {
        modelPosition['@id'] = newId;
    }

    // Update models
    const modelsCopy = deepCopy(models);
    const modelCopy = modelsCopy.find((x) => x['@id'] === oldId);
    if (modelCopy) {
        modelCopy['@id'] = newId;
    }

    // Update contents
    modelsCopy.forEach((m) =>
        m.contents.forEach((c) => {
            const r = c as DtdlRelationship;
            if (r && r.target === oldId) {
                r.target = newId;
            }
            if (r && r['@id'] === oldId) {
                r['@id'] = newId;
            }

            const p = c as DtdlInterfaceContent;
            if (p && p.schema === oldId) {
                p.schema = newId;
            }

            if (m.extends) {
                const e = m.extends as string[];
                const i = e.indexOf(oldId);
                if (i >= 0) {
                    e[i] = newId;
                }
            }
        })
    );

    return [modelsCopy, modelsPositionsCopy];
};

// Get fileName from DTMI
export const getFileNameFromDTMI = (dtmi: string) => {
    // Get id path - Get section between last ":" and ";"
    const initialPosition = dtmi.lastIndexOf(':') + 1;
    const finalPosition = dtmi.lastIndexOf(';');

    if (initialPosition !== 0 && finalPosition !== -1) {
        const idPath = dtmi.substring(initialPosition, finalPosition);
        const idVersion = dtmi.substring(
            dtmi.lastIndexOf(';') + 1,
            dtmi.length
        );
        return `${idPath}-${idVersion}`;
    }
};

// Get directoryPath from DTMI
export const getDirectoryPathFromDTMI = (dtmi: string) => {
    const initialPosition = dtmi.indexOf(':') + 1;
    const finalPosition = dtmi.lastIndexOf(':');

    if (initialPosition !== 0 && finalPosition !== -1) {
        const directoryPath = dtmi.substring(initialPosition, finalPosition);
        // Scheme - replace ":" with "\"
        return directoryPath.replace(':', '\\');
    }
};

// Load files from local storage
export const loadFiles = () =>
    JSON.parse(localStorage.getItem(OATFilesStorageKey)) || [];

// Save files from local storage
export const saveFiles = (files: ProjectData[]) => {
    localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
};

// Delete model
export const deleteModel = (id, data, models) => {
    const modelsCopy = deepCopy(models);
    if (data['@type'] === OATUntargetedRelationshipName) {
        const match = modelsCopy.find(
            (element) => element['@id'] === data['@id']
        );
        if (match) {
            match.contents = match.contents.filter(
                (content) => content['@id'] !== id
            );
        }
    } else {
        const index = modelsCopy.findIndex((m) => m['@id'] === data['@id']);
        if (index >= 0) {
            modelsCopy.splice(index, 1);
            modelsCopy.forEach((m) => {
                m.contents = m.contents.filter(
                    (content) =>
                        content.target !== data['@id'] &&
                        content.schema !== data['@id']
                );
                if (m.extends) {
                    m.extends = (m.extends as string[]).filter(
                        (ex) => ex !== data['@id']
                    );
                }
            });
        }
    }

    return modelsCopy;
};
