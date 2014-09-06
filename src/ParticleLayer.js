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

  this.ps = new THREE.Particles({color: 'white'});
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

ParticleLayer.prototype.heart = function(from, relativeFrame, to, offset, scale) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 2 * Math.PI - 2 * Math.PI * clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: scale * 160 * Math.pow(Math.sin(t), 3) + offset.x,
    y: scale * 10 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) + offset.y,
    z: 0
  };
};

ParticleLayer.prototype.archimedianSpiral = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 15 - 14.9 * clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 200 * Math.pow(t, -1 / 3) * Math.cos(t),
    y: 200 * Math.pow(t, -1 / 3) * Math.sin(t),
    z: 0
  };
};

ParticleLayer.prototype.archimedesSpiral = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 5 + 16.3 * clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 20 * t * Math.cos(t) + 384,
    y: 20 * t * Math.sin(t) + 136,
    z: 0
  };
};

ParticleLayer.prototype.astroidPedalCurve = function(from, relativeFrame, to) {
  var relativeRelativeFrame = relativeFrame - from;
  var length = to - from;
  var t = 12 * clamp(0, relativeRelativeFrame / length, 1);
  return {
    x: 400 * Math.cos(t) * Math.sin(t) * Math.sin(t),
    z: 300,
    y: 400 * 0.5 * Math.sin(t) * (Math.cos(2 * t) + 1)
  };
};

ParticleLayer.prototype.update = function(frame, relativeFrame) {
  var pos = {x: 0, y: 0};
  if (relativeFrame <= 150) {
    pos = this.archimedianSpiral(0, relativeFrame, 150);

  } else if (relativeFrame <= 500) {
    pos = this.archimedesSpiral(150, relativeFrame, 500);

  } else if (relativeFrame <= 700) {
    var offset = {x: 85, y: 285, z: 0};
    var scale = 2.5;
    pos = this.heart(500, relativeFrame, 700, offset, scale);

  } else if (relativeFrame <= 780) {
    var offset = {x: -600, y: 400, z: 0};
    var scale = 1;
    pos = this.heart(700, relativeFrame, 780, offset, scale);

  } else if (relativeFrame <= 860) {
    var offset = {x: 700, y: 250, z: 0};
    var scale = 1;
    pos = this.heart(780, relativeFrame, 860, offset, scale);

  } else if (relativeFrame <= 1200) {
    pos = this.astroidPedalCurve(860, relativeFrame, 1200);
  }

  console.log(pos);
  this.ps.emitterPosition.x = pos.x;
  this.ps.emitterPosition.y = pos.y;
  this.ps.emitterPosition.z = pos.z;

  this.cameraController.updateCamera(relativeFrame);
};
