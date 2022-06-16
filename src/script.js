import './style.css'
import * as THREE from 'three'
import glslify from 'glslify'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import VertexShader from './shaders/test/vertex.glsl'
import FragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const glsl = require('glslify')

//Loader
const textureloader = new THREE.TextureLoader()
//const pic = textureloader.load('/img2.jpg')


// Canvas
const canvas = document.querySelector('canvas.webgl')
/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()


/**
 * Test mesh
*/

const geometry = new THREE.InstancedBufferGeometry();
const texture = textureloader.load('/01.png')

// positions
const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
positions.setXYZ(0, -0.5, 0.5, 0.0);
positions.setXYZ(1, 0.5, 0.5, 0.0);
positions.setXYZ(2, -0.5, -0.5, 0.0);
positions.setXYZ(3, 0.5, -0.5, 0.0);
geometry.setAttribute('position', positions);

// uvs
const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
uvs.setXYZ(0, 0.0, 0.0);
uvs.setXYZ(1, 1.0, 0.0);
uvs.setXYZ(2, 0.0, 1.0);
uvs.setXYZ(3, 1.0, 1.0);
geometry.setAttribute('uv', uvs);

// index
geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([ 0, 2, 1, 2, 3, 1 ]), 1));

const numPoints = texture.width * texture.height
const threshold = 34

const indices = new Uint16Array(numPoints);
const offsets = new Float32Array(numPoints * 3);
const angles = new Float32Array(numPoints);


for (let i = 0; i < numPoints; i++) {
	offsets[i * 3 + 0] = i % this.width;
	offsets[i * 3 + 1] = Math.floor(i / this.width);

	indices[i] = i;

	angles[i] = Math.random() * Math.PI;
}


geometry.setAttribute('pindex', new THREE.InstancedBufferAttribute(indices, 1, false));
geometry.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3, false));
geometry.setAttribute('angle', new THREE.InstancedBufferAttribute(angles, 1, false));


const material = new THREE.RawShaderMaterial({
	uniforms: {
        uTime: { value: 0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 2.0 },
        uSize: { value: 0.0 },
        uTextureSize: { value: new THREE.Vector2(texture.width, texture.height) },
        uTexture: { value: texture },
        uTouch: { value: null }
    },
	vertexShader: glslify(VertexShader),
	fragmentShader: glslify(FragmentShader),
	depthTest: false,
	transparent: true
});


const model = new THREE.Mesh(geometry, material)
scene.add(model)

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

const mouse = new THREE.Vector2(0, 0)

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})










/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()