import * as THREE from "three";
import Experience from "../Experience";

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;
        this.setRenderer();

        this.activeCamera = this.camera.perspectiveCamera;

    }

    /**
     * Set renderer
     */
    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })

        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
        //this.renderer.physicallyCorrectLights = true
        //this.renderer.outputEncoding = THREE.sRGBEncoding;
        //this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        //this.renderer.toneMappingExposure = 1
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        // Debug
        if(this.debug.active) {
            this.debug.debugFolderRenderer
            .add(this.renderer, 'toneMapping', {
                No: THREE.NoToneMapping,
                Linear: THREE.LinearToneMapping,
                Reinhard: THREE.ReinhardToneMapping,
                Cineon: THREE.CineonToneMapping,
                ACESFilmic: THREE.ACESFilmicToneMapping
            }).onFinishChange(() =>{
                this.renderer.toneMapping = Number(this.renderer.toneMapping)
                this.experience.updateAllMaterials(true, true)
            })

            this.debug.debugFolderRenderer.add(this.renderer, 'toneMappingExposure').min(0).max(7).step(.1).name('exposure')
        }
    }

    //RESIZE
    resize() {
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }

    //UPDATE
    update() {
        this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height)
        //this.renderer.render(this.scene, this.activeCamera);
        
        //Second screen
        /*this.renderer.setScissorTest(true)
        this.renderer.setViewport(
            this.sizes.width - this.sizes.width/3,
            this.sizes.height - this.sizes.height/3,
            this.sizes.width / 3, 
            this.sizes.height / 3
        )

         this.renderer.setScissor(
            this.sizes.width - this.sizes.width/3,
            this.sizes.height - this.sizes.height/3,
            this.sizes.width / 3, 
            this.sizes.height / 3
        )
 
        this.renderer.render(this.scene, this.camera.orthographicCamera)

        this.renderer.setScissorTest(false)*/
    }
}