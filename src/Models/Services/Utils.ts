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
    DurationUnits,
    AzureResourceDisplayFields,
    IAzureResource,
    AzureAccessPermissionRoles,
    AzureAccessPermissionRoleGroups,
    AzureResourceTypes
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
import { IDropdownOption } from '@fluentui/react';
import { createParser, ModelParsingOption } from 'azure-iot-dtdl-parser';
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
        console.error('Error while parsing models {input, error}', models, err);
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
                switch (resourceType) {
                    case AzureResourceTypes.DigitalTwinInstance:
                    case AzureResourceTypes.StorageAccount:
                        return resource;
                    case AzureResourceTypes.StorageBlobContainer: {
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
            switch (resourceType) {
                case AzureResourceTypes.DigitalTwinInstance:
                    return resource.properties?.hostName
                        ? 'https://' + resource.properties.hostName
                        : null;
                case AzureResourceTypes.StorageAccount:
                    return resource.properties?.primaryEndpoints?.blob;
                case AzureResourceTypes.StorageBlobContainer: {
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
                    if (new URL(resource)) {
                        return resource.split('.')[0].split('://')[1]; // to respect casing in the name of the instance
                    } else {
                        return null;
                    }
                } else if (resourceType === AzureResourceTypes.StorageAccount) {
                    const urlObj = new URL(resource);
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
        const containerUrlObj = new URL(containerUrl);
        return containerUrlObj.pathname.split('/')[1];
    } catch (error) {
        console.error(error.message);
        return null;
    }
};

export const getHostNameFromUrl = (urlString: string) => {
    try {
        const urlObj = new URL(urlString);
        return urlObj.hostname;
    } catch (error) {
        console.error('Failed getting hostname from url string', error.message);
        return null;
    }
};

export const removeProtocolPartFromUrl = (urlString: string) => {
    try {
        const urlObj = new URL(urlString);
        return urlObj.hostname + urlObj.pathname;
    } catch (error) {
        console.error('Failed remove protocol from url string', error.message);
        return null;
    }
};
