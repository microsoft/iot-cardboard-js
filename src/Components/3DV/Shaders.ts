import * as BABYLON from 'babylonjs';

const customVertex = `
precision highp float;

// Attributes
attribute vec3 position;
attribute vec3 normal;
uniform vec4 baseColor;
uniform vec4 fresnelColor;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif


// Uniforms
uniform mat4 world;
uniform mat4 worldViewProjection;

// Varying
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec4 vBaseColor;
varying vec4 vFresnelColor;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

void main(void) {
    vec4 outPosition = worldViewProjection * vec4(position, 1.0);
    gl_Position = outPosition;
    
    vPositionW = vec3(world * vec4(position, 1.0));
    vNormalW = normalize(vec3(world * vec4(normal, 0.0)));

    vBaseColor = baseColor;
    vFresnelColor = fresnelColor;
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
varying vec4 vBaseColor;
varying vec4 vFresnelColor;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif

// Refs
uniform vec3 cameraPosition;
uniform sampler2D textureSampler;

void main(void) {
	vec4 _baseColor = vBaseColor;
    vec4 _fresnelColor = vFresnelColor;
    #ifdef VERTEXCOLOR
	_baseColor.rgb *= vColor.rgb;
    #endif

    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);

    // Fresnel
	float fresnelTerm = dot(viewDirectionW, vNormalW);
	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
    
    vec4 _blendedColor = normalize(_baseColor + (_fresnelColor * fresnelTerm));
    _blendedColor.w = _baseColor.w;

    gl_FragColor = _blendedColor;
}
`;

//Compile shader
export function makeShaderMaterial(
    scene: any,
    baseColor: BABYLON.Color4,
    fresnelColor: BABYLON.Color4,
    opacity: number,
) {
    BABYLON.Effect.ShadersStore['customVertexShader'] = customVertex;
    BABYLON.Effect.ShadersStore['customFragmentShader'] = customFragment;
    const material = new BABYLON.ShaderMaterial(
        'shader',
        scene,
        {
            vertex: 'custom',
            fragment: 'custom',
        },
        {
            attributes: [
                'position',
                'normal',
                'uv',
                'baseColor',
                'fresnelColor',
            ],
            uniforms: [
                'world',
                'worldView',
                'worldViewProjection',
                'view',
                'projection',
            ],
        },
    );

    material.setColor4('baseColor', baseColor);
    material.setColor4('fresnelColor', fresnelColor);
    material.setFloat('time', 0);
    material.setVector3('cameraPosition', BABYLON.Vector3.Zero());
    material.backFaceCulling = false;
    material.alpha = opacity;
    material.alphaMode = 5;

    return material;
}
