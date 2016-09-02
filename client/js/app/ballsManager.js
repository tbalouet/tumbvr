var BallsManager;
(function(){
	"use strict";

	/**
	 * Handle the balls and put them back when throw ended
	 * @param {[type]} ballsArray array of the balls to manage
	 */
	BallsManager = function(ballsIDs){
		this.ballsArray   = [];
		this.nbFrameReset = 60;
		this.minDist      = 0.01;
		this.maxDist      = 4;
		this.tmpVec       = new THREE.Vector3();

		for(var i = 0, len = ballsIDs.length; i < len; ++i){
			var ballEntity = document.querySelector("#" + ballsIDs[i]);
			this.ballsArray.push({
				entity      : ballEntity,
				iniPos      : new THREE.Vector3().copy(ballEntity.getAttribute("position")),
				movPos      : new THREE.Vector3(),
				countStatic : 0
			});
		}

		this.update();
	}

	BallsManager.prototype.update = function(){
		for(var i = 0, len = this.ballsArray.length; i < len; ++i){
			var aBall = this.ballsArray[i];
			this.tmpVec.copy(aBall.entity.getAttribute("position"));

			if(this.tmpVec.distanceTo(aBall.iniPos) > this.maxDist){
				if(this.tmpVec.distanceTo(aBall.movPos) < this.minDist){
					aBall.countStatic++;

					if(aBall.countStatic > this.nbFrameReset){
						aBall.entity.pause();
						aBall.countStatic = 0;
						aBall.entity.setAttribute("position", aBall.iniPos);
						aBall.entity.play();
					}
				}
				aBall.movPos.copy(this.tmpVec);
			}
		}

		requestAnimationFrame(this.update.bind(this));
	}
})();
module.exports = BallsManager;