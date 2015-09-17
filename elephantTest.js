#pragma strict

var circleRadius: float;

private var destination: Vector3;

private var nav: NavMeshAgent;
private var target: Transform;
private var counter = 0;

function Start () {
	nav = GetComponent(NavMeshAgent);
	var targetObject = GameObject.FindWithTag("Player");
	if(targetObject != null) {
		target = GameObject.FindWithTag("Player").transform;
	}
}

function Update () {
	if(counter < 1) {
		nav.destination = (GetDestination());
	}
	counter++;
}

function GetDestination() {
	//get the position of the player
	var targetPosition = target.position;
	
	//do math to find the target of the elephant along a circle with rad circleradius
	var hypotenuse = Mathf.Sqrt(targetPosition.x*targetPosition.x + targetPosition.z*targetPosition.z);
	var xPos = (targetPosition.x)/hypotenuse * circleRadius;
	var zPos = (targetPosition.z)/hypotenuse * circleRadius;
	
	//get the current position
	var destination = GetCurrentPosition();
	//add the x values and z values to the destination
	destination.x = xPos;
	destination.z = zPos;
	Debug.Log(destination);
	
	return destination;
}

function GetCurrentPosition() {
	return new Vector3(transform.position.x, transform.position.y, transform.position.z); 
}