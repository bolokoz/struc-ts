import * as THREE from 'three';

export class MaterialLibrary {
    private static materials = {
        steel: new THREE.MeshStandardMaterial({
            color: 0x808080,
            metalness: 0.8,
            roughness: 0.2
        }),
        concrete: new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.1,
            roughness: 0.9
        }),
        force: new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
        })
    };

    public static getMaterial(type: keyof typeof MaterialLibrary.materials): THREE.Material {
        return this.materials[type];
    }
}