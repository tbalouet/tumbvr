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