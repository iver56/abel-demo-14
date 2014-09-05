/**
 * @constructor
 */
function ShoutOutLayer(layer) {
  this.cubes = [];
  this.second_cubes = [];
  this.numCubes = 10;

  this.scene = new THREE.Scene();

  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  this.cubeGeometry = new THREE.BoxGeometry(50, 50, 50);

  var letters = [
    ['-', '-', 'e', '-', '-', 'o'],
    ['a', '-', 'm', '-', 's', 'l'],
    ['l', 'a', 'm', '-', 'i', 'o'],
    ['e', 'e', 'a', '-', 'g', 'l'],
    ['k', 't', '-', '-', 'v', 'o'],
    ['s', 's', 'e', '-', 'e', 'r'],
    ['a', 'i', 'm', '-', 's', 'c'],
    ['n', 'r', 'i', '-', 'e', 's'],
    ['b', 'c', 'l', '-', 'b', 'r'],
    ['-', '-', 'e', '-', '-', 'm']
  ];
  for (var i = 0; i < this.numCubes; i++) {
    var cube = this.createCube(letters[i]);
    cube.position.set(70 * i - 400, 0, -70 * i + 400);
    this.cubes.push(cube);
    this.scene.add(cube);
  }
  Loader.start(function(){}, function(){});

  var second_letters = [
    ['-', '-', 'e', '-', '-', '-'],
    ['-', '-', 'm', '-', 'l', 'b'],
    ['p', '-', 'm', '-', 'i', 'o'],
    ['r', '-', 'a', '-', 'o', 'o'],
    ['o', 'n', '-', '-', 'n', 'd'],
    ['f', 'u', 'e', '-', 'l', '-'],
    ['i', 'r', 'm', '-', 'e', 'r'],
    ['t', '-', 'i', '-', 'a', 'm'],
    ['-', '-', 'l', '-', 'f', '-'],
    ['-', '-', 'e', '-', '-', '-']
  ];
  for (var i = 0; i < this.numCubes; i++) {
    var cube = this.createCube(second_letters[i]);
    cube.position.set(70 * i - 400, 0, -70 * i + 400);
    this.second_cubes.push(cube);
  }
  Loader.start(function(){}, function(){});

  var planeGeo = new THREE.PlaneGeometry(5000, 5000);
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0x55ff55, side: THREE.BackSide});
  this.plane = new THREE.Mesh(planeGeo, planeMaterial);
  this.plane.rotation.x = Math.PI / 2;
  this.plane.position.setY(-25);
  this.scene.add(this.plane);

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

  if (relativeFrame >= 651 && !this.secondCubesInScene) {
    this.secondCubesInScene = true;
    for (var i=0; i < this.numCubes; i++) {
      this.scene.remove(this.cubes[i]);
      this.scene.add(this.second_cubes[i]);
    }
  } else if (relativeFrame <= 650 && this.secondCubesInScene) {
    this.secondCubesInScene = false;
    for (var i=0; i < this.numCubes; i++) {
      this.scene.remove(this.second_cubes[i]);
      this.scene.add(this.cubes[i]);
    }
  }
};

ShoutOutLayer.prototype.createCube = function(letters) {
  var imageSuffix = ".png";

  var materialArray = [];
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial({
      map: Loader.loadTexture('res/textures/cube_' + letters[i] + imageSuffix),
      side: THREE.FrontSide
    }));
  }
  var cubeMaterial = new THREE.MeshFaceMaterial(materialArray);
  var cube = new THREE.Mesh(this.cubeGeometry, cubeMaterial);
  return cube
};
