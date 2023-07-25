import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import WebGL from 'three/addons/capabilities/WebGL.js';

const SIZE = {
    width : window.innerWidth,
    height: window.innerHeight,
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
// Limit the pixel ratio at 2, more is unnecessary and affect the performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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

/**
 * RESIZING
 */
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    SIZE.width = window.innerWidth;
    SIZE.height = window.innerHeight;
    camera.aspect = SIZE.width / SIZE.height;
    camera.updateProjectionMatrix()
    renderer.setSize(SIZE.width, SIZE.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    render()
}

window.addEventListener('dblclick', ()=> {
    if(!document.fullscreenElement){
        CANVAS.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
})
/*****************************************/
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
