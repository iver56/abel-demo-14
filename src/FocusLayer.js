/**
 * @constructor
 */
function FocusLayer(config) {
  this.config = config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.focus);
}

FocusLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

FocusLayer.prototype.start = function() {
};

FocusLayer.prototype.end = function() {
};

FocusLayer.prototype.update = function(frame) {
  this.shaderPass.uniforms.screenWidth.value = 16 * GU * 0.8;
  this.shaderPass.uniforms.screenHeight.value = 9 * GU * 0.8;
};
