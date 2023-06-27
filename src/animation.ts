import * as THREE from 'three'

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
/** ******* */

scene.add(cube)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = ASR
    camera.updateProjectionMatrix()
    renderer.setSize(SIZE.width, SIZE.height)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate();