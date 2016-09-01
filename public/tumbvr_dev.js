(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AssetLoader;
(function(){
	"use strict";

	/**
	 * Add a sculpture to the scene
	 * @param {[type]} assetList [description]
	 */
	AssetLoader = function(assetList, assetType, assetName, pos, scale){
		this.assetList = assetList;

		switch(assetType){
			case "obj":
				this.loadObj(assetName);
				break;
			case "dae":
				this.loadDae(assetName);
				break;
		}
		return this.addAssetMesh(assetType, assetName, pos, scale);
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

	AssetLoader.prototype.addAssetMesh = function(assetType, assetName, pos, scale){
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
		return assetMesh;
	}

})();
module.exports = AssetLoader;
},{}],2:[function(require,module,exports){
var ImageLoader;
(function(){
	"use strict";

	/**
	 * Initiate loading of tumblr images into gallery
	 * @param {[type]} assetList [description]
	 */
	ImageLoader = function(assetList, imageData){
		this.assetList = assetList;

		this.ratios = [];
		this.nbFrames = Math.min(imageData.length, 12);
		this.loadAssets(imageData);

		this.assetList.addEventListener("loaded", this.onAssetsLoaded.bind(this));
	}

	/**
	 * Adding tumblr images to aframe assetlist for loading
	 * @return {[type]} [description]
	 */
	ImageLoader.prototype.loadAssets = function(imageData){
		for(var i=0; i < this.nbFrames; ++i){
			var pic = imageData[i].photos[0].original_size;

			var imgAsset = document.createElement("img");
			imgAsset.setAttribute("id", "img"+i);
			imgAsset.setAttribute("src", "http://ec2-52-27-113-232.us-west-2.compute.amazonaws.com:8080/" + pic.url);
			imgAsset.setAttribute("crossorigin", "anonymous");
			this.assetList.appendChild(imgAsset);

			this.ratios.push(pic.height / pic.width);
		}
	}

	/**
	 * Distribute the images to correct places in the 3D scene
	 * @return {[type]} [description]
	 */
	ImageLoader.prototype.onAssetsLoaded = function(){
		var aScene       = document.querySelector("a-scene");

		for(var i=1; i < this.nbFrames+1; ++i){
			var img = document.createElement("a-image");
			aScene.appendChild(img);

			img.setAttribute("src", "#img"+(i-1));

			//Position calculation for each image
			var pos = new THREE.Vector3(0, 1.35, 0);
			var rot = new THREE.Vector3(0, 0, 0);
			if(i < 7){
				pos.x = i % 3 === 1 ? -2.25 : i % 3 === 2 ? 0 : 2.25;
				pos.z = i < 4 ? -3.95 : 3.95;
				rot.y = i < 4 ? 0 : 180;
			}
			else{
				pos.x = i < 10 ? -3.95 : 3.95;
				pos.z = i % 3 === 1 ? -2.4 : i % 3 === 2 ? 0 : 2.4;
				rot.y = i < 10 ? 90 : -90;
			}
  			img.setAttribute('position', pos);
			img.setAttribute("rotation", rot);

			//Size calculation for correct rendering
			var width = Math.min(2, (this.ratios[i-1] < 1 ? 1.5 * 1 / this.ratios[i-1] : 1.5));
			var height = Math.min(2, (this.ratios[i-1] < 1 ? 1.5 : 1.5 * this.ratios[i-1]));
			img.setAttribute("width", width);
			img.setAttribute("height", height);
		}
	}
})();
module.exports = ImageLoader;
},{}],3:[function(require,module,exports){
//Main file served by the application
(function(){
	"use strict";
	var ImageLoader     = require("./imageLoader.js");
	var AssetLoader = require("./assetLoader.js");

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

	new ImageLoader(assetList, tumbDatas.posts);

	var davidMesh = new AssetLoader(assetList, "dae", "david", new THREE.Vector3(0, 0.1, -2), new THREE.Vector3(0.8, 0.8, 0.8));
	davidMesh.setAttribute("dynamic-body", "shape: box; mass: 15");


	var sceneMesh = new AssetLoader(assetList, "obj", "cavanagh", new THREE.Vector3(0, 1, 0));

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
},{"./assetLoader.js":1,"./imageLoader.js":2}]},{},[3]);
