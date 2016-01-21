//attribute vec3 vertex;
//uniform mat4 viewMatrix;

varying vec2 texCoord;


void main() {
  texCoord = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
