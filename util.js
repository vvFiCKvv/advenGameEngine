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
	engine.callbackInventoryObjectAdd = function(name,imageUrl)
	{
			graphics.executeCommand("addInventoryObject",name,imageUrl);
			//graphics.executeCommand("update");
	}
	engine.callbackInventoryObjectRemove = function(name)
	{
			graphics.executeCommand("removeInventoryObject",name);
	}
	engine.callbackOnExecuteCommand = function(message)
	{		
		graphics.executeCommand("logAppend","",message);
	}
	engine.callbackObjectOnLoad = function(sceneName, objectName, imageUrl,locationX,locationY,rotation)
	{
		graphics.executeCommand("addObject",objectName,imageUrl);
		var locString = advenGameEngine.GraphicsUI.locationString(locationX,locationY,rotation);
		graphics.executeCommand("moveObject",objectName,locString);
		
	}
	engine.callbackPathwayOnLoad = function(name, imageUrl,locationX,locationY,rotation)
	{
		graphics.executeCommand("addPathway",name,imageUrl);
		var locString = advenGameEngine.GraphicsUI.locationString(locationX,locationY,rotation);
		graphics.executeCommand("moveObject",name,locString);
	}
	engine.callbackSceneOnLoad = function(sceneName, imageUrl)
	{
		graphics.executeCommand("changeBackground",sceneName,imageUrl);
		
	}
	engine.callbackObjectVisibilityChange = function(sceneName, objectName,status)
	{
		graphics.executeCommand("changeObjectVisibility",objectName,status);
	}
	engine.callbackPathwayVisibilityChange = function(name, status)
	{
		graphics.executeCommand("changeObjectVisibility",name,status);
	}
	engine.runPause();
	
}


