import * as THREE from 'three'

import Experience from "../Experience";

export default class Environment {
    constructor() {
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug

        this.addSunlight("#fff", 5, 0, 6, -15, "-1", true)
        this.addAmbiantLight(0xcccccc, .5)
    }

    /**
     * Set SunLight Function
     * @param {String} color 
     * @param {Number} intensity 
     * @param {Number} positionX 
     * @param {Number} positionY 
     * @param {Number} positionZ
     * @param {String} debugIndex
     */
    addSunlight(color, intensity, positionX, positionY, positionZ, debugIndex, castShadow) {
        //Directional Light
        this.sunLight = new THREE.DirectionalLight(color, intensity);
        this.sunLight.castShadow = castShadow; 

        this.sunLight.shadow.mapSize = new THREE.Vector2(2048 * 2, 2048 * 2);
        this.sunLight.shadow.camera.bottom = -4;
        this.sunLight.shadow.camera.left = - 10;
        this.sunLight.shadow.camera.right = 10;
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = 60;
        this.sunLight.shadow.bias= -0.001;

        this.sunLight.position.set(positionX, positionY, positionZ);
        
       this.scene.add(this.sunLight);
        
       //Add light to the camera
       //this.experience.camera.perspectiveCamera.add(this.sunLight);

        //Debug
        if(this.debug.active) {
            this.debugSunFolder = this.debug.debugFolderLight.addFolder(`directional${debugIndex}`)
            this.debugShadowFolder = this.debugSunFolder.addFolder('shadow')

            //Color
            let sunColor = {color: color}
            this.debugSunFolder.addColor(sunColor, 'color').onChange(()=>this.sunLight.color.set(sunColor.color))

            //Intensity
            this.debugSunFolder.add(this.sunLight, 'intensity').min(0).max(10).step(.1).name('intensity').listen()

            //Position
            this.debugPostionSunFolder = this.debugSunFolder.addFolder('position')
            this.debugPostionSunFolder.add(this.sunLight.position, 'x').min(- 25).max(150).step(1).name('sunLight-X').listen()
            this.debugPostionSunFolder.add(this.sunLight.position, 'y').min(- 25).max(150).step(1).name('sunLight-Y').listen()
            this.debugPostionSunFolder.add(this.sunLight.position, 'z').min(- 25).max(150).step(1).name('sunLight-Z').listen()
            
            
            //Shadow
            this.debugShadowFolder.add(this.sunLight.shadow, 'bias').min(-0.009).max(0).step(.001).name('bias')
            this.debugShadowFolder.add(this.sunLight.shadow, 'radius').min(0.5).max(5).step(.1).name('radius')
        }

        //Helper
        const Sunhelper = new THREE.DirectionalLightHelper(
                this.sunLight,
                5,
                "#dc3545"
            );

        //this.scene.add(Sunhelper)
  
    }


    addSpotLight(color, intensity) {
        this.spotLight = new THREE.SpotLight( color, intensity,  );
        
        
        this.spotLight.position.set( 0, 4, -4 );
        this.spotLight.target.position.set( 0, 0, 0 );

        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 0.1;
        this.spotLight.shadow.camera.far = 9;
        this.spotLight.shadow.bias = 0.0001;


        this.spotLight.shadow.mapSize.width = 2048;
        this.spotLight.shadow.mapSize.height = 2048;

        this.scene.add( this.spotLight );

        //Debug
        if(this.debug.active) {
            this.debugSpotFolder = this.debug.debugFolderLight.addFolder(`spotLight`)
            this.debugShadowSpotFolder = this.debugSpotFolder.addFolder('shadow')

            let spotColor = {color: color}

            //Position
            this.debugSpotPosition = this.debugSpotFolder.addFolder(`position`)
            this.debugSpotPosition.addColor(spotColor, 'color').onChange(()=>this.spotLight.color.set(spotColor.color))
            this.debugSpotPosition.add(this.spotLight.position, 'x').min(- 25).max(150).step(1).name('spotLight-X').listen();
            this.debugSpotPosition.add(this.spotLight.position, 'y').min(- 25).max(150).step(1).name('spotLight-Y').listen();
            this.debugSpotPosition.add(this.spotLight.position, 'z').min(- 25).max(150).step(1).name('spotLight-Z').listen();
            this.debugSpotPosition.add(this.spotLight, 'intensity').min(0).max(10).step(.1).name('intensity').listen();
            
            this.debugShadowSpotFolder.add(this.spotLight.shadow, 'bias').min(-0.009).max(0).step(.001).name('bias').listen();
            this.debugShadowSpotFolder.add(this.spotLight.shadow, 'radius').min(0.5).max(5).step(.1).name('radius').listen();
        }

        //Helper
        const helper = new THREE.SpotLightHelper(this.spotLight);
        this.scene.add(helper)
    }

    /**
     * Set Ambiant Light
     * @param {String} color 
     * @param {Number} intensity 
     */
    addAmbiantLight(color, intensity) {
        this.ambiantLight = new THREE.AmbientLight( color, intensity )
        this.experience.camera.perspectiveCamera.add(this.ambiantLight)
        
        //Debug
        if(this.debug.active) {
            this.debugAmbientFolder = this.debug.debugFolderLight.addFolder('ambiant')
    
            let ambiantColor = {color: color}
            this.debugAmbientFolder.addColor(ambiantColor, 'color').onChange(()=>this.ambiantLight.color.set(ambiantColor.color));
            this.debugAmbientFolder.add(this.ambiantLight, 'intensity').min(0).max(10).step(.1).name('intensity')
        }
    }

    /**
     * Set Hemisphere Light
     * @param {String} color 
     * @param {Number} intensity 
     */
    addHemisphereLight(color, intensity) {
        const light = new THREE.HemisphereLight(color, intensity);
        this.scene.add( light );
    }

    /**
     * Set background color scene
     * @param {String} color 
     */
    addBackgroundScene(color) {
        this.scene.background = new THREE.Color(color);
    }

    /**
     * 
     * @param {string} color 
     * @param {number} near 
     * @param {number} far 
     */
    addFog(color, near, far)
    {
        this.scene.fog = new THREE.Fog( color, near, far );
    }
}