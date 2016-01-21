//attribute vec3 vertex;
//uniform mat4 viewMatrix;

void main() {
    gl_Position = projectionMatrix *
                modelViewMatrix * vec4(position, 1.0);
}
