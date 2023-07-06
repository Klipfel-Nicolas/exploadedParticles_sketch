import * as THREE from 'three';

import Experience from '../Experience';
import { EventEmitter } from "events";

import Environment from '../Scene/Environement';
import Models from './Models';
import Objects from './Objects';

import ExplodedParticlesEffect from '../Sketches/ExplodedParticlesEffect/ExplodedParticlesEffect';


export default class World extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        
        // Start world (on ressource ready)
        this.resources.on("ready", ()=> {
            this.environment = new Environment();

            // Plane Object
            this.exploadedParticlesEffect = new ExplodedParticlesEffect();
            this.exploadedParticlesEffect.initImageEffect()
     
            this.emit("worldready");
        }); 
        
    }

    /**
     * 
     * @param {number} geometryX 
     * @param {number} geometryZ 
     * @param {*} color 
     */
    setFloor(geometryX, geometryZ, color) {
        const geometry = new THREE.PlaneGeometry(geometryX, geometryZ);
        const material = new THREE.MeshStandardMaterial( {color: color, side: THREE.DoubleSide} );
        this.plane = new THREE.Mesh( geometry, material );
        this.plane.receiveShadow = true;
        this.plane.castShadow = false;
    
        this.plane.rotateX(Math.PI / 180 * 90);
        this.scene.add( this.plane );
    }

    //RESIZE
    resize() {
        this.composer.setSize(this.experience.sizes.width, this.experience.sizes.height);
    }

    //UPDATE
    update() {
        
        if(this.cube) {
            this.cube.object.rotation.x -= .001 * 2;
            this.cube.object.rotation.y -= .001 * 3;
            this.cube.object.rotation.z -= .001 * 4;
        }

        if(this.exploadedParticlesEffect) this.exploadedParticlesEffect.update()
        

/*         if(this.material) {
            this.material.uniforms.time.value = this.experience.time.time;
            //this.material.uniforms.distortion.value = this.settings.distortion;
            //this.bloomPass.strength = this.settings.bloomStrength;
        } */

        /* if(this.composer) {
            //Comente the renderer in renderer.js
            this.composer.render();
        } */
    }
}