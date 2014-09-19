(function($){

    /**
     * functions
     */
    var HomeCanvas = function(){

        var that = this;
        this.canvas = document.getElementById('maincanvas');
        this.$canvas = $(this.canvas);
        this.canvas.width = $(window).width();
        this.canvas.height = $(window).height();
        this.ctx = this.canvas.getContext('2d');

        this.render = function(evt){
           
            var step = that.app.attributes.canvas.main.step;
            this.ctx.beginPath();
            this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);

            // render steps text
            if(step < that.app.attributes.canvas.main.stepmax){
                var msg = that.app.attributes.canvas.main.messages[step];
                this.ctx.font = "500 60px PT Sans";
                this.ctx.fillStyle = '#b6b6b6';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(
                    msg,
                    this.ctx.canvas.width / 2,
                    this.ctx.canvas.height / 2
                );
            }

            if(step === this.app.attributes.canvas.main.stepmax -1 && evt !== undefined){

                var color = this.app.attributes.canvas.main.colormove;
                var position = this.app.fn.getMousePos(this.canvas, evt);

                if(this.app.attributes.canvas.main.colortmplength === this.app.attributes.canvas.main.colorlength ){
                    this.app.attributes.canvas.main.colortmplength = 0;
                }

                if(this.app.attributes.canvas.main.colortmplength === 0){
                    this.app.attributes.canvas.main.colormove = this.app.fn.getRandomColor();
                }

                this.app.attributes.canvas.main.fillrects.push({color:color, x:position.x, y:position.y});

                for(var i=0; i< this.app.attributes.canvas.main.fillrects.length;i++){

                    this.ctx.fillStyle = this.app.attributes.canvas.main.fillrects[i].color;
                    this.ctx.fillRect(
                        this.app.attributes.canvas.main.fillrects[i].x,
                        this.app.attributes.canvas.main.fillrects[i].y,
                        10,
                        10
                    );

                }

                this.app.attributes.canvas.main.colortmplength++;


            }

            

        };

        /**
         * events
         */
        this.$canvas.on('mousedown touchstart', function(){
            that.app.attributes.canvas.main.step++;
            that.render();
        });

        this.$canvas.on('mousemove touchmove', function(e){
            if(that.app.attributes.canvas.main.step === that.app.attributes.canvas.main.stepmax -1){
                that.render(e);
            }
        });

        this.$canvas.on('mouseup touchend mouseout touchleave', function(e){
            if(that.app.attributes.canvas.main.step === that.app.attributes.canvas.main.stepmax -1){
                that.app.attributes.canvas.main.step++;
                that.render(e);
            }
        });
        
        // render
        this.render();
    };

    var Functions = function(){

        this.getRandomColor = function() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        this.getMousePos = function(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            x = evt.clientX;
            y = evt.clientY;

            if(evt.originalEvent.touches){
                x = evt.originalEvent.touches[0].pageX;
                y = evt.originalEvent.touches[0].pageY;
            }

            return {
                x: x - rect.left,
                y: y - rect.top
            };
        };

    };

    var App = function(){

        var that = this;
        this.attributes = {
            canvas:{
                main:{
                    fillrects:[],
                    colormove:'#fefefe',
                    colortmplength:0,
                    colorlength:30,
                    rendermove:false,
                    step:0,
                    stepmax:3,
                    messages:['hm... click!', 'ehehe, now move!', 'good, started :)']
                }
            }
        };

        this.modules = {};

        return {
            initialize:function(options){
                that.attributes = $.extend(options, that.attributes);
                
                Functions.prototype.app = that;
                that.fn = new Functions();

                HomeCanvas.prototype.app = that;
                that.modules.homecanvas = new HomeCanvas();
            }
        }
    };

    $(document).ready(function(){
        new App().initialize({

        });
    });

})(jQuery);