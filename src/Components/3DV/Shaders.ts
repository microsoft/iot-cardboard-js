import * as BABYLON from '@babylonjs/core/Legacy/legacy';

export function makeMaterial(
    name: string,
    scene: any,
    baseColor: BABYLON.Color4,
    reflectionTexture?: BABYLON.BaseTexture,
    lightingStyle?: number,
    bgLuminanceRatio?: number
) {
    if (lightingStyle === 0)
        return makePBRMaterial(
            name,
            scene,
            baseColor,
            reflectionTexture,
            lightingStyle
        );
    else
        return makeStandardMaterial(
            name,
            scene,
            baseColor,
            lightingStyle,
            bgLuminanceRatio
        );
}

export function makeStandardMaterial(
    name: string,
    scene: any,
    baseColor: BABYLON.Color4,
    lightingStyle?: number,
    bgLuminanceRatio?: number
) {
    const material = new BABYLON.StandardMaterial(name, scene);
    const baseColor3 = new BABYLON.Color3(
        baseColor.r,
        baseColor.g,
        baseColor.b
    );

    const isTransparent = baseColor.a < 1;
    if (!lightingStyle) lightingStyle = 0;
    if (!bgLuminanceRatio) bgLuminanceRatio = 1;

    //diffuse
    material.diffuseColor = baseColor3;

    material.alpha = baseColor.a;
    material.backFaceCulling = false;

    if (isTransparent) {
        material.specularPower = 0;
        material.disableLighting = true;
        //We scale the brightness of the object color if the background requires a higher contrast
        material.emissiveColor = baseColor3.scale(bgLuminanceRatio);
    } else {
        material.emissiveColor = BABYLON.Color3.White(); //baseColor3;
        const emFresnel = new BABYLON.FresnelParameters();
        emFresnel.rightColor = baseColor3;
        emFresnel.leftColor = baseColor3.scale(1.5);
        emFresnel.bias = 0.4;
        emFresnel.power = 1.8;
        material.emissiveFresnelParameters = emFresnel;
        material.useEmissiveAsIllumination = true;
        material.disableLighting = true;
    }

    return material;
}

export function makePBRMaterial(
    name: string,
    scene: any,
    baseColor: BABYLON.Color4,
    reflectionTexture?: BABYLON.BaseTexture,
    lightingStyle?: number
) {
    const material = new BABYLON.PBRMetallicRoughnessMaterial(name, scene);
    const baseColor3 = new BABYLON.Color3(
        baseColor.r,
        baseColor.g,
        baseColor.b
    );
    if (!lightingStyle) lightingStyle = 0;

    material.backFaceCulling = false;

    //diffuse
    material.baseColor = baseColor3;
    material.metallic = 0.05;
    material.roughness = 0.7;

    //Alpha and alphamode
    material.alpha = baseColor.a;

    //Reflection map
    if (reflectionTexture) {
        material.environmentTexture = reflectionTexture;
        material.metallic = 0.05;
        material.roughness = 1;
    }

    return material;
}

export function ToColor3(input: BABYLON.Color4) {
    return new BABYLON.Color3(input.r, input.g, input.b);
}

//SetWireframe changes the alpha blending of the material to get rid of the dark halo that appears around transparent wireframe objects
export function SetWireframe(material: BABYLON.Material, isWireframe: boolean) {
    if (!material || typeof material !== 'object') return;

    if (material.alpha < 1) {
        material.alphaMode = isWireframe
            ? BABYLON.Constants.ALPHA_PREMULTIPLIED_PORTERDUFF
            : BABYLON.Constants.ALPHA_COMBINE;
    } else {
        material.alphaMode = BABYLON.Constants.ALPHA_DISABLE;
    }

    material.wireframe = isWireframe;
}
