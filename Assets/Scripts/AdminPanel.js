public static var gameType = "Nitrous Online";
public static var gameName = "Interview Demo";
public static var adminPanelClicked = false;
public static var masterServerCreated = false;
public static var MasterIp1 = "192.168.0.100";
public static var MasterIp2 = "172.20.1.229";
public static var RemotePort = 25003;
public static var MasterPort = 26000;

public static var btnX = Screen.width * 0.01;
public static var btnY = Screen.height * 0.01;
public static var btnW = Screen.width * 0.3;
public static var btnH = Screen.height * 0.05;

var stringId : String;

var client : ClientNetwork;

var oldLog = new Array();
var newLog = new Array();

var buttonSize = 4;

function OnGUI () {
	if(!masterServerCreated){
		if(adminPanelClicked){
			gameName = GUI.TextField(Rect(btnX, btnY, btnW, btnH),gameName);
			RemotePort = int.Parse(GUI.TextField(Rect(btnX + btnW * 1.04, btnY, btnW, btnH),RemotePort.ToString()));
			
			if(GUI.Button(Rect(btnX + btnW * 2.08, btnY, btnW, btnH), "Add Host")){
				AddHost();
			}
			
			stringId = GUI.TextField(Rect(btnX, btnY * 7, btnW, btnH),stringId);
			
			if(GUI.Button(Rect(btnX + btnW * 1.04, btnY * 7, btnW, btnH), "Delete Host")){
				Debug.Log("Deleting a host");
				DeleteHost(int.Parse(stringId));
			}
			
			if(GUI.Button(Rect(btnX, btnY * 13, btnW, btnH), "Master Server")){
				createMasterServer();
				masterServerCreated = true;
			}
			
			if(GUI.Button(Rect(btnX, btnY * 19, btnW, btnH), "Return")){
				Debug.Log("Returning to main menu");
				adminPanelClicked = false;
				Application.LoadLevel(0);
			}
		}
	}
}

function AddHost () {
	try{
		Network.InitializeServer(32,RemotePort,!Network.HavePublicAddress); 
		MasterServer.RegisterHost(gameType, gameName, "This is a test");
		for (var go : GameObject in FindObjectsOfType(GameObject)){
	 		go.SendMessage("OnLoaded", SendMessageOptions.DontRequireReceiver);	
		}
		Debug.Log("Server is initialized");
	}
	catch(UnityException){
		Debug.Log("Port is already in used, please select a different one");
	}
}

function Update () {
	newLog = client.newLog;
	if(newLog.length != oldLog.length){
		Debug.Log("Receive new request!");
		RunAutoIt();
		Debug.Log(oldLog.length);
		Debug.Log(newLog.length);
		oldLog = newLog;
	}
}

function DeleteHost (Id : int) {
	
}

function OnMasterServerEvent(mse:MasterServerEvent){
	if(mse == MasterServerEvent.RegistrationSucceeded){
		Debug.Log("Registered Server!");
	}
}

function OnApplicationQuit(){
	MasterServer.UnregisterHost();
	Network.Disconnect();
}

function createMasterServer(){
	Network.InitializeServer(32,MasterPort,!Network.HavePublicAddress); 
	MasterServer.RegisterHost(gameType, "Master Server", "This is a test");	
}

function RunAutoIt(){
	if(Application.platform == RuntimePlatform.WindowsEditor){
		var fileLocation = "";
		if(Network.player.ipAddress == "192.168.0.100")
			fileLocation = "C:/MultiplayerProject/Assets/Scripts/IdeaPad.au3";
		else if(Network.player.ipAddress == "172.20.1.229")
			fileLocation = "C:/MultiplayerProject/Assets/Scripts/Kobo.au3";
		System.Diagnostics.Process.Start(fileLocation);
		Debug.Log("Started: " + fileLocation);
	}
}