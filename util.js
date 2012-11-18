//When document is loaded call init(). this may occurred before all httpRequests finished
$(document).ready(function(){init();});

var environment;
function init()
{
	$.ajax({
	    type: "GET",
	    url: "scenario.xml",
	    dataType: "xml",
	    success: parseXml
	  });
	//alert(environment);
	//var xml = $.parseXML(environment);
	
	
}
 

function parseXml(xml)
{

	//environment = xmlToString($(xml).find("environment"));
	//alert(environment);
	//xml = $.parseXML(environment);
	
	getInventoryItems(xml, function(xml,name){
		$("#output").append(getInventoryObjectImage(xml,name) + "<br />");
	});
	
}
function getInventoryItems(xml,callback)
{
	 $(xml).find("inventory > item").each(function()
		  {	 
			  callback(xml,$(this).text());
		  });
}
function getInventoryObjectImage(xml,name)
{
	var res;
	$(xml).find("item[name='"+name+"'] > image").each(function()
		  {	
			  res =  $(this).text();
			  return;		    
		  });	
	return res;
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

