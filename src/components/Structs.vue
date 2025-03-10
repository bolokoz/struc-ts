<template>
  <div ref="container" class="structs-viewer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SceneManager } from '../core/SceneManager';
import { Beam } from '../core/Beam';
import { LoadVisualizer } from '../core/LoadVisualizer';

// Type for 2D/3D coordinates
type Point2D = [number, number];
type Point3D = [number, number, number];
type Point = Point2D | Point3D;

export interface Force {
  type: 'point' | 'moment';
  position: Point;
  direction?: Point; // Optional for moment loads
  magnitude: number;
  color?: number;
}

export interface BeamConfig {
  start: Point;
  end: Point;
  dimensions: {
    width: number;
    height: number;
    length?: number; // Optional in 2D
    flangeThickness?: number;
    webThickness?: number;
  };
  material?: {
    color?: number;
    metalness?: number;
    roughness?: number;
  };
}

const props = defineProps<{
  beams?: BeamConfig[];
  forces?: Force[];
  is3D?: boolean; // Default to 2D mode
}>();

const container = ref<HTMLElement | null>(null);
let sceneManager: SceneManager;
let controls: OrbitControls;

// Convert 2D point to 3D
const to3D = (point: Point): THREE.Vector3 => {
  if (point.length === 3) {
    return new THREE.Vector3(...(point as Point3D));
  }
  return new THREE.Vector3(point[0], point[1], 0);
};

onMounted(() => {
  if (!container.value) return;
  
  // Initialize scene
  sceneManager = new SceneManager(container.value);
  
  // Add orbit controls
  controls = new OrbitControls(sceneManager.getCamera(), container.value);
  controls.enableDamping = true;
  
  // Add grid helper
  const gridHelper = new THREE.GridHelper(10, 10);
  if (!props.is3D) {
    gridHelper.rotation.x = Math.PI / 2; // Lay flat for 2D view
  }
  sceneManager.getScene().add(gridHelper);
  
  // Set initial camera position
  if (!props.is3D) {
    sceneManager.getCamera().position.set(0, 0, 10);
    sceneManager.getCamera().lookAt(0, 0, 0);
  }
  
  // Initial render
  updateScene();
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    sceneManager.render();
  };
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    sceneManager.handleResize();
  });
});

const updateScene = () => {
  if (!sceneManager) return;
  
  // Clear existing elements
  const scene = sceneManager.getScene();
  scene.children = scene.children.filter(child => child instanceof THREE.GridHelper);
  
  // Add beams
  props.beams?.forEach(beamConfig => {
    const material = new THREE.MeshStandardMaterial({
      color: beamConfig.material?.color ?? 0x4287f5,
      metalness: beamConfig.material?.metalness ?? 0.8,
      roughness: beamConfig.material?.roughness ?? 0.2
    });
    
    // Convert 2D points to 3D and set default length
    const start = to3D(beamConfig.start);
    const end = to3D(beamConfig.end);
    const dimensions = {
      ...beamConfig.dimensions,
      length: beamConfig.dimensions.length ?? 0.2 // Default thickness for 2D view
    };
    
    const beam = new Beam(start, end, dimensions, material);
    sceneManager.addElement(beam);
  });
  
  // Add forces
  props.forces?.forEach(force => {
    const loadVisualizer = new LoadVisualizer();
    const position = to3D(force.position);
    
    if (force.type === 'point' && force.direction) {
      const direction = to3D(force.direction);
      const arrow = loadVisualizer.createPointLoad(
        position,
        direction,
        force.magnitude,
        force.color
      );
      scene.add(arrow);
    } else {
      const moment = loadVisualizer.createMomentLoad(
        position,
        force.magnitude
      );
      scene.add(moment);
    }
  });
};

// Watch for changes in props
watch(() => props.beams, updateScene, { deep: true });
watch(() => props.forces, updateScene, { deep: true });
watch(() => props.is3D, updateScene);
</script>

<style scoped>
.structs-viewer {
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f0f0f0;
}
</style> 