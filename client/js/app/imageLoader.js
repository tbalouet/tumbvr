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

		this.onAssetsLoaded();
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

		var galleryMesh = document.querySelector('#mesh_cavanagh').getObject3D('mesh');

		var planeMeshArray = galleryMesh.children.filter(function(obj){ return obj.name.indexOf("Plane") !== -1;});

		for(var i=0; i < this.nbFrames; ++i){
			var img = document.createElement("a-image");
			aScene.appendChild(img);

			img.setAttribute("src", "#img"+(i));

			var pos = new THREE.Vector3();
			var rot = new THREE.Vector3();
			planeMeshArray[i].geometry.computeBoundingSphere();
			pos.copy(planeMeshArray[i].geometry.boundingSphere.center);

			if(planeMeshArray[i].name.indexOf("Rotated") !== -1){
				rot.y = 90;
			}

  			img.setAttribute('position', pos);
			img.setAttribute("rotation", rot);

			//Size calculation for correct rendering
			var width = Math.min(2, (this.ratios[i] < 1 ? 1.5 * 1 / this.ratios[i] : 1.5));
			var height = Math.min(2, (this.ratios[i] < 1 ? 1.5 : 1.5 * this.ratios[i]));
			img.setAttribute("width", width);
			img.setAttribute("height", height);

			planeMeshArray[i].visible = false;
		}
	}
})();
module.exports = ImageLoader;