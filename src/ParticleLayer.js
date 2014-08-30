/**
 * @constructor
 */
function ParticleLayer(layer) {
  var that = this;
  this.numberOfSpheres = 100;
  this.spheres = [];
  this.particlesPerShell = 20;
  this.shells = [];
  this.numShells = 0 | (this.numberOfSpheres / this.particlesPerShell);
  this.scene = new THREE.Scene();

  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  var light = new THREE.PointLight(0xffffff);
  light.position = new THREE.Vector3(0, 0, 600);
  this.scene.add(light);

  this.ps = new THREE.Particles();
  this.scene.add(this.ps);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

ParticleLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

ParticleLayer.prototype.render = function(renderer, interpolation) {
  renderer.render(this.scene, this.camera);
};

ParticleLayer.prototype.update = function(frame, relativeFrame) {
  var t = clamp(0, relativeFrame / 60 * Math.PI * 2, Math.PI * 2);
  this.ps.emitterPosition.x = 160 * Math.pow(Math.sin(t), 3);
  this.ps.emitterPosition.y = 10 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

  this.cameraController.updateCamera(relativeFrame);
};
