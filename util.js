
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
	engine = new advenGameEngine.EngineCore(xmlToString($(xml)));
	
	engine.run();
}

function xmlToString(xmlData) 
{
    var xmlString;
    if (window.ActiveXObject){ 
        xmlString = xmlData.xml; 
      } else {
        var oSerializer = new XMLSerializer(); 
        xmlString = oSerializer.serializeToString(xmlData[0]);
      } 
    return xmlString;
}