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