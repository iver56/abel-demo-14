/*
 * @constructor
 */
function MultiplyLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.tDiffuse
}

MultiplyLayer.prototype.update = function(frame, relativeFrame) {
  var t = relativeFrame / 170;
  this.shaderPass.uniforms.amount.value = smoothstep(0, -5, t);
};

MultiplyLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
