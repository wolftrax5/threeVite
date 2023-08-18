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
scene.add(customObject)
/* ************ */
/** Object */
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    map: textureColor
})
// a mesh needs a shader and a material

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
const door = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
    map: heigthTexture
}))
door.position.x = 2
scene.add(door)

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
