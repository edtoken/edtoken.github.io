(function($){

	var AppMods = function(){
		var that = this;

		this.mainNavigation = function(){
			this.app.n.$mainnav.on('click', function(e){
				if(e.target.getAttribute('href').indexOf('#') >= 0){
					var page = e.target.getAttribute('href').replace('#', '');
					that.app.e.trigger('setpage', page);	
					return false;
				}
			});
		};

		this.hashNavigation = function(){
			// $(window).on('hashchange', function(event){
			// 	var hash = this.location.hash;
			// 	if(typeof hash !== 'undefined' && hash.length > 0){
			// 		node = document.getElementById(hash.replace('#', ''));
			// 		if(node){
			// 			that.app.e.trigger('setpage', hash.replace('#', ''));	
			// 			return false;				
			// 		}
			// 	}
			// });
		};

		this.mainNavigation();
		this.hashNavigation();
		this.scrollHash();
	};

	var AppFunctions = function(){
		var that = this;

		this.makeEvents = function(){

			this.app.e.on('setpage', function(event, name){
				var node = document.getElementById(name);
				if(node){
					
					if(typeof that.app.timers.pagescroll !== 'undefined'){
						that.app.timers.pagescroll.stop();
					}

					that.app.timers.pagescroll = $('html, body').animate({
							scrollTop:$(node).offset().top - that.app.n.$siteheader.height()
					}, that.app.attributes.scrollspeed, function(){
						window.location.hash = name;
						that.app.attributes.page = name;
					});
				}
			});

			this.app.e.on('scroll', function(){
				alert('scrol');
			});
		};

		this.makeEvents();
	};

	var App = function(){

		var that = this;
		this.attributes = {
			page:'',
			scrollspeed:500
		};

		this.e = $(document);
		this.$body = $('body');
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

				that.fn = new AppFunctions();
				that.mod = new AppMods();
			}
		}
	}

	$(window).on('hashchange', function(e){
		e.preventDefault();
		return false;
	});

	$(document).ready(function(){
		new App().initialize({
			debug:true
		});
	});

})(jQuery);