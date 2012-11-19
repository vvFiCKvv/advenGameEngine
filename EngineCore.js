//namespace:
this.advenGameEngine = this.advenGameEngine||{};
(function() {
	
	
		/**
		 * The EngineCore allows you to .... 
		 * @class EngineCore
		 * @constructor
		 **/
		var EngineCore = function(xml) {
		  this.initialize(xml);
		}
	var p = EngineCore.prototype;
	//static public properties:
	
	/**
	 * An identity matrix, representing a null transformation. Read-only.
	 * @property xmlString
	 * @static
	 * @type engineCore
	 **/
	EngineCore.xmlString = "";
	//constructor:
	/**
	 * Initialization method.
	 * @method initialize
	 * @protected
	 * @return {engineCore} This game engine.
	*/
	p.initialize = function(xml) {
		this.xmlString = xml;
	}
	//public methods:
	/**
	 * Concatenates the specified matrix properties with this matrix. All parameters are required.
	 * @method prepend
	 * @param {Number} a
	 * @return This game engine. Useful for chaining method calls.
	 **/
	p.run = function(a) {
		return this._runTest();
	}
	
	//=================================Initializing Functions========================================
	 p._runTest = function()
	{
		
		var xml = $(this.xmlString);
		parentThis = this;		
		this.inventoryCombineItems(xml,"flashLightBroken","battery",function(interction){
			$(interction).find("command").each(function(){
				
				var messages=$(this).find("message");
				var rand = randomGen(0,messages.length);
				var msg = messages[rand-1];	
				parentThis.executeCommand(xml,interction,$(this).attr("name"),$(this).attr("data"),$(msg).text())
				
			});
		
		});
		this.inventoryGetItems(xml, function(xml,name){
			$("#output").append(parentThis.getObjectImage(xml,name) + "<br />");
		});
	
	
	}
	//=================================General Functions========================================
	p.executeCommand = function (xml,sender,command,data,message)
	{
		console.log("command name:"+ command +" data: "+ data +" msg: "+ message);
		if(command=="inventoryAdd")
		{
			this.inventoryObjectAdd(xml,data);
		}
		if(command=="inventoryRemove")
		{
			this.inventoryObjectRemove(xml,data);
		}
		if(command=="changeState")
		{
			//TODO:
			//objectChangeState(xml,data);
		}
	}
	//=================================Inventory Functions========================================
	p.inventoryObjectAdd = function (xml, name)
	{
		var item = $("<item name=\""+name+"\">");
		$(xml).find("runtime inventory").prepend(item);
	}
	p.inventoryObjectRemove = function (xml, name)
	{
		$(xml).find("inventory > item[name='"+name+"']").each(function()
				{	 
					$(this).remove();
				});
	}
	p.inventoryCombineItems = function (xml, name1, name2, callback)
	{
		var result = false;
		var foundItem=null;
		$(xml).find("inventory > objects > interaction").each(function()
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
	p.inventoryGetItems = function (xml,callback)
	{
		 $(xml).find("inventory > item").each(function()
			  {	 
				  callback(xml,$(this).attr("name"));
			  });
	}
	//=================================Object Functions========================================
	p.getObjectImage = function (xml,name)
	{
		var res;
		$(xml).find("inventory > objects > item[name='"+name+"']").each(function()
			  {	
				  res =  $(this).children().attr('url');
				  return;		    
			  });
		return res;
	}

	//=================================Auxiliary Functions========================================
	
	function randomGen (minimum, maximum)
	{
	    var bool = true;
	    while(bool) {
	    var number = (Math.floor(Math.random()*maximum+1)+minimum);
	        if (number > 20) {bool = true;}
	        else {bool = false;}}
	    return number;
	 }
	function xmlFindConsoleLog(xml,srt)
	{
		console.log(xmlToString($(xml).find(srt)));
	}

advenGameEngine.EngineCore = EngineCore;
}());


