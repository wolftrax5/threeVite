import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const CANVAS = document.getElementById("animation") as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)
//Debug lights
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)

const directionalLight = new THREE.DirectionalLight(0xffffff,1.1)
directionalLight.position.set(1,1,1)
// directional shadow
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Blur the shadow
directionalLight.shadow.radius = 5;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 4;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false;
gui.add(directionalLightCameraHelper, 'visible').name( 'Shadow Camera of DL  Debug' )

scene.add(directionalLight, directionalLightCameraHelper)


const pointLight = new THREE.PointLight(0xfff00f, 0.5, 3, 2)
pointLight.castShadow = true;
pointLight.position.set(-1, 1,0)

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 4;


const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
gui.add(pointLightCameraHelper, 'visible').name( 'Shadow Camera of Point L Debug' )

scene.add(pointLight, pointLightCameraHelper)

const spotLight = new THREE.SpotLight(0xffffff, 2.4,10, Math.PI * 0.3);
spotLight.castShadow = true
spotLight.position.set(0,3,2)

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 4;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
gui.add(spotLightCameraHelper, 'visible').name( 'Shadow Camera of Spot  Debug' )

scene.add(spotLight, spotLightCameraHelper)
scene.add(spotLight.target)
/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5
plane.receiveShadow = true;

scene.add(sphere, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, CANVAS)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: CANVAS
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}



// WebGL compatibility check
if ( WebGL.isWebGLAvailable() ) {
	// Initiate function or other initializations here
	tick();

} else {
	const warning = WebGL.getWebGLErrorMessage();
	alert( warning );
}
