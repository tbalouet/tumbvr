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
			imgAsset.setAttribute("src", /*"ec2-35-176-54-164.eu-west-2.compute.amazonaws.com:8080/" +*/ pic.url);
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