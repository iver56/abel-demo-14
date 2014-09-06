/*
 * @constructor
 */
function MultiplyLayer2() {
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.tDiffuse;
}

MultiplyLayer2.prototype.update = function(frame, relativeFrame) {
  var t = (relativeFrame) / 60;
  this.shaderPass.uniforms.amount.value = smoothstep(0, 5, t);
};

MultiplyLayer2.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
