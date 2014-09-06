/**
 * @constructor
 */
function SunLayer(layer) {
  var that = this;
  this.numberOfSpheres = 100;
  this.spheres = [];
  this.particlesPerShell = 20;
  this.shells = [];
  this.numShells = 0 | (this.numberOfSpheres / this.particlesPerShell);
  this.scene = new THREE.Scene();

  this.cameraController = new CameraController(layer.position);
  this.camera = this.cameraController.camera;

  var particleGeometry = new THREE.SphereGeometry(10, 10, 10);
  var particleMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF});

  for (var i = 0; i < this.numShells; i++) {
    var obj3d = new THREE.Object3D();
    this.shells.push(obj3d);
    this.scene.add(obj3d);
  }

  var sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: Loader.loadTexture('res/textures/orange.jpg'),
    side: THREE.FrontSide
  });

  this.sun = new THREE.Object3D();
  this.scene.add(this.sun);

  Loader.loadAjax('res/objects/orange.obj', function(text) {
    var objLoader = new THREE.OBJLoader();
    var innerSun = objLoader.parse(text);
    innerSun.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = sunMaterial;
        child.geometry.computeVertexNormals(); // makeItLookNice = true
      }
    });
    var scale = 5000;
    innerSun.scale.set(scale, scale, scale);
    innerSun.position.setY(-180);
    that.sun.add(innerSun);
  });

  if (!window.FILES) {
    Loader.start(function() {
    }, function() {
    });
  }

  var glowMaterial = new THREE.ShaderMaterial(SHADERS.planetGlow).clone();
  glowMaterial.side = THREE.BackSide;
  glowMaterial.blending = THREE.AdditiveBlending;
  glowMaterial.transparent = true;
  glowMaterial.uniforms.glowColor.value = new THREE.Color(0xffbb77);
  glowMaterial.uniforms.viewVector.value = null;
  glowMaterial.uniforms.c.value = 0.1;
  glowMaterial.uniforms.p.value = 3.4;
  this.glow = new THREE.Mesh(
    new THREE.SphereGeometry(350, 32, 32),
    glowMaterial
  );
  this.scene.add(this.glow);

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

  this.glow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
    this.camera.position, this.glow.position
  );
};
