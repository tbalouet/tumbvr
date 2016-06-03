(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Main file served by the application
(function(){
	"use strict";

	var cors_api_host = 'nameless-eyrie-45995.herokuapp.com';
	var cors_api_url = 'https://' + cors_api_host + '/';
	var slice = [].slice;
	var origin = window.location.protocol + '//' + window.location.host;
	var open = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {
		var args = slice.call(arguments);
		var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
		if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
		targetOrigin[1] !== cors_api_host) {
			args[1] = cors_api_url + args[1];
		}
		return open.apply(this, args);
	};



	var numberFrames = Math.min(tumbDatas.posts.length, 12);
	
	var aScene       = document.querySelector("a-scene");
	var assetList    = document.createElement("a-assets");
	aScene.appendChild(assetList);

	var ratios = [];

	document.querySelector('[camera]').addEventListener('componentchanged', function (evt) {
		if (evt.detail.name === 'position') {
			var posY = document.querySelector('[camera]').getAttribute("position").y;
			document.querySelector('[camera]').getAttribute("position").y = Math.min(1.5, posY);;
		}
	});

	/*
	* LOADING ASSETS
	*/
	for(var i=0; i < numberFrames; ++i){
		var imgAsset = document.createElement("img");
		imgAsset.setAttribute("id", "img"+i);
		imgAsset.setAttribute("src", tumbDatas.posts[i].photos[0].alt_sizes[2].url);
		imgAsset.setAttribute("crossorigin", "anonymous");
		assetList.appendChild(imgAsset);

		ratios.push(tumbDatas.posts[i].photos[0].original_size.height/tumbDatas.posts[i].photos[0].original_size.width);
	}

	var galleryOBJ = document.createElement("a-asset-item");
	galleryOBJ.setAttribute("id", "gallery-obj");
	galleryOBJ.setAttribute("src", "assets/cavanagh.obj");
	assetList.appendChild(galleryOBJ);

	var galleryMTL = document.createElement("a-asset-item");
	galleryMTL.setAttribute("id", "gallery-mtl");
	galleryMTL.setAttribute("src", "assets/cavanagh.mtl");
	assetList.appendChild(galleryMTL);

	assetList.addEventListener("loaded", onAssetLoaded);


	//Load the gallery Mesh
	var galleryMesh = document.createElement("a-entity");
	galleryMesh.setAttribute("obj-model", "obj: #gallery-obj; mtl: #gallery-mtl");
	galleryMesh.setAttribute("position", new THREE.Vector3(0, 0, 0));
	aScene.appendChild(galleryMesh);

	
	//Fill and place the images in the gallery
	function onAssetLoaded(){
		for(var i=1; i < numberFrames+1; ++i){
			var img = document.createElement("a-image");
			aScene.appendChild(img);

			img.setAttribute("src", "#img"+(i-1));

			//Position calculation for each image
			var pos = new THREE.Vector3(0, 0.4, 0);
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
			var width = Math.min(2, (ratios[i-1] < 1 ? 1.5 * 1 / ratios[i-1] : 1.5));
			var height = Math.min(2, (ratios[i-1] < 1 ? 1.5 : 1.5 * ratios[i-1]));
			img.setAttribute("width", width);
			img.setAttribute("height", height);
		}
	};
})();
},{}]},{},[1]);
