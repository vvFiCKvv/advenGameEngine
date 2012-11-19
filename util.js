
//When document is loaded. this may occurred before all httpRequests finished
$(document).ready(function(){	
	init();
});
var engine;
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
	//	engine.loadXmlString(xmlString);
	engine.runPause();
}


