import * as BABYLON from 'babylonjs';
import { WhiteTexture } from '../../Models/Constants';
//import { customShaderTag, shaderHasReflection } from '../../Models/Constants';

const customVertex = `
precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif

// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

void main(void) {
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;
    
    vPositionW = vec3(world * vec4(position, 1.0));
    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));
    #ifdef VERTEXCOLOR
	// Vertex color
	vColor = color;
    #endif
}`;

const customFragment = `
precision highp float;

// Lights
varying vec3 vPositionW;
varying vec3 vNormalW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

// Refs
uniform vec3 cameraPosition;
uniform vec4 baseColor;
uniform vec4 fresnelColor;

uniform sampler2D textureSampler;

#ifdef TDV_REFLECTION
uniform mat4 worldView;
uniform samplerCube refSampler;
#endif

vec4 fresnel_glow(float amount, float intensity, vec4 color, vec3 normal, vec3 view)
{
	return pow((1.0 - dot(normalize(normal), normalize(view))), amount) * color * intensity;
}

vec3 vecThreeLerp(vec3 a, vec3 b, float position)
{
    return vec3(
        mix(a.r,b.r,position),
        mix(a.g,b.g,position),
        mix(a.b,b.b,position)
    );
}

void main(void) {
	vec4 _baseColor = baseColor;
    vec4 _fresnelColor = fresnelColor;
    #ifdef VERTEXCOLOR
	_baseColor.rgb *= vColor.rgb;
    #endif

    // float fresnelBias = 0.2;
    // float fresnelPower = 2.0;
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    
    vec4 fresnel = fresnel_glow(4.0, 4.5, _fresnelColor, vNormalW, viewDirectionW);
    vec4 _blendedColor = vec4(normalize(_baseColor + fresnel).rgb, _baseColor.a);
    
    #ifdef TDV_REFLECTION
    //Reflection
    vec3 e = normalize( vec3( worldView * vec4(vPositionW, 1.) ) );
    vec3 n = normalize( worldView * vec4(vNormalW, 0.0) ).xyz;

    vec3 r = reflect( e, n );
    float m = 2. * sqrt(
        pow( r.x, 2. ) +
        pow( r.y, 2. ) +
        pow( r.z + 1., 2. )
    );
    vec2 vN = r.xy / m + .5;

    vec3 refBase = textureCube( refSampler, vN).rgb;
    float refMix = mix(0.15, 0.75, 1. - _baseColor.a);
    //_blendedColor.rgb = vecThreeLerp(_blendedColor.rgb, refBase, refMix);
    _blendedColor.rgb *= refBase;
    #endif

    gl_FragColor = _blendedColor;
}
`;

//Compile shader
// export function makeShaderMaterial(
//     name: string,
//     scene: any,
//     baseColor: BABYLON.Color4,
//     fresnelColor: BABYLON.Color4,
//     reflectionTexture: BABYLON.Texture
// ) {
//     const hasRefTexture = reflectionTexture != null;
//     BABYLON.Effect.ShadersStore['customVertexShader'] = customVertex;
//     BABYLON.Effect.ShadersStore['customFragmentShader'] = customFragment;
//     const material = new BABYLON.ShaderMaterial(
//         name,
//         scene,
//         {
//             vertex: 'custom',
//             fragment: 'custom'
//         },
//         {
//             attributes: ['position', 'normal', 'uv'],
//             uniforms: [
//                 'world',
//                 'worldView',
//                 'worldViewProjection',
//                 'view',
//                 'projection'
//             ],
//             samplers: ['refSampler'],
//             defines: [hasRefTexture ? '#define TDV_REFLECTION' : ''],
//             needAlphaBlending: true
//         }
//     );

//     material.setColor4('baseColor', baseColor);
//     material.setColor4('fresnelColor', fresnelColor);
//     material.setVector3('cameraPosition', BABYLON.Vector3.Zero());
//     if (hasRefTexture) material.setTexture('refSampler', reflectionTexture);

//     material.backFaceCulling = false;
//     material.alpha = baseColor.a;
//     material.alphaMode = selectAlphaMode(baseColor.a);

//     const tags =
//         customShaderTag + (hasRefTexture ? ' ' + shaderHasReflection : '');
//     //Add a camera update tag to flag for Fresnel update
//     BABYLON.Tags.AddTagsTo(material, tags);

//     return material;
// }

export function makeStandardMaterial(
    name: string,
    scene: any,
    baseColor: BABYLON.Color4,
    fresnelColor?: BABYLON.Color4,
    reflectionTexture?: BABYLON.Texture,
    lightingStyle?: number
) {
    const material = new BABYLON.StandardMaterial(name, scene);
    const baseColor3 = new BABYLON.Color3(
        baseColor.r,
        baseColor.g,
        baseColor.b
    );
    const fresnelColor3 = new BABYLON.Color3(
        fresnelColor?.r,
        fresnelColor?.g,
        fresnelColor?.b
    );
    if (!lightingStyle) lightingStyle = 0;

    //diffuse
    material.diffuseColor = BABYLON.Color3.White();

    //If translucent, set emissive settings
    if (lightingStyle >= 1) {
        material.disableLighting = true;
        material.specularPower = 0;
        material.roughness = 100;
        material.emissiveColor = BABYLON.Color3.White();

        material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
        material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
        material.emissiveFresnelParameters.rightColor = baseColor3;
        material.emissiveFresnelParameters.power = 2;
        material.emissiveFresnelParameters.bias = 0.2;

        material.useEmissiveAsIllumination = true;
    }

    //diffuse fresnel
    if (fresnelColor && lightingStyle == 0) {
        material.diffuseFresnelParameters = new BABYLON.FresnelParameters();
        material.diffuseFresnelParameters.leftColor = fresnelColor3;
        material.diffuseFresnelParameters.rightColor = calculateAverageFresnel3(
            baseColor3,
            fresnelColor3
        );
        material.diffuseFresnelParameters.bias = 4.0;
        material.diffuseFresnelParameters.power = 4.5;
    }

    //Alpha and alphamode
    material.backFaceCulling = baseColor.a >= 1;
    material.alpha = baseColor.a;
    //material.ambientColor = BABYLON.Color3.White();
    material.alphaMode = selectAlphaMode(baseColor.a);

    //Reflection map
    if (reflectionTexture) {
        material.reflectionTexture = reflectionTexture;
        material.useReflectionOverAlpha = true;

        material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        material.reflectionFresnelParameters.leftColor = BABYLON.Color3.White();
        material.reflectionFresnelParameters.rightColor = BABYLON.Color3.Black();

        material.roughness = 1;
        material.specularPower = 10;
    }
    return material;
}
export function outlineMaterial(scene: any) {
    const mat = new BABYLON.StandardMaterial('cloneMat', scene);
    mat.alpha = 0.0;
    mat.alphaMode = 5;

    mat.disableLighting = true;
    mat.diffuseColor = BABYLON.Color3.Black();
    mat.freeze();

    return mat;
}

function calculateAverageFresnel4(
    themeFresnel: BABYLON.Color4,
    baseColor: BABYLON.Color4
) {
    const newFresnel = new BABYLON.Color4(
        (baseColor.r + themeFresnel.r) * 0.5,
        (baseColor.g + themeFresnel.g) * 0.5,
        (baseColor.b + themeFresnel.b) * 0.5,
        (baseColor.a + themeFresnel.a) * 0.5
    );

    return newFresnel;
}
function calculateAverageFresnel3(
    themeFresnel: BABYLON.Color3,
    baseColor: BABYLON.Color3
) {
    const newFresnel = new BABYLON.Color3(
        (baseColor.r + themeFresnel.r) * 0.5,
        (baseColor.g + themeFresnel.g) * 0.5,
        (baseColor.b + themeFresnel.b) * 0.5
    );

    return newFresnel;
}

export function selectAlphaMode(alpha: number) {
    if (alpha >= 1) return 0;
    if (alpha >= 0.9) return BABYLON.Engine.ALPHA_MAXIMIZED;
    if (alpha > 0) return BABYLON.Engine.ALPHA_ADD;
    return 0;
}

export function ToColor3(input: BABYLON.Color4) {
    return new BABYLON.Color3(input.r, input.g, input.b);
}
