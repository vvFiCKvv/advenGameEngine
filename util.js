//When document is loaded call init(). this may occurred before all httpRequests finished
$(document).ready(function(){init();});

function init()
{
	$.ajax({
	    type: "GET",
	    url: "scenario.xml",
	    dataType: "xml",
	    success: parseXml
	  });
}

function parseXml(xml)
{
	printInventoryItems(xml);
}
function printInventoryItems(xml)
{

	 $(xml).find("inventory > item").each(function()
		  {	
			  var res = getInventoryObjectImage(xml,$(this).text());
			  $("#output").append(res + "<br />");
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


