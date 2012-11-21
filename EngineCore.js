/**
 * Adventure GameEngine.
 * @namespace
*/
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
	
	/**
	@class description
	*/
	var p = EngineCore.prototype;
	//================================public static properties=========================
	
	/**
	 * The current Scenario of the game (see prototyoe http://...).
	 * @property xmlString
	 * @static
	 * @type string
	**/
	EngineCore.Version = "v001a2";
	
	//================================public properties================================
	
	/**
	 * The current Scenario of the game (see prototyoe http://...).
	 * @property gameXml
	 * @static
	 * @memberOf advenGameEngine.EngineCore#
	 * @type jquery
	**/
	p.gameXml;
	
	//=============================public static methods===============================
	/**
	 * Converts a jquery xml object to xml string
	 * @method xmlToString
	 * @param {Jquery} xmlData 
	 * @memberOf advenGameEngine.EngineCore
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
	 * @memberOf advenGameEngine.EngineCore#
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
	 * @param {Number} xml
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.loadXmlString = function(xml)
	{
		this.gameXml = $.parseXML(xml);
	}
	//==================General Functions====================
	/**
	 * Executes A given command
	 * @method executeCommand
	 * @param {String} target the target name
	 * @param {String} command the the given command
	 * @param {String} data the data
	 * @param {String} message the message
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.executeCommand = function (target,command,data,message)
	{
/*TODO: create new event when changing scene/object states.
		 *  this will go to the below functions but first we need to stabilize
		 *  the arguments of this and the parse event function*/  
		console.log("command name:"+ command +" data: "+ data +" msg: "+ message);
		if(command=="inventoryAdd")
		{
			this.inventoryObjectAdd(data);
		}
		else if(command=="inventoryRemove")
		{
			this.inventoryObjectRemove(data);
		}
		else if(command=="changeObjectState")
		{
//TODO:must change target equals 'this' to correct one before call executeCommand 
			this.objectChangeState(target,data);
		}
		else if(command=="changeScene")
		{
			this.gameChangeScene(data);
		}else if(command=="changeBackgroundState")
		{
			this.sceneChangeState(data);
		}
		else if(command=="changeObjectVisibility")
		{
//TODO:must change target equals 'all' to correct one before call executeCommand 
//if target equal all for each object of a scene
			this.objectChangeVisibility(target,data);
		}
		else if(command=="conditionSet")
		{
			var cname = $(data).attr("name");
			var cstatus =  $(data).attr("status");
			if(cstatus=="true")
			{
				this.conditionSet(cname,true);
			}
			else
			{
				this.conditionSet(cname,false);
			}
			
		}
//TODO:Add xml prototype for variables
		//callback(message)
	}

	/**
	 * Loads a given jquery scene into the game xml.
	 * @method parseScene
	 * @param {Jquery} jqueryScene a given jquery representing a scene of the game.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.parseScene = function(jqueryScene){
		var xml =  this.gameXml;
		var parentThis = this;
		$(jqueryScene).find("scene").each(function()
		{
			var sceneName =  $(this).attr('name');
			if($(this).attr("default")=="true")
			{
				parentThis.gameChangeScene(sceneName);
			}
			$(this).find("background > state[default=\"true\"]").each(function()
			{		
				//add 
				var stateName=$(this).attr("name");
				var toAddString="<scene name=\""+sceneName+"\" backgroundState=\""+stateName+"\"/>";
				$(xml).find("runtime > scenes").prepend($(toAddString));			
			});	  
			$(this).find("objects > object").each(function()
			{		
				parentThis.parseObject($(this),sceneName);
			});	    
		});
	}
	/**
	 * Loads a given jquery object into in the game xml. And assign it to a given scene
	 * @method parseScene
	 * @param {Jquery} jqueryObject a given jquery representing a scene of the game.
	 * @param {String} sceneName a given name of a scene to assign the object.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.parseObject= function(jqueryObject,sceneName){
		var xml =  this.gameXml;
		var parentThis = this;
		var objectName = $(jqueryObject).attr("name");
		$(jqueryObject).find("state[default=\"true\"]").each(function()
		{		
			//add 
			var stateName=$(this).attr("name");
			var toAddString="<object name=\""+objectName+"\" state=\""+stateName+"\" visibility=\"true\" owner=\""+sceneName+"\"/>";
			$(xml).find("runtime > objects").prepend($(toAddString));				
		});
			      
	}
	//===============Inventory Functions=====================
	/**
	 * Adds an item to the inventory
	 * @method inventoryObjectAdd
	 * @memberOf advenGameEngine.EngineCore#
	 * @param {String} name The name of the item to add.
	 **/
	p.inventoryObjectAdd = function (name)
	{
		var xml = this.gameXml;
		var item = $("<item name=\""+name+"\">");
		$(xml).find("runtime > inventory > available").prepend(item);
	}
	/**
	 * Deletes an item from the inventory
	 * @method inventoryObjectRemove
	 * @param {String} name The name of the item to delete.
	 * @return true if succeed otherwise false
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryObjectRemove = function (name)
	{
		var status = false;
		var xml =  this.gameXml;
		$(xml).find(" runtime > inventory > available > item[name='"+name+"']").each(function()
				{	 
					$(this).remove();
					status=true;
				});
		this.inventoryObjectDeselect(name);
		return status;
	}
	/**
	 * Adds an item to the inventory
	 * @method inventoryObjectAdd
	 * @memberOf advenGameEngine.EngineCore#
	 * @param {String} name The name of the item to add.
	 **/
	p.inventoryObjectSelect = function (name)
	{
		var xml =  this.gameXml;
		var item = $("<item name=\""+name+"\">");
		$(xml).find("runtime > inventory > selected").prepend(item);
	}
	/**
	 * Deletes an item from the inventory
	 * @method inventoryObjectRemove
	 * @param {String} name The name of the item to delete.
	 * @return true if succeed otherwise false
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryObjectDeselect = function (name)
	{
		var status = false;
		var xml = this.gameXml;
		$(xml).find(" runtime > inventory > selected > item[name='"+name+"']").each(function()
				{	 
					$(this).remove();
					status=true;
				});
		return status;
	}
	/**
	 * Checks if an given item is selected
	 * @method inventoryIsItemSelected
	 * @param {String} name The name of item to check.
	 * @return true if given item is selected, otherwise false
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryIsItemSelected = function(name)
	{
		var contition = false;
		var xml = this.gameXml;
		$(xml).find("runtime > inventory > selected >  item[name='"+name+"']").each(function()
		{
			contition = true;
		});
		return contition;
	}
	/**
	 * .
	 * @method inventoryCombineItems
	 * @param {String} name1 
	 * @param {String} name2 
	 * @param {Function} callback
	 * @return 
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryCombineItems = function ()
	{
		var xml =  this.gameXml;
		var result = false;
		var foundItem=null;
		var parentThis = this;
		$(xml).find("inventory > objects > action[event='onInteract']").each(function()
				{
					var contitions = false;
					$(this).find("requires > item").each(function()
					{
						if(parentThis.inventoryIsItemSelected($(this).attr("name")))
						{
							contitions =true;
						}else
						{
							contitions = false;
							return;
						}
					});
					if(contitions==false)
						return;
					$(this).find("requires > condition").each(function()
					{
						if(!parentThis.conditionCheck($(this).attr("name")))
						{
							contitions =false;
							return;
						}
					});
					if(contitions)
						{
							foundItem = $(this);
							result = true;
							return;
						}
				});
		var parentThis = this;
		if(foundItem)	//execute commands
		{
			$(foundItem).find("command").each(function(){	
				var messages=$(this).find("message"); //choose a random message 
				var rand = EngineCore._randomGen(0,messages.length);
				var cmsg = messages[rand-1];	
				var cname=$(this).attr("name");
				var cdata=$(this).attr("data");
				if(cdata==null)
				{
					cdata = EngineCore.jqueryToString($(this).children());
				}
				
				parentThis.executeCommand(foundItem,cname,cdata,$(cmsg).text());
				
			});
		}
		return result;
	}
	//==============conditions Functions=====================
	/**
	 * Checks if a given condition is satisfied
	 * @method inventoryIsItemSelected
	 * @param {String} name The condition name.
	 * @return true if given condition is satisfied, otherwise false
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.conditionCheck = function(name)
	{
		var contition = false;
		var xml =  this.gameXml;
		 $(xml).find("runtime > conditions > condition[name='"+name+"']").each(function()
			  {	 
				  if($(this).attr("status")=="true")
				  {
					  contition = true;
					  return;
				  }
			  });
		return contition;
	}
	/**
	 * Set the status of a given condition.
	 * @method inventoryIsItemSelected
	 * @param {String} name The condition name.
	 * @param {Boolean} name The condition status.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.conditionSet = function(name,status)
	{
		var contitionExist = false;
		var xml =  this.gameXml;
		 $(xml).find("runtime > conditions > condition[name='"+name+"']").each(function()
			  {	 
				  contitionExist = true;
				  $(this).attr("status", status.toString());
			  });
		if(!contitionExist)
		{
			var item = $("<condition name=\""+name+"\" status=\""+status.toString()+"\">");
			$(xml).find("runtime > conditions").prepend(item);	
		}
	}
	/**
	 * .
	 * @method eventOccurred
	 * @param {Function} callback
	 * @return 
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.eventOccurred = function(sender,type,event, data)
	{
//TODO:Implementation missing
		return;
	}
	/**
	 * .
	 * @method inventoryGetItems
	 * @param {Function} callback
	 * @return 
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryGetItems = function (callback)
	{
		var xml = this.gameXml;
		 $(xml).find("runtime > inventory > available > item").each(function()
			  {	 
				  callback($(this).attr("name"));
			  });
	}
	//===================Object Functions====================
	/**
	 * .
	 * @method getObjectImage
	 * @param {String} name
	 * @return 
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.getObjectImage = function (name)
	{
		var xml = this.gameXml;
		var res;
		$(xml).find("inventory > objects > item[name='"+name+"'] > image").each(function()
			  {	
				  res =  $(this).attr('url');
				  return;		    
			  });
		return res;
	}
	/**
	 * Change the state of a given object
	 * @method getObjectImage
	 * @param {String} target The name of given object.
	 * @param {String} target The name of new state.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.objectChangeState = function(target,state)
	{
		$(this.gameXml).find("runtime > objects > object[name=\""+target+"\"]").attr("state",state);
	}
	/**
	 * Change the visibility status of a given object
	 * @method getObjectImage
	 * @param {String} target The name of given object.
	 * @param {String} target The name of new status.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.objectChangeVisibility = function(target,status)
	{
		$(this.gameXml).find("runtime > objects > object[name=\""+target+"\"]").attr("visibility",status);
	}
	//===================Scene Functions====================
	/**
	 * Change the state of a given scene
	 * @method getObjectImage
	 * @param {String} target The name of given scene.
	 * @param {String} target The name of new state. 
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.sceneChangeState= function(target,state)
	{
		$(this.gameXml).find("runtime > scenes > scene[name=\""+target+"\"]").attr("state",state);
	}
	/**
	 * Change the scene of the game
	 * @method getObjectImage
	 * @param {String} scene The name of scene to load.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.gameChangeScene = function (scene)
	{
		$(this.gameXml).find("runtime > scenes").attr("active",scene);
	}
	//=================================private methods=================================
	//================nitializing Functions==================
	/**
	 * General initialization method.
	 * @method initialize
	 * @protected
	 * @return {engineCore} This game engine.
	**/
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
		this.parseScene($(this.gameXml).find("game > scenes"));
		return this;
	}
	 p._runTest = function()
	{

		var xml = this.gameXml;
		//prints runtime in console!
		EngineCore._xmlFindConsoleLog(xml,"runtime");
					
		this.inventoryObjectAdd("flashLightBroken");
		this.inventoryObjectAdd("battery");
		this.inventoryObjectAdd("screwDriver");
		this.inventoryObjectSelect("flashLightBroken");
		this.inventoryObjectSelect("battery");
		//this.inventoryObjectDeselect("battery");
		this.conditionSet("condition_darkRoom",true);
		this.inventoryCombineItems();
		
		this.executeCommand("sirtati_01","changeObjectState","opened","changing state...")
		
		this.objectChangeVisibility("sirtati_01","false");
		//prints runtime in console!
		EngineCore._xmlFindConsoleLog(xml,"runtime");
		
		//prints image url for each inventory items.
		parentThis = this;	
		this.inventoryGetItems(function(name){
			$("#output").append(parentThis.getObjectImage(name) + "<br />");
		});
		
		
		
		
	
	}
//TODO:Implementation missing
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
		res = $(xml).find(srt);
		console.log(EngineCore.jqueryToString(res));
	}

/** @namespace */
advenGameEngine.EngineCore = EngineCore;
}());


