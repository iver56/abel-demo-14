attribute float size;
attribute vec3 pcolor;

varying vec3 vColor;

void main() {
    vColor = pcolor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( 200.0 / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
}