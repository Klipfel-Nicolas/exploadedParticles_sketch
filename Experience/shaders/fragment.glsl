uniform float time;
uniform float progress;
uniform sampler2D textureEnd;
uniform sampler2D textureStart;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;


void main()	{
	
	vec4 tt = texture2D(textureEnd, vUv);
	vec4 tt1 = texture2D(textureStart, vUv);

	vec4 finalTexture = mix(tt1, tt, progress);

	gl_FragColor = finalTexture;
	if(gl_FragColor.r < 0.1 && gl_FragColor.b < 0.1 && gl_FragColor.g < 0.1) discard;
}