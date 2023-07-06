import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import Experience from "../Experience";

export default class Ressources extends EventEmitter{
    constructor(assets) {
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;

        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    /**
     * Set a Loaders Function to create a loaders Object
     */
    setLoaders() {
        // Draco loader
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/public/draco/')

        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.gltfLoader.setDRACOLoader(dracoLoader)
    };

    /**
     * Start Loading Function
     */
    startLoading() {
        for(const asset of this.assets) {
            if(asset.type === "glbModel") {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                })
            }
        }
    };

    singleAssetLoaded(asset, file) {
        //Create a key value pair array with asset name => file
        this.items[asset.name] = file;
        this.loaded++;

        //If all object are loaded
        if(this.loaded === this.queue){
            this.emit("ready");
        }
    }
}