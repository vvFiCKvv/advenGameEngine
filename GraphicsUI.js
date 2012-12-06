/**
 * Adventure GameEngine.
 * @namespace
*/
this.advenGameEngine = this.advenGameEngine||{};
(function() {
	
	
	//=================================constructors===================================
	/**
	 * The GraphicsUI allows you to handle Graphics. 
	 * Given some events it can run it. 
	 * @class GraphicsUI
	 * @constructor
	 **/
	var GraphicsUI = function(canvas) {
		this._initialize(canvas);
	}

	
	/**
	@class description
	*/
	var p = GraphicsUI.prototype;
	//================================public static properties=========================

	GraphicsUI.object = function()
	{
		this.name;
		this.type;
		this.imageUrl;
		this.locationX;
		this.locationY;
		this.container;
		this.visibility;
		this.update;
	};
	
	GraphicsUI.imageEntry = function(url)
	{
		this.url = url;
		this.image = null;
		this.callbacks=new Array();
		this.isReady = false;
	}
	
	GraphicsUI.locationString = function(locationX,locationY,rotation)
	{
		var locString = "";
		if(locationX)
		{
			locString+=locationX+",";
		}
		else
		{
			locString+="0,";
		}
		if(locationY)
		{
			locString+=locationY+",";
		}
		else
		{
			locString+="0,";
		}
		if(rotation)
		{
			locString+=rotation;
		}
		else
		{
			locString+="0";
		}
		return locString;
	}
	p.imageListGet = function(url)
	{
		for(i in this.images)
		{
			var entry = this.images[i];
			if(url==entry.url)
			{
				return entry;
			}
		}
		return null;
	}
	p.imageListCallback = function(url,callback,data)
	{
		var entry =  this.imageListGet(url);
		if(entry==null)
		{
			entry = this.imageListAdd(url);
		}
		if(entry.isReady)
		{
			var image = entry.image;
			callback(image,data)
		}
		else
		{
			var callbackEntry = new Array();
			callbackEntry[0]=callback;
			callbackEntry[1]=data;
			entry.callbacks[entry.callbacks.length]=callbackEntry;
		}
	}
	p.imageListAdd = function(url)
	{
		var entry =  this.imageListGet(url);
		if(entry==null)
		{
			entry = new GraphicsUI.imageEntry(url);
			this.images[this.images.length] = entry;
			var image = new Image();
			entry.image = image;
			entry.parentThis = this;
			image.entry=entry;			
			image.onload = this.imageOnLoad;
//TODO: add on error handler 
			//image.onerror=
			image.src = entry.url;		
		}
		return entry;
	}
	p.imageOnLoad = function(event)
	{
		var image = event.target;
		var entry = image.entry;
		entry.isReady = true;
		for(i in entry.callbacks)
		{
			var callbackEntry = entry.callbacks[i];
			var calback = callbackEntry[0];
			var data = callbackEntry[1]
			calback(image,data);
		}
		entry.callbacks=null;
	}
	
	//================================public properties================================
	p.images;
	p.stage;
	p.canvas;
	p.inventoryUI;
	p.inventorySelectUI;
	p.inventoryCompineUI;
	p.inventoryViewUI;
	p.gameUI;
	p.gameBackgroundUI;
	p.logUI;
	p.objects;
	p.callbackObjectOnPress;//arguments: element
	p.callbackInventorySelect;//arguments: element
	p.callbackInventoryCompine;

	//=============================public static methods===============================

	//=================================public methods=================================
	
	p.executeCommand = function (command,target,data)
	{
		
		if(command=="changeBackground")
		{
			var newItem;
			newItem = this.objectsGetElement(target);
			if(newItem==null)
			{
				newItem = new GraphicsUI.object();
				newItem.type="background";
				newItem.name=target;
				newItem.imageUrl=data;
				newItem.container=null;
				newItem.visibility=true;
				newItem.update=true;
				var index = this.objects.length;
				this.objects[index]=newItem;
			}
			else
			{
			if(newItem.imageUrl!=data)
				{
					newItem.imageUrl=data;
					this.gameUI.background.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
			this.elementUpdate(newItem);
		}
		else if(command=="addObject")
		{
			var newItem;
			newItem = this.objectsGetElement(target);
			if(newItem==null)
			{
				newItem = new GraphicsUI.object();
				newItem.type="object";
				newItem.name=target;
				newItem.imageUrl=data;
				newItem.container=null;
				newItem.visibility=true;
				newItem.update=true;
				var index = this.objects.length;
				var index = this.objects.length;
				this.objects[index]=newItem;
			}
			else
			{
				if(newItem.imageUrl!=data)
				{
					newItem.imageUrl=data;
					this.gameUI.objects.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
			this.elementUpdate(newItem);
			
		}
		else if(command=="addPathway")
		{
			var newItem;
			newItem = this.objectsGetElement(target);
			if(newItem==null)
			{
				newItem = new GraphicsUI.object();
				newItem.type="pathway";
				newItem.name=target;
				newItem.imageUrl=data;
				newItem.container=null;
				newItem.visibility=true;
				newItem.update=true;
				var index = this.objects.length;
				var index = this.objects.length;
				this.objects[index]=newItem;
			}
			else
			{
				if(newItem.imageUrl!=data)
				{
					newItem.imageUrl=data;
					this.gameUI.pathways.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
			this.elementUpdate(newItem);
		}
		else if(command=="moveObject")
		{
			var dataTable = data.split(",");
			var xString = dataTable[0];
			var yString = dataTable[1];
			var rotString = dataTable[2];
			var pointX=0;
			var pointY=0;
			var rotation=0;
			if(xString.charAt(xString.length-1)=='%')
			{
				var str = xString.substr(0,xString.length-1)
				pointX = parseInt(str);
				pointX = pointX*this.canvas.width/this.gameUI.scaleX/100;
//TODO: fix width to corect
			}
			else
			{
				pointX = parseInt(xString);
			}
			if(yString.charAt(yString.length-1)=='%')
			{
				var str = yString.substr(0,yString.length-1)
				pointY = parseInt(str);
				pointY = pointY*this.canvas.height/this.gameUI.scaleY/100;
			}
			else
			{
				pointY = parseInt(yString);
			}
			rotation = parseInt(rotString)

			var element = this.objectsGetElement(target);
			if(element&&element.container)
			{
				element.container.x=pointX;
				element.container.y=pointY;
				element.rotation = rotation;
				var bitmap = element.container.children[0];
				if(bitmap)
				{
					bitmap.rotation = rotation;
				}
			}
			this.elementUpdate(element);
		}
		else if(command=="addInventoryObject")
		{
			//return;
			var newItem;
			newItem = this.objectsGetElement(target);
			if(newItem==null)
			{
				newItem = new GraphicsUI.object();
				newItem.type="inventory";
				newItem.name=target;

					
				newItem.imageUrl=data;
				newItem.container=null;
				newItem.visibility=true;
				newItem.update=true;
				var index = this.objects.length;
				this.objects[index]=newItem;
			}
			else
			{
				if(newItem.imageUrl!=data)
				{
					
					newItem.imageUrl=data;
					this.inventorySelectUI.elements.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
			this.elementUpdate(newItem);
		}
		else if(command=="removeInventoryObject")
		{
			var element = this.objectsGetElement(target);
			for(var i=0; i<this.objects.length; i++) 
			{
				if(this.objects[i] === element) 
				{
					this.objects.splice(i, 1);
					break;
				}
			}
			for(var i=0; i<this.inventorySelectUI.Elements.children.length; i++) 
			{
				if(this.inventorySelectUI.Elements.children[i].element === element) 
				{
					this.inventorySelectUI.Elements.removeChildAt(i);
					break;
				}
			}
			if(this.inventorySelectUI.Selected.element===element)
			{
				this.inventorySelectUI.Selected.removeAllChildren();
				this.inventoryCompineUIOrganize();
				this.inventoryViewUI.Viewer.removeAllChildren();
			}
			this.inventorySelectUIOrganize(element);
		}
		else if(command=="clearObjects")
		{
			this.objects=new Array();
			this.gameUI.removeAllChildren();
		}
		else if(command=="changeObjectVisibility")
		{
			var element = this.objectsGetElement(target);
			element.visibility = (data=="true");
			element.update=false;
			this.elementUpdate(element);
			element.container.visible = element.visibility;
		}
		else if(command=="update")
		{
			element = this.objectsGetElement(target);
			if(element == null)
			{
				for (i in this.objects)
				{
					element = this.objects[i];
					this.elementUpdate(element);
				}
			}
			else
			{
				this.elementUpdate(element);
			}
		}
		else if(command=="logAppend")
		{
			var container = new createjs.Container();
			var delimeter = this.canvas.width /10;
			var textHeight = this.canvas.height/20;
			var txt = new createjs.Text("", textHeight+"px Arial", "#000");			
			txt.text = data;
			txt.outline = true;
			txt.lineWidth = this.canvas.width - 2*delimeter;
			var h =txt.getMeasuredHeight();
			txt.textBaseline = "top";
			txt.textAlign = "left";
			txt.y = 0;
			txt.x = delimeter;
			container.addChild(txt);
			
			var txt = new createjs.Text("", textHeight+"px Arial", "#FFF");			
			txt.text = data;
			txt.lineWidth = this.canvas.width - 2*delimeter;
			var h =txt.getMeasuredHeight();
			txt.textBaseline = "top";
			txt.textAlign = "left";
			txt.y = 0;
			txt.x = delimeter;
			container.addChild(txt);
			container.timeLeft=20;
			for (i in this.logUI.children)
			{
				var cont = this.logUI.children[i];
				cont.y-=h;
			}
			container.y =-h;
			this.logUI.addChild(container);
		}
		this.stage.update();
	}
	p.elementUpdate = function(element)
	{
		if(element.update==true)
		{
			element.container = new createjs.Container();
			element.update=false;
			element.parentThis = this;
//TODO: find a better way than using parentThis in too many variables
			this.imageListCallback(element.imageUrl,this.objectOnLoad,element);					
		}
	}
	p.objectsGetElement = function(name)
	{
		for (i in this.objects)
			{
				var element = this.objects[i];
				if(element.name==name)
				{
					return element;
				}
			}
			return null;
	}
	p.preloadImages = function(urls)
	{
		for (i in urls)
		{
			var url = urls[i];
			this.imageListAdd(url);
		}
	}
	p.objectOnLoad = function(image,data)
	{
		var element=data;
		var container = element.container;
		bitmap = new createjs.Bitmap(image);
		bitmap.snapToPixel = true;
		
		container.addChild(bitmap);
		container.element = element;
		bitmap.width = image.width;
		bitmap.height = image.height;
		

		
		var thisParent=element.parentThis;
		container.parentThis=thisParent;
		container.onPress = thisParent.objectOnPress;
		if(element.type=="object")
		{
			bitmap.regX = bitmap.width/2;
			bitmap.regY = bitmap.height/2;
			bitmap.rotation = element.rotation;
			bitmap.x += bitmap.regX;
			bitmap.y += bitmap.regY;
			thisParent.gameUI.objects.addChild(container);
		}
		if(element.type=="pathway")
		{
			bitmap.regX = bitmap.width/2;
			bitmap.regY = bitmap.height/2;
			bitmap.rotation = element.rotation;
			bitmap.x += bitmap.regX;
			bitmap.y += bitmap.regY;
			thisParent.gameUI.pathways.addChild(container);
		}
		else if(element.type=="background")
		{
			thisParent.gameUI.background.addChild(container);
			thisParent.gameUI.scaleX = thisParent.canvas.width / image.width;
			thisParent.gameUI.scaleY = thisParent.canvas.height / image.height;
		}
		else if (element.type=="inventory")
		{

			var hitArea = new createjs.Shape();
			hitArea.graphics.beginFill("#FFF").drawRect(0,0,bitmap.width,bitmap.height);
			bitmap.hitArea=hitArea;
				
			container.visible=false;
			thisParent.inventorySelectUI.Elements.addChild(container);
			thisParent.inventorySelectUIOrganize();
		}
//TODO: Correct updates		
		thisParent.stage.update();
	}
	p.objectOnPress = function(event)
	{
		var container = event.target;
		var element = container.element;		
		container.parentThis.callbackObjectOnPress(element);
	}
	p.inventorySelectUIOrganize = function()
	{
		var elements = this.inventorySelectUI.Elements;
		var length = elements.children.length;
		var width=elements.width;
		var height=elements.height;
		var ratio = 2;
		var countX=Math.ceil(Math.sqrt(length/ratio));
		var countY=ratio*countX;
		var h=height/countY;
		var w=width/countX;
		for(var i=0;i<length;i++)
		{
			var container = elements.children[i];
			var bitmap = container.children[0];
			container.visible=true;
			container.scaleX = w/bitmap.width;
			container.scaleY = h/bitmap.height;
			container.x = (i%countX)*w;
			container.y = Math.floor(i/countX)*h;
			container.parentThis = this;

			container.onPress=this.inventorySelectOnPress;
			
		}
//TODO: call inventoryCompineUIOrganize when new items added.
	}
	p.inventorySelectOnPress = function(event)
	{
		var container = event.target;
		var element = container.element;
		var parentThis = container.parentThis;
		var bitmap = container.children[0];
		
		container=parentThis.inventorySelectUI.Selected;
		
		container.visible=true;
		var h=container.height;
		var w=container.width;
		container.scaleX = w/bitmap.width;
		container.scaleY = h/bitmap.height;
		container.removeAllChildren();
//container.y -= h/2;
		container.element = element;
		var newBitmap = bitmap.clone();
		newBitmap.width = bitmap.width;
		newBitmap.height = bitmap.height;
		newBitmap.hitArea = bitmap.hitArea;
		container.addChild(newBitmap);
		
		container=parentThis.inventoryViewUI.Viewer;
		var h=container.height;
		var w=container.width;
		container.element = element;
		container.scaleX = w/bitmap.width;
		container.scaleY = h/bitmap.height;
		container.removeAllChildren();
		var newBitmap = bitmap.clone();
		newBitmap.width = bitmap.width;
		newBitmap.height = bitmap.height;
		newBitmap.hitArea = bitmap.hitArea;
		container.parentThis=parentThis;
		container.addChild(newBitmap);
		

		
		parentThis.inventoryCompineUIOrganize(element);
	
		parentThis.stage.update();
		parentThis.callbackInventorySelect(element);
	}
	p.inventoryCompineUIOrganize = function(selectedElement)
	{
		this.inventoryCompineUI.Elements.removeAllChildren();
		if(selectedElement==null)//if there isn't a selection break
		{
			if(this.inventoryTransitionPosition!=0)// if inventory opened force view object details(viewUI)
				{
					this.inventoryCommand("openViewUI");
				}
			return;
		}
		var elements = this.inventorySelectUI.Elements;
		var length = elements.children.length;
		var width=this.inventoryCompineUI.Elements.width;
		var height=this.inventoryCompineUI.Elements.height;
		var ratio = 1
		var countX=Math.ceil(Math.sqrt(length/ratio));
		var countY=ratio*countX;
		var h=height/countY;
		var w=width/countX;
		for(var i=0;i<length;i++)
		{
			var container = elements.children[i];
			var element =  container.element;
			var bitmap = container.children[0];
			if(selectedElement.name==element.name)
			{
				continue;
			}
			container = new createjs.Container();
			container.element = element;
			this.inventoryCompineUI.Elements.addChild(container);
			container.scaleX = w/bitmap.width;
			container.scaleY = h/bitmap.height;
			var newBitmap = bitmap.clone();
			newBitmap.width = bitmap.width;
			newBitmap.height = bitmap.height;
			newBitmap.hitArea = bitmap.hitArea;
			container.addChild(newBitmap);
			
			container.x = (i%countX)*w;
			container.y = Math.floor(i/countX)*h;
			
			container.parentThis=this;
			
			container.onPress=this.inventoryCombineOnPress;
		}		
	}
	p.inventoryCombineOnPress = function(event)
	{
		var container = event.target;
		var element = container.element;
		var parentThis = container.parentThis;
		parentThis.callbackInventoryCompine(element);
	}
	p.inventoryTransitionPosition=0;
	p.inventoryTransitionCommand=""
	p.inventoryTransition = function(percent)
	{
		var position = this.inventoryTransitionPosition;
		var command = this.inventoryTransitionCommand;
		
		if(command=="openSelectUI")
		{
			this.inventorySelectUIOrganize();
			position = percent;
		}else if(command=="closeSelectUI")
		{
			if(position<=1)
			{
				position=1-percent;
			}
			if(position>=2)
			{
				position=2+percent;
			}
		}
		else if(command=="openCompineUI")
		{
			position=1+percent;
		}else if(command == "openViewUI")
		{
			position=2+-percent;
		}

		
		this.inventoryTransitionPosition=position;
		this.inventorySelectUITransition(position);
		this.inventoryCompineUITransition(position);
		this.inventoryViewUITransition(position);

	}
	p.inventorySelectUITransition = function(percent)
	{
		var invertPercent = 1-percent;
		var xLeft=0.4*this.canvas.width;
		var xSplit=0.1*this.canvas.width;
		var delimiter = xSplit*0.4;
		if(percent==0 || percent==3)
		{
			this.inventorySelectUI.x=-xLeft-delimiter*0.2;
		}
		else if(percent<=1)
		{
		
			this.inventorySelectUI.x=-xLeft*invertPercent
		}else if(percent>=2 && percent<=3)
		{
			this.inventorySelectUI.x=-xLeft*(percent-2)
		}
		
	}
	p.inventoryCompineUITransition = function(percent)
	{
		var xSplit=0.1*this.canvas.width;
		var delimiter = xSplit*0.4;
		var invertPercent = 1-percent;
		if(percent>=2 && percent<=3)
		{
			this.inventoryCompineUI.y =(this.canvas.height-xSplit)*(percent-2)
		}
		else if(percent>1)
		{
			this.inventoryCompineUI.y = this.canvas.height-2*xSplit - delimiter+(-this.canvas.height+2*xSplit + delimiter)*(percent-1);
		}
		else
		{
			this.inventoryCompineUI.y = this.canvas.height-xSplit +(-xSplit - delimiter)*percent;
		}		
	}
	p.inventoryViewUITransition = function (percent)
	{
		var xSplit=0.1*this.canvas.width;
		var delimiter = xSplit*0.4;
		var invertPercent = 1-percent;
		if(percent>=2 && percent<=3)
		{
			this.inventoryViewUI.y  =-this.canvas.height+2*xSplit + delimiter - (xSplit+delimiter)*(percent-2)
		}
		else if(percent>1)
		{
			this.inventoryViewUI.y = (-this.canvas.height+2*xSplit + delimiter)*(percent-1)
		}
		else
		{
			this.inventoryViewUI.y = -this.canvas.height+xSplit + (this.canvas.height-xSplit )*(percent)
			
		}
		
	}
	//=================================private methods=================================
	//================initializing Functions==================
		/**
	 * General initialization method.
	 * @method initialize
	 * @protected
	 * @return {GraphicsUI} This GraphicUI.
	**/
	p._initialize = function(canvas) {
		//check to see if we are running in a browser with touch support
		this.stage = new createjs.Stage(canvas);
		this.canvas = canvas;
		parentThis = this;

		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(this.stage);

		// enabled mouse over / out events
		this.stage.enableMouseOver(10);
		
		createjs.Ticker.addListener(this);
		// start the tick and point it at the window so we can do some work before updating the stage:
		createjs.Ticker.useRAF = true;
		// if we use requestAnimationFrame, we should use a framerate that is a factor of 60:
		createjs.Ticker.setFPS(10);
		
		this.images = new Array();
		
		this.gameUI = new  createjs.Container();
		this.stage.addChild(this.gameUI);

		this.inventoryUI = new createjs.Container();
		this.stage.addChild(this.inventoryUI);
		
		this.logUI = new createjs.Container();
		this.stage.addChild(this.logUI);
		
		this.executeCommand("clearObjects");
		
		this._initializeGameUI();
		this._initializeGameLogUI();
		this._initializeInventoryUI();

		
		

		
		return this;
	}

	p._initializeGameUI = function()
	{
		this.gameUI.background = new createjs.Container();
		this.gameUI.addChild(this.gameUI.background);
		
		this.gameUI.objects = new createjs.Container();
		this.gameUI.addChild(this.gameUI.objects);
		this.gameUI.pathways = new createjs.Container();
		this.gameUI.addChild(this.gameUI.pathways);

	}
	p._initializeInventoryUI = function()
	{
		
//TODO: add cache to shapes
		var parentThis=this;
		this.inventorySelectUI = new createjs.Container();
		this.inventoryUI.addChild(this.inventorySelectUI);
		this.inventoryCompineUI = new createjs.Container();
		this.inventoryUI.addChild(this.inventoryCompineUI);
		this.inventoryViewUI = new createjs.Container();
		this.inventoryUI.addChild(this.inventoryViewUI);
		var xSplit=0.1*this.canvas.width;
		var xLeft=0.4*this.canvas.width;
		var xRight=0.5*this.canvas.width;
		var alpha = 0.7;
		var delimiter = xSplit*0.4;
		var cornerRatio=xSplit*0.3;
		var textHeight = this.canvas.width/20;
		
		var x=xLeft+delimiter/2;
		var y=0;
		var w=xRight+xSplit-delimiter;
		var h=this.canvas.height -xSplit - delimiter/2;
		var bg = new createjs.Shape();
		var g = bg.graphics;
		g.beginLinearGradientFill(["#000","#088"], [0.1, 1], 0, 0, 0, this.canvas.height);
		g.setStrokeStyle(delimiter*0.4).beginStroke("#044").drawRoundRectComplex(x,y,w,h,0,0,cornerRatio,cornerRatio);
		bg.alpha = 0.7;
		this.inventoryViewUI.addChildAt(bg);
		


		
		var txt = new createjs.Text("", textHeight+"px Arial", "#F00");
		txt.text = "Object Details";
		txt.lineWidth = w;
		txt.textBaseline = "top";
		txt.textAlign = "center";
		txt.y = y+0.8*h;
		txt.x = x+w/2;
		this.inventoryViewUI.addChild(txt);
		
		var width = w-2*delimiter;
		var height = 0.8*h - 2*delimiter;
		
		x+=delimiter;
		y+=delimiter;		

		this.inventoryViewUI.Viewer = new createjs.Container();
		this.inventoryViewUI.addChild(this.inventoryViewUI.Viewer);
		this.inventoryViewUI.Viewer.width=width;
		this.inventoryViewUI.Viewer.x = x
		this.inventoryViewUI.Viewer.height=height;
		this.inventoryViewUI.Viewer.y= y;

		this.inventoryViewUI.Viewer.onPress = this.objectOnPress;


		var bg = new createjs.Shape();
		bg.x=x-delimiter/4;
		bg.y=y-delimiter/4;
		width+=delimiter/2;
		height+=delimiter/2;
		var g = bg.graphics;
		g.beginFill("#F22");
		g.setStrokeStyle(delimiter/4).beginStroke("#2FF").drawRoundRectComplex(0,0,width,height,cornerRatio/4,cornerRatio/4,cornerRatio/4,cornerRatio/4);
		bg.alpha = 0.1;
		this.inventoryViewUI.addChild(bg);
		
		var x=xRight+delimiter/2;
		var y=xSplit+delimiter;
		var w=this.canvas.width-xRight-delimiter;
		var h=this.canvas.height-xSplit-delimiter;
		var bg = new createjs.Shape();
		var g = bg.graphics;
		g.beginLinearGradientFill(["#088","#000"], [0.1, 1], 0, 0, 0, this.canvas.height);
		g.setStrokeStyle(delimiter*0.4).beginStroke("#044").drawRoundRectComplex(x,y,w,h,cornerRatio,cornerRatio,0,0);
		bg.alpha = 0.7;
		this.inventoryCompineUI.addChildAt(bg);
		
		
		var txt = new createjs.Text("", textHeight+"px Arial", "#F00");
			txt.text = "Combine Selected";
			txt.lineWidth = w;
			txt.textBaseline = "top";
			txt.textAlign = "center";
			txt.y = 1.1*y;
			txt.x = x+w/2;
		this.inventoryCompineUI.addChild(txt);
		

		var width = w-2*delimiter;
		var height = 0.8*h - 2*delimiter;
		
		x+=delimiter;
		y+=delimiter+0.2*h;
		
		this.inventoryCompineUI.Elements = new createjs.Container();
		this.inventoryCompineUI.Elements.width=width;
		this.inventoryCompineUI.Elements.x = x
		this.inventoryCompineUI.Elements.height=height;
		this.inventoryCompineUI.Elements.y= y

		this.inventoryCompineUI.addChild(this.inventoryCompineUI.Elements);

		var bg = new createjs.Shape();
		bg.x=x-delimiter/4;
		bg.y=y-delimiter/4;
		width+=delimiter/2;
		height+=delimiter/2;
		var g = bg.graphics;
		g.beginFill("#F22");
		g.setStrokeStyle(delimiter/4).beginStroke("#2FF").drawRoundRectComplex(0,0,width,height,cornerRatio/4,cornerRatio/4,cornerRatio/4,cornerRatio/4);
		bg.alpha = 0.1;
		this.inventoryCompineUI.addChild(bg);
		
		
		
		var x1=xLeft;
		var y1=this.canvas.height-xSplit;
		var x2=xLeft+xSplit;
		var y2=y1;
		
		var x0=x1;
		var y0=delimiter/2;
		var x3=x2;
		var y3= this.canvas.height;
		var x4=0;
		var y4=y3;
		
		var bg = new createjs.Shape();
		var g = bg.graphics;
		g.beginLinearGradientFill(["#228","#000"], [0.1, 1], 0, 0, x2, 0);
		g.setStrokeStyle(delimiter*0.4,"round","round");
		g.beginStroke("#044");
		g.moveTo(0,delimiter/2);	
		g.arcTo(x1,delimiter/2,x1,y1,cornerRatio*1.5);
		g.arcTo(x1,y1,x2,y2,cornerRatio*1.5);
		g.arcTo(x2,y2,x3,y3,cornerRatio*1.5);
		g.lineTo(x3,y3);
		g.lineTo(x4,y4);
		g.closePath();
		bg.alpha = 0.7;
		this.inventorySelectUI.addChild(bg);
		
		var width = xLeft-2*delimiter;
		var height = y1 - 2*delimiter;
		var x = delimiter;
		var y=1.5*delimiter;
		this.inventorySelectUI.Elements = new createjs.Container();
		this.inventorySelectUI.Elements.width=width;
		this.inventorySelectUI.Elements.x = x
		this.inventorySelectUI.Elements.height=height;
		this.inventorySelectUI.Elements.y= y

		this.inventorySelectUI.addChild(this.inventorySelectUI.Elements);

		var bg = new createjs.Shape();
		bg.x=x-delimiter/4;
		bg.y=y-delimiter/4;
		width+=delimiter/2;
		height+=delimiter/2;
		var g = bg.graphics;
		g.beginFill("#F22");
		g.setStrokeStyle(delimiter/4).beginStroke("#2FF").drawRoundRectComplex(0,0,width,height,cornerRatio/4,cornerRatio/4,cornerRatio/4,cornerRatio/4);
		bg.alpha = 0.1;
		this.inventorySelectUI.addChild(bg);
		
		var x=x1+delimiter/2;
		var y=y2+delimiter/2;
		var w=xSplit-delimiter;
		var h=xSplit-delimiter;
		var container = new createjs.Container();
		container.x=x;
		container.y=y;
		container.width=w;
		container.height=h;
		this.inventorySelectUI.Selected=container;
		this.inventorySelectUI.addChild(container);
		
		var y=this.canvas.height-xSplit-delimiter;
		var w=xLeft-delimiter;
		var txt = new createjs.Text("", textHeight+"px Arial", "#F00");
		txt.text = "Select Object";
		txt.lineWidth = w;
		txt.textBaseline = "top";
		txt.textAlign = "center";
		txt.y = y+textHeight;
		txt.x = x1-2*xSplit;
		this.inventorySelectUI.addChild(txt);
		
		
		
		this.inventoryTransitionPosition=0;
		this.inventoryTransitionCommand="closeSelectUI";
		this.inventoryTransition(1);
		
		
		this.inventorySelectUI.children[0].onPress = function(event)
		{		
			parentThis.inventoryCommand("toggleSelectUI");
		}
		
		this.inventoryCompineUI.children[0].onPress = function(event)
		{
			parentThis.inventoryCommand("openCompineUI");
		}
		this.inventoryViewUI.children[0].onPress = function(event)
		{
			parentThis.inventoryCommand("openViewUI");
		}
		
		
				
	}
	p._initializeGameLogUI = function()
	{
		this.logUI.y = 0.8*this.canvas.height;
	}
	p.inventoryCommand = function(command)
	{
		if(this.tickPercent==-1)
		{
			createjs.Ticker.setFPS(50);
			this.tickPercent = 0;
		}
		if(this.tickPercent!=0)
		{
			return false;
		}
		if(command=="toggleSelectUI")
		{		
			if(this.inventoryTransitionPosition==0||this.inventoryTransitionPosition==3)
			{
				this.inventoryTransitionCommand="openSelectUI"
			}
			else
			{
				this.inventoryTransitionCommand="closeSelectUI"
			}		
		
		}else
		{
			this.inventoryTransitionCommand=command;
		}

	}
	p.tickPercent=-1;
	p.tick = function()
	{
		
		if(this.tickPercent!=-1)
		{
			if(this.inventoryTransitionCommand=="openViewUI"&&this.inventoryTransitionPosition==1)
				return false;
			if(this.inventoryTransitionCommand=="openCompineUI"&&this.inventoryTransitionPosition==2)
				return false;
			this.inventoryTransition((++this.tickPercent)/20);
			if(this.tickPercent==20)
			{
				createjs.Ticker.setFPS(10);
				this.tickPercent=-1;
			}
			this.stage.update();
		}
		else
		{
		    for (var i=0;i<this.logUI.children.length;i++)
		    {
				var log = this.logUI.children[i];
				log.timeLeft--;
				if(log.timeLeft<=0)
				{
					this.logUI.removeChild(log);
					i--;
					this.stage.update();
				}
			}
		}
	}

	/** @namespace */
	advenGameEngine.GraphicsUI = GraphicsUI;
	
}());
