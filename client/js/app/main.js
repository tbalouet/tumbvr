(function(){
	"use strict";
	var numberFrames = 12;

	var aScene = document.querySelector("a-scene");
	var assetList = document.createElement("a-assets");
	aScene.appendChild(assetList);

	var ratios = [];

	for(var i=0; i < numberFrames; ++i){
		var imgAsset = document.createElement("img");
		imgAsset.setAttribute("id", "img"+i);
		imgAsset.setAttribute("src", "http://localhost:8080/"+tumbDatas.posts[i].photos[0].alt_sizes[2].url);
		imgAsset.setAttribute("crossorigin", "anonymous");
		assetList.appendChild(imgAsset);

		ratios.push(tumbDatas.posts[i].photos[0].original_size.height/tumbDatas.posts[i].photos[0].original_size.width);
	}

	assetList.addEventListener("loaded", function(){
		for(var i=1; i < numberFrames+1; ++i){
			var img = document.createElement("a-image");
			aScene.appendChild(img);
			var pos = new THREE.Vector3(0, 0.9, 0);
			var rot = new THREE.Vector3(0, 0, 0);
			if(i < 7){
				pos.x = i % 3 === 1 ? -2.25 : i % 3 === 2 ? 0 : 2.25;
				pos.z = i < 4 ? -3.95 : 3.95;
			}
			else{
				pos.x = i < 10 ? -3.95 : 3.95;
				pos.z = i % 3 === 1 ? -2.4 : i % 3 === 2 ? 0 : 2.4;
				rot.y = 90;
			}
  			img.setAttribute('position', pos);
			img.setAttribute("rotation", rot);
			img.setAttribute("src", "#img"+(i-1));
			img.setAttribute("width", (ratios[i-1] < 1 ? 1.5 * 1 / ratios[i-1] : 1.5));
			img.setAttribute("height", (ratios[i-1] < 1 ? 1.5 : 1.5 * ratios[i-1]));
		}
	});

	var galleryOBJ = document.createElement("a-asset-item");
	galleryOBJ.setAttribute("id", "gallery-obj");
	galleryOBJ.setAttribute("src", "assets/cavanagh.obj");
	assetList.appendChild(galleryOBJ);

	var galleryMTL = document.createElement("a-asset-item");
	galleryMTL.setAttribute("id", "gallery-mtl");
	galleryMTL.setAttribute("src", "assets/cavanagh.mtl");
	assetList.appendChild(galleryMTL);

	var galleryMesh = document.createElement("a-entity");
	galleryMesh.setAttribute("obj-model", "obj: #gallery-obj; mtl: #gallery-mtl");
	galleryMesh.setAttribute("position", new THREE.Vector3(0, 0.5, 0));
	aScene.appendChild(galleryMesh);
})();