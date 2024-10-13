
// function updateBackgroundColor(ballColor) {
//     const hsl = ballColor.getHSL({});

//     const bgColor = `hsla(${hsl.h * 360}, ${hsl.s * 100}%, 90%, 1)`; 
//     const bgColorLight = `hsla(${hsl.h * 360}, ${hsl.s * 100}%, 85%, 1)`; 

//     document.documentElement.style.setProperty('--bgColor', bgColor);
//     document.documentElement.style.setProperty('--bgColorLight', bgColorLight);
// }

// function rainbowColor(value) {
//     var maxValue = 100;
//     var hue = value / maxValue; // Assuming maxValue is the maximum value you expect
    
//     // Convert hue to RGB color
//     var rgb = new THREE.Color().setHSL(hue, 1, 0.5);
    
//     return rgb;
//   }

// var noise = new SimplexNoise();
// var vizInit = function () {
//   var file = document.getElementById("thefile");
//   var audio = document.getElementById("audio");
//   var fileLabel = document.querySelector("label.file");

//   document.onload = function (e) {
//     console.log(e);
//     audio.play();
//     play();
//   };


//   file.onchange = function () {
//     fileLabel.classList.add("normal");
//     audio.classList.add("active");
//     var files = this.files;

//     audio.src = URL.createObjectURL(files[0]);
//     audio.load();
//     audio.play();
//     play();
//   };

//   function play() {
//     var context = new AudioContext();
//     var src = context.createMediaElementSource(audio);
//     var analyser = context.createAnalyser();
//     src.connect(analyser);
//     analyser.connect(context.destination);
//     analyser.fftSize = 512;
//     var bufferLength = analyser.frequencyBinCount;
//     var dataArray = new Uint8Array(bufferLength);
//     var scene = new THREE.Scene();
//     var group = new THREE.Group();
//     var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.set(0, 0, 100);
//     camera.lookAt(scene.position);
//     scene.add(camera);

//     var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
//     var value = Math.sin(Date.now() / 1000) * 50 + 50;
//     var color = rainbowColor(value);

//     var planeMaterial = new THREE.MeshLambertMaterial({
//     color: color,
//     side: THREE.DoubleSide,
//     wireframe: true,
//     });
//     // var particles = new THREE.BufferGeometry();
//     // var particleCount = 5000;
//     // const positions = new Float32Array(particleCount * 3);
//     // particles.setAttribute(
//     //     'position', 
//     //     new THREE.BufferAttribute(positions, 3)
//     // );

//     // console.log(particles)
//     // var planeMaterial = new THREE.MeshLambertMaterial({
//     //   color: 0x00ff00,
//     //   side: THREE.DoubleSide,
//     //   wireframe: true,
//     // });

//     var plane = new THREE.Mesh(planeGeometry, planeMaterial);
//     plane.rotation.x = -0.5 * Math.PI;
//     plane.position.set(0, 30, 0);
//     group.add(plane);

//     var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
//     plane2.rotation.x = -0.5 * Math.PI;
//     plane2.position.set(0, -30, 0);
//     group.add(plane2);

//     var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
//     var lambertMaterial = new THREE.MeshLambertMaterial({
//       color: 0xff00ee,
//       wireframe: true,
//     });

//     var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
//     ball.position.set(0, 0, 0);
//     group.add(ball);

//     var ambientLight = new THREE.AmbientLight(0xaaaaaa);
//     scene.add(ambientLight);

//     var spotLight = new THREE.SpotLight(0xffffff);
//     spotLight.intensity = 0.9;
//     spotLight.position.set(-10, 40, 20);
//     spotLight.lookAt(ball);
//     spotLight.castShadow = true;
//     scene.add(spotLight);

//     scene.add(group);

//     document.getElementById("out").appendChild(renderer.domElement);

//     window.addEventListener("resize", onWindowResize, false);
//     var defaultSpinSpeed = 0.005;
//     var currentSpin = defaultSpinSpeed;
//     var beatDetected = false;
//     var beatTimer = 0;
//     let previousPeak = 0;
//     let beatHoldTime = 30; 
//     let beatDecayRate = 0.95; 
//     let beatMin = 1.15; 
//     let beatThreshold = beatMin; 
//     let framesSinceLastBeat = 0;

//     render();

//     function render() {
//       analyser.getByteFrequencyData(dataArray);
      

//       var lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
//       var upperHalfArray = dataArray.slice(dataArray.length / 2 - 1, dataArray.length - 1);

//       var overallAvg = avg(dataArray);
//       var lowerMax = max(lowerHalfArray);
//       var lowerAvg = avg(lowerHalfArray);
//       var upperMax = max(upperHalfArray);
//       var upperAvg = avg(upperHalfArray);

//       var lowerMaxFr = lowerMax / lowerHalfArray.length;
//       var lowerAvgFr = lowerAvg / lowerHalfArray.length;
//       var upperMaxFr = upperMax / upperHalfArray.length;
//       var upperAvgFr = upperAvg / upperHalfArray.length;

//       makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
//       makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));

//       makeRoughBall(
//         ball,
//         modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
//         modulate(upperAvgFr, 0, 1, 0, 4)
//       );

//       // Update ball color based on upperAvg
//       var color = new THREE.Color(`hsl(${modulate(upperAvgFr, 0, 1, 0, 360)}, 100%, 50%)`);
//       ball.material.color = color;
//       updateBackgroundColor(color);
//       var upper90thPercentile = percentile(upperHalfArray, 0.);
//       // if (upperMaxFr > upper90thPercentile && !beatDetected) {
//       //   beatDetected = true;
//       //   currentSpin = 0.1;
//       //   beatTimer = 10;
//       // }

//       // if (beatTimer > 0) {
//       //   beatTimer --;
//       // } else {
//       //   currentSpin = defaultSpinSpeed;
//       //   beatDetected = false;
//       // }
//       // group.rotation.y += currentSpin;
//       var currentPeak = max(dataArray);
//       if (currentPeak > beatThreshold && framesSinceLastBeat > beatHoldTime) {
//           console.log('hi');
//           beatDetected = true;
//           currentSpinSpeed = 0.07; // Increase speed on beat
//           framesSinceLastBeat = 0;
//           beatThreshold = currentPeak * beatMin; // Set new threshold
//       } else {
//           beatDetected = false;
//           currentSpinSpeed = defaultSpinSpeed; // Return to default speed
//       }
  
//       // Decay beat threshold
//       beatThreshold *= beatDecayRate;
//       framesSinceLastBeat++;
  
//       group.rotation.y += currentSpinSpeed;
  
//       renderer.render(scene, camera);
//       requestAnimationFrame(render);
//     }

//     function onWindowResize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function makeRoughBall(mesh, bassFr, treFr) {
//       mesh.geometry.vertices.forEach(function (vertex, i) {
//         var offset = mesh.geometry.parameters.radius;
//         var amp = 7;
//         var time = window.performance.now();
//         vertex.normalize();
//         var rf = 0.00001;
//         var distance = offset + bassFr + noise.noise3D(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp * treFr;
//         vertex.multiplyScalar(distance);
//       });
//       mesh.geometry.verticesNeedUpdate = true;
//       mesh.geometry.normalsNeedUpdate = true;
//       mesh.geometry.computeVertexNormals();
//       mesh.geometry.computeFaceNormals();
//     }

//     function makeRoughGround(mesh, distortionFr) {
//       mesh.geometry.vertices.forEach(function (vertex, i) {
//         var amp = 2;
//         var time = Date.now();
//         var distance = noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) * distortionFr * amp;
//         vertex.z = distance;
//       });
//       mesh.geometry.verticesNeedUpdate = true;
//       mesh.geometry.normalsNeedUpdate = true;
//       mesh.geometry.computeVertexNormals();
//       mesh.geometry.computeFaceNormals();
//     }

//     audio.play();
//   }
// };

// window.onload = vizInit;

// document.body.addEventListener("touchend", function (ev) {
//   context.resume();
// });

// function fractionate(val, minVal, maxVal) {
//   return (val - minVal) / (maxVal - minVal);
// }

// function modulate(val, minVal, maxVal, outMin, outMax) {
//   var fr = fractionate(val, minVal, maxVal);
//   var delta = outMax - outMin;
//   return outMin + fr * delta;
// }

// function avg(arr) {
//   var total = arr.reduce(function (sum, b) {
//     return sum + b;
//   });
//   return total / arr.length;
// }

// function max(arr) {
//   return arr.reduce(function (a, b) {
//     return Math.max(a, b);
//   });
// }
// function percentile(arr, p) {
//   arr.sort((a, b) => a - b);
//   var index = Math.floor(p * arr.length);
//   return arr[index];
// }


async function loadAudio(file) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
  }
  
  function detectBeats(audioBuffer, threshold = 0.9) {
    const sampleRate = audioBuffer.sampleRate;
    const data = audioBuffer.getChannelData(0); // Get left channel data
    const beatTimes = [];
  
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(data[i]) > threshold) {
        beatTimes.push({ time: i / sampleRate, intensity: Math.abs(data[i]) });
      }
    }
  
    return beatTimes;
  }
  
  function getTopBeats(beatTimes, percentage = 0.5) {
    const sortedBeats = [...beatTimes].sort((a, b) => b.intensity - a.intensity);
    const topBeatsCount = Math.ceil((percentage / 100) * sortedBeats.length);
    const thresholdIntensity = sortedBeats[topBeatsCount]?.intensity || 0;
    return sortedBeats.filter(beat => beat.intensity >= thresholdIntensity);
  }
  
  
  function updateBackgroundColor(ballColor) {
      const hsl = ballColor.getHSL({});
  
      const bgColor = `hsla(${hsl.h * 360}, ${hsl.s * 100}%, 90%, 1)`; 
      const bgColorLight = `hsla(${hsl.h * 360}, ${hsl.s * 100}%, 85%, 1)`; 
  
      document.documentElement.style.setProperty('--bgColor', bgColor);
      document.documentElement.style.setProperty('--bgColorLight', bgColorLight);
  }
  
  function rainbowColor(value) {
      var maxValue = 100;
      var hue = value / maxValue; // Assuming maxValue is the maximum value you expect
      
      // Convert hue to RGB color
      var rgb = new THREE.Color().setHSL(hue, 1, 0.5);
      
      return rgb;
    }
  
  var noise = new SimplexNoise();
  var vizInit = async function () {
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var fileLabel = document.querySelector("label.file");
  
    document.onload = function (e) {
      console.log(e);
      audio.play();
      play();
    };
  
  
    file.onchange = async function () {
      fileLabel.classList.add("normal");
      audio.classList.add("active");
      var files = this.files;
  
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
  
      const audioBuffer = await loadAudio(files[0]);
      const beatTimes = detectBeats(audioBuffer);
      const topBeats = getTopBeats(beatTimes);
  
      console.log("Top Beats Detected: ", topBeats);
      audio.load();
      audio.play();
      play(topBeats);
    };
  
    function play(topBeats) {
      var context = new AudioContext();
      var src = context.createMediaElementSource(audio);
      var analyser = context.createAnalyser();
      src.connect(analyser);
      analyser.connect(context.destination);
      analyser.fftSize = 512;
      var bufferLength = analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      var scene = new THREE.Scene();
      var group = new THREE.Group();
      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 100);
      camera.lookAt(scene.position);
      scene.add(camera);
  
      var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
  
      var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
      var value = Math.sin(Date.now() / 1000) * 50 + 50;
      var color = rainbowColor(value);
  
      var planeMaterial = new THREE.MeshLambertMaterial({
      color: color,
      side: THREE.DoubleSide,
      wireframe: true,
      });
      // var particles = new THREE.BufferGeometry();
      // var particleCount = 5000;
      // const positions = new Float32Array(particleCount * 3);
      // particles.setAttribute(
      //     'position', 
      //     new THREE.BufferAttribute(positions, 3)
      // );
  
      // console.log(particles)
      // var planeMaterial = new THREE.MeshLambertMaterial({
      //   color: 0x00ff00,
      //   side: THREE.DoubleSide,
      //   wireframe: true,
      // });
  
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.set(0, 30, 0);
      group.add(plane);
  
      var plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
      plane2.rotation.x = -0.5 * Math.PI;
      plane2.position.set(0, -30, 0);
      group.add(plane2);
  
      var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
      var lambertMaterial = new THREE.MeshLambertMaterial({
        color: 0xff00ee,
        wireframe: true,
      });
  
      var ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
      ball.position.set(0, 0, 0);
      group.add(ball);
  
      var ambientLight = new THREE.AmbientLight(0xaaaaaa);
      scene.add(ambientLight);
  
      var spotLight = new THREE.SpotLight(0xffffff);
      spotLight.intensity = 0.9;
      spotLight.position.set(-10, 40, 20);
      spotLight.lookAt(ball);
      spotLight.castShadow = true;
      scene.add(spotLight);
  
      scene.add(group);
  
      document.getElementById("out").appendChild(renderer.domElement);
  
      window.addEventListener("resize", onWindowResize, false);
      var defaultSpinSpeed = 0.005;
      var currentSpin = defaultSpinSpeed;
      var beatDetected = false;
      var beatTimer = 0;
  
  
      render();
  
      function render() {
        analyser.getByteFrequencyData(dataArray);
  
        var lowerHalfArray = dataArray.slice(0, dataArray.length / 2 - 1);
        var upperHalfArray = dataArray.slice(dataArray.length / 2 - 1, dataArray.length - 1);
  
        var overallAvg = avg(dataArray);
        var lowerMax = max(lowerHalfArray);
        var lowerAvg = avg(lowerHalfArray);
        var upperMax = max(upperHalfArray);
        var upperAvg = avg(upperHalfArray);
  
        var lowerMaxFr = lowerMax / lowerHalfArray.length;
        var lowerAvgFr = lowerAvg / lowerHalfArray.length;
        var upperMaxFr = upperMax / upperHalfArray.length;
        var upperAvgFr = upperAvg / upperHalfArray.length;
    
  
        makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
        makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));
  
        makeRoughBall(
          ball,
          modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
          modulate(upperAvgFr, 0, 1, 0, 4)
        );
  
        // Update ball color based on upperAvg
        var color = new THREE.Color(`hsl(${modulate(upperAvgFr, 0, 1, 0, 360)}, 100%, 50%)`);
        ball.material.color = color;
        updateBackgroundColor(color);
        const intensity = upperAvg / 255; 
        const rotationSpeed = cmodulate(intensity, 0, 1, 0.01, 0.1);
      
        // Apply rotation to camera
        group.rotation.y += rotationSpeed + 0.001;
        // group.rotation.y += 0.005;
    
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
  
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
  
  
      function makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
          var offset = mesh.geometry.parameters.radius;
          var amp = 7;
          var time = window.performance.now();
          vertex.normalize();
          var rf = 0.00001;
          var distance = offset + bassFr + noise.noise3D(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp * treFr;
          vertex.multiplyScalar(distance);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
      }
  
      function makeRoughGround(mesh, distortionFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
          var amp = 2;
          var time = Date.now();
          var distance = noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) * distortionFr * amp;
          vertex.z = distance;
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
      }
  
      audio.play();
    }
  };
  
  window.onload = vizInit;
  
  document.body.addEventListener("touchend", function (ev) {
    context.resume();
  });
  
  function fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
  }
  
  function cmodulate(value, inMin, inMax, outMin, outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
  }
  
  function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + fr * delta;
  }
  
  function avg(arr) {
    var total = arr.reduce(function (sum, b) {
      return sum + b;
    });
    return total / arr.length;
  }
  
  function max(arr) {
    return arr.reduce(function (a, b) {
      return Math.max(a, b);
    });
  }
  function percentile(arr, p) {
    arr.sort((a, b) => a - b);
    var index = Math.floor(p * arr.length);
    return arr[index];
  }
  