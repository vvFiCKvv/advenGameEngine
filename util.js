
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
    var xmlString = "";
    if (window.ActiveXObject){ 
        xmlString = xmlData.xml; 
      } else {
        var oSerializer = new XMLSerializer(); 
        for(var i=0;i<xmlData.length;i++)
        {
        xmlString += oSerializer.serializeToString(xmlData[i]);
	}
      } 
    return xmlString;
}
