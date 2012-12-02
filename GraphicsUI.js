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
		this.callback=null
		this.isReady = false;
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
	p.imageListAdd = function(url,callback)
	{
		var entry =  this.imageListGet(url);
		if(entry==null)
		{
			entry = new GraphicsUI.imageEntry(url);
			this.images[this.images.length] = entry;
			if(callback==null)
			{
			}
			
			var image = new Image();
			entry.image = image;
			entry.parentThis = this;
			image.entry=entry;			
			image.onload = this.imageOnLoad;
//TODO: add on error handler 
			//image.onerror=
			image.src = entry.url;
			
		}
		if(callback!=null)
		{
			entry.callback=callback;
		}
		if(entry.isReady)
		{
			if(callback!=null)
			{
				callback(entry);
			}
		}
		return entry;

	}
	p.imageOnLoad = function(event)
	{
		var image = event.target;
		var entry = image.entry;
		entry.isReady = true;
		if(entry.callback)
		{
			entry.callback(entry);
		}
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
					this.gameUI.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
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
					this.gameUI.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
			
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
					this.gameUI.removeChild(newItem.container);
					newItem.container=null;
					newItem.update=true;
				}
			}
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
		}
		else if(command=="update")
		{
			
			element = null;
			for (i in this.objects)
			{
				element = this.objects[i];
				if(element.update==true)
				{
					var entry = this.imageListAdd(element.imageUrl,null);
					
					entry.element = element;		
					element.container = new createjs.Container();
					element.update=false;
					
					this.imageListAdd(element.imageUrl,this.objectOnLoad);					
				}
				else 
				{
					if(element.type=="object"||element.type=="background")
					{
						this.objectUpdate(element);
					}
				}
			}
		}
		else if(command=="logAppend")
		{
			var container = new createjs.Container();
//TODO: dynamic px size, Crate better UI.
			var txt = new createjs.Text("", "20px Arial", "#FFF");
			
			txt.text = data;
			txt.lineWidth = 400;
			txt.textBaseline = "top";
			txt.textAlign = "left";
			txt.y = 0;
			txt.x = 180;
			container.addChild(txt);
			container.timeLeft=20;
			container.y = 50*this.logUI.children.length+50;
			this.logUI.addChild(container);
		}
		this.stage.update();
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
			this.imageListAdd(url,null);
		}
	}
	p.objectOnLoad = function(entry)
	{
//TODO: stretch image to correct dimensions
//TODO: preload images
		var image = entry.image;
		var element=entry.element;
		var container = element.container;
		bitmap = new createjs.Bitmap(image);
		bitmap.snapToPixel = true;
		
		container.addChild(bitmap);
		container.element = element;
		bitmap.width = image.width;
		bitmap.height = image.height;
		var thisParent=entry.parentThis;
		thisParent.objectUpdate(element);
		if(element.type=="object")
		{
			thisParent.gameUI.addChild(container);
		}
		else if(element.type=="background")
		{
			thisParent.gameUI.addChildAt(container,0);
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

	p.objectUpdate = function(element)
	{
		var container = element.container;
		container.visible = element.visibility;
		for(var i=0;i<container.children.length;i++)
		{
				var bitmap = container.children;
				if(bitmap==null || bitmap.image==null)
					break;
				bitmap.x = element.locationX;
				bitmap.y = element.locationY;
				//bitmap.regX = bitmap.image.width/2|0;
				//bitmap.regY = bitmap.image.height/2|0;
				//bitmap.name = element.name;
				/*
				var hitArea = new createjs.Shape();
				hitArea.x = bitmap.width/2;
				hitArea.y = bitmap.height/2;
				//hitArea.graphics.beginFill("#FF0").drawEllipse(-11,-14,24,18);
				//hitArea.graphics.beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,bitmap.height/2-15,5,0.6).closePath();

				// assign the hitArea to each bitmap to use it for hit tests:
				//bitmap.hitArea = hitArea;
				//bitmap.mask = hitArea;
				//container.addChild(hitArea);
				* */
		}
		container.parentThis=this;
		container.onPress = this.objectOnPress;
		this.stage.update();
		
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
//TODO:Calculating dynamical
		var countX=2;
		var countY=4;
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
		if(selectedElement==null)
		{
			this.inventoryCommand("openViewUI");
			return;
		}
		var elements = this.inventorySelectUI.Elements;
		var length = elements.children.length;
		var width=this.inventoryCompineUI.Elements.width;
		var height=this.inventoryCompineUI.Elements.height;
//TODO:Calculating dynamical
		var countX=3;
		var countY=4;
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
		this.logUI = new createjs.Container();
		this.stage.addChild(this.logUI);
		this.inventoryUI = new createjs.Container();
		this.stage.addChild(this.inventoryUI);
		
		this.executeCommand("clearObjects");
		
		this._initializeGameUI();
		this._initializeGameLogUI();
		this._initializeInventoryUI();

		
		

		
		return this;
	}

	p._initializeGameUI = function()
	{
		

	}
	p._initializeInventoryUI = function()
	{
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
		


		
		var txt = new createjs.Text("", this.canvas.width/20+"px Arial", "#F00");
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
		
		
		var txt = new createjs.Text("", this.canvas.width/20+"px Arial", "#F00");
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
		var y=x2+delimiter/2;
		var w=xSplit-delimiter;
		var h=xSplit-delimiter;
		var container = new createjs.Container();
		container.x=x;
		container.y=y;
		container.width=w;
		container.height=h;
		this.inventorySelectUI.Selected=container;
		this.inventorySelectUI.addChild(container);
		
		var y=xSplit+delimiter;
		var h=this.canvas.height-xSplit-delimiter;
		var txt = new createjs.Text("", this.canvas.width/20+"px Arial", "#F00");
		txt.text = "Select Object";
		txt.lineWidth = w;
		txt.textBaseline = "top";
		txt.textAlign = "center";
		txt.y = y+0.8*h;
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
