(function($){

  $.fn.canvasRadialProcess = function(){

    /**
     * by Ed
     * editied@gmail.com
     */
    
      if("getContext" in document.createElement("canvas") === false){
        return false;
      }

      window.requestAnimationFrame = window.requestAnimationFrame 
        || window.mozRequestAnimationFrame 
        || window.webkitRequestAnimationFrame 
        || window.msRequestAnimationFrame;

      var App = function(options){

        this.fn = {};

        /**
        * make canvas element
        * returned app obj
        */
        this.fn.makeNode = function(){
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          ctx.canvas.width = this.attributes.width;
          ctx.canvas.height = this.attributes.height;

          this.canvas = canvas;
          this.$canvas = $(canvas);
          this.ctx = ctx;

          return this;
        };

        this.fn.makeEvents = function(){
          var that = this;

          window.addEventListener('orientationchange', function(){
            that.setCompileData();
            that.render();
          });

          $(window).on('resize', function(){
            that.setCompileData();
            that.render();
          });
        };

        /**
        * append canvas element
        * returned app obj
        */
        this.fn.appendNode = function(){
          this.$el.html(this.canvas);
          return this;
        };

        this.fn.makeCompileData = function(){
          var out = {};
          out.fulltext = this.el.innerHTML.split(' ')[0];
          out.percentEnd = parseInt(this.el.innerHTML.split(' ')[1].replace('%', ''));
          return out;
        };

        this.fn.setCompileData = function(){

          var width = this.$el.width();
          var height = width;

          this.attributes = $.extend(
            this.attributes,
            {
              width: width,
              height:height
            }
          );

          this.ctx.width = this.attributes.width;
          this.ctx.height = this.attributes.height;
          this.canvas.width = this.attributes.width;
          this.canvas.height = this.attributes.height;
        };

        /**
         * render canvas obj
         */
        this.fn.render = function(){

          var that = this;
                  this.ctx.beginPath();
                  this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);

                  var sizeData = {
                      w:this.attributes.width,
                      h:this.attributes.height
                  };

                  if(sizeData.w < sizeData.h){
                      sizeData.h = sizeData.w;
                  }

                  if(!this.attributes.processColor){
                    this.attributes.processColor = this.attributes.colors[Math.floor(Math.random()*this.attributes.colors.length)];
                  }

                  // background out
                  this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
                  this.ctx.beginPath();
                  this.ctx.arc(
                      sizeData.h /2,
                      sizeData.w /2,
                      sizeData.w /2, 0, 2 * Math.PI, false
                  );
                  this.ctx.closePath();
                  this.ctx.fill();
                  // #

                   // line
                  this.ctx.fillStyle = 'transparent';
                  this.ctx.beginPath();
                  this.ctx.arc(
                      sizeData.w /2,
                      sizeData.h /2,
                      sizeData.w /2 - 6,
                      -(Math.PI / 2),
                      ((Math.PI * 2) * this.attributes.process/100) - Math.PI / 2,
                      false
                  );
                  this.ctx.lineWidth = 6;
                  this.ctx.strokeStyle = this.attributes.processColor;
                  this.ctx.stroke();

                  this.ctx.closePath();
                  this.ctx.fill();
                  // #
                  
                  this.ctx.font = "500 14px AvenirNextCondensed-Regular";
                  this.ctx.fillStyle = this.attributes.processColor;
                  this.ctx.textAlign = 'center';
                  this.ctx.textBaseline = 'middle';
                  this.ctx.fillText(this.attributes.fulltext, sizeData.w /2, sizeData.h/2);
                  this.ctx.font = "500 8px AvenirNextCondensed-Regular";
                  this.ctx.fillStyle = '#ffffff';
                  this.ctx.fillText('0', sizeData.w /2, 7);

                  // var ang = 360 * this.attributes.process / 100;
                  // if(ang < 180){
                  //   var b = Math.sin(180 - ang) * sizeData.w /2;
                  //   var npos = {
                  //     x:sizeData.w /2 + b,
                  //     y:sizeData.h /2 + 10
                  //   }
                  //   console.log('b', b);
                  //   this.ctx.fillText(this.attributes.process, 30, npos.y);
                  // }
                  


          if(this.attributes.process < this.attributes.percentEnd){
            this.attributes.process++;
            requestAnimationFrame(function(){
              that.render();
            });
          }
        };

        this.fn.init = function(node, options){
          var that = this;
          this.el = node;
          this.$el = $(this.el);
          this.attributes = $.extend(
            {
              percentEnd:0,
              percentStart:0,
              process:0,
              colors:[
                'rgba(86, 219, 204, 0.6)',
                'rgba(219, 86, 86, 0.6)',
                'rgba(86, 101, 219, 0.6)',
                'rgba(86, 101, 219, 0.6)',
                'rgba(219, 86, 219, 0.6)'
              ]
            },
            this.makeCompileData()
          );
          this.makeNode();
          this.appendNode();
          this.makeEvents();
          this.setCompileData();
          this.render();
        };

        return this;
      };

      return this.each(function(){
        var OBJ = new App();
        OBJ.fn.init(this, {});
      });

  };

})(jQuery);
