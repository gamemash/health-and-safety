var THREE = require('../../vendor/three.min.js');

var rectWidth = 1;
var rectLength = 1;
var rectShape = new THREE.Shape();
rectShape.moveTo( 0,0 );
rectShape.lineTo( 0, rectWidth );
rectShape.lineTo( rectLength, rectWidth );
rectShape.lineTo( rectLength, 0 );
rectShape.lineTo( 0, 0 );

module.exports = rectShape;