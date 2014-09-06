/*
 * @constructor
 */
function MultiplyLayer() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.tDiffuse
}

MultiplyLayer.prototype.update = function(frame, relativeFrame) {
  var t = relativeFrame / 110;
  this.shaderPass.uniforms.amount.value = smoothstep(0, -15, t);
};

MultiplyLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
