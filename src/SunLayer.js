/**
 * @constructor
 */
function SunLayer(layer) {
  var that = this;
  var geometry, material;
  this.numberOfSpheres = 100;
  this.spheres = [];
  this.particlesPerShell = 20;
  this.shells = [];
  this.numShells = 0 | (this.numberOfSpheres / this.particlesPerShell);
  this.scene = new THREE.Scene();

  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  var light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(-50, -50, -50);
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  geometry = new THREE.SphereGeometry(200, 6, 6);

  var particleGeometry = new THREE.SphereGeometry(4, 4, 3);
  var particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff9900});

  for (var i = 0; i < this.numShells; i++) {
    var obj3d = new THREE.Object3D();
    this.shells.push(obj3d);
    this.scene.add(obj3d);
  }

  var sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: Loader.loadTexture('res/textures/orange.jpg'),
    side: THREE.FrontSide
  });

  Loader.loadAjax('res/objects/orange.obj', function(text) {
    var objLoader = new THREE.OBJLoader();
    that.sun = objLoader.parse(text);
    that.sun.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = sunMaterial;
      }
    });
    var scale = 5000;
    that.sun.scale.set(scale, scale, scale);
    that.scene.add(that.sun);
  });

  if(!window.FILES) {
    Loader.start( function(){}, function(){});
  }

  for (var i = 0; i < this.numberOfSpheres; i++) {
    //Each sphere is initialized here
    var rot = Math.PI * 2 / this.particlesPerShell * i;
    var shellIndex = (0 | (i / this.particlesPerShell));
    var radius = 250 + 50 * shellIndex;

    var sphere = new THREE.Mesh(particleGeometry, particleMaterial);
    sphere.position.x = radius * Math.cos(rot);
    sphere.position.y = radius * Math.sin(rot);
    this.spheres.push(sphere);
    this.shells[shellIndex].add(sphere);
  }


  var light = new THREE.PointLight(0xffffff);
  light.position = new THREE.Vector3(0, 0, 600);
  this.scene.add(light);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

SunLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

SunLayer.prototype.render = function(renderer, interpolation) {
  renderer.render(this.scene, this.camera);
};

SunLayer.prototype.update = function(frame, relativeFrame) {
  this.sun.rotation.z = 0.6 * Math.sin(0.05 * relativeFrame);
  for (var i = 0; i < this.numShells; i++) {
    var shell = this.shells[i];
    shell.rotation.z = 0.6 * Math.sin(0.05 * relativeFrame - i * 0.1)
  }

  this.cameraController.updateCamera(relativeFrame);
};
