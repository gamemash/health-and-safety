uniform sampler2D texture1;
uniform sampler2D chunkData;
varying vec2 texCoord;

vec2 offsetCorrection(vec2 tileInfo, vec2 spriteSize, float tileSize);

void main(void) {
  float tileSize = 96.0;
  vec2 spriteSize = vec2(960, 4704);
  vec2 coordinate = vec2(
      mod(texCoord.x , 16.0),
      texCoord.y
   );
  vec2 relativeCoordinate = coordinate - floor(coordinate);
  vec2 textureSize = exp2(ceil(log2(spriteSize))); //textures are a power of 2. This offsets the resulting width of the tex coords.


  vec2 tileInfo = texture2D(chunkData, floor(coordinate) / 16.0).xy;
  vec2 backgroundTile = offsetCorrection(tileInfo, spriteSize, tileSize);
  vec2 backgroundTexCoord = (backgroundTile + vec2(tileSize) * relativeCoordinate) / textureSize;
  vec4 backgroundResult = texture2D(texture1, backgroundTexCoord);

  tileInfo = texture2D(chunkData, floor(coordinate) / 16.0).zw;
  vec2 foregroundTile = offsetCorrection(tileInfo, spriteSize, tileSize);
  vec2 foregroundTexCoord = (foregroundTile + vec2(tileSize) * relativeCoordinate) / textureSize;
  vec4 foregroundResult = texture2D(texture1, foregroundTexCoord);

  gl_FragColor = backgroundResult * (1.0 - foregroundResult.w) + foregroundResult * foregroundResult.w;
}

vec2 offsetCorrection(vec2 tileInfo, vec2 spriteSize, float tileSize){
  return vec2(tileInfo.x, spriteSize.y - tileInfo.y - tileSize);
}

