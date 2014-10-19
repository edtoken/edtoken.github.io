(function($){

	/**
	 * calculate info
	 * http://www.litunovskiy.com/gamedev/intersection_of_two_circles/
	 */

	window.requestAnimationFrame = window.requestAnimationFrame 
	|| window.mozRequestAnimationFrame 
	|| window.webkitRequestAnimationFrame 
	|| window.msRequestAnimationFrame;

	var getRandomColor = function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	var canvasFunctions = function(){

		var that = this;
		this.calc = {};
		this.render = {};

		/**
		 * render line
		 */
		this.render.line = function(data){
			that.app.ctx.lineWidth = data.lineWidth;
			that.app.ctx.strokeStyle = data.strokeStyle;
			for(var i=0; i<data.items.length;i++){
				that.app.ctx.beginPath();
				data.items[i] = that.app.fn.calc.getValues(data.items[i]);
				that.app.ctx.moveTo(data.items[i].x1, data.items[i].y1);
				that.app.ctx.lineTo(data.items[i].x2, data.items[i].y2);
				that.app.ctx.stroke();
			}
		};

		/**
		 * render ARC
		 */
		this.render.arc = function(data){
			that.app.ctx.fillStyle = data.background;			
			for(var i=0; i< data.items.length;i++){
				that.app.ctx.beginPath();
				data.items[i] = that.app.fn.calc.getValues(data.items[i]);
				that.app.ctx.arc(
					data.items[i].x, 
					data.items[i].y, 
					data.items[i].r, 
					data.items[i].sAngle * (Math.PI / 180), 
					data.items[i].eAngle * (Math.PI / 180), 
					data.items[i].counterclockwise
				);
				if(!data.strokeStyle && !data.lineWidth){
					that.app.ctx.fill();				
				}else{
					that.app.ctx.strokeStyle = data.strokeStyle;
					that.app.ctx.stroke();			
				}
			}
			that.app.log({msg:'[F] [ARC] render ', data:data});
		};

		/**
		 * calculate step ready
		 */
		this.calc.getReady = function(start, end){
			
			if(start > that.app.attributes.r.step){
				return 0;
			}

			if(that.app.attributes.r.step === end){
				return that.app.attributes.r.percent;
			}

			if(that.app.attributes.r.step > end){
				return 100;
			}

			var time = 0;
			var currentTimeProcess = 0;
			var currentTime = that.app.attributes.r.steps[that.app.attributes.r.step];

			for(var i=0; i< end; i++){

				var step = that.app.attributes.r.steps[i];
				if(i < that.app.attributes.r.step){
					currentTimeProcess += step;
				}

				time += step;
			}

			var currentTimeP = currentTime / 100 * that.app.attributes.r.percent;
			currentTimeProcess += currentTimeP;
			var percent = currentTimeProcess * 100 / time;
			return percent;
		}

		/**
		 * returned compile item values
		 */
		this.calc.getValues = function(obj){
			for(var n in obj){
				if(typeof obj[n] === 'function'){
					obj[n] = obj[n]();
				}
			}
			return obj;
		}
		/**
		 * returned item obj
		 */
		this.calc.getItem = function(items, name){
			for(var n in items){
				if(items[n].name === name){
					var item = that.app.fn.calc.getValues(items[n]);
					return item;
				}
			}
			return false;
		}

		/**
		 * calculate canvas data
		 */
		this.calc.getData = function(){

			that.app.ctx.canvas.width = that.app.$canvas.width();
			that.app.ctx.canvas.height = that.app.$canvas.height();

			var opt = {};

			opt.base = {};
			opt.base.width = that.app.canvas.width;
			opt.base.height = that.app.canvas.height;
			opt.base.colors = {
				line1:'#000000',
				line2:'#000000',
				line3:'#000000',
				line4:'#000000',
				point1:'#000000',
				point2:'#000000'
			};

			opt.area = {};
			opt.area.scroll = $(window).scrollTop();
			opt.area.x1 = 20;
			opt.area.y1 = 20;
			opt.area.x2 = that.app.canvas.width - 20;
			opt.area.y2 = that.app.canvas.height - 20;
			opt.area.width =  that.app.canvas.width - 40;
			opt.area.height =  that.app.canvas.height - 40;
			opt.area.center = {x:that.app.canvas.width / 2, y:that.app.canvas.height / 2};

			/**
			 * render items
			 */
			opt.items = [
				// {
				// 	name:'',
				// 	type:'',
				// 	step:{start:1,end:1},
				// 	background:
				// 	items:
				// },
				{
					name:'startPoints',
					type:'arc',
					step:{start:1, end:10, full:false},
					background:opt.base.colors.point1,
					items:[
						{
							x:opt.area.x1, 
							y:opt.area.y1,
							r: 3 / 100 * that.app.fn.calc.getReady(1, 1), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:opt.area.x1, 
							y:opt.area.y2,
							r: 3 / 100 * that.app.fn.calc.getReady(1, 1), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:opt.area.x2, 
							y:opt.area.y1,
							r: 3 / 100 * that.app.fn.calc.getReady(1, 1), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:opt.area.x2, 
							y:opt.area.y2,
							r: 3 / 100 * that.app.fn.calc.getReady(1, 1), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						}
					]
				},

				{
					name:'startLines',
					type:'line',
					step:{start:2, end:10, full:false},
					lineWidth:1,
					strokeStyle:opt.base.colors.line1,
					items:[
						{
							x1:opt.area.x1, 
							x2:opt.area.x1 + ((opt.area.x2 - opt.area.x1) / 100 * that.app.fn.calc.getReady(2, 2)), 
							y1:opt.area.y1, 
							y2:opt.area.y1
						},
						{
							x1:opt.area.x2, 
							x2:opt.area.x2, 
							y1:opt.area.y1, 
							y2:opt.area.y1 + ((opt.area.y2 - opt.area.y1) / 100 * that.app.fn.calc.getReady(2, 2))
						},
						{
							x1:opt.area.x1, 
							x2:opt.area.x1, 
							y1:opt.area.y1, 
							y2:opt.area.y1 + ((opt.area.y2 - opt.area.y1) / 100 * that.app.fn.calc.getReady(2, 2))
						},
						{
							x1:opt.area.x1, 
							x2:opt.area.x1 + ((opt.area.x2 - opt.area.x1) / 100 * that.app.fn.calc.getReady(2, 2)), 
							y1:opt.area.y2, 
							y2:opt.area.y2
						}
					]

				},

				{
					name:'baseLine',
					type:'line',
					step:{start:3, end:10},
					lineWidth:1,
					strokeStyle:opt.base.colors.line1,
					items:[
						{
							x1:opt.base.width / 8,
							x2:opt.base.width / 8 + ((opt.base.width / 8 * 6) / 100 * that.app.fn.calc.getReady(3, 3)), 
							y1:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							}, 
							y2:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							}
						}
					]
				},

				{
					name:'baseLineStartPoint',
					type:'arc',
					step:{start:4, end:10},
					background:opt.base.colors.point1,
					items:[
						{
							x:opt.area.center.x, 
							y:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(4, 4), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						}
					]
				},

				{
					name:'baseLineFirstArc',
					type:'arc',
					step:{start:5, end:10},
					background:'transparent',
					strokeStyle:opt.base.colors.line1,
					lineWidth:1,
					items:[
						{
							x:opt.area.center.x, 
							y:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							},
							r: function(){
								var a1 = $('#visitCardHeader').height();
								var a2 = $('#visitCardBody').height();
								var a3 = $('#visitCardFooter').height();
								
								var a = (a1+a2+a3) / 2;
								var b = $('#visitCardHeader').width()/2;
								var r = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
								return r;
							}, 
							sAngle:0, 
							eAngle:360 / 100 * that.app.fn.calc.getReady(5, 5),
							counterclockwise:false
						}
					]
				},

				{
					name:'baseLineSecondPoints',
					type:'arc',
					step:{start:6, end:10},
					background:opt.base.colors.point1,
					items:[
						{
							x:function(){
								return opt.area.center.x - $('#visitCardHeader').width() / 2;
							}, 
							y:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(6, 6), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:function(){
								return opt.area.center.x + $('#visitCardHeader').width() / 2;
							},
							y:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(6, 6), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						}
					]
				},

				{
					name:'baseLineSecondArcs',
					type:'arc',
					step:{start:7, end:10},
					background:'transparent',
					strokeStyle:opt.base.colors.line1,
					lineWidth:1,
					items:[
						{
							x:function(){
								return opt.area.center.x - $('#visitCardHeader').width() / 2;
							},
							y:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							},
							r: function(){
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return (a+b+c) / 2;
							}, 
							sAngle:0, 
							eAngle:360 / 100 * that.app.fn.calc.getReady(7, 7),
							counterclockwise:false
						},

						{
							x:function(){
								return opt.area.center.x + $('#visitCardHeader').width() / 2;
							},
							y:function(){
								var top = $('#visitCardHeader').offset().top;
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return top + ((a+b+c)/2) - opt.area.scroll;
							},
							r: function(){
								var a = $('#visitCardHeader').height();
								var b = $('#visitCardBody').height();
								var c = $('#visitCardFooter').height();
								return ((a+b+c) / 2) / 100 * that.app.fn.calc.getReady(7, 7);
							}, 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						}
					]
				},

				{
					name:'baseLineIntersectionPoints',
					type:'arc',
					step:{start:8, end:10},
					background:opt.base.colors.point1,
					items:[
						{
							x:function(){
								var dataCircle = that.app.fn.calc.getItem(opt.items, 'baseLineFirstArc');
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var c1 = dataCircles.items[0];
								var d1 = dataCircle.items[0].r;
								var b1 = (Math.pow(d1, 2) - Math.pow(c1.r, 2) + Math.pow(d1, 2)) / (2 * d1);
								// return opt.area.center.x - b1;
								return opt.area.center.x - $('#visitCardHeader').width() / 2;
							}, 
							y:function(){
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var dataCircleItem = that.app.fn.calc.getValues(dataCircles.items[0]);
								var items = that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var a = items.items[0].x - dataCircleItem.x;
								var b = Math.sqrt(Math.pow(dataCircleItem.r, 2) - Math.pow(a, 2));
								return dataCircleItem.y + b;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(8, 8), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:function(){
								var dataCircle = that.app.fn.calc.getItem(opt.items, 'baseLineFirstArc');
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var c1 = dataCircles.items[1];
								var d1 = dataCircle.items[0].r;
								var b1 = (Math.pow(d1, 2) - Math.pow(c1.r, 2) + Math.pow(d1, 2)) / (2 * d1);
								// return opt.area.center.x + b1;
								return opt.area.center.x + $('#visitCardHeader').width() / 2;
							}, 
							y:function(){
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var dataCircleItem = that.app.fn.calc.getValues(dataCircles.items[1]);
								var items = that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var a = items.items[1].x - dataCircleItem.x;
								var b = Math.sqrt(Math.pow(dataCircleItem.r, 2) - Math.pow(a, 2));
								return dataCircleItem.y + b;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(8, 8), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:function(){
								var dataCircle = that.app.fn.calc.getItem(opt.items, 'baseLineFirstArc');
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var c1 = dataCircles.items[0];
								var d1 = dataCircle.items[0].r;
								var b1 = (Math.pow(d1, 2) - Math.pow(c1.r, 2) + Math.pow(d1, 2)) / (2 * d1);
								// return opt.area.center.x - b1;
								return opt.area.center.x - $('#visitCardHeader').width() / 2;
							}, 
							y:function(){
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var dataCircleItem = that.app.fn.calc.getValues(dataCircles.items[0]);
								var items = that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var a = items.items[0].x - dataCircleItem.x;
								var b = Math.sqrt(Math.pow(dataCircleItem.r, 2) - Math.pow(a, 2));
								return dataCircleItem.y - b;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(8, 8), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						},
						{
							x:function(){
								var dataCircle = that.app.fn.calc.getItem(opt.items, 'baseLineFirstArc');
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var c1 = dataCircles.items[1];
								var d1 = dataCircle.items[0].r;
								var b1 = (Math.pow(d1, 2) - Math.pow(c1.r, 2) + Math.pow(d1, 2)) / (2 * d1);
								// return opt.area.center.x + b1;
								return opt.area.center.x + $('#visitCardHeader').width() / 2;
							}, 
							y:function(){
								var dataCircles = that.app.fn.calc.getItem(opt.items, 'baseLineSecondArcs');
								var dataCircleItem = that.app.fn.calc.getValues(dataCircles.items[1]);
								var items = that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var a = items.items[1].x - dataCircleItem.x;
								var b = Math.sqrt(Math.pow(dataCircleItem.r, 2) - Math.pow(a, 2));
								return dataCircleItem.y - b;
							},
							r: 3 / 100 * that.app.fn.calc.getReady(8, 8), 
							sAngle:0, 
							eAngle:360,
							counterclockwise:false
						}
					]
				},

				{
					name:'baseCardLine',
					type:'line',
					step:{start:9, end:11},
					lineWidth:2,
					strokeStyle:opt.base.colors.line2,
					items:[
						{
							x1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[0];
								return item.x;
							},
							x2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[1];
								var itemFirst = items.items[0];
								return itemFirst.x + (item.x - itemFirst.x) / 100 * that.app.fn.calc.getReady(9, 9);
							},
							y1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[0];
								return item.y;
							}, 
							y2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[1];
								return item.y;
							}
						},

						{
							x1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								return item.x;
							},
							x2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[3];
								var itemFirst = items.items[2];
								return itemFirst.x + (item.x - itemFirst.x) / 100 * that.app.fn.calc.getReady(9, 9);
							},
							y1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								return item.y;
							}, 
							y2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[3];
								return item.y;
							}
						},

						{
							x1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								return item.x;
							},
							x2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								return item.x;
							},
							y1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								return item.y;
							}, 
							y2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								var itemFirst = items.items[1];
								return item.y + (itemFirst.y - item.y) / 100 * that.app.fn.calc.getReady(9, 9);
							}
						},

						{
							x1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[1];
								return item.x;
							},
							x2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[1];
								return item.x;
							},
							y1:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[2];
								return item.y;
							}, 
							y2:function(){
								var items =  that.app.fn.calc.getItem(opt.items, 'baseLineIntersectionPoints');
								var item = items.items[1];
								var itemFirst = items.items[2];
								return itemFirst.y + (item.y - itemFirst.y) / 100 * that.app.fn.calc.getReady(9, 9);
							}
						}
					]
				}

			];

			

			return opt;
		};
	};
	
	var App = function(){

		var that = this;
		this.attributes = {
			debug:false,
			r:{
				speed:1,
				process:0,
				step:1,
				percent:0,
				steps:[5,5,5,5,20,5,20,10,30]
			}
		};
		
		this.nodes = {};

		this.log = function(data){
			if(this.attributes.debug){
				if(data.data){
					console.info('> ', data.msg, data.data);
				}else{
					console.info('> ', data.msg);
				}
			}
		};

		/**
		 * create canvas events
		 */
		this.makeEvents = function(){

			$(window).on('resize', function(){
		            that.render();
		        });
		        $(window).on('scroll', function(){
		            that.render();
		        });

		};

		this.render = function(){

			var d = this.fn.calc.getData();
			var c = this.ctx;
			c.clearRect(0,0,d.base.width, d.base.height);

			for(var item in d.items){
				switch(d.items[item].name){

					default:

						if(typeof d.items[item].step.full !== 'undefined'
							&& d.items[item].step.full === false
							&& d.items[item].step.end <= this.attributes.r.step
						){
							continue;
						}

						if(d.items[item].step.start && d.items[item].step.start > this.attributes.r.step){
							continue;
						}

						switch(d.items[item].type){

							case 'line':
								this.fn.render.line(d.items[item]);
								this.log({msg:'[F] render items type: LINE', data:d.items[item]});
								break;

							case 'arc':
								this.fn.render.arc(d.items[item]);
								this.log({msg:'[F] render items type: ARC', data:d.items[item]});
								break;

							default:

								this.log({msg:'[F] render items', data:d.items[item]});
								break;
						}

						break;
				}
			}

			if(this.attributes.r.step <= this.attributes.r.steps.length){

				requestAnimationFrame(function(){
				    if(that.attributes.r.process < that.attributes.r.steps[that.attributes.r.step - 1]){
				        that.attributes.r.process++;
				        that.attributes.r.percent = that.attributes.r.process * 100 / that.attributes.r.steps[that.attributes.r.step - 1];
				    }else{
				        that.attributes.r.process = 0;
				        that.attributes.r.percent = 0;
				        that.attributes.r.step++;
				    }
				    
				    // TODO
				    // if(that.attributes.r.step <= that.attributes.r.steps.length){
				        that.render();
				    // }

				    	if(that.attributes.r.step > that.attributes.r.steps.length){
				    		that.renderFinal();
					}
				});

			}

			this.renderFinal = function(){
				$('#visitCardHeader').removeClass('disable');
				$('#visitCardBody').removeClass('disable');
				$('#visitCardFooter').removeClass('disable');
			}

			this.log({msg:'[F] render'});
			this.log({msg:'[D] render data', data:d});
		};

		this.init = function(options){

			if("getContext" in document.createElement("canvas") === false){
				return false;
        		}

        		this.fn.app = this;
			this.attributes = $.extend(this.attributes, options);
			this.canvas = document.getElementById('mainCanvas');
			this.$canvas = $(this.canvas);
			this.ctx = this.canvas.getContext('2d');
			this.ctx.canvas.width = this.$canvas.width();
			this.ctx.canvas.height = this.$canvas.height();

			this.makeEvents();
			this.render();
			this.log({msg:'[F] init'});
		};
	};
	
	$(document).ready(function(){

		App.prototype.fn = new canvasFunctions();
		new App().init({

		});

		var skillProcessInit = function(){

            var process =  0;
            var color;
            $('.skillsList li').append('<span></span>');

            var skillProcess = function(){
                $('.skillsList li span').each(function(){
                    color = getRandomColor();
                    var value = parseInt(this.parentNode.getAttribute('data-val')) / 100 * (process * 2);
                    this.setAttribute('style', 'background:' + color +';width:'+value+'%;');
                });

                if(process < 50){
                    requestAnimationFrame(skillProcess)
                    process++;
                }
            };

            new skillProcess;
        };

        new skillProcessInit;

	$(window).on('resize', function(){
		$('.skillsList li span').css('background', getRandomColor);
	});

	});

})(jQuery)