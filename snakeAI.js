//TBD
//1 - add an isObstacle variable to let the snake pass various obstacles
//2 - when the player picks up the egg, change hasegg to true

var fieldOfViewAngle: float = 110f;             // Number of degrees, centred on forward, for the enemy see.
var maxVisibleDistance: float = 10;
var maxAttackRange: float = 3;
var wanderSpeed: float = 5;
var wanderRotSpeed: float	= 2;
var chaseSpeed: float = 9;
var chaseRotSpeed: float = 10;
var PosArray:GameObject[];
var egg: GameObject;							//reference to the egg
var obstacleCourseSpeed: float;
static var hasEgg = false;		

private var Path0 = new Array();
private var Path1 = new Array();
private var Path2 = new Array();
private var Path3 = new Array();
private var destinationArray: Transform[];
private var tempCount=0;
static var playerDetected=false;                     // Whether or not the player is currently sighted.
private var nav: NavMeshAgent;                         // Reference to the NavMeshAgent component.
private var col: SphereCollider;                       // Reference to the sphere collider trigger component.
private var anim: Animator;                            // Reference to the Animator.
private var player: GameObject;                        // Reference to the player.
private var playerAnim: Animator;                      // Reference to the player's animator component.
//private var hash: HashIDs;                             // Reference to the HashIDs.
private var currentDestination:Vector3;
private var currentDestID = 0;
private var withinAttackRange = false;						//whether or not the player has the egg
enum aiSnakeState{ wandering, chasing, attacking }
var state : aiSnakeState;

function Awake ()
{
    // Setting up the references.
    nav = GetComponent(NavMeshAgent);
    col = GetComponent(SphereCollider);
    anim = GetComponent(Animator);
    player = GameObject.FindGameObjectWithTag("Player");
  //  playerAnim = player.GetComponent(Animator);
  //  hash = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(HashIDs);
}
function Start ()
{
	col.radius = maxVisibleDistance;
	
	
	if(PosArray.Length > 0) {
		for (var child : Transform in PosArray[0].transform) {
			Path0.Push(child);
		}
		for (var child : Transform in PosArray[1].transform) {
			Path1.Push(child);
		}
		for (var child : Transform in PosArray[2].transform) {
			Path2.Push(child);
		}
		for (var child : Transform in PosArray[3].transform) {
			Path3.Push(child);
		}
	}
	ChooseNextDestination();
	StartCoroutine("FSM");
}

function Update (){
    // ... set the animator parameter to whether the player is in sight or not.
   // anim.SetBool(hash.playerDetected, playerDetected);
	if(!hasEgg) {
		if (playerDetected && withinAttackRange) {
 	  	 	state = aiSnakeState.attacking;
		}
		else if (playerDetected) state = aiSnakeState.chasing;
  	  	else state = aiSnakeState.wandering;
  	}
  	//if the player has the egg, begin chasing him
  	else {
  		chaseSpeed = obstacleCourseSpeed;
  		state = aiSnakeState.chasing;
  	}
}

function FSM(){
	while(true){
		switch(state){
			case aiSnakeState.wandering:
				Wander();
				break;
			case aiSnakeState.chasing:
				Chase();
				break;
			case aiSnakeState.attacking:
				yield Attack();
				break;
			//case aiSnakeState.detected:
		}
		yield;
	}
}

function Wander(){
	RotateToward(currentDestination, wanderRotSpeed);
	MoveForward(wanderSpeed);
	var destinationPos = currentDestination;
	var currentPos = transform.position;
	destinationPos.y = 0;
	currentPos.y = 0;
	if((destinationPos - currentPos).magnitude < 1.0){
		ChooseNextDestination();
		Debug.Log('waypoint found!');
	}
	
}

function Chase(){
/*
	RotateToward(player.transform.position, chaseRotSpeed);
	MoveForward(chaseSpeed);
	*/
	nav.SetDestination(player.transform.position);
}

function Attack(){
//	yield WaitForAnimation( animation.PlayQueued( "Intro" ) );
	Debug.Log("ATTACK!");
	yield WaitForSeconds(5);
}

function ChooseNextDestination(){
	if (!destinationArray || currentDestID == 0){
		if (tempCount%2 < 1 && Random.Range(0,1) < 1) destinationArray = Path0;
		else if (tempCount%2 < 1 && Random.Range(0,1) > 0) destinationArray = Path1;
 		else if (tempCount%2 > 0 && Random.Range(0,1) < 1) destinationArray = Path2;
		else if (tempCount%2 > 0 && Random.Range(0,1) > 0) destinationArray = Path3;
	}
	if(destinationArray.Length > 0) {
		currentDestination = destinationArray[currentDestID].position;
		currentDestID++;
		if (currentDestID == destinationArray.Length) {
			currentDestID -= destinationArray.Length;
		}
	}
}

function RotateToward(targetPos : Vector3, rotSpeed : float){
	targetPos.y = transform.position.y;
	var rotation = Quaternion.LookRotation(targetPos - transform.position);
	transform.rotation = Quaternion.Slerp(transform.rotation, rotation, Time.deltaTime * rotSpeed);
}

function MoveForward(moveSpeed : float){
	transform.Translate(Vector3.forward*Time.deltaTime*moveSpeed);
}

function OnTriggerStay (other : Collider){
    // If the player has entered the trigger sphere...
    if(other.gameObject == player){
        // Create a vector from the enemy to the player and store the angle between it and forward.
        var direction : Vector3 = other.transform.position - transform.position;
        var angle : float = Vector3.Angle(direction, transform.forward);
        var hit : RaycastHit;
        
        
        
        // If the angle between forward and where the player is, is less than half the angle of view...
        if(angle < fieldOfViewAngle * 0.5f){
	        // ... and if a raycast towards the player hits something...
	        if(Physics.Raycast(transform.position + transform.up, direction.normalized, hit, col.radius)){
	        	// ... and if the raycast hits the player...
	            if(hit.collider.gameObject == player){
	                // ... the player is detected
	                playerDetected = true;
	                if (hit.distance <= maxAttackRange) withinAttackRange = true;
	            }
	        }
        }
    }
}

/*
function CalculatePathLength (targetPosition : Vector3){
    // Create a path and set it based on a target position.
    var path : NavMeshPath = new NavMeshPath();
    if(nav.enabled)
        nav.CalculatePath(targetPosition, path);
    
    // Create an array of points which is the length of the number of corners in the path + 2.
    var allWayPoints : Vector3[] = new Vector3[path.corners.Length + 2];
    
    // The first point is the enemy's position.
    allWayPoints[0] = transform.position;
    
    // The last point is the target position.
    allWayPoints[allWayPoints.Length - 1] = targetPosition;
    
    // The points inbetween are the corners of the path.
    for(var i = 0; i < path.corners.Length; i++){
        allWayPoints[i + 1] = path.corners[i];
    }
    
    // Create a float to store the path length that is by default 0.
    var pathLength : float = 0;
    
    // Increment the path length by an amount equal to the distance between each waypoint and the next.
    for(var j = 0; j < allWayPoints.Length - 1; j++){
        pathLength += Vector3.Distance(allWayPoints[j], allWayPoints[j + 1]);
    }
    
    return pathLength;
}*/