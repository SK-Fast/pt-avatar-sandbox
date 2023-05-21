<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { onMounted, ref } from 'vue';

const avatarPreview = ref(null)
let scene;
let animMixer;

const animClips = ref([])

function loadTexture(path) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')

    canvas.width = 1024
    canvas.height = 1024

    const ctx = canvas.getContext('2d')

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image()
    img.src = path

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const base64 = canvas.toDataURL()

      const texture = new THREE.TextureLoader().load(base64);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      resolve(texture)

      canvas.remove()
    }
  })
}

async function equipShirt(path) {
  scene.getObjectByName("Torso").material.map = (await loadTexture(path))
  scene.getObjectByName("Torso").material.alphaTest = 0.5
  scene.getObjectByName("Torso").material.needsUpdate = true
}

async function equipPant(path) {
  scene.getObjectByName("Left_Leg").material.map = (await loadTexture(path))
  scene.getObjectByName("Right_Leg").material.map = (await loadTexture(path))
  scene.getObjectByName("Left_Leg").material.alphaTest = 0.5
  scene.getObjectByName("Left_Leg").material.needsUpdate = true
  scene.getObjectByName("Right_Leg").material.alphaTest = 0.5
  scene.getObjectByName("Right_Leg").material.needsUpdate = true
}

onMounted(async () => {
  const sceneReq = await fetch('/scene.json')
  const sceneData = await sceneReq.json()

  scene = new THREE.ObjectLoader().parse(sceneData);
  const camera = scene.getObjectByName("PerspectiveCamera")
  const player = scene.getObjectByName("Player")

  animMixer = new THREE.AnimationMixer(player);
  const clips = player.animations;

  animClips.value = clips

  camera.aspect = 1
  camera.updateProjectionMatrix();

  equipShirt("/template.png")
  equipPant("/template.png")

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(500, 500);
  avatarPreview.value.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    renderer.setSize(avatarPreview.value.offsetWidth, avatarPreview.value.offsetWidth);

    animMixer.update(clock.getDelta());

    renderer.render(scene, camera);
  }

  animate();
})

async function readImage(file) {
  return new Promise((resolve) => {
    if (file.type && !file.type.startsWith('image/')) {
      console.log('File is not an image.', file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      resolve(event.target.result)
    });
    reader.readAsDataURL(file);
  })
}

const shirtUpload = async (event) => {
  const fileList = event.target.files;

  if (fileList[0]) {
    const imgURL = await readImage(fileList[0])

    equipShirt(imgURL)
  }
}

const pantsUpload = async (event) => {
  const fileList = event.target.files;

  if (fileList[0]) {
    const imgURL = await readImage(fileList[0])

    equipPant(imgURL)
  }
}

const actionObj = ref({})

const toggleAnim = (animN) => {

  if (actionObj.value[animN.name]) {
    actionObj.value[animN.name].stop()

    actionObj.value[animN.name] = undefined
  } else {
    const action = animMixer.clipAction(animN);
    action.play();

    actionObj.value[animN.name] = action
  }

  console.log(actionObj.value)
}

const exportGLTF = async () => {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    function (result) {
      saveArrayBuffer(result, 'export.glb');
    },
    { binary: true }
  );
}

function saveArrayBuffer(buffer, filename) {
  const a = document.createElement("a");
  const file = new Blob([buffer], { type: 'application/octet-stream' });
  a.href = URL.createObjectURL(file);
  a.download = filename;

  a.click()

}
</script>

<template>
  <div class="container mt-5" style="width: 100vw;">
    <div class="text-center mb-5">
      <h3>Preview Polytoria Clothing</h3>
    </div>
    <div class="row">
      <div class="col-12 col-lg-3">
        <div class="card mcard mb-3">
          <h6 class="card-header">
            <i class="fad fa-user-crown"></i> <span class="ms-1">Avatar Preview</span>
          </h6>
          <div class="card-body text-center">
            <div class="mx-auto" style="width: 100%;">
              <div ref="avatarPreview" class="av-preview rounded">
              </div>
            </div>
          </div>
        </div>

        <!--
        <div class="row">
          <div class="col-12 w-100 col-xl-6 ms-0">
            <button class="btn w-100 btn-outline-success mb-3" @click="exportGLTF">
              <i class="fad fa-save"></i> <span class="ms-1">Export GLTF</span>
            </button>
          </div>
        </div>
        -->

        <div class="card mb-3">
          <h6 class="card-header">
            <i class="fad fa-star"></i> <span class="ms-1">Get Started</span>
          </h6>

          <div class="card-body">
            <p class="m-0">Want to create a shirt or pants now? Get the offical templates!</p>

            <div class="d-flex mt-2">
              <a href="https://c0.ptacdn.com/template.png" target="_blank" class="btn btn-sm btn-primary me-2"><i
                  class="fas fa-download me-1"></i> Clothing Template</a>
              <a href="https://c0.ptacdn.com/experttemplate.png" target="_blank" class="btn btn-sm btn-outline-info"><i
                  class="fas fa-download me-1"></i> Expert Template</a>
            </div>

          </div>
        </div>

        <div class="card mb-3">
          <h6 class="card-header">
            <i class="fad fa-circle-info"></i> <span class="ms-1">About</span>
          </h6>

          <div class="card-body">
            <p>This application helps you preview your Polytoria clothings.</p>
            <p>The files is not sent to any servers, all of this happens on your browser.</p>

            <strong>Credits:</strong>
            <ul>
              <li>Polytoria - Avatar, Faces, Frontend css and pretty much everything else</li>
              <li>three.js - Made rendering possible</li>
              <li>Vue - Framework this app was based on.</li>
            </ul>

            <p>This project was also <a href="https://github.com/SK-Fast/pt-avatar-sandbox" target="_blank">open sourced</a>, btw</p>

            <div class="row">
              <div class="col-8">
                <h5>by devpixels</h5>
                <p>aka <a href="https://polytoria.com/users/16342" target="_blank">hu tao</a> from polytoria</p>
                <p><a href="https://devpixels.xyz/" target="_blank">portfolio</a> • <a href="https://discord.gg/EzcWp2KxTr" target="_blank">discord</a> • <a href="https://blog.devpixels.xyz/" target="_blank">blog</a></p>
              </div>
              <div class="col-4">
                <img src="/hutaofromgenshin.png" class="img-fluid">
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="col-12 col-lg-9">
        <h3 class="mb-2">Load Template</h3>

        <div class="card mb-3">
          <div class="card-header">
            <h6 class="m-0">
              <i class="fad fa-tshirt"></i> <span class="ms-1">Shirt</span>
            </h6>
          </div>
          <div class="card-body">
            <div class="px-1"><input type="file" class="form-control bg-dark" @change="shirtUpload" name="files"
                placeholder="Files" accept=".jpg, .jpeg, .png"></div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">
            <h6 class="m-0">
              <i class="fad fa-socks"></i> <span class="ms-1">Pants</span>
            </h6>
          </div>
          <div class="card-body">
            <div class="px-1"><input type="file" @change="pantsUpload" class="form-control bg-dark" id="files"
                name="files" placeholder="Files" accept=".jpg, .jpeg, .png"></div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">
            <h6 class="m-0">
              <i class="fad fa-smile"></i> <span class="ms-1">Emotes</span>
            </h6>
          </div>
          <div class="card-body d-flex flex-wrap">
            <div class="emote m-1" v-for="ac in animClips" :class="{ 'active': actionObj[ac.name] }"
              @click="toggleAnim(ac)">
              <i class="fa-regular fa-smile"></i>

              <p>{{ ac.name }}</p>
            </div>


          </div>
        </div>


      </div>
    </div>
  </div>
</template>