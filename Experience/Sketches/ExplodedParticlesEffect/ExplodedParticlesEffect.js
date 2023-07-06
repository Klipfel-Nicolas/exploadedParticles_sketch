import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { EventEmitter } from "events";

import Experience from '../../Experience';
import Objects from '../../World/Objects';

import vertex from '../../shaders/vertexParticles.glsl';
import fragment from '../../shaders/fragment.glsl';


import { video, imagesArray } from './assets';


export default class ExplodedParticlesEffect extends EventEmitter {
    constructor() {
        super();
        this.experience = new Experience();

        this.containerHtml = document.querySelector('.exploded-particles');
        
        //Setting
        this.settings = {
            distortion: 0,
            bloomStrength: 0,
            progress: 0
        };

        //Sizes
        this.aspectRatio = {
            width: 0,
            height: 0,
        }

        this.isAnimate = false;

        //Image
        //this.initImageEffect()

        //Video
        //this.initVideoEffect()
        
    };

    /**
     * Support for img texture exploded
     * @param {Number} width 
     * @param {Number} height 
     */
    initExplodedParticlesPlane(width, height) {
        console.log('init Plane w and h', width, height)
        
        this.plane = new Objects(
            new THREE.PlaneBufferGeometry( 
                width * 1.911 , 
                height * 1.911 , 
                width,
                height
            ),
            this.material,
            'plane',
            true
        );
    }

    /**
     * Create custom material
     * @param {string} textureStart 
     * @param {string} textureEnd 
     */
    createShaderMaterial(textureStart, textureEnd) {
        this.material = new THREE.ShaderMaterial({
            extensions: {
              derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
              time: { value: 0 },
              distortion: { value: 0 },
              progress: { value: 0 },
              textureStart: { value: new THREE.TextureLoader().load(textureStart) },
              textureEnd: { value: new THREE.TextureLoader().load(textureEnd) },
              viewport: {  value: new THREE.Vector2(window.innerWidth,window.innerHeight) },
              uMouse: {  value: new THREE.Vector2(0,0) },
              resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vertex,
            fragmentShader: fragment
        });
    };

    /**
     * Create a light bloom effect
     */
    createBloomEffect() {
        this.renderScene = new RenderPass( this.experience.scene, this.experience.camera.perspectiveCamera );

        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        this.bloomPass.threshold = this.settings.threshold;
        this.bloomPass.strength = this.settings.bloomStrength;
        this.bloomPass.radius = this.settings.radius;

        this.composer = new EffectComposer( this.experience.renderer.renderer );
        this.composer.addPass( this.renderScene );
        this.composer.addPass( this.bloomPass );

        this.composer.setSize(this.experience.sizes.width, this.experience.sizes.height);
    }

    /* --------------------------------------
                Images static Effect
    -------------------------------------- */
    /**
     * Init Image Effect
     */
    initImageEffect() {
        this.currentImage = 0;

        this.createBloomEffect();
        this.createShaderMaterial(imagesArray[this.currentImage].path, imagesArray[this.currentImage + 1].path);
        this.initExplodedParticlesPlane(imagesArray[this.currentImage].dimension.width, imagesArray[this.currentImage].dimension.height);
        this.addImageEventListeners()

        //debug
        if(this.experience.debug.active) {
            this.experience.debug.debugFolderObject.add(this.settings, "distortion", 0, 3, 0.01).listen();
            this.experience.debug.debugFolderObject.add(this.settings, "bloomStrength", 0, 10, 0.01).listen();
            this.experience.debug.debugFolderObject.add(this.settings, "progress", 0, 1, 0.01).listen();
        }
                
    }

    /* --------------------------------------
                Video Effect
    -------------------------------------- */
    /**
     * Init Video Effect loop
     */
    initVideoEffect() {
        this.currentVideo = 0;

        this.createBloomEffect();
        this.createShaderMaterial(video[this.currentVideo].textureStart, video[this.currentVideo].textureEnd);
        this.initExplodedParticlesPlane(video[this.currentVideo].dimension.width, video[this.currentVideo].dimension.height);
        

        this.createVideoElement(video[this.currentVideo].video);
    }

    /**
     * create html video element and init loop
     * @param {string} src 
     */
    createVideoElement(src) {
        let htmlVideo = document.createElement('video');
        htmlVideo.classList = 'exploded-particles__video'
        htmlVideo.src = src;
        htmlVideo.id = 'explodedParticleVideo'
        this.containerHtml.appendChild(htmlVideo);

        htmlVideo.autoplay = true;
        htmlVideo.muted = true;

        this.addVideoEventListeners(htmlVideo)
    }


    /* --------------------------------------
                Event Listeners
    -------------------------------------- */
    
    /**
     * Set the progress value to 1 to get ended texture at the end of video
     */
    onVideoPlay() {
        this.material.uniforms.progress.value = 1;
    }

    /**
     * End Video TimeLine 
     */
    onVideoEnded(e) {
        this.nextVideo = this.currentVideo < video.length - 1 ? this.currentVideo + 1 : 0;

        gsap.to(e.target, {
            duration: 0.1,
            opacity: 0
        })

        //In
        gsap.to(this.material.uniforms.distortion, {
            duration: 2,
            value: 3,
            ease: "power2.inOut",
        })
        gsap.to(this.bloomPass, {
            duration: 2,
            strength: 7,
            ease: "power2.in",
        })

        // Only if loop the animation
        gsap.to(this.material.uniforms.progress, {
            duration: 1,
            value: 0,
            delay: 1.5,
        })

        //Set the next start texture 
        this.material.uniforms.textureStart.value = new THREE.TextureLoader().load(video[this.nextVideo].textureStart)
        
        //Set the next end texture 
        this.material.uniforms.textureEnd.value =new THREE.TextureLoader().load(video[this.currentVideo].textureEnd)
        
        //Back
        // Only if loop the animation
        gsap.to(this.material.uniforms.distortion, {
            duration: 2,
            value: 0,
            delay: 2,
            ease: "power2.inOut",
        })
        gsap.to(this.bloomPass, {
            duration: 2,
            strength: 0,
            delay: 2,
            ease: "power2.out",
            onComplete: () => {
                // handle loop
                if(this.currentVideo < video.length - 1) {
                    this.currentVideo++
                } else {
                    this.currentVideo = 0
                }

                //Restart video
                e.target.currentTime = 0;
                e.target.src = video[this.currentVideo].video;
                e.target.play();
                
                gsap.to(e.target, {
                    duration: 0,
                    opacity: 1
                })

            }
        })
    }

    /**
     * 
     * @returns Image Timeline
     */
    onImageClicked() {
        
        //Avoid listen click during animation
        if(this.isAnimate) return;
        this.isAnimate = true;

        this.nextImage = this.currentImage < imagesArray.length - 1 ? this.currentImage + 1 : 0;

        const nextPlaneScale = {
            x: imagesArray[this.nextImage].dimension.width / imagesArray[this.currentImage].dimension.width,
            y: imagesArray[this.nextImage].dimension.height / imagesArray[this.currentImage].dimension.height,
        }


        //In
        gsap.to(this.material.uniforms.distortion, {
            duration: 2,
            value: 3,
            ease: "power2.inOut",
        })
        gsap.to(this.bloomPass, {
            duration: 2,
            strength: 7,
            ease: "power2.in",
        })

        // Only if loop the animation
        gsap.to(this.material.uniforms.progress, {
            duration: 1,
            value: 0,
            delay: 1.5,
        })
        // Scale plane to fit img ratio
        gsap.to(this.plane.object.scale, {
            x: imagesArray[this.nextImage].dimension.width / imagesArray[0].dimension.width,
            y: imagesArray[this.nextImage].dimension.height / imagesArray[0].dimension.height,
            duration: 1.5,
            delay:.5
        })
        



        //Set the next start texture 
        this.material.uniforms.textureStart.value = new THREE.TextureLoader().load(imagesArray[this.nextImage].path)
        
        //Set the next end texture 
        this.material.uniforms.textureEnd.value =new THREE.TextureLoader().load(imagesArray[this.currentImage].path)

        this.material.uniforms.progress.value = 1;
        
        //Back
        // Only if loop the animation
        gsap.to(this.material.uniforms.distortion, {
            duration: 2,
            value: 0,
            delay: 2,
            ease: "power2.inOut",
        })
        gsap.to(this.bloomPass, {
            duration: 2,
            strength: 0,
            delay: 2,
            ease: "power2.out",
            onComplete: () => {
                // handle loop
                if(this.currentImage < imagesArray.length - 1) {
                    this.currentImage++
                } else {
                    this.currentImage = 0
                }

                this.isAnimate = false;
            }
        })
    }


    addVideoEventListeners(video) {
        this.onVideoPlayEvent = this.onVideoPlay.bind(this);
        this.onVideoEndedEvent = this.onVideoEnded.bind(this);
    
        video.addEventListener('play', this.onVideoPlayEvent);
        video.addEventListener('ended', this.onVideoEndedEvent);
    }
    
    addImageEventListeners() {
        this.onClickEvent = this.onImageClicked.bind(this);
        document.addEventListener('click', this.onClickEvent); 
    }
    
    removeEventListeners() {
        this.element.removeEventListener('play', this.onVideoPlayEvent);
        this.element.removeEventListener('ended', this.onVideoEndedEvent);

        document.removeEventListener('click', this.onClickEvent); 
    }


    //UPDATE
    update() {
        if(this.material) {
            this.material.uniforms.time.value = this.experience.time.time;
            /* this.material.uniforms.distortion.value = this.settings.distortion;
            this.bloomPass.strength = this.settings.bloomStrength; 
            this.material.uniforms.progress.value = this.settings.progress;*/
        }

        if(this.composer) {      
            //Coment the renderer in renderer.js
            this.composer.render();
        }
    }
}