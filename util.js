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
function parseXml(xml)
{
	//engine = new advenGameEngine.EngineCore();
	
	var xmlString = advenGameEngine.EngineCore.jqueryToString($(xml));
	engine = new advenGameEngine.EngineCore(xmlString);
	graphics = new advenGameEngine.GraphicsUI(document.getElementById("testCanvas"));
	engine.callbackOnExecuteCommand = function(message)
	{
		
		graphics.executeCommand("logAppend","",message);
		graphics.executeCommand("update");
	}
	engine.callbackObjectOnLoad = function(sceneName, objectName, imageUrl)
	{
		graphics.executeCommand("addObject",objectName,"source/images/testSceen/"+imageUrl);
		graphics.executeCommand("update");
		
	}
	engine.callbackSceneOnLoad = function(sceneName, imageUrl)
	{
		graphics.executeCommand("changeBackground",sceneName,"source/images/testSceen/"+imageUrl);
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


