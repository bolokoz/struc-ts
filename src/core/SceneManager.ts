import * as THREE from 'three';
import { StructuralElement } from './StructuralElement';

export class SceneManager {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private elements: StructuralElement[] = [];

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.setupCamera();
    this.setupRenderer(container);
    this.setupLights();
  }

  private setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);
  }

  private setupRenderer(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);
  }

  public addElement(element: StructuralElement) {
    this.elements.push(element);
    this.scene.add(element.getMesh());
  }

  public removeElement(element: StructuralElement) {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
      this.scene.remove(element.getMesh());
    }
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public updateElements() {
    this.elements.forEach(element => element.update());
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public handleResize() {
    const container = this.renderer.domElement.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}