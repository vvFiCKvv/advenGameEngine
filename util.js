/**
 * @fileOverview A collection of functions
 * @name util
 */
//When document is loaded. this may occurred before all httpRequests finished
$(document).ready(function(){	
	init();
});
var engine;
var graphics;
function init()
{
	$.ajax({
	    type: "GET",
	    url: "scenario.xml",
	    dataType: "xml",
	    success: this.parseXml
	  });
	return this;
	
}
//TODO: Split game xml to multiple files, one per scene
function parseXml(xml)
{
	var xmlString = advenGameEngine.EngineCore.jqueryToString($(xml));
	engine = new advenGameEngine.EngineCore(xmlString);
	graphics = new advenGameEngine.GraphicsUI(document.getElementById("testCanvas"));
	graphics.preloadImages(engine.images());
	

		
	engine.callbackInventoryObjectAdd = function(name,imageUrl)
	{
			graphics.executeCommand("addInventoryObject",name,imageUrl);
			graphics.executeCommand("update");
	}
	engine.callbackInventoryObjectRemove = function(name)
	{
			graphics.executeCommand("removeInventoryObject",name);
	}
	graphics.callbackObjectOnPress = function(element)
	{
		engine.eventOccurred(element.type,"","onClick",element.name);

	}
	graphics.callbackInventorySelect = function(element)
	{
		engine.eventOccurred(element.type,"","onDeselect","all");
		engine.eventOccurred(element.type,"","onSelect",element.name);
	}
	graphics.callbackInventoryCompine = function(element)
	{
		engine.eventOccurred(element.type,"","onSelect",element.name);
		engine.eventOccurred(element.type,"","onInteract","");
		engine.eventOccurred(element.type,"","onDeselect",element.name);
	}
	engine.callbackOnExecuteCommand = function(message)
	{
		
		graphics.executeCommand("logAppend","",message);
		graphics.executeCommand("update");
	}
	engine.callbackObjectOnLoad = function(sceneName, objectName, imageUrl)
	{
		graphics.executeCommand("addObject",objectName,imageUrl);
		
			graphics.executeCommand("addObject","arrow","source/images/testSceen/Arrow.gif");
			graphics.executeCommand("update");
			graphics.executeCommand("moveObject","arrow","10%,50%,90");
			graphics.executeCommand("update");
		
	}
	engine.callbackSceneOnLoad = function(sceneName, imageUrl)
	{
		graphics.executeCommand("changeBackground",sceneName,imageUrl);
		graphics.executeCommand("update");
		
	}
	engine.callbackChangeObjectVisibility = function(sceneName, objectName,status)
	{
		graphics.executeCommand("changeObjectVisibility",objectName,status);
		graphics.executeCommand("update");
	}
	//	engine.loadXmlString(xmlString);
	engine.runPause();
	
	//graphics.runTest01();
	/*graphics.executeCommand("changeBackground","bg","source/images/testSceen/Room_01_wall01_Full_Light1.jpg");
	graphics.executeCommand("addObject","name","source/images/testSceen/sirtati_01_closed.gif");
	graphics.executeCommand("update");
	*/
}


