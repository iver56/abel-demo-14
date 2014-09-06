/**
 * @constructor
 */
function HorizontalBlurLayer(config) {
  this.config = config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.horizontalBlur);
}

HorizontalBlurLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

HorizontalBlurLayer.prototype.start = function() {
};

HorizontalBlurLayer.prototype.end = function() {
};

HorizontalBlurLayer.prototype.update = function(frame) {
};
