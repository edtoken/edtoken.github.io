(function($){

	var AppMods = function(){
		var that = this;

		this.app.ev.click.clickMainMenu = this.app.n.$mainnav.on('click', function(e){
			if(e.target.getAttribute('href').indexOf('#') >= 0){
				var page = e.target.getAttribute('href').replace('#', '');
				that.app.e.trigger('setpage', page);	
				return false;
			}
		});

		this.app.ev.click.clickNextRowFirst = this.app.n.$nextRowFirst.on('click', function(e){
			that.app.e.trigger('setpage', 'skills');	
		});

		this.app.ev.scroll.scrollHash = function(){
			if(that.app.timers.pagescroll !== undefined){
				return false;
			}

			var scrollSize = that.app.attributes.scroll;
			var headHeight = that.app.n.$siteheader.height();

			var $items = that.app.n.$mainnav.find('a');

			$items.each(function(){
				var name = this.getAttribute('href').replace('#', '');
				if(name.length > 0 && that.app.attributes.page !== name){
					var node = document.getElementById('n-'+name);
					if(node){
						$node = $(node);
						if(scrollSize + headHeight > $node.offset().top && scrollSize + headHeight < $node.height() + $node.offset().top){
							// TODO
							// that.app.e.trigger('setpage', name);	
							that.app.attributes.page = name;
							// window.location.hash = name;
						}
					}
				}
			});
		};

		this.app.ev.scroll.firstScroll = function(){
			if(!that.app.attributes.fn.firstScroll){
				that.app.n.$nextRowFirst.addClass('active');
				setTimeout(function() {
					that.app.n.$nextRowFirst.find('i').removeClass('disable');
					that.app.attributes.fn.firstScroll = true;
				}, 100);
			}
		};

		this.app.ev.scroll.scrollOpacityHomeRow = function(){
			// console.log('a');
		};
	};

	var AppFunctions = function(){
		var that = this;

		this.makeEvents = function(){

			this.app.e.on('setpage', function(event, name, data){
				var node = document.getElementById('n-'+name);
				if(node){
					
					if(typeof that.app.timers.pagescroll !== 'undefined'){
						that.app.timers.pagescroll.stop();
					}

					that.app.timers.pagescroll = $('html, body').animate({
						scrollTop:$(node).offset().top - that.app.n.$siteheader.height()
					}, that.app.attributes.scrollspeed, function(){
						// window.location.hash = name;
						that.app.attributes.page = name;
						delete that.app.timers.pagescroll; 
					});
					
				}
			});

			this.app.e.on('scroll', function(){
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
				that.app.attributes.scroll = scrollTop;
				for(var func in that.app.ev.scroll){
					that.app.ev.scroll[func].apply(this);
				}
			});

			// for(var ev in this.app.ev.click){
			// 	if(ev !== scroll){
			// 		for(var func in this.app.ev[ev]){
			// 			this.app.ev[ev][func] = this.app.e.on(ev, function(){
			// 				that.app.ev[ev][func].apply(this);
			// 			});
			// 		}
			// 	}
			// }
		};
	};

	var App = function(){

		var that = this;
		this.attributes = {
			page:'',
			scrollspeed:500,
			fn:{}
		};

		this.e = $(document);
		this.$body = $('body');
		this.ev = {
			click:{},
			scroll:{}
		};
		this.n = {};
		this.fn = {};
		this.mod = {};
		this.timers = {};

		return {
			initialize:function(options){

				AppFunctions.prototype.app = that;
				AppMods.prototype.app = that;
				
				that.n.mainnav = document.getElementById('siteMainNav');
				that.n.$mainnav = $(that.n.mainnav);
				that.n.siteheader = document.getElementById('siteHeaderWrap');
				that.n.$siteheader = $(that.n.siteheader);
				that.n.nextRowFirst = document.getElementById('nextRowFirst');
				that.n.$nextRowFirst = $(that.n.nextRowFirst);

				that.fn = new AppFunctions();
				that.mod = new AppMods();

				that.fn.makeEvents();

				var hash = window.location.hash;
				if(hash.length > 0){
					that.e.trigger('setpage', hash.replace('#', ''));	
				}
			}
		}
	}

	$(document).ready(function(){
		new App().initialize({
			debug:true
		});
	});

})(jQuery);