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

ParticleLayer.prototype.heart = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 160 * Math.pow(Math.sin(t), 3),
    y: 10 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  };
};

ParticleLayer.prototype.heart = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 2 * Math.PI - 2 * Math.PI *  clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 3 * 160 * Math.pow(Math.sin(t), 3) + 85,
    y: 3 * 10 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) + 285
  };
};

ParticleLayer.prototype.archimedianSpiral = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 15 - 14.9 * clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 200 * Math.pow(t, -1/3) * Math.cos(t),
    y: 200 * Math.pow(t, -1/3) * Math.sin(t)
  };
};

ParticleLayer.prototype.archimedesSpiral = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 5 + 16.2 * clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 20 * t * Math.cos(t) + 384,
    y: 20 * t * Math.sin(t) + 136
  };
};

ParticleLayer.prototype.update = function(frame, relativeFrame) {
  var pos = {x:0, y:0};
  if (relativeFrame <= 100) {
    pos = this.archimedianSpiral(0, relativeFrame, 100);
  } else if (relativeFrame <= 200) {
    pos = this.archimedesSpiral(100, relativeFrame, 200);
  } else if (relativeFrame <= 300) {
    pos = this.heart(200, relativeFrame, 300);
  }

  console.log(pos);
  this.ps.emitterPosition.x = pos.x;
  this.ps.emitterPosition.y = pos.y;

  this.cameraController.updateCamera(relativeFrame);
};
