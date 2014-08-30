SHADERS={};SHADERS.example = {uniforms: {
    tDiffuse: { type: 't', value: null }
}
,vertexShader: "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n",fragmentShader: "void main() {\r\n    gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5);\r\n}\r\n"};
SHADERS.mountain = {uniforms: {
    tDiffuse: { type: 't', value: null },
}
,vertexShader: "uniform float time;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\r\n    gl_Position = projectionMatrix * mvPosition;\r\n}\r\n",fragmentShader: "uniform float time;\r\nuniform float party;\r\nuniform sampler2D gravel;\r\nuniform sampler2D grass;\r\nuniform sampler2D height;\r\nvarying vec2 vUv;\r\n\r\nvoid main(void) {\r\n    vec4 height = texture2D(height, vUv);\r\n    vec4 color = vec4(1.);\r\n    if(height.x < .03){\r\n        color = texture2D(gravel, vUv);\r\n    } else if(height.x < .8){\r\n        color = 0.1 + 0.8 * texture2D(grass, vUv*5.);\r\n    }\r\n\r\n    if(party > 0.){\r\n        color = texture2D(gravel, vUv * 5. + .1 * sin(time/500.));\r\n        color *= 0.2;\r\n        color += cos(3.141592 * time / 500.) * sin(3.141592 * time * vUv.y / 697. / 1.5) * sin(3.141592 * time * vUv.x / 887. / 1.5) * vec4(.6, 0., .2, .1);\r\n    }\r\n    gl_FragColor = color;\r\n}\r\n"};
SHADERS.noise = {uniforms: {
    tDiffuse: { type: 't', value: null },
    time: { type: 'f', value: null },
    amount: { type: 'f', value: 0},
    width: { type: 'f', value: null},
    height: { type: 'f', value: null}
}
,vertexShader: "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n",fragmentShader: "uniform float time;\r\nuniform float amount;\r\nuniform sampler2D tDiffuse;\r\nuniform float width;\r\nuniform float height;\r\nvarying vec2 vUv;\r\n\r\nfloat ranieyy(vec2 co) {\r\n    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);\r\n}\r\n\r\nvoid main() {\r\n    vec4 colorInput = texture2D( tDiffuse, vUv );\r\n    vec2 pozz = vec2(floor(width*vUv.x)/width, floor(height*vUv.y)/height);\r\n    vec3 color = vec3(.1, 0.1, 0.1) + vec3(ranieyy(vec2(pozz+time/1009.0)));\r\n    gl_FragColor = colorInput*(1.0-amount)+amount*vec4(color, 0.1);\r\n}\r\n"};
SHADERS.water = {uniforms: {
    tDiffuse: { type: 't', value: null },
}
,vertexShader: "const float pi = 3.141592;\r\nconst int numWaves = 8;\r\nuniform float waterHeight;\r\nuniform float time;\r\nuniform float amplitude[8];\r\nuniform float wavelength[8];\r\nuniform float speed[8];\r\nuniform vec2 direction[8];\r\nvarying vec2 vUv;\r\n\r\nfloat wave(int i, float x, float y) {\r\n    float frequency = 2.0*pi/wavelength[i];\r\n    float phase = speed[i] * frequency;\r\n    float theta = dot(direction[i], vec2(x, y));\r\n    return amplitude[i] * sin(theta * frequency + time * phase);\r\n}\r\n    float waveHeight(float x, float y) {\r\n    float height = 0.0;\r\n    for (int i=0; i < numWaves; ++i)\r\n    height += 10.0*wave(i, x, y);\r\n    return height;\r\n}\r\n\r\nfloat dWavedx(int i, float x, float y) {\r\n    float frequency = 2.0*pi/wavelength[i];\r\n    float phase = speed[i] * frequency;\r\n    float theta = dot(direction[i], vec2(x, y));\r\n    float A = amplitude[i] * direction[i].x * frequency;\r\n    return A * cos(theta * frequency + time * phase);\r\n}\r\n\r\nfloat dWavedy(int i, float x, float y) {\r\n    float frequency = 2.0*pi/wavelength[i];\r\n    float phase = speed[i] * frequency;\r\n    float theta = dot(direction[i], vec2(x, y));\r\n    float A = amplitude[i] * direction[i].y * frequency;\r\n    return A * cos(theta * frequency + time * phase);\r\n}\r\n\r\nvec3 waveNormal(float x, float y) {\r\n    float dx = 0.0;\r\n    float dy = 0.0;\r\n    for (int i=0; i < numWaves; ++i) {\r\n        dx += dWavedx(i, x, y);\r\n        dy += dWavedy(i, x, y);\r\n    }\r\n    vec3 n = vec3(-dx, -dy, 1.0);\r\n    return normalize(n);\r\n}\r\n\r\nvoid main() {\r\n    vUv = vec2( 2.0, 2.0 ) * uv;\r\n    vec4 pos = vec4(position, 1.0);\r\n    pos.z = waterHeight * waveHeight(pos.x, pos.y);\r\n    vec4 mvPosition = modelViewMatrix * pos;\r\n    gl_Position = projectionMatrix * mvPosition;\r\n}\r\n",fragmentShader: "varying vec2 vUv;\r\nuniform sampler2D texture2;\r\nuniform float time2;\r\n\r\nvoid main() {\r\n    vec2 position = -1.0 + 2.0 * vUv;\r\n    vec4 noise = texture2D(texture2, vUv);\r\n    vec2 T = vUv + vec2(-2.5, 10.0) * time2 * 0.01;\r\n\r\n    T.x -= noise.y * 0.2;\r\n    T.y += noise.z * 0.2;\r\n\r\n    vec4 color = texture2D(texture2, T * 1.5);\r\n    gl_FragColor = color;\r\n}\r\n"};
SHADERS.default = {uniforms: {
    tDiffuse: { type: 't', value: null },
}
,vertexShader: "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n",fragmentShader: "uniform sampler2D tDiffuse;\r\n\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vec4 colorInput = texture2D( tDiffuse, vUv );\r\n    gl_FragColor = colorInput;\r\n}\r\n"};
SHADERS.multiply = {uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: { type: 'f', value: 0},
    r: { type: 'f', value: 0},
    g: { type: 'f', value: 0},
    b: { type: 'f', value: 0}
}
,vertexShader: "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n",fragmentShader: "uniform float amount;\r\nuniform float r;\r\nuniform float g;\r\nuniform float b;\r\nuniform sampler2D tDiffuse;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vec4 fragColor = texture2D(tDiffuse, vUv);\r\n    gl_FragColor = vec4(mix(fragColor.r, fragColor.r * r, amount),\r\n                        mix(fragColor.g, fragColor.g * g, amount),\r\n                        mix(fragColor.b, fragColor.b * b, amount),\r\n                        1.);\r\n}\r\n"};
SHADERS.vignette = {uniforms: {
    tDiffuse: { type: 't', value: null },
    amount: { type: 'f', value: 0}
}
,vertexShader: "varying vec2 vUv;\r\n\r\nvoid main() {\r\n    vUv = uv;\r\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n",fragmentShader: "uniform sampler2D tDiffuse;\r\nuniform float amount;\r\nvarying vec2 vUv;\r\n\r\nvoid main() {\r\n    vec4 original = texture2D(tDiffuse, vUv);\r\n    float dist = length(vUv - vec2(0.5, 0.5));\r\n    dist = dist / 0.707;\r\n    if(dist < 0.) dist = 0.;\r\n    if(dist > 1.) dist = 1.;\r\n    dist = dist * dist * dist;\r\n    gl_FragColor = vec4(original.xyz * (1. - dist * amount), 1.);\r\n}\r\n"};
