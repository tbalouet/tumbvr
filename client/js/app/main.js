//Main file served by the application
(function(){
	"use strict";
	var ImageLoader  = require("./imageLoader.js");
	var AssetLoader  = require("./assetLoader.js");
	var BallsManager = require("./ballsManager.js");

	/*
	/*Set cross loaders to anonymous
	*/
    THREE.ImageUtils.crossOrigin                           = "anonymous";
    THREE.ImageUtils.loadTexture.crossOrigin               = "anonymous";
    THREE.ImageUtils.loadTexture.prototype.crossOrigin     = "anonymous";
    THREE.ImageUtils.loadTextureCube.prototype.crossOrigin = "anonymous";
    THREE.ImageUtils.loadTextureCube.crossOrigin           = "anonymous";
    THREE.ImageUtils.loadTextureCube.prototype.crossOrigin = "anonymous";

	//Samsung VR browser background
	if ('SamsungChangeSky' in window) {
		window.SamsungChangeSky({ sphere: '/public/samsung_background.jpg' });
	}

    function checkDeviceOnEnterVR(){
		/**
		 * Check the device, if no position set the camera upper
		 * @type {[type]}
		 */
		var getVRDisplays = navigator.getVRDisplays || navigator.getVRDevices;

		if(getVRDisplays){
			navigator.getVRDisplays().then( function(data){
				if(data.length && !data[0].capabilities.hasPosition && data[0].isPresenting){
					document.querySelector('[camera]').addEventListener('componentchanged', function (evt) {
						if (evt.detail.name === 'position') {
							//Forcing the Y position to a certain height on non positional tracking headsets
							document.querySelector('[camera]').getAttribute("position").y = 1.6;
						}
					});
				}
			});
		}
    }

	var aScene       = document.querySelector("a-scene");
	aScene.addEventListener('enter-vr', checkDeviceOnEnterVR);

	var assetList    = document.createElement("a-assets");
	aScene.appendChild(assetList);

	/**
	 * Load the speaker mesh
	 */
	var audioAsset = document.createElement("audio");
	audioAsset.setAttribute("id", "amazingGrace2011");
	audioAsset.setAttribute("src", "public/sounds/amazingGrace2011.WAV");
	assetList.appendChild(audioAsset);
	var speakerMesh = new AssetLoader(assetList, "obj", "speaker", new THREE.Vector3(0, 0, -1.05), new THREE.Vector3(0.4, 0.4, 0.4));
	speakerMesh.setAttribute("sound", "src: #amazingGrace2011;loop:true");

	var ballsIDs = ["ball1", "ball2", "ball3"];
	new BallsManager(ballsIDs);

	/**
	 * Add collision walls
	 */
	for(var i=0; i < 6; ++i){
		var colBox = document.createElement("a-box");
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

  document.querySelector("#butOK").addEventListener("click", function(){
    document.querySelector("#amazingGrace2011").play();
  });

  console.log("David by Michelangelo(https://sketchfab.com/models/8f4827cf36964a17b90bad11f48298ac) by jerryfisher(https://sketchfab.com/jerryfisher) is licensed under CC Attribution(http://creativecommons.org/licenses/by/4.0/)");
  console.log("Landscape gallery by @stoneysteiner(https://sketchfab.com/models/3702735762544e5796be4740cb6d5efc) by stoneysteiner(https://sketchfab.com/stoneysteiner) is licensed under CC Attribution(http://creativecommons.org/licenses/by/4.0/)");
})();
