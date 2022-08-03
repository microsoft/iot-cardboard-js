import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import React from 'react';
import {
    IADTTwin,
    ADTModel_ViewData_PropertyName,
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName,
    ADTModel_InBIM_RelationshipName,
    ComponentErrorType,
    DTwin,
    IConsoleLogFunction,
    DurationUnits
} from '../Constants';
import { DtdlInterface, DtdlProperty } from '../Constants/dtdlInterfaces';
import { CharacterWidths } from '../Constants/Constants';
import { Parser } from 'expr-eval';
import Ajv from 'ajv/dist/2020';
import schema from '../../../schemas/3DScenesConfiguration/v1.0.0/3DScenesConfiguration.schema.json';
import { ComponentError } from '../Classes/Errors';
import {
    I3DScenesConfig,
    IValueRange
} from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../Classes/ViewerConfigUtility';
import { createParser, ModelParsingOption } from 'azure-iot-dtdl-parser';
import { IDropdownOption } from '@fluentui/react';
import { isConstant, toConstant } from 'constantinople';
import { v4 } from 'uuid';
import TreeMap from 'ts-treemap';

let ajv: Ajv = null;
const parser = createParser(ModelParsingOption.PermitAnyTopLevelElement);

/** Parse DTDL models via model parser */
export const parseDTDLModelsAsync = async (dtdlInterfaces: DtdlInterface[]) => {
    const modelDict = await parser.parse(
        dtdlInterfaces.map((dtdlInterface) => JSON.stringify(dtdlInterface))
    );
    return modelDict;
};

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
        console.error('Schema validation errors: ', validate.errors);
        throw new ComponentError({
            type: ComponentErrorType.JsonSchemaError,
            jsonSchemaErrors: validate.errors
        });
    }
};

export const createGUID = (isWithDashes = false) => {
    let id: string = v4();
    if (!isWithDashes) {
        id = id.replace(/-/g, '');
    }
    return id;
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

/**
 * Takes in a duration in milliseconds and returns and object that has the value converted to the best units to describe that duration (ex: seconds, minutes, hours, days, years).
 * @param milliseconds millisecond duration to convert
 * @returns an object containing the scaled version and the locale resource key for the units
 */
export function formatTimeInRelevantUnits(
    milliseconds: number,
    minimumUnits: DurationUnits = DurationUnits.milliseconds
): { value: number; displayStringKey: string } {
    const DEFAULT_RESULT = {
        value: 0,
        displayStringKey: 'duration.seconds'
    };
    if (milliseconds < 1) {
        return DEFAULT_RESULT;
    }
    const timeUnits = new TreeMap<number, string>();
    minimumUnits <= DurationUnits.milliseconds &&
        timeUnits.set(1, 'duration.millisecond');
    minimumUnits <= DurationUnits.seconds &&
        timeUnits.set(1000, 'duration.second');
    minimumUnits <= DurationUnits.minutes &&
        timeUnits.set(60 * 1000, 'duration.minute');
    minimumUnits <= DurationUnits.hours &&
        timeUnits.set(60 * 60 * 1000, 'duration.hour');
    minimumUnits <= DurationUnits.days &&
        timeUnits.set(24 * 60 * 60 * 1000, 'duration.day');
    minimumUnits <= DurationUnits.years &&
        timeUnits.set(365 * 24 * 60 * 60 * 1000, 'duration.year');

    // get the next entry below, if there isn't one, get the next one larger
    let unitBelow = timeUnits.floorEntry(milliseconds);
    let value = milliseconds / (unitBelow?.[0] || 1);

    if (!unitBelow) {
        unitBelow = timeUnits.higherEntry(milliseconds);
        value = 0;
    }

    let units = unitBelow[1];
    // make the key plural if it's != 1
    if (value !== 1) {
        units += 's';
    }
    return {
        value: value,
        displayStringKey: units
    };
}

export function parseExpression(expression: string, twins: any) {
    let result: any = '';
    try {
        result = Parser.evaluate(expression, twins) as any;
    } catch {
        console.error(`Unable to parse expression: ${expression}`);
    }

    return result;
}

export function deepCopy<T>(object: T): T {
    if (object) {
        return JSON.parse(JSON.stringify(object)) as T;
    } else {
        return object;
    }
}

export function getSceneElementStatusColor(
    valueExpression: string,
    valueRanges: IValueRange[],
    twins: Record<string, DTwin>
) {
    const value = parseLinkedTwinExpression(valueExpression, twins);
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

export function wrapTextInTemplateString(text: string) {
    if (!text) return '';
    const templatedText = text.replace(/`/g, '');
    return '`' + templatedText + '`';
}

export function stripTemplateStringsFromText(text: string) {
    if (!text) return '';
    return text.replace(/`/g, '');
}

export function parseLinkedTwinExpression(
    expression: string,
    twins: Record<string, DTwin>,
    fallbackResult?: any
) {
    let result: any = fallbackResult ?? '';

    try {
        if (isConstant(expression, { ...twins, Math: Math })) {
            result = toConstant(expression, { ...twins, Math: Math });
        }
    } catch (err) {
        console.error(`${expression} - could not be parsed into constant`);
    }

    return result;
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

export function addHttpsPrefix(url: string) {
    if (url?.startsWith('https://')) {
        // if it's got the prefix, don't add anything
        return url;
    } else if (url) {
        // if we have a value, add the prefix
        return 'https://' + url;
    } else {
        // if we didn't get anything, then just give back whatever value we got ('', undefined, null)
        return url;
    }
}

/**
 * Sort function to order items alphabetically. Case insensitive sort
 * NOTE: only works when property is one layer down
 * @param propertyName name of the property to sort on
 * @example listItems.sort(sortAlphabetically('textPrimary'))
 * @returns Sort function to pass to `.sort()`
 */
export function sortAlphabetically<T>(propertyName: keyof T) {
    return (a: T, b: T) => {
        const aVal = (a[propertyName] as unknown) as string;
        const bVal = (b[propertyName] as unknown) as string;
        return aVal?.toLowerCase() > bVal?.toLowerCase() ? 1 : -1;
    };
}

export function getDebugLogger(
    context: string,
    enabled: boolean
): IConsoleLogFunction {
    if (!enabled) return () => undefined;
    return (
        level: 'debug' | 'info' | 'warn' | 'error',
        message: string,
        ...args: unknown[]
    ) => {
        const formattedMessage = `[CB-DEBUG][${context}] ${message}`;
        switch (level) {
            case 'debug':
                console.debug(formattedMessage, ...args);
                break;
            case 'error':
                console.error(formattedMessage, ...args);
                break;
            case 'warn':
                console.warn(formattedMessage, ...args);
                break;
            default:
                console.info(formattedMessage, ...args);
                break;
        }
    };
}
