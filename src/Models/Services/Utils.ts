import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import React from 'react';
import { DtdlInterface, DtdlProperty } from '../Constants/dtdlInterfaces';
import {
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName,
    ADTModel_InBIM_RelationshipName,
    ADTModel_ViewData_PropertyName,
    CharacterWidths,
    CONNECTION_STRING_SUFFIX
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
import { isConstant, toConstant } from 'constantinople';
import { v4 } from 'uuid';
import TreeMap from 'ts-treemap';
import {
    AzureAccessPermissionRoles,
    AzureResourceDisplayFields,
    AzureResourceTypes,
    ComponentErrorType
} from '../Constants/Enums';
import { DTwin, IADTTwin, IAzureResource } from '../Constants/Interfaces';
import {
    AzureAccessPermissionRoleGroups,
    DurationUnits,
    IConsoleLogFunction,
    TimeSeriesData
} from '../Constants/Types';
import { format } from 'd3-format';

let ajv: Ajv = null;
// const parser = createParser(ModelParsingOption.PermitAnyTopLevelElement);

/** Parse DTDL models via model parser */
export const parseDTDLModelsAsync = async (dtdlInterfaces: DtdlInterface[]) => {
    const DTDLParserPath = './dtdl-parser/index.js';
    const { parseAsync } = await import(
        /* webpackIgnore: true */ DTDLParserPath
    );
    let modelDict = null;

    /* We loop over this function to attempt to parse models, and remove models that fail */
    const tryParseWorkerFunction = async (interfaces: DtdlInterface[]) => {
        try {
            return await parseAsync(
                interfaces.map((dtdlInterface) => JSON.stringify(dtdlInterface))
            );
        } catch (e) {
            logDtdlParserError(e);
            return e;
        }
    };

    modelDict = await tryParseWorkerFunction(dtdlInterfaces);

    /* If some models failed to parse, we will try to remove them and parse the rest of the models */
    let previousInterfaces = dtdlInterfaces;
    let failedModelCount = 0;
    const maxFailedModelCount = 20;
    while (
        modelDict?._parsingErrors &&
        failedModelCount < maxFailedModelCount
    ) {
        try {
            const parsingErrorCauses = modelDict?._parsingErrors?.map(
                (pe) => pe?.cause
            ) as Array<string>;

            /* The parsing error cause is not a model ID, but it contains a model ID 
            so we remove the a model if its ID is contained in the cause */
            const interfacesWithoutParserErrors = previousInterfaces.filter(
                (intf) => {
                    const modelId = intf['@id'];
                    return !parsingErrorCauses?.filter((parseError) =>
                        parseError.includes(modelId)
                    ).length;
                }
            );

            /* Iteratively parse models if we successfully removed some models, and there are still some left */
            if (
                interfacesWithoutParserErrors.length <
                    previousInterfaces.length &&
                interfacesWithoutParserErrors.length > 0
            ) {
                console.log(
                    'Removing models that failed to parse and retrying'
                );
                modelDict = await tryParseWorkerFunction(
                    interfacesWithoutParserErrors
                );
                previousInterfaces = interfacesWithoutParserErrors;
                failedModelCount++;
            } else {
                console.warn('Could not remove models with parser errors');
                return null;
            }
        } catch (e) {
            console.warn('Could not remove models with parser errors');
            console.log(e);
            return null;
        }
    }

    return modelDict;
};

/* Pretty prints parser errors to the console to aid customer debugging */
export const logDtdlParserError = (parserErrors) => {
    try {
        console.group('DTDL Parser Errors');
        console.group('Raw Errors');
        console.table(JSON.stringify(parserErrors?._parsingErrors));
        console.group('Specific Errors');
        const consoleStyle = 'background: #0274bf; color: #fff; padding: 2px;';
        parserErrors?._parsingErrors?.forEach((pe) => {
            console.group(pe?.primaryId);
            console.log(`%cModelID: ${pe?.primaryId}`, consoleStyle);
            console.log(`%cValidationId: ${pe?.validationId}`, consoleStyle);
            console.log(`%cCause: ${pe?.cause}`, consoleStyle);
            console.groupEnd();
        });
        console.groupEnd();
        console.groupEnd();
        console.groupEnd();
    } catch (e) {
        return;
    }
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
    str: string,
    searchTerm: string,
    isCaseSensitive = false
) => {
    try {
        if (searchTerm) {
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
        } else {
            return React.createElement('span', {}, [str]);
        }
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
 * @returns an object containing the scaled version and the locale resource key for the units, NOTE: the resource key expects the value to be passed in as an argument to populate the value ex: `t(formattedTime.displayStringKey, {value: formattedTime.value})`
 */
export function formatTimeInRelevantUnits(
    milliseconds: number,
    minimumUnits: DurationUnits = DurationUnits.milliseconds
): { value: number; displayStringKey: string } {
    const DEFAULT_RESULT = {
        value: 0,
        displayStringKey: 'duration.seconds'
    };
    if (!milliseconds || milliseconds < 1) {
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
    let value = 0;

    if (!unitBelow) {
        unitBelow = timeUnits.higherEntry(milliseconds);
    } else {
        value = milliseconds / unitBelow[0];
    }

    let units = unitBelow[1];
    // make the key plural if it's != 1
    if (Math.round(value) != 1) {
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

export async function parseModels(models: DtdlInterface[]) {
    const modelParser = createParser(
        ModelParsingOption.PermitAnyTopLevelElement
    );
    try {
        await modelParser.parse([JSON.stringify(models)]);
    } catch (err) {
        if (err.name === 'ParsingException') {
            return err._parsingErrors
                .map((e) => `${e.action} ${e.cause}`)
                .join('\n');
        }

        return err.message;
    }
}

/**
 * Sort function to order items from ascending or descending order, for boolean, numbers and strings. Case insensitive sort
 * NOTE: only works when property is one layer down
 * @param propertyName name of the property to sort on
 *  @example listItems.sort(sortAscendingOrDescending('textPrimary'))
 * @returns Sort function to pass to `.sort()`
 */
export function sortAscendingOrDescending<T>(
    propertyName: keyof T,
    descending?: boolean
) {
    return (a: T, b: T) => {
        let aVal = (a[String(propertyName)] as unknown) as string;
        // handle the case where the property is not a string, if no value, fall back to empty string so we can sort undefined values consistently
        aVal =
            aVal && typeof aVal === 'string' ? aVal.toLowerCase() : aVal || '';
        let bVal = (b[String(propertyName)] as unknown) as string;
        // handle the case where the property is not a string, if no value, fall back to empty string so we can sort undefined values consistently
        bVal =
            bVal && typeof bVal === 'string' ? bVal.toLowerCase() : bVal || '';
        let order = -1;
        if (!descending) {
            order = aVal > bVal ? 1 : -1;
        } else {
            order = aVal < bVal ? 1 : -1;
        }
        return order;
    };
}

/**
 * remove duplicate objects from an array
 * @param array array of objects to operate on
 * @param key key of the property to use as the discriminator
 * @returns a new copy of the array with only unique values
 */
export function removeDuplicatesFromArray<T>(array: T[], key: keyof T) {
    const check = new Set<string>();
    return array.filter(
        (obj) => !check.has(obj[key as string]) && check.add(obj[key as string])
    );
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

/** checks if a value is null or undefined and returns true if it's not one of those values */
export function isDefined(value: unknown) {
    return value != null && value != undefined;
}

/**
 * Check if two string type resource display property values are equal
 * @param value1 resource property value
 * @param value2 resource property value
 * @example areResourceValuesEqual('https://exampleurl-1.com', 'https://exampleurl-2', AzureResourceDisplayFields.url)
 * @returns true if they are equal, false if not or values are empty
 */
export function areResourceValuesEqual(
    value1: string,
    value2: string,
    displayField: AzureResourceDisplayFields
): boolean {
    if (!value1 || !value2) return false;
    if (displayField === AzureResourceDisplayFields.url) {
        if (value1.endsWith('/')) {
            value1 = value1.slice(0, -1);
        }
        if (value2.endsWith('/')) {
            value2 = value2.slice(0, -1);
        }
        return value1.toLowerCase() === value2.toLowerCase();
    } else {
        return value1 === value2;
    }
}

/**
 * Retrieving the access permission role ids from role assignments resources
 * @param roleAssingments list of role assignments to retrieve the role ids from
 * @returns the list of role ids as AzureAccessPermissionRoles from the role assignment properties
 */
export function getRoleIdsFromRoleAssignments(
    roleAssignments: Array<IAzureResource> = []
): Array<AzureAccessPermissionRoles> {
    const assignedRoleIds = new Set<AzureAccessPermissionRoles>();
    roleAssignments.forEach((roleAssignment) => {
        const roleId = roleAssignment.properties?.roleDefinitionId
            ?.split('/')
            .pop();
        if (roleId) {
            assignedRoleIds.add(roleId);
        }
    });
    return Array.from(assignedRoleIds);
}

/**
 * Returns the list of missing role ids based on the passed assigned role ids and required role ids to check against
 * @param assignedRoleIds list of roles already assigned to the user
 * @param requiredAccessRoles list of required roles as enforced or interchangeables to check against if the user is already assigned
 * @returns the list of missing role group including missing enforced role ids and missing interchangeable role ids
 */
export function getMissingRoleIdsFromRequired(
    assignedRoleIds: Array<AzureAccessPermissionRoles>,
    requiredAccessRoles: AzureAccessPermissionRoleGroups
): AzureAccessPermissionRoleGroups {
    const missingRoleIds: AzureAccessPermissionRoleGroups = {
        enforced: [],
        interchangeables: []
    };

    requiredAccessRoles.enforced.forEach((enforcedRoleId) => {
        if (!assignedRoleIds.includes(enforcedRoleId)) {
            missingRoleIds.enforced.push(enforcedRoleId);
        }
    });

    requiredAccessRoles.interchangeables.forEach(
        // for each interchangeable permission group, at least one of the assignedRoleId needs to exist
        (interchangeableRoleIdGroup) => {
            if (
                !assignedRoleIds.some((assignedRoleId) =>
                    interchangeableRoleIdGroup.includes(assignedRoleId)
                )
            ) {
                missingRoleIds.interchangeables.push(
                    interchangeableRoleIdGroup
                );
            }
        }
    );

    return missingRoleIds;
}

export const getResourceUrl = (
    resource: IAzureResource | string, // can either be the url string or azure resource
    resourceType: AzureResourceTypes, // always pass this in case the resource is string type
    parentResource?: IAzureResource | string
): string | null => {
    if (resource) {
        if (typeof resource === 'string') {
            // it means the option is manually entered using freeform
            if (resourceType) {
                switch (resourceType.toLowerCase()) {
                    case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                    case AzureResourceTypes.StorageAccount.toLowerCase():
                        return resource.endsWith('/')
                            ? resource
                            : resource + '/';
                    case AzureResourceTypes.StorageBlobContainer.toLowerCase(): {
                        const storageAccountEndpointUrl = getResourceUrl(
                            parentResource,
                            AzureResourceTypes.StorageAccount
                        );
                        if (storageAccountEndpointUrl) {
                            return `${
                                storageAccountEndpointUrl.endsWith('/')
                                    ? storageAccountEndpointUrl
                                    : storageAccountEndpointUrl + '/'
                            }${resource}`;
                        } else {
                            return null;
                        }
                    }
                    default:
                        return null;
                }
            } else {
                return resource;
            }
        } else {
            const resourceType = resource.type;
            switch (resourceType.toLowerCase()) {
                case AzureResourceTypes.DigitalTwinInstance.toLowerCase():
                    return resource.properties?.hostName
                        ? 'https://' + resource.properties.hostName + '/'
                        : null;
                case AzureResourceTypes.StorageAccount.toLowerCase():
                    return resource.properties?.primaryEndpoints?.blob;
                case AzureResourceTypes.StorageBlobContainer.toLowerCase(): {
                    const storageAccountEndpointUrl = getResourceUrl(
                        parentResource,
                        AzureResourceTypes.StorageAccount
                    );
                    if (storageAccountEndpointUrl) {
                        return `${
                            storageAccountEndpointUrl.endsWith('/')
                                ? storageAccountEndpointUrl
                                : storageAccountEndpointUrl + '/'
                        }${resource.name}`;
                    } else {
                        return null;
                    }
                }
                default:
                    return null;
            }
        }
    }
    return null;
};

export const getResourceUrls = (
    resources: Array<IAzureResource | string> = [],
    resourceType: AzureResourceTypes, // always pass this in case the resource is string type
    parentResource?: IAzureResource | string
) => {
    return resources.map((resource) =>
        getResourceUrl(resource, resourceType, parentResource)
    );
};

export const getResourceId = (
    resource: IAzureResource | string // can either be the url string or azure resource
): string | null => {
    if (resource) {
        if (typeof resource === 'string') {
            return null;
        } else {
            return resource.id;
        }
    }
    return null;
};

export const getNameOfResource = (
    resource: string | IAzureResource, // for container type resources string type refers to the name of the container, otherwise it is the url string of the resource
    resourceType: AzureResourceTypes
) => {
    try {
        if (resource) {
            if (typeof resource !== 'string') {
                return resource.name;
            } else {
                if (resourceType === AzureResourceTypes.DigitalTwinInstance) {
                    const urlObj = getUrlFromString(resource);
                    if (urlObj) {
                        return resource.split('.')[0].split('://')[1]; // to respect casing in the name of the instance
                    } else {
                        return null;
                    }
                } else if (resourceType === AzureResourceTypes.StorageAccount) {
                    const urlObj = getUrlFromString(resource);
                    return urlObj.hostname.split('.')[0];
                } else if (
                    resourceType === AzureResourceTypes.StorageBlobContainer
                ) {
                    return resource;
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getContainerNameFromUrl = (containerUrl: string) => {
    try {
        const containerUrlObj = getUrlFromString(containerUrl);
        return containerUrlObj.pathname.split('/')[1];
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const removeProtocolPartFromUrl = (urlString: string) => {
    try {
        const urlObj = getUrlFromString(urlString);
        return urlObj.hostname + urlObj.pathname;
    } catch (error) {
        console.error('Failed remove protocol from url string', error.message);
        return null;
    }
};

export const getUrlFromString = (urlString: string): URL => {
    try {
        let urlStr = urlString;
        if (!(urlStr.startsWith('https://') || urlStr.startsWith('http://'))) {
            urlStr = 'https://' + urlStr;
        }
        return new URL(urlStr);
    } catch (error) {
        console.error('Failed to get url from string', error.message);
        return null;
    }
};

/** Checking if a given ADX cluster url is a safe url following a certain regex and hostname */
export const isValidADXClusterUrl = (clusterUrl: string): boolean => {
    const isValidADXClusterHostUrl = (urlPrefix) =>
        /^[a-zA-Z0-9]{4,22}.[a-zA-Z0-9]{1,}\b$/.test(urlPrefix);

    if (clusterUrl) {
        try {
            const clusterUrlObj = getUrlFromString(clusterUrl);
            if (
                clusterUrlObj.host.endsWith(CONNECTION_STRING_SUFFIX) &&
                isValidADXClusterHostUrl(
                    clusterUrlObj.host.substring(
                        0,
                        clusterUrlObj.host.length -
                            CONNECTION_STRING_SUFFIX.length
                    )
                )
            ) {
                return true;
            }
        } catch (error) {
            console.error(
                'Failed validating the ADX cluster url',
                error.message
            );
        }
    }
    return false;
};

/** Creates mock time series data array with data points between now and a certain milliseconds ago */
export const getMockTimeSeriesDataArrayInLocalTime = (
    lengthOfSeries = 1,
    numberOfDataPoints = 5,
    agoInMillis = 1 * 60 * 60 * 1000
): Array<Array<TimeSeriesData>> => {
    const toInMillis = Date.now();
    const fromInMillis = toInMillis - agoInMillis;
    return Array.from({ length: lengthOfSeries }).map(() => {
        const maxLimitVariance = Math.floor(Math.random() * 500); // pick a max value between 0-500 as this timeseries value range to add more variance for values of different timeseries in independent y axes
        return Array.from({ length: numberOfDataPoints }, () => ({
            timestamp: Math.floor(
                Math.random() * (toInMillis - fromInMillis + 1) + fromInMillis
            ),
            value: Math.floor(Math.random() * maxLimitVariance)
        })).sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
    });
};

/**
 * Takes a number and returns a string representing the formatted number
 * @param val, number that is to be formatted
 * @returns a string representation of the number
 * represents infinitesimally small or large numbers in scientific notation
 * represents tens, hundreds, and thousands with 3 sig figs w/ commas when necessary
 * represents million and billion values with M or B suffixes
 */
export function formatNumber(val: number) {
    if (Math.abs(val) < 1000000) {
        let formatted = format('.1e')(val);
        if (Math.abs(val) < 0.00001) {
            if (Math.abs(val) == 0) {
                formatted = format('.1n')(val);
            }
            return formatted;
        } else {
            //values between [0.00001, 999,999.999] are formatted in this else statement
            let formatted = format(',.3r')(val); // format value to have 3 sig figs and add commas if necessary
            if (formatted.indexOf('.') != -1) {
                // if it's a decimal value, remove the trailing zeroes
                let lastChar = formatted[formatted.length - 1];
                while (lastChar == '0') {
                    formatted = formatted.slice(0, -1);
                    lastChar = formatted[formatted.length - 1];
                }
                if (lastChar == '.') formatted = formatted.slice(0, -1);
            }
            return formatted;
        }
    } else if (Math.abs(val) >= 1000000 && Math.abs(val) < 1000000000)
        return format('.3s')(val);
    // suffix of M for millions
    else if (Math.abs(val) >= 1000000000 && Math.abs(val) < 1000000000000)
        return format('.3s')(val).slice(0, -1) + 'B'; // suffix of B for billions
    return format('.1n')(val); // scientific for everything else
}
