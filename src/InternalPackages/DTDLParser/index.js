import { dotnet } from './dotnet.js'

let dotnetExports = null

async function createRuntimeAndGetExports() {
    const { getAssemblyExports, getConfig } = await dotnet.create()
    const config = getConfig()
    return getAssemblyExports(config.mainAssemblyName)
}

export async function parseAsync(jsonTexts) {
    dotnetExports ??= await createRuntimeAndGetExports()
    const objectModelJson = await dotnetExports.ModelParserInterop.ParseToJsonAsync(Array.from(jsonTexts))
    return JSON.parse(objectModelJson)
}