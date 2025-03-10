import * as THREE from 'three';
import { ILoad } from '../types/ILoad';

export abstract class StructuralElement {
  protected mesh!: THREE.Mesh;
  protected geometry!: THREE.BufferGeometry;
  protected material: THREE.Material;

  constructor(material: THREE.Material) {
    this.material = material;
    this.createGeometry();
    this.initializeMesh();
  }

  protected abstract createGeometry(): void;

  protected initializeMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  public getMesh(): THREE.Mesh {
    return this.mesh;
  }

  public applyLoad(load: ILoad) {
    // Implementation will depend on the type of load and structural analysis
  }

  public update() {
    // Update mesh position, rotation, etc. based on analysis results
  }
}