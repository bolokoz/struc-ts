import * as THREE from 'three';

export class EngineeringMath {
    /**
     * Converts global coordinates to local element coordinates
     * @param vector Vector in global coordinates
     * @param elementOrientation Element's orientation quaternion
     * @returns Vector in local coordinates
     */
    public static globalToLocal(
        vector: THREE.Vector3,
        elementOrientation: THREE.Quaternion
    ): THREE.Vector3 {
        const inverseRotation = elementOrientation.clone().invert();
        return vector.clone().applyQuaternion(inverseRotation);
    }

    /**
     * Converts local element coordinates to global coordinates
     * @param vector Vector in local coordinates
     * @param elementOrientation Element's orientation quaternion
     * @returns Vector in global coordinates
     */
    public static localToGlobal(
        vector: THREE.Vector3,
        elementOrientation: THREE.Quaternion
    ): THREE.Vector3 {
        return vector.clone().applyQuaternion(elementOrientation);
    }

    static calculateStress(force: number, area: number): number {
      return force / area;
    }
  
    static calculateDeflection(
      load: number,
      length: number,
      elasticity: number,
      momentOfInertia: number
    ): number {
      return (load * Math.pow(length, 3)) / (3 * elasticity * momentOfInertia);
    }
}