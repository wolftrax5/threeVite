import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import WebGL from 'three/addons/capabilities/WebGL.js';
import * as lil from 'lil-gui'

/**
 * Debug
 */
const gui = new lil.GUI()
/**************************/
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

/*** TEXTURE */
const IMAGE_SOURCE = 'static/textures/door/color.jpg'

/// Using Native JS way
const image = new Image()
const dirtyTexture = new THREE.Texture(image)
image.addEventListener('load', ()=> {
    dirtyTexture.needsUpdate = true
})
image.src= IMAGE_SOURCE
///////////////////////
/// Using textureLoader
const textureLoader = new THREE.TextureLoader();
const textureColor = textureLoader.load(IMAGE_SOURCE,
    ()=>{
    console.log('textureLoader finished')
    },
      ()=>{
    console.log('textureLoader Progressing')
    },
      ()=>{
    console.log('textureLoader Error')
    },
)

textureColor.rotation = Math.PI / 4
///////////////////////
/// Using LoadingManager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('loadingManager Started')
}
loadingManager.onLoad = () => {
    console.log('loadingManager Finished')
}
loadingManager.onProgress = () => {
    console.log('loadingManager progressing')
}
loadingManager.onError = () => {
    console.log('loadingManager error')
}

const manneredTextureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = manneredTextureLoader.load('static/textures/door/color.jpg')
const alphaTexture = manneredTextureLoader.load('static/textures/door/alpha.jpg')
const ambientOcclusionTexture = manneredTextureLoader.load('static/textures/door/ambientOcclusion.jpg')
const heigthTexture = manneredTextureLoader.load('static/textures/door/height.jpg')
const normalTexture = manneredTextureLoader.load('static/textures/door/normal.jpg')
const metalnessTexture = manneredTextureLoader.load('static/textures/door/metalness.jpg')
const roughnessTexture = manneredTextureLoader.load('static/textures/door/roughness.jpg')
///////////////////////
// Environment map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeTextureLoader.load([
    'static/textures/environmentMaps/0/px.jpg',
    'static/textures/environmentMaps/0/nx.jpg',
    'static/textures/environmentMaps/0/py.jpg',
    'static/textures/environmentMaps/0/ny.jpg',
    'static/textures/environmentMaps/0/pz.jpg',
    'static/textures/environmentMaps/0/nz.jpg',
])
/***************** */

/*** Lights */

/**
 * 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
*/
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
/*********** */

/** Custom Object Geometry */
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0, // v0
	 1.0, -1.0,  1.0, // v1
	 1.0,  1.0,  1.0, // v2
] );
const positionsAttribute = new THREE.BufferAttribute(vertices, 3);
const customGeometry = new THREE.BufferGeometry();
customGeometry.setAttribute('position', positionsAttribute);
const customMaterial = new THREE.MeshBasicMaterial({
  
    map: dirtyTexture
})
const customObject = new THREE.Mesh(customGeometry, customMaterial)
//scene.add(customObject)
/* ************ */
/** Object */
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    map: textureColor
})
const basicMaterial = new THREE.MeshStandardMaterial();
basicMaterial.metalness = 0.7
basicMaterial.roughness = 0.2
basicMaterial.envMap = environmentMap
gui.add(basicMaterial, 'metalness').min(0).max(1).step(0.0001)
gui.add(basicMaterial, 'roughness').min(0).max(1).step(0.0001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    basicMaterial
)
sphere.position.x = -2
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    basicMaterial
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3,0.2,16,32),
    basicMaterial
)
torus.position.x = 2
scene.add(sphere, plane, torus)
// a mesh needs a shader and a material

const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)
const door = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
    map: heigthTexture
}))
door.position.x = 2
// scene.add(door)

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
     const elapsedTime = clock.getElapsedTime();
    // Update Camera
    // camera.position.x = Math.sin(CURSOR.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(CURSOR.x * Math.PI * 2) * 3
    // camera.position.y = CURSOR.y * 5
    //camera.lookAt(plane.position)
     sphere.rotation.y = 0.1 * elapsedTime;
     plane.rotation.y = 0.1 * elapsedTime;
     torus.rotation.y = 0.1 * elapsedTime;

     sphere.rotation.x = 0.15 * elapsedTime;
     plane.rotation.x = 0.15 * elapsedTime;
     torus.rotation.x = 0.15 * elapsedTime;

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
