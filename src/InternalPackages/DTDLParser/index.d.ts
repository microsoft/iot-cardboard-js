import { DtdlObjectModel } from "./JsonOm";
export * from "./JsonOm";
export * from "./JsonErr"

declare module "DTDLParserInterop" {
    export function parseAsync(jsonTexts: string[]): Promise<DtdlObjectModel>
}