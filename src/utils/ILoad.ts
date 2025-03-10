import * as THREE from 'three';

export interface ILoad {
    type: 'point' | 'distributed' | 'moment';
    magnitude: number;
    direction: THREE.Vector3;
    applicationPoint: THREE.Vector3;
    length?: number; // For distributed loads
}