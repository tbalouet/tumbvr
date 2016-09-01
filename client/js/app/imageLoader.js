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