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

	
	//================================public properties================================
	p.stage;
	p.canvas;
	p.inventoryUI;
	p.inventorySelectUI;
	p.inventoryCompineUI;
	p.inventoryViewUI;
	p.gameUI;
	p.gameBackgroundUI;
	p.logUI;
	//=============================public static methods===============================
	
	//=================================public methods=================================
	p.inventoryTransitionPosition=0;
	p.inventoryTransitionCommand=""
	p.inventoryTransition = function(percent)
	{
		var position = this.inventoryTransitionPosition;
		var command = this.inventoryTransitionCommand;
		
		if(command=="openSelectUI")
		{
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
	p.runTest01 = function()
	{
		// load the source image:
		var parentThis=this;
		var image = new Image();
		image.src = "source/images/Fruit0032_SS.png";
		image.onload = function(event)
		{
			var image = event.target;
			var bitmap;
			var container = new createjs.Container();
			parentThis.stage.addChild(container);
			
			bitmap = new createjs.Bitmap(image);
			container.addChild(bitmap);
			bitmap.x = parentThis.canvas.width * Math.random()|0;
			bitmap.y = parentThis.canvas.height * Math.random()|0;
			bitmap.rotation = 360 * Math.random()|0;
			bitmap.regX = bitmap.image.width/2|0;
			bitmap.regY = bitmap.image.height/2|0;
			bitmap.scaleX = bitmap.scaleY = bitmap.scale = Math.random()*0.4+0.6;
			bitmap.name = "test22";
			
			var hitArea = new createjs.Shape();
			hitArea.x = bitmap.width/2;
			hitArea.y = bitmap.height/2;
			//hitArea.graphics.beginFill("#FF0").drawEllipse(-11,-14,24,18);
			//hitArea.graphics.beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,bitmap.height/2-15,5,0.6).closePath();

			// assign the hitArea to each bitmap to use it for hit tests:
			//bitmap.hitArea = hitArea;
			//bitmap.mask = hitArea;
			//container.addChild(hitArea);
			bitmap.onPress = function(evt) {
					alert("tar:"+evt.target.name);
							
			
			}
			
			container2 = new createjs.Container();
			container.addChild(container2);
			
			var txt = new createjs.Text("", "17px Arial", "#FFF");
			txt.text = "This text is rendered in canvas using the Text Object:\n\n";
			txt.text += "The API is loosely based on Flash's display list, and should be easy to pick up for both JS and AS3 developers. The key classes are:\n\n";
			txt.text += "DisplayObject\nAbstract base class for all display elements in Easel. Exposes all of the display properties (ex. x, y, rotation, scaleX, scaleY, alpha, shadow, etc) that are common to all display objects.\n\n"
			txt.text += "Stage\nThe root level display container for display elements. Each time tick() is called on Stage, it will update and render the display list to its associated canvas.\n\n";
			txt.text += "Container\nA nestable display container, which lets you aggregate display objects and manipulate them as a group.\n\n";
			txt.text += "Text\nRenders text in the context of the display list."

			txt.lineWidth = 600;
			txt.textBaseline = "top";
			txt.textAlign = "left";
			txt.y = 50;
			txt.x = 30;
			container2.addChild(txt);		
					
			var pad = 10;
			var bg = new createjs.Shape();
			bg.graphics.beginLinearGradientFill(["#000","#228"], [0.1, 1], 0, 20, 0, 320).setStrokeStyle(8).beginStroke("#F00").drawRoundRectComplex(txt.x-pad, txt.y-pad, txt.lineWidth+pad*2, txt.getMeasuredHeight()+pad*2,0,0,0,0);
			bg.alpha = 0.7;
			container2.addChildAt(bg);
			//container.update();
			
			
			
			
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
		
		createjs.Ticker.addListener(function()
		{
				parentThis.stage.update();
		});
		
		// start the tick and point it at the window so we can do some work before updating the stage:
		createjs.Ticker.useRAF = true;
		// if we use requestAnimationFrame, we should use a framerate that is a factor of 60:
		createjs.Ticker.setFPS(10);
		
		this.gameUI = new  createjs.Container();
		this.stage.addChild(this.gameUI);
		this.inventoryUI = new createjs.Container();
		this.stage.addChild(this.inventoryUI);
		this.logUI = new createjs.Container();
		this.stage.addChild(this.logUI);
		
		
		this._initializeGameUI();
		this._initializeInventoryUI();
		this._initializeGameLogUI();
		
		

		
		return this;
	}

	p._initializeGameUI = function()
	{
		// load the source image:
		var parentThis=this;
		var bg = new Image();
			bg.src ="http://www.freemediagoo.com/images/reg/IMG_0783.jpg";
			bg.onload = function(event)
			{
				parentThis.gameUI.addChild(new createjs.Bitmap(event.target));
			}
		var image = new Image();
		image.src = "source/images/Fruit0032_SS.png";
		image.onload = function(event)
		{
			var image = event.target;
			var bitmap;
			var container = new createjs.Container();
			parentThis.gameUI.addChild(container);
			
			for(var i=0;i<10;i++)
			{
				bitmap = new createjs.Bitmap(image);
				container.addChild(bitmap);
				bitmap.x = parentThis.canvas.width * Math.random()|0;
				bitmap.y = parentThis.canvas.height * Math.random()|0;
				bitmap.rotation = 360 * Math.random()|0;
				bitmap.regX = bitmap.image.width/2|0;
				bitmap.regY = bitmap.image.height/2|0;
				bitmap.scaleX = bitmap.scaleY = bitmap.scale = Math.random()*0.4+0.6;
				bitmap.name = "test:"+i;
				
				var hitArea = new createjs.Shape();
				hitArea.x = bitmap.width/2;
				hitArea.y = bitmap.height/2;
				//hitArea.graphics.beginFill("#FF0").drawEllipse(-11,-14,24,18);
				//hitArea.graphics.beginStroke("#FF0").setStrokeStyle(5).drawPolyStar(0,0,bitmap.height/2-15,5,0.6).closePath();

				// assign the hitArea to each bitmap to use it for hit tests:
				//bitmap.hitArea = hitArea;
				//bitmap.mask = hitArea;
				//container.addChild(hitArea);
				
				bitmap.onPress = function(evt) {
						alert("tar:"+evt.target.name);

				
				}
			}
			
			
		}

	}
	p._initializeInventoryUI = function()
	{
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
			txt.text = "Compine Objects";
			txt.lineWidth = w;
			txt.textBaseline = "top";
			txt.textAlign = "center";
			txt.y = 1.1*y;
			txt.x = x+w/2;
		this.inventoryCompineUI.addChild(txt);
		
		
		
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
		this.inventorySelectUI.addChildAt(bg);
		
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
		
		
			
		
		// start the tick and point it at the window so we can do some work before updating the stage:
		createjs.Ticker.useRAF = true;
		// if we use requestAnimationFrame, we should use a framerate that is a factor of 60:
		createjs.Ticker.setFPS(50);
		
		this.inventorySelectUI.onPress = function(event)
		{
			parentThis.inventoryCommand("toggleSelectUI");
		}
		
		this.inventoryCompineUI.onPress = function(event)
		{
			parentThis.inventoryCommand("openCompineUI");
		}
		this.inventoryViewUI.onPress = function(event)
		{
			parentThis.inventoryCommand("openViewUI");
		}
		
		
				
	}
	p._initializeGameLogUI = function()
	{
		
	}
	p.inventoryCommand = function(command)
	{
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
		if(command=="openViewUI"&&this.inventoryTransitionPosition==1)
			return false;
		if(command=="openCompineUI"&&this.inventoryTransitionPosition==2)
			return false;
		createjs.Ticker.addListener(this);
	}
	p.tickPercent=0;
	p.tick = function()
	{
		this.inventoryTransition((++this.tickPercent)/20);
		if(this.tickPercent==20)
		{
			createjs.Ticker.removeListener(this)
			this.tickPercent=0;
		}
	}

	/** @namespace */
	advenGameEngine.GraphicsUI = GraphicsUI;
	
}());
