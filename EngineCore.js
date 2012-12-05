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
	/**
	 * callback function(message) called when a command is executed.
	 * arguments: message is the message defined in the xml scenario.
	 * @property callbackOnExecuteCommand
	 * @static
	 * @memberOf advenGameEngine.EngineCore#
	 * @type jquery
	**/
	p.callbackOnExecuteCommand;
	/**
	 * callback function(sceneName,objectName,imageUrl) called when an object is loaded.
	 * arguments: scene name, object name, image url.
	 * @property callbackOnExecuteCommand
	 * @static
	 * @memberOf advenGameEngine.EngineCore#
	 * @type jquery
	**/
	p.callbackObjectOnLoad;
	/**
	 * callback function(sceneName,objectName,imageUrl) called when an object is loaded.
	 * arguments: scene name, image url.
	 * @property callbackOnExecuteCommand
	 * @static
	 * @memberOf advenGameEngine.EngineCore#
	 * @type jquery
	**/
	p.callbackObjectVisibilityChange;
	
	p.callbackPathwayOnLoad;
	/**
	 * callback function(sceneName,objectName,imageUrl) called when an object is loaded.
	 * arguments: scene name, image url.
	 * @property callbackOnExecuteCommand
	 * @static
	 * @memberOf advenGameEngine.EngineCore#
	 * @type jquery
	**/
	p.callbackPathwayVisibilityChange;
	
	p.callbackSceneOnLoad;
	p.callbackInventoryObjectAdd;
	p.callbackInventoryObjectRemove;
	
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
//TODO: put isRunning as attribute to runtime
		p.isRunning = !p.isRunning;
		if(p.isRunning)
		{
			this.parseScene($(this.gameXml).find("game > scenes"));
			this.parsePathways($(this.gameXml).find("game > pathways"));
			this._runTest();
		}
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
//TODO: add Documentation
	p.imageGetUrl = function (image)
	{
		var imageUrl="";
		var i=0;
		var node = image;
		do
		{
			var url = node.attr("url");
			if(url)
			{
				imageUrl= url+ imageUrl; 
			}
			node=node.parent();
			if(i++>=10)
				break;
        }while(node!=null)
		return imageUrl;
	}
	 p.images = function()
	 {
		 var result = new Array();
		 var i=0;
		 var parentThis = this;
		 $(this.gameXml).find("image").each(function()
			  {	
				  var url = parentThis.imageGetUrl($(this));
				  result[i++] = url;
			  });
		 return result;
	 }
	//==================General Functions====================
	/**
	 * Executes A given command
	 * @method executeCommand
	 * @param {String} target the target name (scene.object)
	 * @param {String} command the the given command
	 * @param {String} data the data
	 * @param {String} message the message
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.executeCommand = function (target,command,data,message)
	{
//		console.log("executeCommand==command name:"+ command +" data: "+ data +" msg: "+ message);
		var parentThis = this;
		var sceneName="";
		var objectName="";
		targetArray=target.split(",");
		targetArray.forEach(function(entry) {
			var targetNode = entry.split(".");
			if(targetNode.length==2)
			{
				sceneName=targetNode[0];
				objectName=targetNode[1];
			}
			else
			{
				sceneName=(parentThis.gameGetCurrentScene());
				objectName=targetNode[0];
			}
			if(message!="")
				parentThis.callbackOnExecuteCommand(message);
			if(command=="inventoryAdd")
			{
				var imageUrl = parentThis.inventoryObjectGetImage(data);
				parentThis.callbackInventoryObjectAdd(data,imageUrl);
				parentThis.inventoryObjectAdd(data)
			}
			else if(command=="inventoryRemove")
			{
				parentThis.callbackInventoryObjectRemove(data);
				parentThis.inventoryObjectRemove(data);
			}
			else if(command=="changeObjectState")
			{
				
				parentThis.objectChangeState(sceneName,objectName,data);
			}
			else if(command=="changeScene")
			{
				parentThis.gameChangeScene(data);
			}else if(command=="changeBackgroundState")
			{
				parentThis.sceneChangeState(sceneName,data);
			}
			else if(command=="changeObjectVisibility")
			{
				parentThis.objectChangeVisibility(sceneName,objectName,data);
				parentThis.callbackObjectVisibilityChange(sceneName,objectName,data);
			}
			else if(command=="conditionSet")
			{
				var cname = $(data).attr("name");
				var cstatus =  $(data).attr("status");
				if(cstatus=="true")
				{
					parentThis.conditionSet(cname,true);
				}
				else
				{
					parentThis.conditionSet(cname,false);
				}
				
			}
			else if(command=="codeCheck")
			{
//TODO: callback codeCheck
			}
		});
//TODO:Add xml prototype for variables
	}
	/**
	 * Loads a given jquery pathways into the game xml.
	 * @method parseScene
	 * @param {Jquery} jqueryScene a given jquery representing the pathways of the game.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.parsePathways = function(jqueryScene)
	{
		var parentThis = this;
		$(jqueryScene).find("direction").each(function()
		{
//TODO: fix callbackPathwayVisibilityChange false on scene load fix callbackPathwayVisibilityChange correctly
			var name = $(this).attr("name");
			var imageUrl =  parentThis.imageGetUrl($(this).find("image"));
//TODO: correct location for objects.
			var location =  $(this).find("location");
//TODO: separate onload and events Occurred.
			parentThis.callbackPathwayOnLoad(name,imageUrl,$(location).attr("x"),$(location).attr("y"),$(location).attr("rotation"));
			parentThis.callbackPathwayVisibilityChange(name,"true");
		});
	}
	
	/**
	 * Loads a given jquery scene into the game xml.
	 * @method parseScene
	 * @param {Jquery} jqueryScene a given jquery representing a scene of the game.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.parseScene = function(jqueryScene)
	{
		var xml =  this.gameXml;
		var parentThis = this;
		var defaultScene="";
		$(jqueryScene).find("scene").each(function()
		{
			var sceneName =  $(this).attr('name');			
			$(this).find("background > states > state[default=\"true\"]").each(function()
			{		
				//add 
				var stateName=$(this).attr("name");
				var toAddString="<scene name=\""+sceneName+"\"><background state=\""+stateName+"\"/></scene>";
				$(xml).find("runtime > scenes").prepend($(toAddString));	
			});	  
			$(this).find("objects > object").each(function()
			{		
				parentThis.parseObject($(this),sceneName);
			});	 
			if($(this).attr("default")=="true")
			{
				defaultScene = sceneName;
			}   
		});
		this.gameChangeScene(defaultScene);
	}
	/**
	 * Loads a given jquery object into in the game xml. And assign it to a given scene
	 * @method parseObject
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
		var item = $("<item name=\""+name+"\">");
		if(this.inventoryIsItemAvailable(name))
			return;
		$(this.gameXml).find("runtime > inventory > available").prepend(item);
	}
	/**
	 * Checks if an item is available in the inventory.
	 * @method inventoryObjectAdd
	 * @memberOf advenGameEngine.EngineCore#
	 * @param {String} name The name of the item to check.
	 **/
	p.inventoryIsItemAvailable = function (name)
	{
		var res=false;
		$(this.gameXml).find(" runtime > inventory > available > item[name='"+name+"']").each(function()
			{	 
				//already exist
			res=true;
			});
		return res;
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
		$(this.gameXml).find(" runtime > inventory > available > item[name='"+name+"']").each(function()
				{	 
					$(this).remove();
					status=true;
				});
		this.inventoryObjectDeselect(name);
		return status;
	}
	/**
	 * Selects an item from the inventory.
	 * @method inventoryObjectSelect
	 * @memberOf advenGameEngine.EngineCore#
	 * @param {String} name The name of the item to select.
	 **/
	p.inventoryObjectSelect = function (name)
	{
		var parentThis = this;
		if(name=="all")
		{
			$(this.gameXml).find("inventory > objects > item").each(function()
			{
				parentThis.inventoryObjectSelect($(this).attr("name"));
			});
			return;
		}
		
		if(this.inventoryIsItemSelected(name)) //already selected
			return;
		var item = $("<item name=\""+name+"\">");
		$(this.gameXml).find("runtime > inventory > selected").prepend(item);
	}
	/**
	 * Deselect an item from the inventory
	 * @method inventoryObjectDeselect
	 * @param {String} name The name of the item to deselect.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryObjectDeselect = function (name)
	{
		var parentThis = this;
		if(name=="all")
		{
			$(this.gameXml).find("inventory > objects > item").each(function()
			{
				parentThis.inventoryObjectDeselect($(this).attr("name"));
			});
			return;
		}
		$(this.gameXml).find(" runtime > inventory > selected > item[name='"+name+"']").each(function()
		{	 
			$(this).remove();
		});
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
		if(name=="")
			return false;
		$(this.gameXml).find("runtime > inventory > selected >  item[name='"+name+"']").each(function()
		{
			contition = true;
		});
		return contition;
	}
	//=================event Functions=====================
	/**
	 * Send an event to the EngineCore.
	 * @method eventOccurred
	 * @param {String} type The type of sender ('pathway','background','object','inventory').
	 * @param {String} sender The name of the sender.
	 * @param {String} event The name of the event('onClick', 'onSelect','onDeselect', 'onFocus', 'onInteract', 'onLoad').
	 * @param {String} data Additional Data.
	 * @return 
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.eventOccurred = function(type,sender,event, data)
	{
		//EngineCore._xmlFindConsoleLog(this.gameXml,"runtime");
//		console.log("eventOccurred=="+" type:"+type+" sender:"+sender+" event:"+event+" data:"+data)
		var sceneName = this.gameGetCurrentScene();
		var objectName;
		var stateName;
		var xmlQuery;
		var parentThis = this;
		if(type=="pathway")
		{
			xmlQuery="scenes > scene[name='"+sceneName+"']";
			stateName = this.sceneGetState(sceneName);
			xmlQuery+=" > background > states > state[name='"+stateName+"']";
			xmlQuery+=" > pathway[name='"+data+"']"
		}
		else if(type=="background")
		{
			xmlQuery="scenes > scene[name='"+sceneName+"']";
			stateName = this.sceneGetState(sceneName);
			xmlQuery+=" > background > states > state[name='"+stateName+"']";

		}
		else if(type=="object")
		{
			objectName=data;
			xmlQuery="scenes > scene[name='"+sceneName+"']";
			xmlQuery+=" > objects > object[name='"+objectName+"']";
			stateName = this.objectGetState(sceneName,objectName);
			xmlQuery+=" > states > state[name='"+stateName+"']";
		}
		else if(type=="inventory")
		{
			xmlQuery="inventory > objects";
			if(event!="onInteract")
			{

				if(event=="onSelect")
				{
					this.inventoryObjectSelect(data);
				}
				else if(event=="onDeselect")
				{
					this.inventoryObjectDeselect(data);
				}
				xmlQuery+=" > item[name='"+data+"']";
			}
		}
		xmlQuery+=" > action[event='"+event+"']";

		$(this.gameXml).find(xmlQuery).each(function()
				{
					var contitions = true;
					var stopSearching = false;
					$(this).find("requires > item").each(function()
					{
						if(stopSearching==true)
							return;
						if(!parentThis.inventoryIsItemSelected($(this).attr("name")))
						{
							contitions = false;
							stopSearching=true;
						}
						
					});
					if(contitions==false)
						return;
					$(this).find("requires > condition").each(function()
					{
						var reverse = false;
						if(stopSearching==true)
							return;
						if($(this).attr("not")=="true")
						{
							reverse = true;
						}
						if(parentThis.conditionCheck($(this).attr("name"))==reverse)
						{
							contitions =false;
							stopSearching=true;
						}
					});
					if(contitions)//foundI item!
						{
							$(this).find("command").each(function(){	
								var messages=$(this).find("message"); //choose a random message 
								var rand = EngineCore._randomGen(0,messages.length);
								var commandMessage = $(messages[rand-1]).text();	
								var commandName=$(this).attr("name");
								var commandData=$(this).attr("data");
								var commandTarget=$(this).attr("target");
								if(commandTarget=="this"||commandTarget==null)
								{
									commandTarget=sceneName;
									if(objectName)
									{
										commandTarget+="."+objectName;
									}
								}
								if(commandTarget=="all")
								{
									commandTarget="";
									$(parentThis.gameXml).find("runtime > objects > object[owner='"+sceneName+"']").each(function()
									{
										if(commandTarget!="")
										{
											commandTarget+=",";
										}
										commandTarget+=sceneName;
										commandTarget+="."+$(this).attr("name");
										
									});
								}
								if(commandData==null)
								{
									commandData = EngineCore.jqueryToString($(this).children());
								}
								
								parentThis.executeCommand(commandTarget,commandName,commandData,commandMessage);
							
							});
							return;
						}
				});
		return;
	}
	//================Conditions Functions===================
	/**
	 * Checks if a given condition is satisfied
	 * @method conditionCheck
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
	 * @method conditionSet
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
	 * Foreach object available in inventory call a given function. 
	 * @method inventoryGetItems
	 * @param {Function} callback The function to call.
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
	 * Gets The image of an inventory object
	 * @method inventoryObjectGetImage
	 * @param {String} name the name of the inventory object
	 * @return The url of the image
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.inventoryObjectGetImage = function (name)
	{
		var xml = this.gameXml;
		var res;
		var parentThis = this;
		$(xml).find("inventory > objects > item[name='"+name+"'] > image").each(function()
			  {	
				  res =  parentThis.imageGetUrl($(this));
				  return;		    
			  });
		return res;
	}
	/**
	 * Change the state of a given object
	 * @method objectChangeState
	 * @param {String} sceneName The name of scene own the given object.
	 * @param {String} objectName The name of given object.
	 * @param {String} state The name of new state.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.objectChangeState = function(sceneName,objectName,state)
	{
		$(this.gameXml).find("runtime > objects > object[name=\""+objectName+"\"][owner=\""+sceneName+"\"]").attr("state",state);
		this.objectOnLoad(sceneName,objectName);
	}
	/**
	 * Get the state of a given object
	 * @method objectGetState
	 * @param {String} sceneName The name of scene own the given object.
	 * @param {String} objectName The name of given object.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.objectGetState = function(sceneName,objectName)
	{
		return $(this.gameXml).find("runtime > objects > object[name=\""+objectName+"\"][owner=\""+sceneName+"\"]").attr("state");
	}
	/**
	 * Change the visibility status of a given object
	 * @method objectChangeVisibility
	 * @param {String} target The name of given object.
	 * @param {String} target The name of new status.
	 * @memberOf advenGameEngine.EngineCore#
	 **/
	p.objectChangeVisibility = function(sceneName,objectName,status)
	{
		$(this.gameXml).find("runtime > objects > object[name=\""+objectName+"\"][owner=\""+sceneName+"\"]").attr("visibility",status);
	}
	/**
	 * Find and executes scene onLoad actions and onLoad actions for each object of scene 
	 * @method objectOnLoad
	 * @param {String} target The name of given scene.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.objectOnLoad= function(sceneName,objectName)
	{

		var stateName = "";
		parentThis=this;
		$(this.gameXml).find("runtime > objects > object[name=\""+objectName+"\"][owner=\""+sceneName+"\"]").each(function()
		{
			stateName  = $(this).attr("state");
		});
//		console.log("objectOnLoad==scene:"+sceneName+" object:"+objectName+" state:"+stateName);
		
		var scene = $(this.gameXml).find("game > scenes >  scene[name=\""+sceneName+"\"]");
		var object = $(scene).find("objects object[name=\""+objectName+"\"]");
		var state = $(object).find("state[name=\""+stateName+"\"]");
		
		var imageUrl =  this.imageGetUrl($(state).find("image"))

//TODO: separate onload and events Occurred.
		this.callbackObjectOnLoad(sceneName,objectName,imageUrl);
		
		this.eventOccurred("object","","onLoad",objectName);		 
	}
	//===================Scene Functions====================
	/**
	 * Change the state of a given scene
	 * @method sceneChangeState
	 * @param {String} sceneName The name of given scene.
	 * @param {String} target The name of new state. 
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.sceneChangeState= function(sceneName,state)
	{
		$(this.gameXml).find("runtime > scenes > scene[name=\""+sceneName+"\"] > background").attr("state",state);
		this.sceneOnLoad(sceneName);
	}
	/**
	 * Get the state of a given scene
	 * @method sceneGetState
	 * @param {String} sceneName The name of given scene.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.sceneGetState = function(sceneName)
	{
		return $(this.gameXml).find("runtime > scenes > scene[name=\""+sceneName+"\"] > background").attr("state");
	}
	/**
	 * Change the scene of the game
	 * @method getObjectImage
	 * @param {String} scene The name of scene to load.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.gameChangeScene = function (sceneName)
	{
		$(this.gameXml).find("runtime > scenes").attr("active",sceneName);
		this.sceneOnLoad(sceneName);
	}

	/**
	 * Get the name of the current scene.
	 * @method gameGetCurrentScene
	 * @memberOf advenGameEngine.EngineCore#
	 * @return The name of current scene.
	**/
	p.gameGetCurrentScene = function ()
	{
		return $(this.gameXml).find("runtime > scenes").attr("active");
	}
	
	/**
	 * Find and executes scene onLoad actions and onLoad actions for each object of scene 
	 * @method sceneOnLoad
	 * @param {String} target The name of given scene.
	 * @memberOf advenGameEngine.EngineCore#
	**/
	p.sceneOnLoad= function(sceneName)
	{

		var stateName = "";
		parentThis=this;
		$(this.gameXml).find("runtime > scenes > scene[name=\""+sceneName+"\"] > background").each(function()
		{
			stateName  = $(this).attr("state");
		});
		
//		console.log("sceneOnLoad==scene:"+sceneName+"state:"+stateName);
		
		var scene = $(this.gameXml).find("game > scenes >  scene[name=\""+sceneName+"\"]");
		var state = $(scene).find("background > states > state[name=\""+stateName+"\"]");
		var image =  this.imageGetUrl($(state).find("image"));
		this.callbackSceneOnLoad(sceneName,image);
//TODO: first initialize and then try finding events
		$(scene).find("objects > object").each(function()
			  {	
				  var objectName=$(this).attr("name");
				  parentThis.objectOnLoad(sceneName,objectName);
				  	    
			  });
		this.eventOccurred("background","","onLoad",sceneName);
		 
	}
	//=================================private methods=================================
	//================initializing Functions==================
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
		return this;
	}
	 p._runTest = function()
	{

		var xml = this.gameXml;
		//prints runtime in console!
		//EngineCore._xmlFindConsoleLog(xml,"runtime");
		
					
		this.executeCommand("","inventoryAdd","flashLightBroken");
		this.executeCommand("","inventoryAdd","battery");
		
		
		//this.gameChangeScene("Room_01_wall01");
		
		this.conditionSet("condition_batteryFull",true);
		
		//this.eventOccurred("inventory","","onSelect","battery");
		//this.eventOccurred("inventory","","onSelect","flashLightBroken");
		//this.eventOccurred("inventory","","onInteract","");
		
		//this.eventOccurred("inventory","","onSelect","flashLight");
		//this.eventOccurred("background","","onClick","");
		
		//this.eventOccurred("background","","onClick","");
		
		this.executeCommand("","inventoryAdd","key");
		//this.inventoryObjectSelect("key");
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		
		
		//this.conditionSet("condition_passwd",true);
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		this.executeCommand("","inventoryAdd","screwDriver");
		//this.eventOccurred("inventory","","onSelect","screwDriver");
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		//this.eventOccurred("object","","onClick","sirtati_01");
		
		
		//this.executeCommand("sirtati_01","changeObjectState","openedFirstTime","changing state...");
		
		//this.objectChangeVisibility("sirtati_01","false");
		//prints runtime in console!
		//EngineCore._xmlFindConsoleLog(xml,"runtime");
		
		//prints image url for each inventory items.
		//parentThis = this;
		/*$("#output").append("<br />===Inventory===<br />");
		this.inventoryGetItems(function(name){
			$("#output").append("item: "+name+" image: "+parentThis.inventoryObjectGetImage(name) + "<br />");
		});*/
		

		
		
		
	
	}
//TODO: pathways
//TODO: put isRunning as attribute to runtime
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
		if(srt=="")
		{
			console.log(EngineCore.jqueryToString(xml));
		}
		res = $(xml).find(srt);
		console.log(EngineCore.jqueryToString(res));
	}

	/** @namespace */
	advenGameEngine.EngineCore = EngineCore;
}());


