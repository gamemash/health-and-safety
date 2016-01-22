uniform sampler2D texture1;
uniform int chunkData[256];
varying vec2 texCoord;

void main(void) {
  float tileSize = 96.0;
  vec2 spriteSize = vec2(960, 4704);
  vec2 coordinate = vec2(
      mod(texCoord.x , 16.0),
      texCoord.y
   );

  int chunkIndex = int(floor(coordinate.x) + floor(coordinate.y) * 16.0);
  vec2 tileInfo = vec2(240.0, 1872.0); //offset x, offset y, width, height
  tileInfo = vec2(tileInfo.x, spriteSize.y - tileInfo.y - tileSize);
  vec2 relativeCoordinate = coordinate - floor(coordinate);
  vec2 textureSize = exp2(ceil(log2(spriteSize))); //textures are a power of 2. This offsets the resulting width of the tex coords.
  //vec2 actualTexCoord = (tileInfo.xy + tileInfo.zw * relativeCoordinate) / textureSize;
  vec2 actualTexCoord = (tileInfo + vec2(tileSize) * relativeCoordinate) / textureSize;
  gl_FragColor = texture2D(texture1, actualTexCoord);
}
