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
 
function xmlFindAlert(xml,srt)
{
	alert(xmlToString($(xml).find(srt)));
}

function parseXml(xml)
{
	combineInventoryItems(xml,"flashLightBroken","battery",function(interction){
		
			$(interction).find("command").each(function(){
				
				var messages=$(this).find("message");
				var rand = randomGen(0,messages.length);
				var msg = messages[rand-1];	
				executeCommand(xml,$(this).attr("name"),$(this).attr("data"),$(msg).text())
				
			});
		
		});
	
	getInventoryItems(xml, function(xml,name){
		$("#output").append(getInventoryObjectImage(xml,name) + "<br />");
	});
	
	
	
}
function executeCommand(xml,name,data,message)
{
	$("#output").append("command name:"+ name +" data: "+ data +" msg: "+ message+"<br>");
	if(name=="inventoryAdd")
	{
		addInventoryObject(xml,data);
	}
	if(name=="inventoryRemove")
	{
		removeInventoryObject(xml,data);
	}
	
}
function addInventoryObject(xml, name)
{
	//TODO: Didnt work!
	var inventory = $(xml).find("environment inventory");
	var item = "<item name=\""+name+"\">";
	//alert(xmlToString(inventory));
	inventory.prepend(item);
	//alert(xmlToString(inventory));
}
function removeInventoryObject(xml, name)
{
	$(xml).find("inventory > item[name='"+name+"']").each(function()
			{	 
				$(this).remove();
			});
}
function combineInventoryItems(xml, name1, name2, callback)
{
	var result = false;
	var foundItem=null;
	$(xml).find("objects > interaction").each(function()
			{
				var item1 = $(this).find("item[name='"+name1+"']");
				var item2 = $(this).find("item[name='"+name2+"']");
				if(item1.length  && item2.length )
					{
						//TODO:missing condition check
						foundItem = $(this);
						result = true;
						return;
					}
			});
	if(foundItem)
		callback(foundItem);
	return result;
}
function getInventoryItems(xml,callback)
{
	 $(xml).find("inventory > item").each(function()
		  {	 
			  callback(xml,$(this).attr("name"));
		  });
}
function getInventoryObjectImage(xml,name)
{
	var res;
	$(xml).find("item[name='"+name+"'] > image").each(function()
		  {	
			  res =  $(this).attr('url');
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
function randomGen (minimum, maximum)
{
    var bool = true;
    while(bool) {
    var number = (Math.floor(Math.random()*maximum+1)+minimum);
        if (number > 20) {bool = true;}
        else {bool = false;}}
    return number;
 }

