//Main file served by the application
(function(){
	"use strict";
	var ImageLoader  = require("./imageLoader.js");
	var AssetLoader  = require("./assetLoader.js");
	var BallsManager = require("./ballsManager.js");

	var SCENE_SIZE = 7.92;//Magic number calculated from the scene object

	/*
	/*Set cross loaders to anonymous
	*/
    THREE.ImageUtils.crossOrigin                           = "anonymous";
    THREE.ImageUtils.loadTexture.crossOrigin               = "anonymous";
    THREE.ImageUtils.loadTexture.prototype.crossOrigin     = "anonymous";
    THREE.ImageUtils.loadTextureCube.prototype.crossOrigin = "anonymous";
    THREE.ImageUtils.loadTextureCube.crossOrigin           = "anonymous";
    THREE.ImageUtils.loadTextureCube.prototype.crossOrigin = "anonymous";
	
	var aScene       = document.querySelector("a-scene");
	var assetList    = document.createElement("a-assets");
	aScene.appendChild(assetList);

	/**
	 * Load the David statue
	 */
	var davidMesh = new AssetLoader(assetList, "dae", "david", new THREE.Vector3(0, 0.1, 2), new THREE.Vector3(0.8, 0.8, 0.8));
	davidMesh.setAttribute("dynamic-body", "shape: box; mass: 15");
	davidMesh.setAttribute("rotation", new THREE.Vector3(0, 90, 0));

	/**
	 * Function to check if the model is fully loaded before calling callback
	 * @param  {[type]}   objID     the ID of the aframe object
	 * @param  {[type]}   className class to compare the object to
	 * @param  {Function} callback  callback to be called once the object is complete
	 */
	function checkObject3DTypeLoop(objID, className, callback){
		callback = callback || function(){};
		if(document.querySelector('#'+objID).getObject3D('mesh') instanceof className){
			callback();
		}
		else{
			setTimeout(function(){
				checkObject3DTypeLoop(objID, className, callback);
			}, 250);
		}
	}

	/**
	 * Create the gallery scene by loading the mesh then adding pictures from tumblr
	 * @param  {[type]} virtualSceneSize Size {x: value, z: value} if we want the virtual room to be adapted (bad idea->clostrophobia)
	 * @return {[type]}                  [description]
	 */
	function createScene(virtualSceneSize){
		var sceneMesh = undefined;
		sceneMesh = new AssetLoader(assetList, "obj", "cavanagh", new THREE.Vector3(), new THREE.Vector3(virtualSceneSize.x / SCENE_SIZE, 1, virtualSceneSize.z / SCENE_SIZE), function(){
			//Function to check if scene object correctly loaded before appending images to it
			checkObject3DTypeLoop("mesh_cavanagh", THREE.Group, function(){
				new ImageLoader(assetList, tumbDatas.posts);
			});
		});
	}
	createScene({x : SCENE_SIZE, z : SCENE_SIZE});

	var ballsIDs = ["ball1", "ball2", "ball3"];
	new BallsManager(ballsIDs);

	// var getVRDisplays = navigator.getVRDisplays || navigator.getVRDevices;

	// if(getVRDisplays){
	// 	navigator.getVRDisplays().then( function(data){
	// 		if(data.length && data[0].stageParameters){
	// 			createScene({x : data[0].stageParameters.sizeX, z : data[0].stageParameters.sizeZ});
	// 		}
	// 		else{
	// 			createScene({x : SCENE_SIZE, z : SCENE_SIZE});
	// 		}
	// 	});
	// }
	// else{
	// 	createScene({x : SCENE_SIZE, z : SCENE_SIZE});
	// }

	/**
	 * Add collision walls
	 */
	for(var i=0; i < 6; ++i){
		var colBox = document.createElement("a-box");
		colBox.setAttribute("static-body", "true");
		colBox.setAttribute("id", "colBox_"+i);
		colBox.setAttribute("visible", false);
		if(i < 2){
			colBox.setAttribute("width", 8);
			colBox.setAttribute("height", 0.1);
			colBox.setAttribute("depth", 8);
		}
		else if(i < 4){
			colBox.setAttribute("width", 0.1);
			colBox.setAttribute("height", 8);
			colBox.setAttribute("depth", 8);
		}
		else{
			colBox.setAttribute("width", 8);
			colBox.setAttribute("height", 8);
			colBox.setAttribute("depth", 0.1);
		}
		aScene.appendChild(colBox);
	}
	document.querySelector("#colBox_0").setAttribute("position", new THREE.Vector3(0, 0, 0));
	document.querySelector("#colBox_1").setAttribute("position", new THREE.Vector3(0, 2.8, 0));

	document.querySelector("#colBox_2").setAttribute("position", new THREE.Vector3(-4.1, 1, 0));
	document.querySelector("#colBox_3").setAttribute("position", new THREE.Vector3(4.1, 1, 0));
	document.querySelector("#colBox_4").setAttribute("position", new THREE.Vector3(0, 1, 4.1));
	document.querySelector("#colBox_5").setAttribute("position", new THREE.Vector3(0, 1, -4.1));
})();