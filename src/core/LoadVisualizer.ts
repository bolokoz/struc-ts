import * as THREE from 'three';

export class LoadVisualizer {
    private material: THREE.Material;

    constructor() {
        this.material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        });
    }

    public createPointLoad(
        position: THREE.Vector3,
        direction: THREE.Vector3,
        magnitude: number = 1,
        color: number = 0xff0000
    ): THREE.ArrowHelper {
        const normalizedDirection = direction.clone().normalize();
        return new THREE.ArrowHelper(
            normalizedDirection,
            position,
            magnitude,
            color,
            magnitude * 0.2,
            magnitude * 0.1
        );
    }

    public createMomentLoad(
        position: THREE.Vector3,
        magnitude: number = 1
    ): THREE.Object3D {
        const group = new THREE.Group();
        const geometry = new THREE.TorusGeometry(magnitude, magnitude * 0.1, 8, 20);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(geometry, material);
        
        // Add arrow head to show direction
        const arrowHead = new THREE.ConeGeometry(magnitude * 0.15, magnitude * 0.3, 8);
        const arrow = new THREE.Mesh(arrowHead, material);
        arrow.position.y = magnitude;
        arrow.rotation.z = Math.PI / 4;
        
        group.add(ring, arrow);
        group.position.copy(position);
        
        return group;
    }
}