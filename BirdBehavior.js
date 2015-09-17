//to do
//0 - get rid of navmesh, use position instead
//1 - have birds wings dipwhen it circles
//2 - animations
//3 - change circle time to a method that calcs the rotation time of 1 loop, get the rot time based on where the bird is going next
//    allow user to change # of loops by adding (time of 1 loop) * # of loops
//4 - conditional change for 'if(the bird has reached destination)

#pragma strict

//-----------------------
var circleTime: float;						//how long the bird circles around
var objectArray = new Transform[4];			//an array of objects that the bird flies to
var birdSpeed: float; 						//how fast the bird flies
//-----------------------

//--------------------------
enum aiState001{nextZone, circling};		//two states, finding next zone and circling
private var state: aiState001;				//the variable that holds the current state
private var currentZone: Vector3;			//the zone that the bird currently occupies
private var nav: NavMeshAgent;				//the navmesh agent that helps the bird navigate to the points

private var isTravelling = true;			//boolean to help determine when to start circling
private var isCircling = false;				//boolean to decide when to search for next zone
private var circleStartTime: float;			//number to hold the start of the circling period

private var testZone = new Vector3(0,0,0);	//start point of the bird
//--------------------------

function Start () {
	nav = GetComponent.<NavMeshAgent>();				
	for(var i = 0; i < objectArray.Length; i++) {
		objectArray[i].position.y = 10;
	}
	StartCoroutine("FSM");
	state = aiState001.nextZone;
	
	currentZone = objectArray[0].position;
}

function Update () {
	
	if(currentZone != testZone) { //make sure the bird isnt at the starting zone
		if((transform.position - currentZone).magnitude < 0.5 && state != aiState001.circling) { //check whether the bird has reached destination
			state = aiState001.circling;
			Debug.Log("Start circling.");
			circleStartTime = Time.time;
			isCircling = true;
			isTravelling = false;
		}
	}
	if(Time.time >= (circleStartTime + circleTime) && isCircling) {
		state = aiState001.nextZone;
		Debug.Log("Find next zone.");
		isCircling = false;
	}
}

function FSM() {
	while(true) {
		switch(state) {
			case aiState001.circling:
				yield WaitForSeconds(.0002);
				Circling();
				break;
			case aiState001.nextZone:
				yield WaitForSeconds(.0002);
				MoveToNextZone();
				break;
		}
	}
}

function Circling() {
	nav.ResetPath();
	transform.Rotate(new Vector3(0,1,0));
	transform.Translate(Vector3.forward * Time.deltaTime * birdSpeed);
}

function MoveToNextZone() {
	if(isTravelling == false) {
		GetNextZone();
		isTravelling = true;
	}
	if(isTravelling == true) {
		var relativePos : Vector3 = currentZone - transform.position;
		var rotation : Quaternion = Quaternion.LookRotation(relativePos);
		transform.rotation = Quaternion.Slerp(transform.rotation, rotation, .1);
		transform.Translate(Vector3.forward*.1);
	}
	/*if(isTravelling == true) {
		nav.SetDestination(currentZone);
	}*/
}

/*
if(isTravelling == true) {
	var relativePos : Vector3 = currentZone - transform.position;
	var rotation : Quaternion = Quaternion.LookRotation(relativePos);
	transform.rotation = Quaternion.Slerp(transform.rotation, rotation, 0.1);
}
*/
function GetNextZone() {
	for(var zone: int = 0; zone < objectArray.length; zone++) {
		var nextZone = Mathf.Floor(Random.Range(0,4));
	
		while((zone == nextZone && currentZone == objectArray[zone].position) || nextZone == 4) {
			nextZone = Mathf.Floor(Random.Range(0,4));
		}
		
		if(currentZone == objectArray[zone].position) {
			currentZone = objectArray[nextZone].position;
			break;
		}
	}
	
}



