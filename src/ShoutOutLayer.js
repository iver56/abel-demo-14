/**
 * @constructor
 */
function ShoutOutLayer(layer) {
  this.cubes = [];
  this.numCubes = 7;

  this.scene = new THREE.Scene();

  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
  var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff9900});

  for (var i = 0; i < this.numCubes; i++) {
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(150 * i, -50 * i, -50 * i);
    this.cubes.push(cube);
    this.scene.add(cube);
  }

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set(0, 0, 300);
  this.scene.add(light);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

ShoutOutLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

ShoutOutLayer.prototype.render = function(renderer, interpolation) {
  renderer.render(this.scene, this.camera);
};

ShoutOutLayer.prototype.update = function(frame, relativeFrame) {
  this.cameraController.updateCamera(relativeFrame);
};
