/**
 * @constructor
 */
function VerticalBlurLayer(config) {
  this.config = config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.verticalBlur);
}

VerticalBlurLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

VerticalBlurLayer.prototype.start = function() {
};

VerticalBlurLayer.prototype.end = function() {
};

VerticalBlurLayer.prototype.update = function(frame) {
};
