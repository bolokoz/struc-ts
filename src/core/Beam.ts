import * as THREE from 'three';
import { StructuralElement } from './StructuralElement';

export interface BeamDimensions {
    width: number;
    height: number;
    length: number;
    flangeThickness?: number;
    webThickness?: number;
}

export class Beam extends StructuralElement {
    constructor(
        public start: THREE.Vector3,
        public end: THREE.Vector3,
        private dimensions: BeamDimensions,
        material: THREE.Material
    ) {
        super(material);
        this.validateDimensions();
        this.updatePosition();
    }

    private validateDimensions() {
        if (this.dimensions.width <= 0 || this.dimensions.height <= 0 || this.dimensions.length <= 0) {
            throw new Error('Beam dimensions must be positive numbers');
        }

        if (this.dimensions.flangeThickness !== undefined && this.dimensions.webThickness === undefined) {
            throw new Error('If flangeThickness is specified, webThickness must also be specified');
        }

        if (this.dimensions.webThickness !== undefined && this.dimensions.flangeThickness === undefined) {
            throw new Error('If webThickness is specified, flangeThickness must also be specified');
        }

        if (this.dimensions.flangeThickness !== undefined && this.dimensions.webThickness !== undefined) {
            if (this.dimensions.flangeThickness <= 0 || this.dimensions.webThickness <= 0) {
                throw new Error('Flange and web thickness must be positive numbers');
            }
            if (this.dimensions.webThickness >= this.dimensions.width) {
                throw new Error('Web thickness must be less than beam width');
            }
            if (this.dimensions.flangeThickness * 2 >= this.dimensions.height) {
                throw new Error('Total flange thickness must be less than beam height');
            }
        }
    }

    protected createGeometry(): void {
        if (this.dimensions.flangeThickness !== undefined && this.dimensions.webThickness !== undefined) {
            this.geometry = this.createIBeamGeometry();
        } else {
            this.geometry = new THREE.BoxGeometry(
                this.dimensions.width,
                this.dimensions.height,
                this.dimensions.length
            );
        }
    }

    private createIBeamGeometry(): THREE.BufferGeometry {
        const { width, height, flangeThickness, webThickness } = this.dimensions;
        
        if (!flangeThickness || !webThickness) {
            throw new Error('Flange and web thickness are required for I-beam geometry');
        }
        
        // Create an I-beam shape
        const shape = new THREE.Shape();
        
        // Top flange
        shape.moveTo(-width/2, height/2);
        shape.lineTo(width/2, height/2);
        shape.lineTo(width/2, height/2 - flangeThickness);
        
        // Web
        shape.lineTo(webThickness/2, height/2 - flangeThickness);
        shape.lineTo(webThickness/2, -height/2 + flangeThickness);
        
        // Bottom flange
        shape.lineTo(width/2, -height/2 + flangeThickness);
        shape.lineTo(width/2, -height/2);
        shape.lineTo(-width/2, -height/2);
        shape.lineTo(-width/2, -height/2 + flangeThickness);
        
        // Web
        shape.lineTo(-webThickness/2, -height/2 + flangeThickness);
        shape.lineTo(-webThickness/2, height/2 - flangeThickness);
        
        // Close shape
        shape.lineTo(-width/2, height/2 - flangeThickness);
        shape.lineTo(-width/2, height/2);

        const extrudeSettings = {
            steps: 1,
            depth: this.dimensions.length,
            bevelEnabled: false,
        };

        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    private updatePosition() {
        const direction = new THREE.Vector3().subVectors(this.end, this.start);
        this.mesh.position.copy(this.start);
        this.mesh.lookAt(this.end);
        this.mesh.rotateX(Math.PI / 2); // Align beam with local z-axis
    }

    public update() {
        this.updatePosition();
    }
}