<template>
  <div ref="container" class="struct-viewer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SceneManager } from '../core/SceneManager';

const props = defineProps<{
  beams: Array<{
    start: { x: number; y: number; z: number };
    end: { x: number; y: number; z: number };
    section: {
      width: number;
      height: number;
      length: number;
    };
  }>;
  forces: Array<{
    position: { x: number; y: number; z: number };
    direction: { x: number; y: number; z: number };
    magnitude: number;
    color: number;
  }>;
}>();

const container = ref<HTMLElement | null>(null);
let sceneManager: SceneManager;

onMounted(() => {
  if (!container.value) return;
  
  sceneManager = new SceneManager(container.value);
  
  const controls = new OrbitControls(sceneManager.getCamera(), container.value);
  controls.enableDamping = true;
  
  const gridHelper = new THREE.GridHelper(10, 10);
  sceneManager.getScene().add(gridHelper);
  
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    sceneManager.render();
  };
  animate();
  
  window.addEventListener('resize', () => {
    sceneManager.handleResize();
  });
});

// Watch for changes in beams and forces
watch(() => props.beams, (newBeams) => {
  if (!sceneManager) return;
  sceneManager.clearBeams();
  
  newBeams.forEach(beam => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x4287f5,
      metalness: 0.8,
      roughness: 0.2
    });
    
    sceneManager.addBeam(
      new THREE.Vector3(beam.start.x, beam.start.y, beam.start.z),
      new THREE.Vector3(beam.end.x, beam.end.y, beam.end.z),
      beam.section,
      material
    );
  });
}, { deep: true });

watch(() => props.forces, (newForces) => {
  if (!sceneManager) return;
  sceneManager.clearForces();
  
  newForces.forEach(force => {
    sceneManager.addForce(
      new THREE.Vector3(force.position.x, force.position.y, force.position.z),
      new THREE.Vector3(force.direction.x, force.direction.y, force.direction.z),
      force.magnitude,
      force.color
    );
  });
}, { deep: true });
</script>

<style scoped>
.struct-viewer {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}
</style> 