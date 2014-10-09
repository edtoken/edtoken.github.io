(function($){

	var AppMods = function(){

		this.appGlobalEvents = function(){
			var that = this;

			this.ev.custom.body_scroll = this.e.on('body_scroll', function(event, value){
				
				that.attributes.opt.body_scroll = value;

				switch(value){
					case true:
						that.n.$body.css({
							'overflow':'',
							'width':'',
							'height':'',
							'position':''
						});
						break;
					case false:
						that.n.$body.css({
							'overflow':'hidden',
							'width':'100%',
							'height':'100%',
							'position':'fixed'
						});
						break;
				}
			});
		};

		this.canvasRadialProcess = function(){
			$('.jtcradial').canvasRadialProcess();
			return true;
		};

		this.BrowserBodyClass = function(){
			function css_browser_selector(u){var ua=u.toLowerCase(),is=function(t){return ua.indexOf(t)>-1},g='gecko',w='webkit',s='safari',o='opera',m='mobile',h=document.documentElement,b=[(!(/opera|webtv/i.test(ua))&&/msie\s(\d)/.test(ua))?('ie ie'+RegExp.$1):is('firefox/2')?g+' ff2':is('firefox/3.5')?g+' ff3 ff3_5':is('firefox/3.6')?g+' ff3 ff3_6':is('firefox/3')?g+' ff3':is('gecko/')?g:is('opera')?o+(/version\/(\d+)/.test(ua)?' '+o+RegExp.$1:(/opera(\s|\/)(\d+)/.test(ua)?' '+o+RegExp.$2:'')):is('konqueror')?'konqueror':is('blackberry')?m+' blackberry':is('android')?m+' android':is('chrome')?w+' chrome':is('iron')?w+' iron':is('applewebkit/')?w+' '+s+(/version\/(\d+)/.test(ua)?' '+s+RegExp.$1:''):is('mozilla/')?g:'',is('j2me')?m+' j2me':is('iphone')?m+' iphone':is('ipod')?m+' ipod':is('ipad')?m+' ipad':is('mac')?'mac':is('darwin')?'mac':is('webtv')?'webtv':is('win')?'win'+(is('windows nt 6.0')?' vista':''):is('freebsd')?'freebsd':(is('x11')||is('linux'))?'linux':'','js']; c = b.join(' '); h.className += ' '+c; return c;}; 
			this.n.$body.addClass(css_browser_selector(navigator.userAgent));
			return true;
		};

		this.mobileNavigation = function(){
			var that = this;

			this.ev.click.mobileNavigation = $('#mainNavigation').on('click', function(e){
				if(e.target.id === 'mainNavigation'){
					$('#mainNavigation').toggleClass('active');
					if($('#mainNavigation').hasClass('active')){
						that.e.trigger('body_scroll', false);
					}else{
						that.e.trigger('body_scroll', true);
					}
				}
			});

			return true;
		};
	};

	var AppFunctions = function(){

	};

	var App = function(){

		var that = this;
		this.attributes = {
			page:'',
			scrollspeed:500,
			opt:{}
		};
		this.e = $(document);
		this.n = {};
		this.ev = {
			scroll:{},
			click:{},
			custom:{}
		};
		this.n.$body = $('body');
		this.fn = {};
		this.mods = {};
		this.timers = {};


		return {
			initialize:function(options){

				that.attributes = $.extend(options, that.attributes);

				AppFunctions.prototype.app = that;
				that.fn = new AppFunctions();
				var Mods = new AppMods();

				for(var mod in Mods){
					that.mods[mod] = Mods[mod].apply(that);
				}		
				
				return that;
			}
		}
	}

	$(document).ready(function(){

		new App().initialize({});
		$(window).on('scroll', function(){
			$('.skillsListWrap').removeClass('animate');
		});

	});

})(jQuery);