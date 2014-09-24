(function($){

	window.requestAnimationFrame = window.requestAnimationFrame 
	|| window.mozRequestAnimationFrame 
	|| window.webkitRequestAnimationFrame 
	|| window.msRequestAnimationFrame;

	var App = function(){

		var that = this;
		this.attributes = {
			canvasId:'cardCanvas',
			// rendered process
			rendered:{
				process:0,
				step:1,
				percent:0,
				steps:[15, 20, 30, 20]
			}
		};

		this.getReady = function(start, end){

			if(!end && start > this.attributes.rendered.step){
				return 0;
			}

			if(!end && start < this.attributes.rendered.step){
				return 100;
			}

			if(!end && start == this.attributes.rendered.step){
				return this.attributes.rendered.process * 100 / this.attributes.rendered.steps[this.attributes.rendered.step-1];
			}

			// if(end){

			// 	var v = 0;
			// 	for(var i=0; i<=end;i++){
			// 		v+= that.attributes.rendered.steps[i];
			// 	}
			// }
			
			return 100;
		};

		this.makeEvents = function(){

			$(window).on('resize', function(){
				that.ctx.canvas.width = that.$canvas.width();
				that.ctx.canvas.height = that.$canvas.height();
				that.render();
			});

		};

		this.fn = {};
		this.fn.renderLine = function(x1, x2, y1, y2, lineWidth, strokeStyle, options){
			this.ctx.beginPath();
			this.ctx.strokeStyle = strokeStyle;
			this.ctx.moveTo(x1, y1);
			this.ctx.lineTo(x2, y2);
			this.ctx.stroke();
		};
		this.fn.renderCircle = function(x, y, radius, background, options){
			this.ctx.beginPath();
			this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			this.ctx.fillStyle = background;
			this.ctx.fill();
		};
		this.fn.renderCircleRange = function(x, y, radius, background, lineWidth, strokeStyle, options){
			this.fn.renderCircle.call(this, x, y, radius, background, options);
			this.ctx.lineWidth = lineWidth;
			this.ctx.strokeStyle = strokeStyle;
			this.ctx.stroke();
		};

		this.fn.renderArc = function(x, y, radius, startAngle, endAngle, lineWidth, strokeStyle){
			this.ctx.beginPath();                                              
			this.ctx.arc(x, y, radius, startAngle, endAngle, false);
			this.ctx.lineWidth = lineWidth;                                         
			this.ctx.strokeStyle = strokeStyle;                                    
			this.ctx.stroke();
		};

		this.getData = function(){

			var r = that.attributes.rendered;
			var opt = {};
			
			opt.base = {};
			opt.base.width = this.canvas.width;
			opt.base.height = this.canvas.height;
			opt.base.colors = {
				line1:'#999999',
				line2:'#555555',
				line3:'#333333',
				line4:'#000000',
				point1:'#555555',
				point2:'#222222'
			};

			opt.area = {};
			opt.area.x1 = 20;
			opt.area.y1 = 20;
			opt.area.x2 = this.canvas.width - 20;
			opt.area.y2 = this.canvas.height - 20;
			opt.area.width =  this.canvas.width - 40;
			opt.area.height =  this.canvas.height - 40;
			opt.area.center = {x:this.canvas.width / 2, y:this.canvas.height / 2};

			/**
			 * render items
			 */
			opt.items = {};
			
			/**
			 * start points
			 */
			opt.items.startPoints = {
				radius:3 / 100 * this.getReady(1, false),
				background:opt.base.colors.point1,
				items:[
					{x:opt.area.x1, y:opt.area.y1},
					{x:opt.area.x1, y:opt.area.y2},
					{x:opt.area.x2, y:opt.area.y1},
					{x:opt.area.x2, y:opt.area.y2}
				]
			};

			/**
			 * start lines
			 */
			opt.items.startLines = {
				lineWidth:1,
				strokeStyle:opt.base.colors.line1,
				items:[
					{
						x1:opt.area.x1, 
						x2:opt.area.x1 + ((opt.area.x2 - opt.area.x1) / 100 * this.getReady(2, false)), 
						y1:opt.area.y1, 
						y2:opt.area.y1
					},
					{
						x1:opt.area.x2, 
						x2:opt.area.x2, 
						y1:opt.area.y1, 
						y2:opt.area.y1 + ((opt.area.y2 - opt.area.y1) / 100 * this.getReady(2, false))
					},
					{
						x1:opt.area.x1, 
						x2:opt.area.x1, 
						y1:opt.area.y1, 
						y2:opt.area.y1 + ((opt.area.y2 - opt.area.y1) / 100 * this.getReady(2, false))
					},
					{
						x1:opt.area.x1, 
						x2:opt.area.x1 + ((opt.area.x2 - opt.area.x1) / 100 * this.getReady(2, false)), 
						y1:opt.area.y2, 
						y2:opt.area.y2
					}
				]
			};

			/**
			 * started centered 
			 * point
			 */
			opt.items.startCenterPoint = {
				radius:3 / 100 * this.getReady(1, false),
				background:opt.base.colors.point2,
				position:{x:opt.area.center.x, y:opt.area.center.y}
			};

			/**
		       * started centered 
		       * circle
		       */
		      if(this.getReady(1, false)){
		      	opt.items.startCenterCircle = {
					radius:200,
					background:'transparent',
					lineWidth:1,
					strokeStyle:opt.base.colors.line2,
					position:{x:opt.area.center.x, y:opt.area.center.y}
			      };
		      }
		      

		      /**
		       * start circle rects
		       */
		      if(this.getReady(2, false)){

			      opt.items.startCircleResects = {
			      	radius:200,
			      	lineWidth:1,
			      	strokeStyle:opt.base.colors.line1,
			      	items:[
			      		{
			      			x:opt.area.center.x + opt.items.startCenterCircle.radius, 
			      			y:opt.area.center.y, 
			      			startAngle:110 * (Math.PI / 180) , 
			      			endAngle:130 * (Math.PI / 180) 
			      		}
			      	]
			      };

			      if(this.getReady(2, false)){
			      	opt.items.startCircleResects.items.push({
		      			x:opt.area.center.x - opt.items.startCenterCircle.radius, 
		      			y:opt.area.center.y, 
		      			startAngle:40 * (Math.PI / 180), 
		      			endAngle:70 * (Math.PI / 180)
		      		});
		      		opt.items.startCircleResects.items.push({
		      			x:opt.area.center.x - opt.items.startCenterCircle.radius, 
		      			y:opt.area.center.y, 
		      			startAngle:290 * (Math.PI / 180), 
		      			endAngle:310 * (Math.PI / 180)
		      		});
		      	}
		      	
			      if(this.getReady(3, false)){
		      		opt.items.startCircleResects.items.push({
		      			x:opt.area.center.x + opt.items.startCenterCircle.radius, 
		      			y:opt.area.center.y, 
		      			startAngle:230 * (Math.PI / 180), 
		      			endAngle:255 * (Math.PI / 180)
		      		});
			      }
			}

		      /**
		       * start circle points intersection
		       * calc http://algolist.manual.ru/maths/geom/intersect/circlecircle2d.php
		       */
		      if(this.getReady(2, false)){

			      opt.items.startCirclePoints = {
			      	radius:3,
					background:opt.base.colors.point2,
					items:[
						{
							x:function(){
								return opt.items.startCircleResects.items[0].x - opt.items.startCircleResects.radius / 2
							}, 
							y:function(){
								return opt.items.startCircleResects.items[0].y + (opt.items.startCenterCircle.radius * Math.sqrt(3) / 2) ;
							}
						}
						
					]
			      };

			      if(this.getReady(3, false)){
			      	opt.items.startCirclePoints.items.push({
						x:function(){
							return opt.items.startCircleResects.items[1].x + opt.items.startCircleResects.radius / 2
						}, 
						y:function(){
							return opt.items.startCircleResects.items[1].y + (opt.items.startCenterCircle.radius * Math.sqrt(3) / 2) ;
						}
					});
			      	opt.items.startCirclePoints.items.push({
						x:function(){
							return opt.items.startCircleResects.items[1].x + opt.items.startCircleResects.radius / 2
						}, 
						y:function(){
							return opt.items.startCircleResects.items[1].y - (opt.items.startCenterCircle.radius * Math.sqrt(3) / 2) ;
						}
					});
			      	opt.items.startCirclePoints.items.push({
						x:function(){
							return opt.items.startCircleResects.items[0].x - opt.items.startCircleResects.radius / 2
						}, 
						y:function(){
							return opt.items.startCircleResects.items[0].y - (opt.items.startCenterCircle.radius * Math.sqrt(3) / 2) ;
						}
					});
			      }
			}
		      /**
		       * baseLine
		       */
		      if(this.getReady(3, false)){
			      opt.items.baselineBottom = {
			      	lineWidth:1,
					strokeStyle:opt.base.colors.line2,
					position:{
						x1:opt.area.center.x - opt.items.startCenterCircle.radius - 100, 
						x2:opt.area.center.x - opt.items.startCenterCircle.radius - 100
							+ ( ((opt.area.center.x + opt.items.startCenterCircle.radius + 100) 
								- (opt.area.center.x - opt.items.startCenterCircle.radius - 100)) / 100 * this.getReady(3, false) )
						,
						y1:opt.items.startCirclePoints.items[0].y(), 
						y2:opt.items.startCirclePoints.items[0].y()
					}
			      };
			}

			if(this.getReady(3, false)){
			      opt.items.baseLineRight = {
			      	lineWidth:1,
					strokeStyle:opt.base.colors.line2,
					position:{
						x1:opt.area.center.x + opt.items.startCenterCircle.radius - 100, 
						x2:opt.area.center.x + opt.items.startCenterCircle.radius - 100,
						y1:opt.items.startCirclePoints.items[1].y(), 
						y2:opt.items.startCirclePoints.items[1].y() -
							(opt.items.startCirclePoints.items[1].y() - opt.items.startCirclePoints.items[2].y()) / 100 
							* this.getReady(3, false)
					}
			      };
			}

			if(this.getReady(4, false)){
			      opt.items.baseLineLeft = {
			      	lineWidth:2,
					strokeStyle:opt.base.colors.line2,
					position:{
						x1:opt.area.center.x - opt.items.startCenterCircle.radius + 100, 
						x2:opt.area.center.x - opt.items.startCenterCircle.radius + 100,
						y1:opt.items.startCirclePoints.items[0].y(), 
						y2:opt.items.startCirclePoints.items[1].y() -
							(opt.items.startCirclePoints.items[1].y() - opt.items.startCirclePoints.items[2].y()) / 100 
							* this.getReady(4, false)
					}
			      };
			}

			return opt;
		};

		this.render = function(){

			var d = this.getData();
			var c = this.ctx;

			c.beginPath();
			c.clearRect(0,0,d.base.width, d.base.height);

			/**
			 * renderred start points
			 */
			if(d.items.startLines){
				for(var i1 in d.items.startLines.items){
					this.fn.renderLine.call(
						this,
						d.items.startLines.items[i1].x1, 
						d.items.startLines.items[i1].x2, 
						d.items.startLines.items[i1].y1, 
						d.items.startLines.items[i1].y2, 
						d.items.startLines.lineWidth,
						d.items.startLines.strokeStyle
					);
				}
			}

			/**
			 * rendered start lines
			 */
			if(d.items.startPoints){
				for(var i2 in d.items.startPoints.items){
					this.fn.renderCircle.call(
						this,
						d.items.startPoints.items[i2].x, 
						d.items.startPoints.items[i2].y, 
						d.items.startPoints.radius,
						d.items.startPoints.background
					);
				}
			}

			/**
			 * render center point
			 */
			if(d.items.startCenterPoint){
				this.fn.renderCircle.call(
					this,
					d.items.startCenterPoint.position.x, 
					d.items.startCenterPoint.position.y, 
					d.items.startCenterPoint.radius,
					d.items.startCenterPoint.background
				);
			}

			/**
			* render center circle
			*/
			if(d.items.startCenterCircle){
				this.fn.renderCircleRange.call(
				this,
					d.items.startCenterCircle.position.x, 
					d.items.startCenterCircle.position.y, 
					d.items.startCenterCircle.radius,
					d.items.startCenterCircle.background,
					d.items.startCenterCircle.lineWidth,
					d.items.startCenterCircle.strokeStyle
				);
			}

			/**
			 * render circle rects
			 */
			if(d.items.startCircleResects){
				for(var i3 in d.items.startCircleResects.items){
					this.fn.renderArc.call(
						this,
						d.items.startCircleResects.items[i3].x, 
						d.items.startCircleResects.items[i3].y, 
						d.items.startCircleResects.radius, 
						d.items.startCircleResects.items[i3].startAngle, 
						d.items.startCircleResects.items[i3].endAngle,
						d.items.startCircleResects.items.lineWidth,
						d.items.startCircleResects.items.strokeStyle
					);
				}
			}

			/**
			 * rendered start circle points intersection
			 */
			if(d.items.startCirclePoints){
				for(var i2 in d.items.startCirclePoints.items){
					this.fn.renderCircle.call(
						this,
						d.items.startCirclePoints.items[i2].x(), 
						d.items.startCirclePoints.items[i2].y(), 
						d.items.startCirclePoints.radius,
						d.items.startCirclePoints.background
					);
				}
			}


			/**
			 * render baseLine
			 */
			if(d.items.baselineBottom){
				this.fn.renderLine.call(
					this,
					d.items.baselineBottom.position.x1, 
					d.items.baselineBottom.position.x2, 
					d.items.baselineBottom.position.y1, 
					d.items.baselineBottom.position.y2, 
					d.items.baselineBottom.lineWidth,
					d.items.baselineBottom.strokeStyle
				);
			}

			/**
			 * baseline left 
			 */
			if(d.items.baseLineLeft){
				this.fn.renderLine.call(
					this,
					d.items.baseLineLeft.position.x1, 
					d.items.baseLineLeft.position.x2, 
					d.items.baseLineLeft.position.y1, 
					d.items.baseLineLeft.position.y2, 
					d.items.baseLineLeft.lineWidth,
					d.items.baseLineLeft.strokeStyle
				);
			}

			/**
			 * baseline right
			 */
			if(d.items.baseLineRight){
				this.fn.renderLine.call(
					this,
					d.items.baseLineRight.position.x1, 
					d.items.baseLineRight.position.x2, 
					d.items.baseLineRight.position.y1, 
					d.items.baseLineRight.position.y2, 
					d.items.baseLineRight.lineWidth,
					d.items.baseLineRight.strokeStyle
				);
			}

			if(this.attributes.rendered.step <= this.attributes.rendered.steps.length){

				requestAnimationFrame(function(){
				    if(that.attributes.rendered.process < that.attributes.rendered.steps[that.attributes.rendered.step - 1]){
				        that.attributes.rendered.process++;
				        that.attributes.rendered.percent = that.attributes.rendered.process * 100 / that.attributes.rendered.steps[that.attributes.rendered.step - 1];
				    }else{
				        that.attributes.rendered.process = 0;
				        that.attributes.rendered.percent = 0;
				        that.attributes.rendered.step++;
				    }

				    // TODO
				    if(that.attributes.rendered.step <= that.attributes.rendered.steps.length){
				        that.render();
				    }
				});

			}

			// console.log('RENDER', 'step:',this.attributes.rendered.step, 'process', this.attributes.rendered.process, 'end:',that.attributes.rendered.steps[that.attributes.rendered.step - 1], 'percent', this.attributes.rendered.percent);
		};

		this.initialize = function(opt){
			
			if("getContext" in document.createElement("canvas") === false){
				return false;
        		}

			var options = $.extend(that.attributes, opt);
			this.canvas = document.getElementById(options.canvasId);
			this.$canvas = $(this.canvas);
			this.ctx = this.canvas.getContext('2d');
			this.ctx.canvas.width = this.$canvas.width();
			this.ctx.canvas.height = this.$canvas.height();

			this.makeEvents();
			this.render();

		};
	}; 


	$(document).ready(function(){
		new App().initialize({
			canvasId:'cardCanvas',
			speed:3
		});
	});												

})(jQuery);