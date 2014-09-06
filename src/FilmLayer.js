/**
 * @constructor
 */
function FilmLayer(config) {
  this.config = config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.film);
}

FilmLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

FilmLayer.prototype.start = function() {
};

FilmLayer.prototype.end = function() {
};

FilmLayer.prototype.update = function(frame) {
};
