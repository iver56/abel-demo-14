uniform sampler2D texture;

varying vec3 vColor;

void main() {
  vec4 outColor = texture2D( texture, gl_PointCoord );
  gl_FragColor = outColor * vec4( vColor, 1.0 );
}
