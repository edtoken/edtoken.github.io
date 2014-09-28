(function(){

    window.requestAnimationFrame = window.requestAnimationFrame ||
                                        window.mozRequestAnimationFrame ||
                                        window.webkitRequestAnimationFrame ||
                                        window.msRequestAnimationFrame;

    var getRandomColor = function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var mainCanvas = function(){

        var that = this;
        this.canvas = document.getElementById('mainCanvas');
        this.$canvas = $(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = $(window).width();
        this.canvas.height = $(window).height();

        $(window).on('resize', function(){
            that.render();
        });
        $(window).on('scroll', function(){
            that.render();
        });

        this.getCalcData = function(){

            var mobile = $(window).width() < 980;
            this.canvas.width = $(window).width();
            this.canvas.height = $(window).height();

            var top  = window.pageYOffset || document.documentElement.scrollTop;
            var headerData = {
                text:Math.ceil(this.app.$header.width() / 100 * this.app.attributes.step),
                x1:this.app.$header.offset().left,
                y:this.app.$header.offset().top - 40 - top,
                x2:this.app.$header.offset().left + this.app.$header.width(),
                process:this.app.$header.offset().left + this.app.$header.width() / 100 * this.app.attributes.step,
                bottom:this.app.$header.offset().top - top,
                top:(this.app.$header.offset().top - (45 / 100 * this.app.attributes.step)) - top,
                sub:{
                    top:this.app.$header.offset().top - (25 / 100 * this.app.attributes.step) - top,
                    left:{
                        x1:this.app.$header.offset().left,
                        x2:this.app.$header.offset().left + this.app.$header.width() / 2,
                        y:this.app.$header.offset().top - 20 - top,
                        process:this.app.$header.offset().left + (
                            (this.app.$header.width() / 4 * 3) / 100 * this.app.attributes.step
                            ),
                        text:(this.app.$header.offset().left + (
                            (this.app.$header.width() / 4 * 3) / 100 * this.app.attributes.step
                            ) - this.app.$header.offset().left).toFixed(2)
                    },
                    right:{
                        x1:this.app.$header.offset().left + this.app.$header.width() + 5,
                        x2:this.app.$header.offset().left + this.app.$header.width() / 4 * 3,
                        y:this.app.$header.offset().top - 20 - top,
                        process:this.app.$header.offset().left + this.app.$header.width() - (
                            (this.app.$header.width() / 4 * 1 / 100 * this.app.attributes.step)
                            )
                    }
                }
            };

            var getLeftData = {
                x1:this.app.$body.offset().left - 12,
                y1:this.app.$body.offset().top + this.app.$body.height() - top,
                x2:this.app.$header.offset().left - 12,
                x3:false,
                y2:this.app.$header.offset().top - top,
                process:this.app.$body.offset().top - top + this.app.$body.height() - ((this.app.$body.height() + this.app.$header.height() )/ 100 * this.app.attributes.step),
                bottom:this.app.$body.offset().left,
                top:this.app.$body.offset().left - ( 17 / 100 * this.app.attributes.step),
                text:this.app.$header.height() + this.app.$body.height() - this.app.$header.offset().top,

                sector:{
                    y1:this.app.$body.offset().top - top
                }
            };

            var textPositions = {
                header:{
                    position:this.app.$body.width() / 2 + this.app.$body.offset().left,
                    top:this.app.$header.offset().top - 50 - top,
                    positionLeft:this.app.$header.offset().left + this.app.$header.width() / 3,
                    positionRight:this.app.$header.offset().left + (this.app.$header.width() / 4 * 3 + (this.app.$header.width() / 4 / 2)),
                    topnext:this.app.$header.offset().top - 30 - top
                },
                left:{
                    left:this.app.$body.offset().left - 12,
                    top:(this.app.$header.height() + this.app.$body.height()) / 2 - top
                }
            }

            if(mobile){
                headerData.top = headerData.top + 20;
                headerData.y = headerData.y + 20;
                textPositions.header.top = textPositions.header.top + 20;
                getLeftData.x3 = this.app.nodes.$skillsList.offset().top - top;
            }

            var lineData = {
                y:0,
                y1:this.ctx.canvas.height,
                left:50
            };

            return {
                mobile:mobile,
                header:headerData,
                left:getLeftData,
                texts:textPositions,
                line:lineData
            }
        };

        this.render = function(){

            this.ctx.beginPath();
            this.ctx.clearRect(0,0,this.ctx.canvas.width, this.ctx.canvas.height);

            var color = '#178a3b';
            var data = this.getCalcData();

            // home line
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = color
            this.ctx.fillStyle = color;

            this.ctx.moveTo(data.header.x1 - 5, data.header.y);
            this.ctx.lineTo(data.header.process + 5, data.header.y);
            that.ctx.stroke();

            if(!data.mobile){
                // sub header
                // left 
                this.ctx.beginPath();
                this.ctx.moveTo(data.header.sub.left.x1 - 5, data.header.sub.left.y);
                this.ctx.lineTo(data.header.sub.left.process, data.header.sub.left.y);
                that.ctx.stroke();
                // right
                this.ctx.beginPath();
                this.ctx.moveTo(data.header.sub.right.x1, data.header.sub.right.y);
                this.ctx.lineTo(data.header.sub.right.process, data.header.sub.right.y);
                that.ctx.stroke();

                // vertical sub header
                this.ctx.beginPath();
                this.ctx.moveTo(data.header.sub.right.x2, data.header.bottom);
                this.ctx.lineTo(data.header.sub.right.x2, data.header.sub.top);
                that.ctx.stroke();
            }

            this.ctx.beginPath();
            this.ctx.moveTo(data.header.x1, data.header.bottom);
            this.ctx.lineTo(data.header.x1, data.header.top);
            that.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(data.header.x2, data.header.bottom);
            this.ctx.lineTo(data.header.x2, data.header.top);
            that.ctx.stroke();

            // left size line
            this.ctx.beginPath();
            this.ctx.moveTo(data.left.x1, data.left.y1 + 5);
            this.ctx.lineTo(data.left.x2, data.left.process - 20);
            that.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(data.left.bottom, data.left.y1);
            this.ctx.lineTo(data.left.top, data.left.y1);
            that.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(data.left.bottom, data.left.y2);
            this.ctx.lineTo(data.left.top, data.left.y2);
            that.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(data.left.bottom, data.left.sector.y1);
            this.ctx.lineTo(data.left.top, data.left.sector.y1);
            that.ctx.stroke();

            if(data.mobile){
                this.ctx.beginPath();
                this.ctx.moveTo(data.left.bottom, data.left.x3);
                this.ctx.lineTo(data.left.top, data.left.x3);
                that.ctx.stroke();
            }

            /**
             * render circles
             */
            if(this.app.attributes.step > 60){
                
                this.ctx.beginPath();
                this.ctx.arc(data.left.x2 - 20, data.left.y2, 15, 0, 2 * Math.PI, false);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.arc(data.left.x1 - 20, data.left.y1, 15, 0, 2 * Math.PI, false);
                this.ctx.fill();

                this.ctx.beginPath();
                this.ctx.arc(data.left.x1 - 20, data.left.sector.y1, 15, 0, 2 * Math.PI, false);
                this.ctx.fill();

                if(data.left.x3){
                    this.ctx.beginPath();
                    this.ctx.arc(data.left.x1 - 20, data.left.x3, 15, 0, 2 * Math.PI, false);
                    this.ctx.fill();
                }

                // render move line
                // this.ctx.lineWidth = 1;
                // this.ctx.strokeStyle = ' #000';
                // this.ctx.beginPath();
                // this.ctx.moveTo(data.line.left, data.line.y);
                // this.ctx.lineTo(data.line.left, data.line.y1);
                // console.log(data.line);
                // that.ctx.stroke();

                // // this.ctx.lineWidth = 1;
                // this.ctx.strokeStyle = color
            }

            if(this.app.attributes.step > 60){

                that.ctx.font = "500 12px PT Sans";
                that.ctx.fillStyle = '#eee';
                that.ctx.textAlign = 'center';
                that.ctx.textBaseline = 'middle';

                that.ctx.fillText(data.header.text + 'px', data.texts.header.position, data.texts.header.top);
                
                if(!data.mobile){
                    that.ctx.fillText(data.header.sub.left.text + 'px', data.texts.header.positionLeft, data.texts.header.topnext);
                    that.ctx.fillText(this.app.attributes.step / 4 + '%', data.texts.header.positionRight, data.texts.header.topnext);
                }
                
                that.ctx.fillText('D', data.left.x2 - 20, data.left.y2);
                that.ctx.fillText('C', data.left.x1 - 20, data.left.sector.y1);

                if(data.left.x3){
                    that.ctx.fillText('B', data.left.x1 - 20, data.left.x3);
                }

                that.ctx.fillText('A', data.left.x1 - 20, data.left.y1);
            

            }


            if(this.app.attributes.step < 100){
                requestAnimationFrame(function(){
                    that.app.attributes.step++;
                    that.render();
                });
            }
            
        };

        this.render();

    };

    var App = function(){

        var that = this;
        this.attributes = {
            step:1
        };
        
        return {

            initialize:function(options){
                
                that.attributes = $.extend(options, that.attributes);
                that.header = document.getElementById('visitCardHeader');
                that.$header = $(that.header);
                that.body = document.getElementById('visitCardBody');
                that.$body = $(that.body);
                that.nodes = {};
                that.nodes.$contactList = $('.contactList');
                that.nodes.$skillsList = $('.skillsList');
                that.nodes.$linkedin = $('.linkedin');
                that.nodes.$github = $('.github');
                that.nodes.$phone = $('.phone');
                that.nodes.$skype = $('.skype');
                that.nodes.$email = $('.email');
                that.nodes.$address = $('.address');

                mainCanvas.prototype.app = that;
                that.maincanvas = new mainCanvas();

            }
        }
    };

    $(document).ready(function(){

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

        new App().initialize({
            debug:false
        });

        $(window).on('resize', function(){
            $('.skillsList li span').css('background', getRandomColor);
            // вот тут пииш 5
            data = {
                start:0,
                end:100,
                current:500
            }
       });

    });

})(jQuery);