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
      var tsc = this;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);

      var loader = new FBXLoader();

      loader.load('../assets/brain.fbx', function ( object ) {
        tsc.scene.add(object)
        object.position.y = 0;
        object.position.x = 0;  

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
