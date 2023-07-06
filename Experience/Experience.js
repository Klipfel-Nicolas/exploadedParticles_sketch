import * as THREE from 'three';

import assets from "./utils/assets.js";
import Camera from './Scene/Camera';
import Sizes from './utils/Sizes.js';
import Time from './utils/Time.js';
import Renderer from './Scene/Renderer.js';
import Debug from './utils/Debug.js';
import World from './World/World.js';
import Ressources from './utils/Ressources.js';


export default class Experience {
    static instance
    
    constructor (canvas) {

        if(Experience.instance) {
            return Experience.instance
        }
        Experience.instance = this
        
        this.canvas = canvas;
        this.debug = new Debug();

        this.sizes = new Sizes();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.resources = new Ressources(assets);
        this.world = new World();
        this.renderer = new Renderer();

        this.time = new Time();

        // EMIT LISTENER
        //On emit event from Size.js call the update function from here to update all the stuff
        this.sizes.on("resize", ()=> {
            this.resize();
        })

        //On emit event from Time.js call the update function from here to update all the stuff
        this.time.on("update", ()=> {
            this.update();
        })

        this.world.on("worldready", () => {
            const htmlLoader = document.querySelector('.loader');
            htmlLoader.classList.add("loaded");


        })
       
    }

    /**
     * Update Material
     * @param {Boolean} castShadow 
     * @param {Boolean} receiveShadow 
     */
    updateAllMaterials(castShadow, receiveShadow) {
        this.scene.traverse((child) =>{

            if(child.isMesh){

                child.castShadow = castShadow
                child.receiveShadow = receiveShadow

                child.material.needsUpdate = true
                
            }
        })
    }


    // RESIZE 
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    //UPDATE
    update() {
        this.camera.update();
        this.renderer.update();
        this.world.update();
    }
    
}