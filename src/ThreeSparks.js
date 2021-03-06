var ThreeSparks;

var THREE = THREE || {};

THREE.Particles = (function() {
  var numMax = Number.MAX_VALUE;

  function VectorPool(vectors) {
    var __pools = vectors;
    this.get = function() {
      if (__pools.length <= 0) throw Error("Have no enough particles");
      return __pools.pop();
    };
    this.release = function(v) {
      v.set(numMax, numMax, numMax); //move vertice to invisible location
      __pools.push(v);
    };
  }

  function SparkParticle(options) {
    if (typeof options == "undefined") options = {};
    var defaults = {
      size: 28,
      count: 300,
      position: new THREE.Vector3(0, 0, 0),
      program: function(ctx) {
        var radius = 14;
        var centerX = radius;
        var centerY = radius;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fill();
      },
      sparksInit: function(emitter, SPARKS) {
        var sphereCap = new SPARKS.SphereCapZone(0, 0, 0, 0, 0, 28);
        emitter.addInitializer(new SPARKS.Lifetime(2, 4));
        emitter.addInitializer(new SPARKS.Velocity(sphereCap));
        emitter.addAction(new SPARKS.Age());
        emitter.addAction(new SPARKS.Move());
        emitter.addAction(new SPARKS.RandomDrift(40, 40, 40));
        emitter.addAction(new SPARKS.Accelerate(0.6));
      }
    };

    for (var key in defaults) {
      if (!options.hasOwnProperty(key)) {
        options[key] = defaults[key];
      }
    }

    var canvas = document.createElement("canvas");
    canvas.style.visibility = 'hidden';
    canvas.width = options.size;
    canvas.height = options.size;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = options.color || "white";
    options.program(ctx);
    document.getElementsByTagName("body")[0].appendChild(canvas);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var geometry = new THREE.Geometry();

    var pMaterial = new THREE.ParticleBasicMaterial({
      color: options.color || "white",
      size: options.size,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    window.pMaterial = pMaterial;

    var v;
    var arr = [];
    for (var p = 0; p <= options.count * 10; p++) {
      v = new THREE.Vector3(numMax, numMax, numMax);
      geometry.vertices.push(v);
      arr.push(v)
    }
    THREE.ParticleSystem.call(this, geometry, pMaterial);
    this.position = options.position;
    var vectorPool = new VectorPool(arr);
    this.sortParticles = true;
    this.emitterPosition = this.position.clone();
    this.sparksEmitter = new SPARKS.Emitter(new SPARKS.SteadyCounter(options.count), {VectorPool: vectorPool});
    this.sparksEmitter.addInitializer(new SPARKS.Position(new SPARKS.PointZone(this.emitterPosition)));
    options.sparksInit(this.sparksEmitter, SPARKS);

    this.sparksEmitter.addCallback("created", function() {
      geometry.__dirtyVertices = true;
      geometry.__dirtyElements = true;
    });
    this.sparksEmitter.addCallback("dead", function() {
      geometry.__dirtyVertices = true;
      geometry.__dirtyElements = true;
    });

    this.sparksEmitter.start();
  }

  SparkParticle.prototype = Object.create(THREE.ParticleSystem.prototype);

  return SparkParticle;
})();
