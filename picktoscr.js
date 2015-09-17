#pragma strict

var snake: GameObject;

var objectPos : Vector3;

var objectRot : Quaternion;

var pickObj : GameObject;

var canpick = true;

var picking = false;

var guipick = false;

var pickref : GameObject;

function Start () 
{
	pickref = GameObject.FindWithTag ("pickupref");
	
	pickObj = pickref;
}

function Update () 
{
	var raycheck : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	
	var hitcheck : RaycastHit;
	
	if (Physics.Raycast(raycheck, hitcheck, 10) && hitcheck.collider.gameObject.tag == "pickup")
	{	
		guipick = true;
	}
	
	if (Physics.Raycast(raycheck, hitcheck) && hitcheck.collider.gameObject.tag != "pickup")
	{
		guipick = false;
	}
	
	objectPos = transform.position;
	
	objectRot = transform.rotation;
	
	if (Input.GetMouseButtonDown(0) && canpick)
	{
		picking = true;
		
		var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		
		var hit : RaycastHit;
		
		if (Physics.Raycast(ray, hit, 10) && hit.collider.gameObject.tag == "pickup")
		{
			pickObj = hit.collider.gameObject;
			
			hit.rigidbody.useGravity = false;
			
			hit.rigidbody.isKinematic = true;
			
			hit.collider.isTrigger = true;
			
			hit.transform.parent = gameObject.transform;
			
			hit.transform.position = objectPos;
			
			hit.transform.rotation = objectRot;
			
			if(hit.collider.gameObject.name == "Egg") {
				snake.GetComponent(snakeAI).hasEgg = true;
				Debug.Log("Egg picked up");
			}
		}
	}
	
	if (Input.GetMouseButtonUp(0) && picking)
	{
		picking = false;
		
		canpick = false;
	}
	
	if (Input.GetMouseButtonDown(0) && !canpick && pickObj.GetComponent(pickedupobj).refusethrow != true)
	{
		canpick = true;
		
		pickObj.GetComponent.<Rigidbody>().useGravity = true;
		
		pickObj.GetComponent.<Rigidbody>().isKinematic = false;
		
		pickObj.transform.parent = null;
		
		pickObj.GetComponent.<Collider>().isTrigger = false;
		
		pickObj.GetComponent.<Rigidbody>().AddForce (transform.forward * 5000);
		
		pickObj = pickref;
	}
	
	if (Input.GetMouseButtonDown(1) && !canpick && pickObj.GetComponent(pickedupobj).refusethrow != true)
	{
		canpick = true;
		
		pickObj.GetComponent.<Rigidbody>().useGravity = true;
		
		pickObj.GetComponent.<Rigidbody>().isKinematic = false;
		
		pickObj.transform.parent = null;
		
		pickObj.GetComponent.<Collider>().isTrigger = false;
		
		pickObj = pickref;
		
		canpick = true;
	}
	
}

function OnGUI ()
{
	GUI.Label(Rect(Screen.width/2, Screen.height/2.1, Screen.width/2, Screen.height/2) , "x");
	if(guipick && canpick) {
		GUI.Label(Rect(Screen.width/2, Screen.height/2, Screen.width/2, Screen.height/2), "Pick Up");
	}
}