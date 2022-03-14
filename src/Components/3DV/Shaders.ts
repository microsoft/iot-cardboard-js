import * as BABYLON from 'babylonjs';
import { BaseTexture, Texture } from 'babylonjs';
import { customShaderTag } from '../../Models/Constants';

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
uniform vec3 baseColor;
uniform vec3 fresnelColor;
uniform float opacity;

uniform sampler2D textureSampler;

#ifdef TDV_REFLECTION
uniform mat4 worldView;
uniform sampler2D refSampler;
#endif

vec3 fresnel_glow(float amount, float intensity, vec3 color, vec3 normal, vec3 view)
{
	return pow((1.0 - dot(normalize(normal), normalize(view))), amount) * color * intensity;
}

void main(void) {
	vec3 _baseColor = baseColor;
    vec3 _fresnelColor = fresnelColor;
    #ifdef VERTEXCOLOR
	_baseColor.rgb *= vColor.rgb;
    #endif

    float fresnelBias = 0.2;
    float fresnelPower = 2.0;
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    
    vec3 fresnel = fresnel_glow(4.0, 4.5, _fresnelColor, vNormalW, viewDirectionW);
    vec4 _blendedColor = vec4(normalize(_baseColor + fresnel), opacity);
    
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

    vec3 refBase = texture2D( refSampler, vN).rgb;
    _blendedColor *= vec4(refBase,1.);
    #endif

    gl_FragColor = _blendedColor;
}
`;

//Compile shader
export function makeShaderMaterial(
    name: string,
    scene: any,
    baseColor: BABYLON.Color3,
    fresnelColor: BABYLON.Color3,
    opacity: number,
    reflectionTexture: Texture
) {
    const hasRefTexture = reflectionTexture != null;
    BABYLON.Effect.ShadersStore['customVertexShader'] = customVertex;
    BABYLON.Effect.ShadersStore['customFragmentShader'] = customFragment;
    const material = new BABYLON.ShaderMaterial(
        name,
        scene,
        {
            vertex: 'custom',
            fragment: 'custom'
        },
        {
            attributes: ['position', 'normal', 'uv'],
            uniforms: [
                'world',
                'worldView',
                'worldViewProjection',
                'view',
                'projection'
            ],
            samplers: ['refSampler'],
            defines: [hasRefTexture ? '#define TDV_REFLECTION' : ''],
            needAlphaBlending: true
        }
    );

    material.setColor3('baseColor', baseColor);
    material.setColor3('fresnelColor', fresnelColor);
    material.setFloat('opacity', opacity);
    material.setVector3('cameraPosition', BABYLON.Vector3.Zero());
    if (hasRefTexture) material.setTexture('refSampler', reflectionTexture);

    material.backFaceCulling = false;
    material.alpha = opacity;
    material.alphaMode = opacity > 0.9 ? 5 : 1;

    //Add a camera update tag to flag for Fresnel update
    BABYLON.Tags.AddTagsTo(material, customShaderTag);

    return material;
}

export function calculateFresnelColor(baseColor: BABYLON.Color3) {
    const luminanceMultiplier = 2.0;
    const newColor = new BABYLON.Color3(
        baseColor.r * luminanceMultiplier,
        baseColor.g * luminanceMultiplier,
        baseColor.b * luminanceMultiplier
    );
    return newColor;
}
