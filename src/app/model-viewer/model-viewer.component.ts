import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import * as THREE from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Scene } from 'three';



@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.css']
})
export class ModelViewerComponent{

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  renderer = new THREE.WebGLRenderer({antialias: true});
  scene = new THREE.Scene();
  camera = null;
  mesh = null;
  loader = null;
  

  constructor() {
    let me = this;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
      this.scene.background = new THREE.Color( 0xa0a0a0 );
      
      var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
        
      this.scene.add( mesh );
      
      var loader = new FBXLoader();
      loader.load('../assets/brain.fbx', function ( object ) {
        object.position.y = 0;
        object.position.x =0;  
        me.scene.add( object);

       } );
      
  }

  ngAfterViewInit() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
      this.animate();
  }

  animate() {     
      this.renderer.render(this.scene, this.camera);
  }
}
