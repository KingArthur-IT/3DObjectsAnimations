import * as THREE from 'three';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { PointLight } from 'three/src/lights/PointLight.js';
import { AmbientLight } from 'three/src/lights/AmbientLight.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { Shape } from 'three/src/extras/core/Shape.js';
import { ExtrudeGeometry } from 'three/src/geometries/ExtrudeGeometry.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { Mesh } from 'three/src/objects/Mesh.js';

//scene
let canvas, camera, scene, light, light2, renderer;
let objectsArray = [];

class MeshObj {
    constructor(sizeVector, color, rotation, position, moveDirection) {
        const materialExtr = new MeshPhongMaterial({ color: color });
        let RoundedBox = createBoxWithRoundedEdges(sizeVector.x, sizeVector.y, sizeVector.z, 1, 100);
        this.mesh = new Mesh(RoundedBox, materialExtr);
        this.startAngle = rotation;
        this.startPosition = position;
        this.moveDirection = moveDirection;
        this.mesh.rotation.setFromVector3(rotation);
        this.mesh.position.copy(position);        
    }
}

class App {
	init() {
		canvas = document.getElementById('main3DCanvas');
		canvas.setAttribute('width', 	window.innerWidth);
		canvas.setAttribute('height',   window.innerHeight);
		
		//scene and camera
		scene = new Scene();
		camera = new PerspectiveCamera(40.0, window.innerWidth / window.innerHeight, 0.1, 5000);
		camera.position.set(0, 0, 100);
		//light
        light = new PointLight(0xffffff, 0.2);
        light.position.set(0, 50, 60);
        scene.add(light);
        light2 = new AmbientLight(0xffffff, 0.8);
        light2.position.set(0, 100, 100);
        scene.add(light2);

        //const materialExtr = new THREE.MeshPhongMaterial({ color: 0xf7f7f7 });
        /*
        var arcShape = new THREE.Shape(); 
        arcShape.absarc(0, 0, 15, 0, Math.PI, false);
        var holePath = new THREE.Path();
        holePath.absarc( 0, 0, 0, 0, Math.PI , true );
        arcShape.holes.push(holePath);        
        
        var extrudeGeom = new THREE.ExtrudeBufferGeometry(arcShape, { depth: 7, curveSegments: 64, bevelEnabled: false, bevelThickness: 0 });
        mesh1 = new THREE.Mesh(extrudeGeom, materialExtr);
        mesh1.rotation.set(Math.PI * 1.2, 0.4, -0.5);
        mesh1.position.set(0, 20, 0);
        scene.add(mesh1);
        */

        objectsArray.push(new MeshObj(
            new Vector3(10, 10, 10),
            0xf7f7f7,
            new Vector3(0.0, 0.4, -0.5),
            new Vector3(0.0, 20.0, 0.0),
            new Vector3(0.0, 1.0, 0.0)
        ));
        objectsArray.push(new MeshObj(
            new Vector3(12, 8, 7),
            0xf7f7f7,
            new Vector3(-0.5, 0.5, 0.1), //-0.5, 0.5, 0.1
            new Vector3(10.0, 5.0, 0.0),
            new Vector3(1.0, -1.0, 0.0)
        ));
        objectsArray.push(new MeshObj(
            new Vector3(10, 8, 10),
            0xf7f7f7,
            new Vector3(0.5, 0.5, 0.1),
            new Vector3(-8.0, 5.0, 0.0),
            new Vector3(-1.0, -1.0, 0.0)
        ));
        objectsArray.forEach(element => {
            scene.add(element.mesh)
        });

        let box = new THREE.BoxGeometry(20, 20, 20, 100, 100, 100);
        let materialExtr = new MeshPhongMaterial({ color: 0xf7f7f7 });
        let mesh = new Mesh(box, materialExtr);
        mesh.rotation.set(-0.5, 0.5, 0.1)
        //scene.add(mesh)
		//renderer
		renderer = new WebGLRenderer({ canvas: canvas, antialias: true });
		renderer.setClearColor(0xffffff);

		renderer.render(scene, camera);
		//window.addEventListener( 'resize', onWindowResize, false );
		window.addEventListener('mousemove', onMouseMove, false);
		window.addEventListener('scroll', onScroll, false);

		animate();
	}
}

function onMouseMove(e) {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let wk = 0.3 * (e.x - w * 0.5) / w;
    let hk = 0.3 * (e.y - h * 0.5) / h;
    objectsArray.forEach(element => {
        element.mesh.rotation.x = element.startAngle.x + hk;
        element.mesh.rotation.y = element.startAngle.y + wk;
    });
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

function onScroll(e) {
    let distanceToTop = canvas.getBoundingClientRect().top;
    let scrollMoveKoeff = -100.0 * (distanceToTop / canvas.width);
    objectsArray.forEach(element => {
        element.mesh.position.x = element.startPosition.x + element.moveDirection.x * scrollMoveKoeff;
        element.mesh.position.y = element.startPosition.y + element.moveDirection.y * scrollMoveKoeff;
        element.mesh.position.z = element.startPosition.z + element.moveDirection.z * scrollMoveKoeff;
    });
}

function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
  let shape = new Shape();
  let eps = 0.000001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  let geometry = new ExtrudeGeometry( shape, {
    amount: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });
  
  geometry.center();
  
  return geometry;
}

export default App;
