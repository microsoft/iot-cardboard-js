import * as BABYLON from 'babylonjs';
import { customShaderTag, shaderHasReflection } from '../../Models/Constants';

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
uniform sampler2D refSampler;
#endif

vec4 fresnel_glow(float amount, float intensity, vec4 color, vec3 normal, vec3 view)
{
	return pow((1.0 - dot(normalize(normal), normalize(view))), amount) * color * intensity;
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

    vec3 refBase = texture2D( refSampler, vN).rgb;
    _blendedColor *= vec4(refBase, 1.);
    #endif

    gl_FragColor = _blendedColor;
}
`;

//Compile shader
export function makeShaderMaterial(
    name: string,
    scene: any,
    baseColor: BABYLON.Color4,
    fresnelColor: BABYLON.Color4,
    reflectionTexture: BABYLON.Texture
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

    material.setColor4('baseColor', baseColor);
    material.setColor4('fresnelColor', fresnelColor);
    material.setVector3('cameraPosition', BABYLON.Vector3.Zero());
    if (hasRefTexture) material.setTexture('refSampler', reflectionTexture);

    material.backFaceCulling = false;
    material.alpha = baseColor.a;
    material.alphaMode = baseColor.a > 0.9 ? 5 : 1;

    const tags =
        customShaderTag + (hasRefTexture ? ' ' + shaderHasReflection : '');
    //Add a camera update tag to flag for Fresnel update
    BABYLON.Tags.AddTagsTo(material, tags);

    return material;
}
export function calculateAverageFresnel(
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
