uniform sampler2D texture1;
uniform int chunkData[256];
varying vec2 texCoord;

void main(void) {
  vec2 coordinate = vec2(
      mod(texCoord.x , 16.0),
      texCoord.y
   );

  int chunkIndex = int(floor(coordinate.x) + floor(coordinate.y) * 16.0);
  vec4 tileInfo = vec4(0.0, 0.0, 1.0, 1.0); //offset x, offset y, width, height
  //chunkData[
  //gl_FragColor = vec4(coordinate / 16.0, 0, 1); //debug the coordinates (reduced by 16 to show coordinates in color)

  vec2 relativeCoordinate = coordinate - floor(coordinate);
  vec2 actualTexCoord = (relativeCoordinate / tileInfo.zw) + tileInfo.xy;
  //gl_FragColor = vec4(actualTexCoord, 0, 1);
  gl_FragColor = texture2D(texture1, actualTexCoord);


}
