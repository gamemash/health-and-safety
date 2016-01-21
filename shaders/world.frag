uniform sampler2D texture1;
varying vec2 texCoord;

void main(void) {
    gl_FragColor = texture2D(texture1, texCoord);
    //gl_FragColor = vec4(1.0, 0, 0, 1);
}
