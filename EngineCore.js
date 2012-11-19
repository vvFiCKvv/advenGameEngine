//=================================NameSpace==========================================
this.advenGameEngine = this.advenGameEngine||{};
(function() {
	
	//=================================constructors===================================
	/**
	 * The EngineCore allows you to handle a given xml scenario. 
	 * Given some events it can run it. 
	 * @class EngineCore
	 * @constructor
	 **/
	var EngineCore = function() {
		this._initialize();
	}
		/**
	 * The EngineCore allows you to handle a given xml scenario. 
	 * Given some events it can run it. 
	 * @class EngineCore
	 * @param {String} scenario xml string
	 * @constructor
	 **/
	var EngineCore = function(xml) {
		this._initialize(xml);
	}
	var p = EngineCore.prototype;
	//================================public static properties=========================
	
	/**
	 * The current Scenario of the game (see prototyoe http://...).
	 * @property xmlString
	 * @static
	 * @type engineCore
	**/
	EngineCore.Version = "v001a2";
	
	//================================public properties================================
	
	/**
	 * The current Scenario of the game (see prototyoe http://...).
	 * @property xmlString
	 * @static
	 * @type engineCore
	**/
	p.xmlString;
	
	//=============================public static methods===============================
	/**
	 * Converts a jquery xml object to xml string
	 * @method xmlToString
	 * @return current state
	 **/
	EngineCore.jqueryToString = function (xmlData)
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
	//=================================public methods=================================
	/**
	 * Pause/run the GameEngine
	 * @method runPause
	 * @return current state
	 **/
	p.runPause = function() {
		p.isRunning = !p.isRunning;
		if(p.isRunning)
			this._runTest();
		return p.isRunning ;
	}
	/**
	 * Loads an scenario from xml string
	 * @method loadXmlString
	 **/
	p.loadXmlString = function(xml)
	{
		this.xmlString = xml;
	}
	//==================General Functions====================
	/**
	 * .
	 * @method executeCommand
	 * @param {Number} 
	 * @return 
	 **/
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
	//===============Inventory Functions=====================
	/**
	 * .
	 * @method inventoryObjectAdd
	 * @param {Number} 
	 * @return 
	 **/
	p.inventoryObjectAdd = function (xml, name)
	{
		var item = $("<item name=\""+name+"\">");
		$(xml).find("runtime inventory").prepend(item);
	}
	/**
	 * .
	 * @method inventoryObjectRemove
	 * @param {Number} 
	 * @return 
	 **/
	p.inventoryObjectRemove = function (xml, name)
	{
		$(xml).find("inventory > item[name='"+name+"']").each(function()
				{	 
					$(this).remove();
				});
	}
	/**
	 * .
	 * @method inventoryCombineItems
	 * @param {Number} 
	 * @return 
	 **/
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
	/**
	 * .
	 * @method inventoryGetItems
	 * @param {Number} 
	 * @return 
	 **/
	p.inventoryGetItems = function (xml,callback)
	{
		 $(xml).find("inventory > item").each(function()
			  {	 
				  callback(xml,$(this).attr("name"));
			  });
	}
	//===================Object Functions====================
	/**
	 * .
	 * @method getObjectImage
	 * @param {Number} 
	 * @return 
	 **/
	p.getObjectImage = function (xml,name)
	{
		var xmltxt = EngineCore.jqueryToString(xml);
		var res;
		$(xml).find("inventory > objects > item[name='"+name+"'] > image").each(function()
			  {	
				  res =  $(this).attr('url');
				  return;		    
			  });
		return res;
	}
	//=================================private methods=================================
	//================nitializing Functions==================
	/**
	 * General initialization method.
	 * @method initialize
	 * @protected
	 * @return {engineCore} This game engine.
	*/
	p._initialize = function() {
		return this;
	}
	/**
	 * Initialization method. input an xml string (see prototyoe http://...)
	 * @method initialize
	 * @protected
	 * @return {engineCore} This game engine.
	*/
	p._initialize = function(xmlString) {
		this.loadXmlString(xmlString);
		return this;
	}
	 p._runTest = function()
	{
		
		var xml = $($.parseXML(this.xmlString));
		
		
		
		parentThis = this;		
		this.inventoryCombineItems(xml,"flashLightBroken","battery",function(interction){
			$(interction).find("command").each(function(){
				
				
				var messages=$(this).find("message");
				var rand = EngineCore._randomGen(0,messages.length);
				var msg = messages[rand-1];	
				parentThis.executeCommand(xml,interction,$(this).attr("name"),$(this).attr("data"),$(msg).text())
				
			});
		
		});
		this.inventoryGetItems(xml, function(xml,name){
			$("#output").append(parentThis.getObjectImage(xml,name) + "<br />");
		});
	
	
	}
	p.isRunning = false;
	//=================Auxiliary Functions===================	
	EngineCore._randomGen = function (minimum, maximum)
	{
	    var bool = true;
	    while(bool) {
	    var number = (Math.floor(Math.random()*maximum+1)+minimum);
	        if (number > 20) {bool = true;}
	        else {bool = false;}}
	    return number;
	 }
	EngineCore._xmlFindConsoleLog = function(xml,srt)
	{
		console.log(xmlToString($(xml).find(srt)));
	}


advenGameEngine.EngineCore = EngineCore;
}());


