import * as THREE from 'three';

export interface ILoad {
    type: 'axial' | 'shear' | 'moment' | 'distributed';
    magnitude: number;
    direction: THREE.Vector3;
    applicationPoint: THREE.Vector3;
  }
  
  export interface IStructuralElementConfig {
    material: {
      type: 'steel' | 'concrete' | 'composite';
      grade?: string;
    };
    crossSection: {
      shape: 'I-beam' | 'box' | 'circular' | 'custom';
      dimensions: number[];
    };
    constraints?: {
      supports: 'fixed' | 'pinned' | 'roller';
      degreesOfFreedom: boolean[];
    };
  }

export interface IStructuralElement {
    direction: THREE.Vector3;
    applicationPoint: THREE.Vector3;
    magnitude: number;
}