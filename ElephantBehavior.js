//check for errors, crashes on start so comment out the methods and test them

#pragma strict

//------------------------------------
var chargeSpeed: float;
var chargeRotSpeed: float;
var warmupRotationSpeed: float; //searching for player
var pushPower: float;
var warmupTime: float;
var centerPosition: Vector3;
var circleRadius: float;
var startTime: float;
var destination: Vector3;
//------------------------------------

//----------------------------------------
enum aiState{searching, charging, wallCollision, playerCollision};
var state : aiState;
private var nav: NavMeshAgent;
private var target: Transform; //player
//-----------------------------------------


function Start () {
	nav = GetComponent(NavMeshAgent);

	var targetObject = GameObject.FindWithTag("Player");
	Debug.Log(targetObject);
	if(targetObject != null) {
		target = GameObject.FindWithTag("Player").transform;
		Debug.Log(target);
	}
	startTime = Time.time;
	Debug.Log(startTime);
	StartCoroutine("FSM");
}

function Update () {
	if(transform.position == centerPosition) {
		state = aiState.searching;
		startTime = Time.time;
	}
}

function FSM() {
	while(true) {
		switch(state) {
			case aiState.playerCollision:
				break;
			case aiState.wallCollision:
				break;
			case aiState.searching:
				yield WaitForSeconds(2);
				Debug.Log("hi");
				SearchForPlayer(startTime);
				break;
			case aiState.charging:
				yield WaitForSeconds(2);
				Debug.Log("bye");
				Charge(destination);
				break;
		}
	}
}

function Charge(destination:Vector3) {
	nav.SetDestination(destination);
	if(transform.position == destination) {
		nav.SetDestination(centerPosition);
	}
}

//=-------------------------------------------------------------------------------------------------------------
function SearchForPlayer(time:float) {
	var lookAt = Quaternion.LookRotation(target.position - transform.position);
	//rotate (slerp) towards the player.
	transform.rotation = Quaternion.Slerp(transform.rotation, lookAt, warmupRotationSpeed);
	
	if(Quaternion.Dot(transform.rotation, lookAt) > .99 || Quaternion.Dot(transform.rotation, lookAt) < -.99) {
		state = aiState.charging;
		destination = GetDestination();
	}
}
//=-------------------------------------------------------------------------------------------------------------

//=-----------------------------------------------------------------------
function GetDestination() {
	var targetPosition = target.position;
	
	var hypotenuse = Mathf.Sqrt(targetPosition.x*targetPosition.x + targetPosition.z*targetPosition.z);
	var xPos = (targetPosition.x)/hypotenuse * circleRadius;
	var zPos = (targetPosition.z)/hypotenuse * circleRadius;
	
	var destination = GetCurrentPosition();
	destination.x += xPos;
	destination.z += zPos;
	
	return destination;
}
//=-----------------------------------------------------------------------

//=-----------------------------------------------------
function GetCurrentPosition() {
	return new Vector3(transform.position.x, transform.position.y, transform.position.z); 
}
//=-----------------------------------------------------

