(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AssetLoader;
(function(){
	"use strict";

	/**
	 * Add a sculpture to the scene
	 * @param {[type]} assetList [description]
	 */
	AssetLoader = function(assetList, assetType, assetName, pos, scale, callbackLoaded){
		callbackLoaded = callbackLoaded || function(){};
		this.assetList = assetList;

		switch(assetType){
			case "obj":
				this.loadObj(assetName);
				break;
			case "dae":
				this.loadDae(assetName);
				break;
		}
		return this.addAssetMesh(assetType, assetName, pos, scale, callbackLoaded);
	}

	AssetLoader.prototype.loadObj = function(assetName){
		var assetOBJ = document.createElement("a-asset-item");
		assetOBJ.setAttribute("id", "asset_"+assetName+"-obj");
		assetOBJ.setAttribute("src", "/public/assets/"+assetName+".obj");
		this.assetList.appendChild(assetOBJ);

		var assetMTL = document.createElement("a-asset-item");
		assetMTL.setAttribute("id", "asset_"+assetName+"-mtl");
		assetMTL.setAttribute("src", "/public/assets/"+assetName+".mtl");
		this.assetList.appendChild(assetMTL);
	}

	AssetLoader.prototype.loadDae = function(assetName){
		var assetCollada = document.createElement("a-asset-item");
		assetCollada.setAttribute("id", "asset_"+assetName+"-dae");
		assetCollada.setAttribute("src", "/public/assets/"+assetName+".dae");
		this.assetList.appendChild(assetCollada);
	}

	AssetLoader.prototype.addAssetMesh = function(assetType, assetName, pos, scale, callbackLoaded){
		pos        = pos || new THREE.Vector3();
		scale      = scale || new THREE.Vector3(1, 1, 1);

		var assetMesh = document.createElement("a-entity");
		assetMesh.setAttribute("id", "mesh_"+assetName);

		switch(assetType){
			case "obj":
				assetMesh.setAttribute("obj-model", "obj: #asset_"+assetName+"-obj; mtl: #asset_"+assetName+"-mtl");
				break;
			case "dae":
				assetMesh.setAttribute("collada-model", "#asset_"+assetName+"-dae");
				break;
		}

		assetMesh.setAttribute("position", pos);
		assetMesh.setAttribute("scale", scale);

		document.querySelector("a-scene").appendChild(assetMesh);

		assetMesh.addEventListener("loaded", callbackLoaded);
		return assetMesh;
	}

})();
module.exports = AssetLoader;
},{}],2:[function(require,module,exports){
var BallsManager;
(function(){
	"use strict";

	/**
	 * Handle the balls and put them back when throw ended
	 * @param {[type]} ballsArray array of the balls to manage
	 */
	BallsManager = function(ballsIDs){
		this.leftController  = document.querySelector("#leftController");
		this.rightController = document.querySelector("#rightController");
		this.ground          = document.querySelector("#colBox_0");
		
		this.ballsArray      = [];
		this.timeBack        = 4000;

		var tmpVec = new THREE.Vector3();
		for(var i = 0, len = ballsIDs.length; i < len; ++i){
			var ballEntity = document.querySelector("#" + ballsIDs[i]);
			tmpVec.copy(ballEntity.getAttribute("position"));
			tmpVec.y += 0.5;

			this.ballsArray.push({
				entity      : ballEntity,
				iniPos      : new THREE.Vector3().copy(tmpVec),
				timeoutBack : undefined
			});
			ballEntity.addEventListener('collide', this.onCollide.bind(this));
		}
	};

	BallsManager.prototype.onCollide = function(event){
		var that = this;

		// if(event.detail.body.el === this.leftController || event.detail.body.el === this.rightController){
		// 	console.log("The ball ", event.detail.target.el, "was picked", event.detail.contact);
		// }
		// else 
			if(event.detail.body.el === document.querySelector("#colBox_0")){
			// console.log("Ball on the ground!");
			for(var i = 0, len = this.ballsArray.length; i < len; ++i){
				if(this.ballsArray[i].entity === event.detail.target.el){
					var aBall = this.ballsArray[i];
					console.log("Found the ball!", aBall);
					if(aBall.timeoutBack === undefined){
						aBall.timeoutBack = setTimeout(function(){
							that.putBallBack(aBall);
						}, this.timeBack);
					}
					break;
				}
			} 
		}
		// else{
		// 	console.log("collision with", event.detail.body.el);
		// }
		// e.detail.target.el;  // Original entity (playerEl).
		// e.detail.body.el;    // Other entity, which playerEl touched.
		// e.detail.contact;    // Stats about the collision (CANNON.ContactEquation).
		// e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
	};

	BallsManager.prototype.putBallBack = function(aBall){
		// console.log("Putting back", aBall);
		aBall.entity.pause();
		aBall.entity.setAttribute("position", aBall.iniPos);
		aBall.entity.play();
		clearTimeout(aBall.timeoutBack);
		aBall.timeoutBack = undefined;
	};
})();
module.exports = BallsManager;
},{}],3:[function(require,module,exports){
var ImageLoader;
(function(){
	"use strict";

	/**
	 * Initiate loading of tumblr images into gallery
	 * @param {[type]} assetList [description]
	 */
	ImageLoader = function(assetList, imageData){
		this.assetList      = assetList;
		
		this.imgArray       = [];
		this.nbFrames       = Math.min(imageData.length, 12);
		this.loadAssets(imageData);
		
		this.rotatingFrames = [];
		this.tempRot		= new THREE.Vector3();

		this.onAssetsLoaded();
		this.update();
	};

	/**
	 * Adding tumblr images to aframe assetlist for loading
	 * @return {[type]} [description]
	 */
	ImageLoader.prototype.loadAssets = function(imageData){
		for(var i=0; i < imageData.length; ++i){
			var pic = imageData[i].photos[0].original_size;

			var imgAsset = document.createElement("img");
			imgAsset.setAttribute("id", "img"+i);
			imgAsset.setAttribute("src", "http://ec2-52-27-113-232.us-west-2.compute.amazonaws.com:8080/" + pic.url);
			imgAsset.setAttribute("crossorigin", "anonymous");
			this.assetList.appendChild(imgAsset);

			this.imgArray.push({
				id : "img"+i,
				ratio : pic.height / pic.width
			});
		}
	};

	/**
	 * Distribute the images to correct places in the 3D scene
	 * @return {[type]} [description]
	 */
	ImageLoader.prototype.onAssetsLoaded = function(){
		var aScene       = document.querySelector("a-scene");

		var galleryMesh = document.querySelector('#mesh_cavanagh').getObject3D('mesh');

		var planeMeshArray = galleryMesh.children.filter(function(obj){ return obj.name.indexOf("Plane") !== -1;});

		for(var i=0; i < this.nbFrames; ++i){
			var img = document.createElement("a-image");
			img.setAttribute("static-body", "true");
			aScene.appendChild(img);

			img.addEventListener('collide', this.onCollide.bind(this));

			var pos = new THREE.Vector3();
			var rot = new THREE.Vector3();
			planeMeshArray[i].geometry.computeBoundingSphere();
			pos.copy(planeMeshArray[i].geometry.boundingSphere.center);

			if(planeMeshArray[i].name.indexOf("Rotated") !== -1){
				rot.y = 90;
			}

  			img.setAttribute('position', pos);
			img.setAttribute("rotation", rot);

			this.addFrame(img, this.imgArray[i]);

			planeMeshArray[i].visible = false;
		}
	};

	ImageLoader.prototype.addFrame = function(imgEntity, imgProperties){
		//Size calculation for correct rendering
		var width = Math.min(2, (imgProperties.ratio < 1 ? 1.5 * 1 / imgProperties.ratio : 1.5));
		var height = Math.min(2, (imgProperties.ratio < 1 ? 1.5 : 1.5 * imgProperties.ratio));
		imgEntity.setAttribute("width", width);
		imgEntity.setAttribute("height", height);

		imgEntity.setAttribute("src", "#"+imgProperties.id);
	};

	ImageLoader.prototype.onCollide = function(event){
		this.rotatingFrames.push({
			rot       : new THREE.Vector3(),
			iniRot	  : new THREE.Vector3().copy(event.detail.target.el.getAttribute("rotation")),
			imgEntity : event.detail.target.el,
			newAsset : this.imgArray[Math.round(Math.random() * (this.imgArray.length - 1))]
		});
	}


	ImageLoader.prototype.update = function(){
		for(var i = this.rotatingFrames.length - 1; i >= 0; --i){
			var aRotFrame = this.rotatingFrames[i];
			if(aRotFrame.rot.y < 180){
				aRotFrame.rot.y++;
				aRotFrame.imgEntity.setAttribute("rotation", this.tempRot.addVectors(aRotFrame.rot, aRotFrame.iniRot));
			}
			else{
				this.addFrame(aRotFrame.imgEntity, aRotFrame.newAsset);
				this.rotatingFrames.pop();
			}
		}

		requestAnimationFrame(this.update.bind(this));
	};
})();
module.exports = ImageLoader;
},{}],4:[function(require,module,exports){
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
	 * Load the speaker mesh
	 */
	var audioAsset = document.createElement("audio");
	audioAsset.setAttribute("id", "amazingGrace2011");
	audioAsset.setAttribute("src", "public/amazingGrace2011.WAV");
	assetList.appendChild(audioAsset);
	var speakerMesh = new AssetLoader(assetList, "obj", "speaker", new THREE.Vector3(0, 0, -1.05), new THREE.Vector3(0.4, 0.4, 0.4));
	speakerMesh.setAttribute("sound", "src: #amazingGrace2011;autoplay:true;loop:true");

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
},{"./assetLoader.js":1,"./ballsManager.js":2,"./imageLoader.js":3}]},{},[4]);
