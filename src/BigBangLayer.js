/**
 * @constructor
 */
function BigBangLayer(layer) {

  var geometry, material;
  this.spheres = [];
  this.numberOfSpheres = 1000;
  this.shakeAmount = 0.1;
  this.scene = new THREE.Scene();
  this.explodeFrame = 133;

  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 0);
  this.scene.add(light);

  geometry = new THREE.SphereGeometry(4, 4, 3);
  material = new THREE.MeshBasicMaterial({ color: 0xffffff});

  for (var i = 0; i < this.numberOfSpheres; i++) {
    //Each sphere is initialized here
    var rot = Math.PI * 2 * Math.random();
    var z = 1 - 2 * Math.random();
    var radius = 500 + 1000 * Math.random();

    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = radius * Math.sqrt(1 - z * z) * Math.cos(rot);
    sphere.position.y = radius * Math.sqrt(1 - z * z) * Math.sin(rot);
    sphere.position.z = radius * z;
    this.spheres.push(sphere);
    this.scene.add(sphere);
  }

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

BigBangLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

BigBangLayer.prototype.render = function(renderer, interpolation) {
  renderer.render(this.scene, this.camera);
};

BigBangLayer.prototype.update = function(frame, relativeFrame) {
  if (relativeFrame < this.explodeFrame) {
    for (var i = 0; i < this.spheres.length; i++) {

      var shakeX = (0.5 * this.shakeAmount - this.shakeAmount * Math.random()) * relativeFrame;
      var shakeY = (0.5 * this.shakeAmount - this.shakeAmount * Math.random()) * relativeFrame;
      var shakeZ = (0.5 * this.shakeAmount - this.shakeAmount * Math.random()) * relativeFrame;

      var sphere = this.spheres[i];
      var dx = -0.04 * sphere.position.x;
      var dy = -0.04 * sphere.position.y;
      var dz = -0.04 * sphere.position.z;
      sphere.position.x += dx + shakeX;
      sphere.position.y += dy + shakeY;
      sphere.position.z += dz + shakeZ;
    }
  } else if (relativeFrame >= this.explodeFrame) {
    for (var i = 0; i < this.spheres.length; i++) {
      var sphere = this.spheres[i];
      if (relativeFrame === this.explodeFrame) {
        sphere.userData.dx = 2 * sphere.position.x;
        sphere.userData.dy = 1.4 * sphere.position.y;
        sphere.userData.dz = 1.5 * sphere.position.z;
      }
      sphere.position.x += sphere.userData.dx;
      sphere.position.y += sphere.userData.dy;
      sphere.position.z += sphere.userData.dz;
    }
  }

  if (relativeFrame < 500) {
    var color_t = clamp(0, (relativeFrame-240)/60, 1);
    var r = parseInt(smoothstep(0, 98, color_t));
    var g = parseInt(smoothstep(0, 190, color_t));
    var b = parseInt(smoothstep(0, 238, color_t));
    demo.renderer.setClearColor(new THREE.Color("rgb(" + r + "," + g + "," + b + ")"), 1);
  } else if (relativeFrame >= 2000 && relativeFrame < 3327) {
    var color_t = clamp(0, (relativeFrame-2000)/60, 1);
    var r = parseInt(smoothstep(0, 98, color_t));
    var g = parseInt(smoothstep(0, 190, color_t));
    var b = parseInt(smoothstep(0, 238, color_t));
    demo.renderer.setClearColor(new THREE.Color("rgb(" + r + "," + g + "," + b + ")"), 1);
  } else {
    demo.renderer.setClearColor(new THREE.Color("rgb(0,0,0)"), 1);
  }


  this.cameraController.updateCamera(relativeFrame);
};
