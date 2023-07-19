import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import WebGL from 'three/addons/capabilities/WebGL.js';

const SIZE = {
    width : 500,
    height: 400,
}
const CANVAS = document.getElementById("animation") as HTMLCanvasElement
/**
 * Cursor
 */
const CURSOR = {
    x:0,
    y:0
}
window.addEventListener('mousemove', (event:MouseEvent)=> {
    CURSOR.x = event.clientX / SIZE.width - 0.5;
    CURSOR.y = - (event.clientY / SIZE.height - 0.5);
});
// SCENE
const scene = new THREE.Scene()
/** CAMERA */
// The Aspect Ratio
const ASR :number=  SIZE.width / SIZE.height;
// the Field of View
const FOV:number = 75

const camera = new THREE.PerspectiveCamera(
    FOV,
    ASR,
    0.1,
    1000
)
camera.position.z = 4
/** ******* */

// Controls
const CONTROLS = new OrbitControls(camera, CANVAS);
CONTROLS.enableDamping = true
/** ******* */
/** Render */
const renderer = new THREE.WebGLRenderer({
    canvas: CANVAS
})
renderer.setSize(SIZE.width, SIZE.height)
/** ******* */

/** Object */
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
// a mesh needs a shader and a material

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
/** ******* */

/** GROUPS */
// const group = new THREE.Group()
// group.scale.y = 2
// group.rotation.y = 2
// scene.add(group)

// const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xff00ff}))
// cube1.position.x = -2
// const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xf1f10f}))
// cube2.position.x = 2
// group.add(cube1)
// group.add(cube2)

/******** */



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = ASR
    camera.updateProjectionMatrix()
    renderer.setSize(SIZE.width, SIZE.height)
    render()
}
//// Clock - internal solution for deltaTime
const clock = new THREE.Clock()

function animate() {
    //Clock
    // const elapsedTime = clock.getElapsedTime();
    // Update Camera
    // camera.position.x = Math.sin(CURSOR.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(CURSOR.x * Math.PI * 2) * 3
    // camera.position.y = CURSOR.y * 5
    // camera.lookAt(cube.position)
    // Update Controls
    CONTROLS.update()
    // Render
    render()

    requestAnimationFrame(animate)
}

function render() {
    renderer.render(scene, camera)
}

// WebGL compatibility check
if ( WebGL.isWebGLAvailable() ) {
	// Initiate function or other initializations here
	animate();

} else {
	const warning = WebGL.getWebGLErrorMessage();
	alert( warning );
}
