
#pragma strict

//-------------------------------------------------
var moveSpeed: float;
var rotationSpeed: float;
var waitTime: float;
var minPigRange: float;
var maxPigRange: float;
var animator : Animator;
//-------------------------------------------------

//-------------------------------------------------
private var destination: Vector3;
enum aiStatePig{wandering, eating, turning};
private var state : aiStatePig;
//-------------------------------------------------


//------------------------------------------------------------------------------------------------------
function Start () {
	animator = GetComponent(Animator);
	
	GetDestination();
	Debug.Log(destination);
	state = aiStatePig.turning;
	
	StartCoroutine("FSM");
}
//------------------------------------------------------------------------------------------------------

//----------------------------------------------
function FSM() {
	while(true) {
		switch(state) {
			case aiStatePig.wandering:
				MovePig();
				break;
			case aiStatePig.turning:
				TurnPig();
				break;
			case aiStatePig.eating:
				//wait while the pig performs the eating animation, then change the state to turning
				yield WaitForSeconds(waitTime);
				state = aiStatePig.turning;
				break;
		}
		yield;
	}
}
//-----------------------------------------------

//--------------------------------------------------------------------------------------------
function Update () {
	//if the pig has reached its destination, set the state to eating
	if(TestPosition(destination)) {
		GetDestination();
		state = aiStatePig.eating;
	}
	if(animator != null && state == aiStatePig.wandering) {
		animator.SetFloat("Speed",moveSpeed * 100);
	}
	else {
		animator.SetFloat("Speed", 0);
	}
}
//---------------------------------------------------------------------------------------------


// function to move the pig// =-----------------------------------------------------------
function MovePig() {
	transform.Translate(Vector3.forward * moveSpeed*100);
}
//=---------------------------------------------------------------------------------------


//function to turn the pig // =----------------------------------------------------------------------------------------
function TurnPig() {
	//get the rotation
	if(animator != null) {
		animator.SetFloat("Rotation", rotationSpeed*100);
	}
	var lookAt = Quaternion.LookRotation(destination - transform.position);
	
	//rotate the pig with slerp for smooth turning
	transform.rotation = Quaternion.Slerp(transform.rotation, lookAt, rotationSpeed * 100);
	
	//test the rotation, change the pig's state to moving if the rotation is complete
	if(Quaternion.Dot(transform.rotation, lookAt) > .99 || Quaternion.Dot(transform.rotation, lookAt) < -.99) {
		state = aiStatePig.wandering;
		Debug.Log("Done");
		if(animator != null) {
			animator.SetFloat("Rotation", 0);
		}
	}
}
//=--------------------------------------------------------------------------------------------------------------------


//function to generate the pig's next destination// =---------------------------------
function GetDestination() {
	//refer to the current position with GetCurrentPosition
	//refer to the destination with the 'destination' variable
	
	var xRange1 = Random.Range(minPigRange, maxPigRange);
	var xRange2 = Random.Range(-maxPigRange, -minPigRange);
	var zRange1 = Random.Range(minPigRange, maxPigRange);
	var zRange2 = Random.Range(-maxPigRange, -minPigRange);
	
	var xRange : float;
	var zRange : float;
	
	var xTest = Random.Range(-100,100);
	var zTest = Random.Range(-100,100);
	
	xRange = xRange1;
	if(xTest <= 0) {
		xRange = xRange2;
	}
	
	zRange = zRange1;
	if(zTest <= 0) {
		zRange = zRange2;
	}		 
	
	destination = GetCurrentPosition();
	
	destination.x += xRange;
	destination.z += zRange;
}
//=-----------------------------------------------------------------------------------

//function to return the pig's current position//=---------------------------------------------------------------------
function GetCurrentPosition() {
	return new Vector3(transform.position.x, transform.position.y, transform.position.z);
}
//=--------------------------------------------------------------------------------------------------------------------

//function to test whether the pig has gotten to the position, return true when pig has reached destination------------
function TestPosition(destination:Vector3) {
	var currentPosition = GetCurrentPosition();
	var relativeDestination = Vector3(0,0,0);
	
	relativeDestination.x = destination.x - currentPosition.x;
	relativeDestination.z = destination.z - currentPosition.z;
	
	//if the x coord of destination is negative, see if the position is below that
	if(relativeDestination.x <= 0 && currentPosition.x <= relativeDestination.x) {
		return true;
	}
	//if the x coord of the destination is positive, see if the position is above that
	else if(relativeDestination.x >= 0 && currentPosition.x >= relativeDestination.x) {
		return true;
	}
	//if the pig hasnt gone past the point, return false
	else {
		return false;
	}
}
//------------------------------------------------------------------------------------------------------------------------



