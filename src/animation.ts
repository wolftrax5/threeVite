import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js';
import gsap from 'gsap'

const SIZE = {
    width : 500,
    height:300.
}
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

/** Render */
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("animation") as HTMLCanvasElement
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
const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 2
scene.add(group)

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xff00ff}))
cube1.position.x = -2
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0xf1f10f}))
cube2.position.x = 2
group.add(cube1)
group.add(cube2)

/******** */



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = ASR
    camera.updateProjectionMatrix()
    renderer.setSize(SIZE.width, SIZE.height)
    render()
}
//// Clock - interal solition for deltaTime
const clock = new THREE.Clock()
// Green Sock move.
//gsap.to(cube.position, {duration: 1, delay:1, x:-2})

function animate() {
    //Clock
    const elapsedTime = clock.getElapsedTime();
    //Update objects
    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;
    cube.position.x = Math.cos(elapsedTime);
    cube.position.y = Math.sin(elapsedTime)

    camera.position.x = -Math.cos(elapsedTime);
    camera.position.y = Math.sin(elapsedTime);
    camera.lookAt(cube.position)
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
